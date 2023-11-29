varying vec3 vViewPosition;
varying vec3 vNormal;

// uniforms
uniform float metallic;
uniform float roughness;
uniform vec3 albedo;

// defines
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
//#define saturate(x) clamp(x, 0.0, 1.0)

float pow2(const in float x) { return x*x; }
vec3 transformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((matrix * vec4(dir, 0.0)).xyz);
}
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
  return normalize((vec4(dir, 0.0) * matrix).xyz);
}
// vec4 GammaToLinear(in vec4 value, in float gammaFactor) {
//   return vec4(pow(value.xyz, vec3(gammaFactor)), value.w);
// }
// vec4 LinearToGamma(in vec4 value, in float gammaFactor) {
//   return vec4(pow(value.xyz, vec3(1.0/gammaFactor)), value.w);
// }

struct IncidentLight {
  vec3 color;
  vec3 direction;
  bool visible;
};

struct ReflectedLight {
  vec3 directDiffuse;
  vec3 directSpecular;
  vec3 indirectDiffuse;
  vec3 indirectSpecular;
};

struct GeometricContext {
  vec3 position;
  vec3 normal;
  vec3 viewDir;
};

struct Material {
  vec3 diffuseColor;
  float specularRoughness;
  vec3 specularColor;
};

// lights

bool testLightInRange(const in float lightDistance, const in float cutoffDistance) {
  return any(bvec2(cutoffDistance == 0.0, lightDistance < cutoffDistance));
}

float punctualLightIntensityToIrradianceFactor(const in float lightDistance, const in float cutoffDistance, const in float decayExponent) {
  if (decayExponent > 0.0) {
    return pow(saturate(-lightDistance / cutoffDistance + 1.0), decayExponent);
  }
  
  return 1.0;
}

struct DirectionalLight {
  vec3 direction;
  vec3 color;
};

void getDirectionalDirectLightIrradiance(const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight) {
  directLight.color = directionalLight.color;
  directLight.direction = directionalLight.direction;
  directLight.visible = true;
}

struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
  float decay;
};

void getPointDirectLightIrradiance(const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight) {
  vec3 L = pointLight.position - geometry.position;
  directLight.direction = normalize(L);
  
  float lightDistance = length(L);
  if (testLightInRange(lightDistance, pointLight.distance)) {
    directLight.color = pointLight.color;
    directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, pointLight.distance, pointLight.decay);
    directLight.visible = true;
  } else {
    directLight.color = vec3(0.0);
    directLight.visible = false;
  }
}

struct SpotLight {
  vec3 position;
  vec3 direction;
  vec3 color;
  float distance;
  float decay;
  float coneCos;
  float penumbraCos;
};

void getSpotDirectLightIrradiance(const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight) {
  vec3 L = spotLight.position - geometry.position;
  directLight.direction = normalize(L);
  
  float lightDistance = length(L);
  float angleCos = dot(directLight.direction, spotLight.direction);
  
  if (all(bvec2(angleCos > spotLight.coneCos, testLightInRange(lightDistance, spotLight.distance)))) {
    float spotEffect = smoothstep(spotLight.coneCos, spotLight.penumbraCos, angleCos);
    directLight.color = spotLight.color;
    directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor(lightDistance, spotLight.distance, spotLight.decay);
    directLight.visible = true;
  } else {
    directLight.color = vec3(0.0);
    directLight.visible = false;
  }
}

// light uniforms
#define LIGHT_MAX 4
uniform DirectionalLight directionalLights[LIGHT_MAX];
uniform PointLight pointLights[LIGHT_MAX];
uniform SpotLight spotLights[LIGHT_MAX];
uniform int numDirectionalLights;
uniform int numPointLights;
uniform int numSpotLights;
uniform float directLightIntensity;

// BRDFs

// Normalized Lambert
vec3 DiffuseBRDF(vec3 diffuseColor) {
  return diffuseColor / PI;
}

vec3 F_Schlick(vec3 specularColor, vec3 H, vec3 V) {
  return (specularColor + (1.0 - specularColor) * pow(1.0 - saturate(dot(V,H)), 5.0));
}

