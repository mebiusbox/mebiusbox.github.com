uniform sampler2D ColorSampler;
uniform float Opacity;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(ColorSampler, vUv) * Opacity;
}
