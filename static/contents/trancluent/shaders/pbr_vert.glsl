varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec2 vUv;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
  vNormal = normalMatrix * normal;
  vUv = uv;
}