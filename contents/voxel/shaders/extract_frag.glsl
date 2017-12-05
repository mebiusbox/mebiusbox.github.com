uniform sampler2D tDiffuse;
uniform float threshold;
uniform float scale;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  color.xyz -= threshold;
  color.xyz = scale * max(color.xyz, 0.0);
  gl_FragColor = vec4(color.xyz, 1.0);
}