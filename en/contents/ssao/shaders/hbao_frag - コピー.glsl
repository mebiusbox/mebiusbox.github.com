#define PI 3.14159265359
#define SAMPLE_FIRST_STEP 1
#define NUM_STEPS 4
#define MAX_STEPS 16
#define NUM_DIRECTIONS 8
uniform sampler2D ColorSampler;
uniform sampler2D DepthSampler;
// x: radius, y: radius2, z: negInvRadius2, w: maxRadius
uniform vec4 RadiusParams;
// x: angleBias, y: tanAngleBias, z: strength, w: 1.0
uniform vec4 BiasParams;
// x: resX, y: resY, z: invResX, w: invResY
uniform vec4 ScreenParams;
// x: uvToVA0, y: uvToVA1, z: uvToVB0, w: uvToVB1
uniform vec4 UvToViewParams;
// x: focal1, y: focal2, z: invFocal1, w: invFocal2
uniform vec4 FocalParams;
// x: near, y: far, z: 0.0, w: 0.0
uniform vec4 CameraParams;
uniform mat4 CameraProjectionMatrix;
uniform mat4 CameraInverseProjectionMatrix;
varying vec2 vUv;

vec2 rand(vec2 p) 
{
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}

vec2 round(vec2 a) 
{
  return floor(a + 0.5);
}

float rsqrt(float a) 
{
  return inversesqrt(a);
}

float lengthSqr(vec3 v) 
{
    return dot(v,v);
}

vec3 minDiff(vec3 P, vec3 Pr, vec3 Pl) 
{
    vec3 v1 = Pr - P;
    vec3 v2 = P - Pl;
    return (lengthSqr(v1) < lengthSqr(v2)) ? v1 : v2;
}

float falloffFactor(float d2) 
{
    float NegInvRadius = RadiusParams.z;
    return d2 * NegInvRadius + 1.0;
    // return d2 * RadiusParams.z + 1.0;
}

vec2 snapUVOffset(vec2 uv) 
{
    vec2 AORes    = ScreenParams.xy;
    vec2 InvAORes = ScreenParams.zw;
    return round(uv*AORes.xy) * InvAORes.xy;
    // return round(uv*ScreenParams.xy) * ScreenParams.zw;
}

// sin(x) = tan(x)/sqrt(1+(tan(x))^2)
float TanToSin(float x) 
{
    return x*rsqrt(x*x+1.0);
}

float inverseLength(vec2 V)
{
    return rsqrt(dot(V,V));
}

float getTangent(vec3 T) 
{
    return T.z * rsqrt(dot(T.xy,T.xy));
    // return -T.z * rsqrt(dot(T.xy,T.xy));// left-hand coordinates
}

float getBiasedTangent(vec3 T) 
{
    // float TanAngleBias = BiasParams.y;
    return T.z * rsqrt(dot(T.xy,T.xy)) + BiasParams.y;
    // return -T.z * rsqrt(dot(T.xy,T.xy)) + BiasParams.y;// left-hand coordinates
}

// NOTE viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions

float viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) 
{
  return (viewZ + near) / (near - far);
}

float orthographicDepthToViewZ(const in float linearClipZ, const in float near, const in float far)
{
    return linearClipZ * (near - far) - near;
}

float viewZToPerspectiveDepth(const in float viewZ, const in float near, const in float far)
{
    return ((near + viewZ) * far) / ((far - near) * viewZ);
}

float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) 
{
  return (near * far) / ((far - near) * invClipZ - far);
}

float getDepth(vec2 screenPosition) 
{
    return texture2D(DepthSampler, screenPosition).x;
}

// = viewZToOrthographicDepth(perspectiveDepthToViewZ(uv))
float getLinearDepth(vec2 screenPosition) 
{
    float fragCoordZ = texture2D(DepthSampler, screenPosition).x;
    float nz = CameraParams.x * fragCoordZ;
    return -nz / (CameraParams.y * (fragCoordZ-1.0) - nz);
}

// = perspectiveDepthToViewZ
float getViewZ(float depth) 
{
    return (CameraParams.x*CameraParams.y) / ((CameraParams.y-CameraParams.x)*depth-CameraParams.y);
}

