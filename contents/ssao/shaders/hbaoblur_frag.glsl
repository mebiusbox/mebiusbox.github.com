#define KERNEL_RADIUS 15
uniform sampler2D OcclusionSampler;
uniform vec4 BlurParams;
varying vec2 vUv;

float CrossBilateralWeight(float r, float ddiff, inout float weightTotal) {
    float w = exp(-r*r*BlurParams.z) * (ddiff < BlurParams.w ? 1.0 : 0.0);
    weightTotal += w;
    return w;
}

// Perform a gaussian blur in one direction
vec2 Blur(vec2 texScale) {
    vec2 centerCoord = vUv;
    float weightTotal = 1.0;
    vec2 aoDepth = texture2D(OcclusionSampler, centerCoord).xy;
    float totalAO = aoDepth.x;
    float centerZ = aoDepth.y;
    // [unroll]
    for (int i=-KERNEL_RADIUS; i<KERNEL_RADIUS; i++) {
        vec2 texCoord = centerCoord + (float(i)*texScale);
        vec2 sampleAOZ = texture2D(OcclusionSampler, texCoord).xy;
        float diff = abs(sampleAOZ.y - centerZ);
        float weight = CrossBilateralWeight(float(i), diff, weightTotal);
        totalAO += sampleAOZ.x * weight;
    }

    return vec2(totalAO / weightTotal, centerZ);
}

void main() {
    gl_FragColor = vec4(Blur(BlurParams.xy), 0.0, 1.0);
}
