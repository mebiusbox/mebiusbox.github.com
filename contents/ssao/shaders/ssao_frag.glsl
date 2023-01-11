#define KERNEL_SIZE 64
uniform sampler2D ColorSampler;
uniform sampler2D NormalSampler;
uniform sampler2D DepthSampler;
uniform sampler2D NoiseSampler;
uniform vec3 Kernel[KERNEL_SIZE];
uniform vec2 Resolution;
uniform float CameraNear;
uniform float CameraFar;
uniform mat4 CameraProjectionMatrix;
uniform mat4 CameraInverseProjectionMatrix;
uniform float KernelRadius;
uniform float MinDistance;
uniform float MaxDistance;
uniform float Strength;
varying vec2 vUv;

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

void main() {
    float depth = getDepth(vUv);
    float viewZ = getViewZ(depth);

    vec3 viewPosition = getViewPosition(vUv, depth, viewZ);
    vec3 viewNormal   = getViewNormal(vUv);

    vec2 noiseScale = vec2(Resolution.x / 4.0, Resolution.y / 4.0);
    vec3 random = texture2D(NoiseSampler, vUv * noiseScale).xyz;

    vec3 tangent = normalize(random - viewNormal * dot(random,viewNormal));
    vec3 bitangent = cross(viewNormal, tangent);
    mat3 kernelMatrix = mat3(tangent, bitangent, viewNormal);

    float occlusion = 0.0;
    for (int i=0; i<KERNEL_SIZE; i++) {
        vec3 sampleVector = kernelMatrix * Kernel[i];
        vec3 samplePoint = viewPosition + (sampleVector * KernelRadius);
        vec4 samplePointNDC = CameraProjectionMatrix * vec4(samplePoint, 1.0);
        samplePointNDC /= samplePointNDC.w;

        vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5;
        float realDepth = getLinearDepth(samplePointUv);
        float sampleDepth = viewZToOrthographicDepth(samplePoint.z);
        float delta = sampleDepth - realDepth;
        if (delta > MinDistance && delta < MaxDistance) {
            occlusion += 1.0;
        }
    }

    occlusion = clamp(occlusion / float(KERNEL_SIZE), 0.0, 1.0);
    gl_FragColor = vec4(vec3(1.0 - occlusion * Strength), 1.0);
}