vec3 getViewPosition(vec2 screenPosition, float depth, float viewZ) 
{
    float clipW = CameraProjectionMatrix[2][3] * viewZ + CameraProjectionMatrix[3][3];
    vec4 clipPosition = vec4((vec3(screenPosition, depth) - 0.5)*2.0, 1.0);
    clipPosition *= clipW; // unprojection
    return (CameraInverseProjectionMatrix * clipPosition).xyz;
}

vec3 uvToView(vec2 uv, float viewZ) 
{
    uv = UvToViewParams.xy * uv + UvToViewParams.zw;
    return vec3(uv*viewZ, viewZ);
}

vec3 viewPos(vec2 uv) 
{
    float near = CameraParams.x;
    float far = CameraParams.y;
    float depth = texture2D(DepthSampler, uv).x;
    float viewZ = perspectiveDepthToViewZ(depth, near, far);
    return uvToView(uv, viewZ);

    // left-hand coordinates
    // float depth = texture2D(DepthSampler, uv).x;
    // float viewZ = perspectiveDepthToViewZ(depth, CameraParams.x, CameraParams.y);
    // return uvToView(uv, -viewZ);

    // float depth = getDepth(uv);
    // float viewZ = getViewZ(depth);
    // return getViewPosition(uv, depth, viewZ);
}

vec2 rotateDirections(vec2 Dir, vec2 CosSin) 
{
    return vec2(Dir.x*CosSin.x - Dir.y*CosSin.y, 
                Dir.x*CosSin.y + Dir.y*CosSin.x);
}

vec3 randCosSinJitter(vec2 uv) 
{
    vec2 r = rand(uv);
    float angle = 2.0 * PI * r.x / float(NUM_DIRECTIONS);
    return vec3(cos(angle), sin(angle), r.y);
}

void calculateNumSteps(inout vec2 stepSizeInUV, 
                       inout float numSteps,
                       float radiusInPixels, 
                       float rand) 
{
    float MaxRadiusPixels = RadiusParams.w;
    vec2  InvAORes = ScreenParams.zw;

    // Avoid oversampling if NUM_STEPS is greater than the kernel radius in pixels
    numSteps = min(float(NUM_STEPS), radiusInPixels);

    // Divide by Ns+1 so that the farthest samples are not fully attenuated
    float stepSizeInPixels = radiusInPixels / (numSteps + 1.0);

    // Clamp numSteps if it is greater than the max kernel footprint
    float maxNumSteps = MaxRadiusPixels / stepSizeInPixels;
    if (maxNumSteps < numSteps) 
    {
        // Use dithering to avoid AO discontinuities
        numSteps = floor(maxNumSteps + rand);
        numSteps = max(numSteps, 1.0);
        stepSizeInPixels = MaxRadiusPixels / numSteps;
    }

    // Step size in uv space
    stepSizeInUV = stepSizeInPixels * InvAORes.xy;
}


float integrateOcclusion(vec2 uv0, 
                         vec2 snapped_duv, 
                         vec3 P, 
                         vec3 dPdu, 
                         vec3 dPdv,    
                         inout float tanH) 
{
    float ao = 0.0;

    // Compute a tangent vector for snapped_duv
    vec3 T = snapped_duv.x * dPdu + snapped_duv.y * dPdv;
    float tanT = getBiasedTangent(T);
    float sinT = TanToSin(tanT);
    vec3 S = viewPos(uv0 + snapped_duv);
    vec3 diff = S - P;
    float tanS = getTangent(diff);
    float sinS = TanToSin(tanS);
    float d2 = lengthSqr(diff);
    float R2 = RadiusParams.y; // R*R
    if ((d2 < R2) && (tanS > tanT)) {
        // Compute AO between the tangent plane and the sample
        ao = falloffFactor(d2) * saturate(sinS - sinT);
        // Update the horizon angle
        tanH = max(tanH, tanS);
    }

    return ao;
}