float D_GGX(float a, float dotNH) {
  float a2 = a*a;
  float dotNH2 = dotNH*dotNH;
  float d = dotNH2 * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

float G_Smith_Schlick_GGX(float a, float dotNV, float dotNL) {
  float k = a*a*0.5 + EPSILON;
  float gl = dotNL / (dotNL * (1.0 - k) + k);
  float gv = dotNV / (dotNV * (1.0 - k) + k);
  return gl*gv;
}

// Cook-Torrance
vec3 SpecularBRDF(const in IncidentLight directLight, const in GeometricContext geometry, vec3 specularColor, float roughnessFactor) {
  
  vec3 N = geometry.normal;
  vec3 V = geometry.viewDir;
  vec3 L = directLight.direction;
  
  float dotNL = saturate(dot(N,L));
  float dotNV = saturate(dot(N,V));
  vec3 H = normalize(L+V);
  float dotNH = saturate(dot(N,H));
  float dotVH = saturate(dot(V,H));
  float dotLV = saturate(dot(L,V));
  float a = roughnessFactor * roughnessFactor;

  float D = D_GGX(a, dotNH);
  float G = G_Smith_Schlick_GGX(a, dotNV, dotNL);
  vec3 F = F_Schlick(specularColor, V, H);
  return (F*(G*D))/(4.0*dotNL*dotNV+EPSILON);
}

// RenderEquations(RE)
void RE_Direct(const in IncidentLight directLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  
  float dotNL = saturate(dot(geometry.normal, directLight.direction));
  vec3 irradiance = dotNL * directLight.color;
  
  // punctual light
  irradiance *= PI;
  
  reflectedLight.directDiffuse += irradiance * DiffuseBRDF(material.diffuseColor);
  reflectedLight.directSpecular += irradiance * SpecularBRDF(directLight, geometry, material.specularColor, material.specularRoughness);
}

// IBLs
uniform samplerCube radianceMap;
uniform samplerCube irradianceMap;
uniform float radianceMapIntensity;
uniform float irradianceMapIntensity;

// [ Lazarov 2013 "Getting More Physical in Call of Duty: Black Ops II" ]
// Adaptation to fit our G term
// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile
// BRDF_Specular_GGX_Environment
vec3 EnvBRDFApprox(vec3 specularColor, float roughness, float NoV) {
  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04 );
  vec4 r = roughness * c0 + c1;
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;
  return specularColor * AB.x + AB.y;
}

// three.js (bsdfs.glsl)
// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html
float GGXRoughnessToBlinnExponent(const in float ggxRoughness) {
  return 2.0 / pow2(ggxRoughness + 0.0001) - 2.0;
}

float BlinnExponentToGGXRoughness(const in float blinnExponent) {
  return sqrt(2.0 / (blinnExponent + 2.0));
}

// taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html
float getSpecularMipLevel(const in float blinnShininessExponent, const in int maxMipLevel) {
  float maxMipLevelScalar = float(maxMipLevel);
  float desiredMipLevel = maxMipLevelScalar - 0.79248 - 0.5 * log2(pow2(blinnShininessExponent)+1.0);
  
  // clamp to allowable LOD ranges
  return clamp(desiredMipLevel, 0.0, maxMipLevelScalar);
}

