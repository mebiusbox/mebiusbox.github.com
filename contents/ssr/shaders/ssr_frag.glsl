#define MAX_ITERATIONS 300
#define MAX_BINARY_SEARCH_ITERATIONS 64
uniform sampler2D ColorSampler;
uniform sampler2D NormalSampler;
uniform sampler2D DepthSampler;
uniform sampler2D MetalRoughSampler;
uniform samplerCube EnvSampler;
uniform vec4 Resolution;    // xy: BufferSize, zw: InvBufferSize
uniform float CameraNear;
uniform float CameraFar;
uniform mat4 CameraProjectionMatrix;        // projection matrix that maps to screen pixels (not NDC)
uniform mat4 CameraInverseProjectionMatrix; // inverse projection matrix (NDC to camera space)
uniform float Iterations;                   // maximum ray iterations
uniform float BinarySearchIterations;       // maximum binary search refinement iterations
uniform float Thickness;                    // Z size in camera space of a pixel in the depth buffer = Thickness
uniform float MaxRayDistance;               // maximum distance of a ray
uniform float EdgeDistance;
uniform float EdgeExponent;
uniform float FadeDistance;
uniform float FadeExponent;
varying vec2 vUv;

vec3 transformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((matrix * vec4(dir, 0.0)).xyz);
}

vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((vec4(dir, 0.0) * matrix).xyz);
}

float viewZToOrthographicDepth(float viewZ) {
    return (viewZ + CameraNear) / (CameraNear - CameraFar);
}

float perspectiveDepthToViewZ(float invClipZ) {
    return (CameraNear*CameraFar) / ((CameraFar-CameraNear)*invClipZ-CameraFar);
}

float getDepth(vec2 screenPosition) {
    return texture2D(DepthSampler, screenPosition).x;
}

float getLinearDepth(vec2 screenPosition) {
    float fragCoordZ = texture2D(DepthSampler, screenPosition).x;
    float nz = CameraNear * fragCoordZ;
    return -nz / (CameraFar * (fragCoordZ-1.0) - nz);
}

float getViewZ(float depth) {
    return (CameraNear*CameraFar) / ((CameraFar-CameraNear)*depth-CameraFar);
}

vec3 getViewPosition(vec2 screenPosition, float depth, float viewZ) {
    float clipW = CameraProjectionMatrix[2][3] * viewZ + CameraProjectionMatrix[3][3];
    vec4 clipPosition = vec4((vec3(screenPosition, depth) - 0.5)*2.0, 1.0);
    clipPosition *= clipW; // unprojection
    return (CameraInverseProjectionMatrix * clipPosition).xyz;
}

vec3 getViewNormal(vec2 screenPosition) {
    vec3 rgb = texture2D(NormalSampler, screenPosition).xyz;
    return 2.0*rgb.xyz - 1.0;
}

//----------------------------------------------------------------------------
bool rayIntersectsDepth(float z, vec2 uv)
{
    float sceneZMax = getViewZ(getDepth(uv));
    float dist = z - sceneZMax;
    return dist < 0.0 && dist > -Thickness;
}

bool traceCameraSpaceRay(
    vec3 rayOrg,
    vec3 rayDir,
    float dotNV,
    out vec2 hitPixel,
    out vec3 hitPoint,
    out float iterationCount)
{
    float rayDist = MaxRayDistance * (1.0 - saturate(dotNV)*step(0.6,dotNV));
    // float rayDist = MaxRayDistance;

    // Clip to the near plane
    float rayLength = ((rayOrg.z + rayDir.z * rayDist) > -CameraNear) ?
        (-CameraNear - rayOrg.z) / rayDir.z : rayDist;
    vec3 rayEnd = rayOrg + rayDir * rayLength;

    vec3 Q0 = rayOrg;
    vec3 Q1 = rayEnd;
    vec3 delta = Q1 - Q0;
    vec3 deltaStep = delta / Iterations;

    vec3 Q = Q0;
    vec2 P;
    
    // Track ray step and derivatives in a vec4 to parallelize
    bool intersect = false;
    float count = 0.0;
    for (int i=0; i<MAX_ITERATIONS; i++)
    {
        if (float(i) >= Iterations) break;
        if (intersect) break;

        Q += deltaStep;
        vec4 clip = CameraProjectionMatrix * vec4(Q,1.0);
        P = clip.xy / clip.w;

        hitPixel = P.xy*0.5+0.5;
        intersect = rayIntersectsDepth(Q.z, hitPixel);

        count = float(i);
    }

    // Binary search refinement
    if (BinarySearchIterations > 1.0 && intersect)
    {
        Q -= deltaStep;
        deltaStep /= BinarySearchIterations;

        float originalStride = BinarySearchIterations * 0.5;
        float stride = originalStride;

        for (int j=0; j<MAX_BINARY_SEARCH_ITERATIONS; j++)
        {
            if (float(j) >= BinarySearchIterations) break;

            Q += deltaStep * stride;
            vec4 clip = CameraProjectionMatrix * vec4(Q,1.0);
            P = clip.xy / clip.w;

            hitPixel = P.xy*0.5+0.5;

            originalStride *= 0.5;
            stride = rayIntersectsDepth(Q.z, hitPixel) ? -originalStride : originalStride;
        }
    }

    hitPoint = Q;
    iterationCount = count;

    return intersect;
}

float calculateAlpha(
    bool intersect,
    float iterationCount,
    float specularStrength,
    vec2 hitPixel, 
    vec3 hitPoint,
    vec3 rayOrg,
    vec3 rayDir)
{
    /// Roughness
    float alpha = specularStrength;
    // float alpha = min(1.0, specularStrength + 1.0);

    /// Distance Fade
    // float h = max(0.0, hitPoint.y - viewPosition.y);
    // alpha = saturate(1.0 - pow(h / FadeDistance, FadeExponent));
    float d = length(rayOrg - hitPoint);
    alpha *= saturate(1.0 - pow(d / FadeDistance, FadeExponent));

    /// ScreenEdge Fade
    vec2 edgeuv = vUv * (1.0 - vUv.yx);
    float edge = edgeuv.x * edgeuv.y * EdgeDistance;
    edge = saturate(pow(abs(edge), EdgeExponent));
    alpha *= edge;

    // float uvFactor = 2.0 * length(hitPixel - vec2(0.5,0.5));
    // uvFactor *= uvFactor;
    // float edge = max(0.0, 1.0 - uvFactor);

    alpha *= intersect ? 1.0 : 0.0;

    return alpha;
}

void main() {
    float depth = getDepth(vUv);
    float viewZ = getViewZ(depth);

    vec3 viewPosition = getViewPosition(vUv, depth, viewZ);
    vec3 viewNormal   = getViewNormal(vUv);

    vec4 metalRoughness = texture2D(MetalRoughSampler, vUv);
    float specularStrength = 1.0 - metalRoughness.y;

    vec3 rayOrg = viewPosition;
    vec3 rayDir = reflect(normalize(rayOrg), viewNormal);

    vec2 hitPixel;
    vec3 hitPoint;
    float iterationCount;

    float dotNV = dot(normalize(-rayOrg), viewNormal);
    bool intersect = traceCameraSpaceRay(rayOrg, rayDir, dotNV, hitPixel, hitPoint, iterationCount);
    float alpha = calculateAlpha(intersect, iterationCount, specularStrength, hitPixel, hitPoint, rayOrg, rayDir);

    vec3 color = texture2D(ColorSampler, hitPixel).xyz;
    color = mix(vec3(.3), color, depth < 1.0 ? 1.0 : 0.0);

    gl_FragColor = vec4(color.xyz, alpha);
}
