uniform sampler2D ColorSampler;
uniform sampler2D OcclusionSampler;
uniform float OcclusionPower;
uniform vec3 OcclusionColor;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(ColorSampler, vUv);
    float occlusion = pow(texture2D(OcclusionSampler, vUv).x, OcclusionPower);
    gl_FragColor = vec4(mix(OcclusionColor, color.xyz, occlusion), 1.0);
}