float calculateHorizonOcclusion(vec2 dUv, 
                                vec2 texelDeltaUV, 
                                vec2 uv0, 
                                vec3 P,    
                                float numSteps, 
                                float randstep, 
                                vec3 dPdu, 
                                vec3 dPdv) 
{
    float ao = 0.0;

    vec2 uv = uv0 + snapUVOffset(randstep * dUv);
    vec2 deltaUV = snapUVOffset(dUv);
    vec3 T = deltaUV.x * dPdu + deltaUV.y * dPdv;

    float tanH = getBiasedTangent(T);

#if SAMPLE_FIRST_STEP
    // Take a first sample between uv0 and uv0 + deltaUV
    vec2 snapped_duv = snapUVOffset(randstep * deltaUV + texelDeltaUV);
    ao = integrateOcclusion(uv0, snapped_duv, P, dPdu, dPdv, tanH);
    --numSteps;
#endif

    float sinH = TanToSin(tanH);
    for (int j=1; j<MAX_STEPS; ++j)
    {
        if (float(j) >= numSteps)
        {
            break;
        }

        uv += deltaUV;
        vec3 S = viewPos(uv);
        vec3 diff = S - P;
        float tanS = getTangent(diff);
        float d2 = lengthSqr(diff);
        float R2 = RadiusParams.y; // R*R
        if ((d2 < R2) && (tanS > tanH)) 
        {
            // Accumulate AO between the horizon and the sample
            float sinS = TanToSin(tanS);
            ao += falloffFactor(d2) * saturate(sinS - sinH);

            // Update the current horizon angle
            tanH = tanS;
            sinH = sinS;
        }
    }

    return ao;
}

void main() 
{
    //-------------------------------------------------
    float FocalLength = FocalParams.x;
    float R = RadiusParams.x;
    vec2 AORes = ScreenParams.xy;
    vec2 InvAORes = ScreenParams.zw;
    float AOStrength = BiasParams.z;
   //-------------------------------------------------

    vec2 uv = vUv;
    vec3 P = viewPos(uv);
    float ao = 1.0;

    // gl_FragColor = vec4(P,1.0);
    // return;

    // Calculate the projecteds size of the hemisphere
    // Compute projection of disk of radius "RadiusParams.x" into uv space
    // Multiply by 0.5 to scale from [-1,1]^2 to [0,1]^2
    float diskRadiusInUV = 0.5 * R * FocalLength / -P.z;
    // float diskRadiusInUV = 0.5 * R * FocalLength / P.z;// left-hand coordinates
    float radiusInPixels = diskRadiusInUV * AORes.x;
    if (radiusInPixels > 1.0)
    {
        // Nearest neighbor pixels on the tangent plane
        vec3 Pr = viewPos(uv + vec2( InvAORes.x, 0));
        vec3 Pl = viewPos(uv + vec2(-InvAORes.x, 0));
        vec3 Pt = viewPos(uv + vec2(0,  InvAORes.y));
        vec3 Pb = viewPos(uv + vec2(0, -InvAORes.y));
        // Reconstruct Normal
        // N = -normalize(cross(minDiff(P,Pr,Pl), minDiff(P,Pt,Pb)));

        // Calculate tangent basis vectors
        // Screen-aligned basis for the tangent plane
        vec3 dPdu = minDiff(P, Pr, Pl);
        vec3 dPdv = minDiff(P, Pt, Pb) * (AORes.y * InvAORes.x);

        ao = 0.0;

        const float alpha = 2.0 * PI / float(NUM_DIRECTIONS);
        float numSteps;
        vec2 stepSize;
        vec3 rand = randCosSinJitter(uv);
        calculateNumSteps(stepSize, numSteps, radiusInPixels, rand.z);

        // Calculate the horizon occlusion of each direction
        for (int d=0; d<NUM_DIRECTIONS; d++) {
            // Apply noise to the direction
            float angle = alpha * float(d);
            vec2 dir = rotateDirections(vec2(cos(angle), sin(angle)), rand.xy);
            vec2 deltaUV = dir * stepSize.xy;
            vec2 texelDeltaUV = dir * InvAORes.xy;
            ao += calculateHorizonOcclusion(deltaUV, texelDeltaUV, uv, P, numSteps, rand.z, dPdu, dPdv);
        }

        // Average the results and produce the final AO
        ao = 1.0 - ao / float(NUM_DIRECTIONS) * AOStrength;
    }

    gl_FragColor = vec4(saturate(ao), P.z, 0.0, 1.0);
    // gl_FragColor = vec4(vec3(saturate(ao)), 1.0);
}