vec3 getLightProbeIndirectIrradiance(const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {
  vec3 worldNormal = inverseTransformDirection(N, viewMatrix);
  vec3 queryVec = vec3(-worldNormal.x, worldNormal.yz); //flip
  // return PI * textureCube(irradianceMap, queryVec).rgb * irradianceMapIntensity;
  return PI * GammaToLinear(textureCube(irradianceMap, queryVec), float(GAMMA_FACTOR)).rgb * irradianceMapIntensity;
  //return PI * GammaToLinear(textureCubeLodEXT(radianceMap, queryVec, float(maxMipLevel)), float(GAMMA_FACTOR)).rgb * irradianceMapIntensity;
}

vec3 getLightProbeIndirectRadiance(const in vec3 V, const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {
  vec3 reflectVec = inverseTransformDirection(reflect(-V, N), viewMatrix);
  float specMipLevel = getSpecularMipLevel(blinnShininessExponent, maxMipLevel);
  vec3 queryVec = vec3(-reflectVec.x, reflectVec.yz); //flip
  return GammaToLinear(textureCubeLodEXT(radianceMap, queryVec, specMipLevel), float(GAMMA_FACTOR)).rgb * radianceMapIntensity;
}

void RE_IndirectDiffuse(const in vec3 irradiance, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  reflectedLight.indirectDiffuse += irradiance * DiffuseBRDF(material.diffuseColor);
}

void RE_IndirectSpecular(const in vec3 radiance, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
  reflectedLight.indirectSpecular += radiance * EnvBRDFApprox(material.specularColor, material.specularRoughness, dotNV);
}

// SH
uniform vec3 irradcoeff[9];
uniform float irradSH;
uniform float irradSHIntensity[9];
vec3 sphericalHarmonics(const in vec3 N) {
  float x2;
  float y2;
  float z2;
  float xy;
  float yz;
  float xz;
  float x;
  float y;
  float z;
  vec3 col;

  // 0: Y{0, 0} =  0.282095
  // 1: Y{1,-1} = -0.488603(y)
  // 2: Y{1, 0} =  0.488603(z)
  // 3: Y{1, 1} = -0.488603(x)
  // 4: Y{2,-2} =  1.092548(xy)
  // 5: Y{2,-1} = -1.092548(yz)
  // 6: Y{2, 0} =  0.315392(3z^2-1)
  // 7: Y{2, 1} = -1.092548(xz)
  // 8: Y{2, 2} =  0.546274(x^2-y^2)
  
  // PI = 3.141593
  // 2PI / 3 = 2.094395
  // PI / 4 = 0.785398
  
  const float c1 = 0.429043;  // 0.546274 * PI / 4
  const float c2 = 0.511664;  // 0.488603 * 2PI / 3 * 0.5 (?)
  const float c2a = 1.023328; // 0.488603 * 2PI / 3
  const float c3 = 0.743125;  // c5 * 3.0
  const float c4 = 0.886227;  // 0.282095 * PI
  const float c5 = 0.247708;  // 0.315392 * PI / 4
  x = N.x;
  y = N.y;
  z = N.z;
  
  x2 = x*x; y2 = y*y; z2 = z*z;
  xy = x*y; yz = y*z; xz = x*z;
  
  // L0
  col = c4*irradcoeff[0] * irradSHIntensity[0];
  
  // L1
  col += 2.0 * c2 * irradcoeff[3]*x * irradSHIntensity[1];
  col += 2.0 * c2 * irradcoeff[1]*y * irradSHIntensity[2];
  col += 2.0 * c2 * irradcoeff[2]*z * irradSHIntensity[3];
  
  // L2
  col += 2.0*c1*irradcoeff[4]*xy * irradSHIntensity[4];
  col += 2.0*c1*irradcoeff[5]*yz * irradSHIntensity[5];
  col += c3*irradcoeff[6]*z2 - c5*irradcoeff[6] * irradSHIntensity[6];
  col += 2.0*c1*irradcoeff[7]*xz * irradSHIntensity[7];
  col += c1*irradcoeff[8]*(x2-y2) * irradSHIntensity[8];
  
  return GammaToLinear(vec4(col/PI,1.0), float(GAMMA_FACTOR)).rgb;
}

vec3 getLightProbeIndirectIrradianceSH(const in vec3 N) {
  vec3 worldNormal = inverseTransformDirection(N, viewMatrix);
  vec3 queryVec = vec3(worldNormal.x, worldNormal.y, -worldNormal.z); //flip
  return PI * sphericalHarmonics(queryVec) * irradianceMapIntensity;
}

void main() {
  GeometricContext geometry;
  geometry.position = -vViewPosition;
  geometry.normal = normalize(vNormal);
  geometry.viewDir = normalize(vViewPosition);
  
  Material material;
  material.diffuseColor = mix(albedo, vec3(0.0), metallic);
  material.specularColor = mix(vec3(0.04), albedo, metallic);
  material.specularRoughness = roughness;
  
  // Lighting
  
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 emissive = vec3(0.0);
  float opacity = 1.0;
  
  IncidentLight directLight;
  
  // point light
  for (int i=0; i<LIGHT_MAX; ++i) {
    if (i >= numPointLights) break;
    getPointDirectLightIrradiance(pointLights[i], geometry, directLight);
    if (directLight.visible) {
      RE_Direct(directLight, geometry, material, reflectedLight);
    }
  }
  
  // spot light
  for (int i=0; i<LIGHT_MAX; ++i) {
    if (i >= numSpotLights) break;
    getSpotDirectLightIrradiance(spotLights[i], geometry, directLight);
    if (directLight.visible) {
      RE_Direct(directLight, geometry, material, reflectedLight);
    }
  }
  
  // directional light
  for (int i=0; i<LIGHT_MAX; ++i) {
    if (i >= numDirectionalLights) break;
    getDirectionalDirectLightIrradiance(directionalLights[i], geometry, directLight);
    RE_Direct(directLight, geometry, material, reflectedLight);
  }
  
  reflectedLight.directDiffuse *= directLightIntensity;
  reflectedLight.directSpecular *= directLightIntensity;
  
  // IBL
  float blinnExponent = GGXRoughnessToBlinnExponent(material.specularRoughness);
  vec3 irradiance = getLightProbeIndirectIrradiance(geometry.normal, blinnExponent, 8);
  irradiance = mix(irradiance, vec3(0.0), sign(irradSH));
  RE_IndirectDiffuse(irradiance, geometry, material, reflectedLight);
  irradiance = getLightProbeIndirectIrradianceSH(geometry.normal);
  irradiance = mix(vec3(0.0), irradiance, sign(irradSH));
  RE_IndirectDiffuse(irradiance, geometry, material, reflectedLight);
  
  vec3 radiance = getLightProbeIndirectRadiance(geometry.viewDir, geometry.normal, blinnExponent, 8);
  RE_IndirectSpecular(radiance, geometry, material, reflectedLight);
  
  vec3 outgoingLight = emissive + reflectedLight.directDiffuse + reflectedLight.directSpecular + reflectedLight.indirectDiffuse + reflectedLight.indirectSpecular;
  gl_FragColor = LinearToGamma(vec4(toneMapping(outgoingLight), opacity), float(GAMMA_FACTOR));
}