uniform bool expand;
uniform float voxelScaledGridSize;
uniform vec2 viewportSize;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vDistance;
varying vec2 vUv;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  
  if (expand) {
    vec4 mPosition = modelMatrix * vec4(position, 1.0);
    vec3 cameraDir = normalize(cameraPosition - mPosition.xyz);
    vec3 n = normalize(vNormal - dot(vNormal, cameraDir));
    mvPosition.xyz += n * voxelScaledGridSize;
  }
  
  gl_Position = projectionMatrix * mvPosition;
  
  vPosition = mvPosition.xyz;
  vDistance.x = mvPosition.z;
  vDistance.yz = (projectionMatrix * vec4(0,voxelScaledGridSize, vDistance.x, 1)).yw;
  vDistance.y *= viewportSize.y * 0.5 / 2.0;
  vUv = uv;
}