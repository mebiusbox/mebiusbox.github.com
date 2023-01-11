uniform mat4 mModelView;
uniform mat4 mProj;
varying vec3 vDistance;
varying vec2 vUv;
void main() {
  // vec4 mvPosition = mModelView * vec4(position, 1.0);
  // gl_Position = mProj * mvPosition;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vDistance = mvPosition.xyz;
  vUv = uv;
}