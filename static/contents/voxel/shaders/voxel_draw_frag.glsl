uniform sampler2D tDiffuse;
uniform float voxelScaledGridSize;
uniform float voxelBevelOffset;
uniform int voxelIteration;
uniform vec2 viewportSize;
uniform vec3 lightDir;
uniform vec3 lightColor;
uniform vec4 maskColor;
uniform mat4 mViewInverse;
uniform mat4 mViewProj;
uniform mat4 mProj;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vDistance;
varying vec2 vUv;

vec3 transformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((matrix * vec4(dir,0.0)).xyz);
}
// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((vec4(dir,0.0)*matrix).xyz);
}
vec3 AdjustVector(vec3 i) {
  return (step(0.0, i) * 2.0 - 1.0) * max(abs(i), 1e-4);
}
vec3 AlignPosition(vec3 pos) {
  return (floor(pos * (1.0/voxelScaledGridSize) + 1000.0 + 0.5) - 1000.0) * voxelScaledGridSize;
}
vec4 Raytrace(vec3 pos, vec3 v, out vec3 hitblock) {
  vec4 albedo = vec4(0);
  
  pos.xyz += v * (voxelScaledGridSize * -2.0);
  
  vec3 invV = 1.0 / v;
  vec3 offset1 = (sign(v) * voxelScaledGridSize * 0.5) * invV;
  // estimate distance to the next next block
  vec3 tnext0 = abs(voxelScaledGridSize * invV);
  float t2 = min(tnext0.x, min(tnext0.y, tnext0.z));
  
  for (int i=0; i<32; i++) {
    if (i > voxelIteration) break;
    // hitblock = pos.xyz;
    hitblock = AlignPosition(pos.xyz);
    vec4 vpos = viewMatrix * vec4(hitblock.xyz, 1.0);
    vec4 ppos = mProj * vpos;
    // vec4 ppos = mViewProj * vec4(hitblock.xyz, 1.0);
    vec2 uv = (ppos.xy / ppos.w * vec2(0.5, 0.5) + 0.5);
    float depth = texture2D(tDiffuse, uv).x;
    if (maskColor.a > 0.0) {
      albedo.x = (depth/50.0 * maskColor.x);
      albedo.y = (-vpos.z/50.0 * maskColor.y);
      albedo.xy += uv * maskColor.z;
      albedo.z = 0.0;
      albedo.w = 1.0;
      break;
    }
    if (0.0 < depth && depth < -vpos.z * 1.01 + voxelScaledGridSize) {
    // if (0.0 < depth) {
      albedo = vec4(1);
      break;
    }
    
    vec3 dif = (hitblock - pos.xyz) * invV;
    vec3 tnear = offset1 + dif; // distance to the next block
    
    vec3 t0 = (tnear.x < tnear.y) ? tnear.xyz : tnear.yxz;
    t0 = (t0.y < t0.z) ? t0.xyz : ((t0.x < t0.z) ? t0.xzy : t0.zxy);
    pos.xyz += v * ((t0.x + min(t0.y, t0.x + t2)) * 0.5);
  }
  
  return albedo;
}
vec3 CalcPositionAndNormal(vec3 hitblock, inout vec3 N, vec3 V, float depthRate) {
  vec3 tNear = (cameraPosition - (hitblock.xyz + (voxelScaledGridSize * 0.5))) * (1.0/V);
  vec3 tFar  = (cameraPosition - (hitblock.xyz - (voxelScaledGridSize * 0.5))) * (1.0/V);
  tNear = min(tNear, tFar);
  vec3 hitpos = cameraPosition - V * max(tNear.x, max(tNear.y, tNear.z));
  vec3 N0 = normalize(abs(hitpos - hitblock));
  N0 = normalize(step(vec3(max(N0.x, max(N0.y, N0.z))) - voxelBevelOffset, N0) * sign(V));
  N0 = transformDirection(N0, viewMatrix);
  N = normalize(mix(N, N0, 1.0 - saturate(depthRate)));
  return hitpos;
}
vec3 CalcPosition(vec3 hitblock, vec3 V) {
  vec3 tNear = (cameraPosition - (hitblock.xyz + sign(V) * (voxelScaledGridSize * 0.5))) * (1.0/V);
  vec3 hitpos = cameraPosition - V * max(tNear.x, max(tNear.y, tNear.z));
  return hitpos;
}
void main() {
  vec3 N = vNormal;
  vec3 worldP = (mViewInverse * vec4(vPosition,1.0)).xyz;
  vec3 worldV = AdjustVector(normalize(cameraPosition - worldP));
  vec3 hitblock = vec3(0);
  vec4 albedo = Raytrace(worldP, -worldV, hitblock);
  if (albedo.w - 1e-3 < 0.0) {
    discard;
  }
  
  vec3 hitpos = CalcPositionAndNormal(hitblock, N, worldV, vDistance.z / vDistance.y);
  float dotNL = max(dot(N,lightDir),0.2);
  albedo.xyz = lightColor * dotNL;
  
  gl_FragColor = vec4(albedo.xyz, 1.0);
}