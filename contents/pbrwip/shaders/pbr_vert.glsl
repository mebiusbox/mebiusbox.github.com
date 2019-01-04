attribute vec4 tangent;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBinormal;
// varying vec2 vUv;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  vTangent = normalize(normalMatrix * tangent.xyz);
  vBinormal = normalize(cross(vNormal, vTangent) * tangent.w);
  // vUv = uv;
}