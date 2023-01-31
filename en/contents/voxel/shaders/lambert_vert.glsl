uniform mat4 mModelView;
uniform mat4 mProj;
varying vec3 vPosition;
varying vec3 vNormal;
void main() {
  // vec4 mvPosition = mModelView * vec4(position, 1.0);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = mProj * mvPosition;
  vPosition = -mvPosition.xyz;
  vNormal = normalMatrix * normal;
}
  