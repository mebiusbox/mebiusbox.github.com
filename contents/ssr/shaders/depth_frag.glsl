uniform sampler2D DepthSampler;
uniform float CameraNear;
uniform float CameraFar;
varying vec2 vUv;

float viewZToOrthographicDepth(float viewZ) {
    return (viewZ + CameraNear) / (CameraNear - CameraFar);
}

float perspectiveDepthToViewZ(float invClipZ) {
    return (CameraNear*CameraFar) / ((CameraFar-CameraNear)*invClipZ-CameraFar);
}

float perspectiveDepthToOrthographicDepth(float invClipZ) {
    float nz = CameraNear * invClipZ;
    return -nz / (CameraFar * (invClipZ-1.0) - nz);
}

void main() {
    float fragCoordZ = texture2D(DepthSampler, vUv).x;
    // float viewZ = perspectiveDepthToViewZ(fragCoordZ);
    // float depth = viewZToOrthographicDepth(viewZ);
    float depth = perspectiveDepthToOrthographicDepth(fragCoordZ);
    gl_FragColor = vec4(vec3(1.0-depth), 1.0);
}
