uniform sampler2D tDiffuse;
varying vec3 vDistance;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(-vDistance.zzz,1.0);
}