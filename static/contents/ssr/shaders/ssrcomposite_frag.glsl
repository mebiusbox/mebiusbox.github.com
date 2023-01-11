uniform sampler2D ColorSampler;
uniform sampler2D SSRSampler;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(ColorSampler, vUv);
    vec4 ssr = texture2D(SSRSampler, vUv);
    gl_FragColor = vec4(mix(color.xyz, ssr.xyz, ssr.w), 1.0);
}