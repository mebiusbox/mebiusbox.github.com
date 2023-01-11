varying vec3 vTangent;
varying vec3 vBinormal;

//-------------------------------------------------------------------------
// BRDFs

#define MIN_ROUGHNESS              0.045
#define MIN_LINEAR_ROUGHNESS       0.002025
#define MAX_CLEAR_COAT_ROUGHNESS   0.6

// ClearCoat
uniform float clearCoat;
uniform float clearCoatRoughness;

// Kelemen 2001, "A Microfacet Based Coupled Specular-Matte BRDF Model with Importance Sampling"
float V_Keleman(float dotLH) {
  return saturate(0.25 / (dotLH*dotLH));
}

float F_SchlickF(float f0, float f90, float dotVH) {
  return f0 + (f90-f0) * pow(1.0 - dotVH, 5.0);
}

// float F_SchlickF(float f0, float dotVH) {
//   return f0 + (1.0-f0) * pow(1.0 - saturate(dotVH), 5.0));
// }

vec2 PrefilteredDFG(float alpha, float dotNV) {
  return texture2D(dfgMap, vec2(dotNV, alpha)).rg;
}

vec3 f0ClearCoatToSurface(const vec3 f0) {
    // Approximation of iorTof0(f0ToIor(f0), 1.5)
    // This assumes that the clear coat layer has an IOR of 1.5
    return saturate(f0 * (f0 * (0.941892 - 0.263008 * f0) + 0.346479) - 0.0285998);
}

// Normalized Lambert
vec3 DiffuseBRDF(vec3 diffuseColor) {
  return diffuseColor / PI;
}


float D_GGX(float a, float dotNH) {
  float a2 = a*a;
  float dotNH2 = dotNH*dotNH;
  float d = dotNH2 * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

// Hammon 2017, "PBR Diffuse Lighting for GGX+Smith Microsurfaces"
float G_SmithGGXCorrelated_Fast(float a, float dotNV, float dotNL) {
  float v = 0.5 / mix(2.0*dotNL*dotNV, dotNL+dotNV, a);
  return saturate(v);
}

vec3 F_Schlick(vec3 specularColor, float dotVH) {
  return (specularColor + (1.0 - specularColor) * pow(1.0-dotVH, 5.0));
}

// Cook-Torrance
vec3 SpecularBRDF(const in IncidentLight directLight, 
  const in GeometricContext geometry, const in Material material,
  float dotNL, float dotNH, float dotVH) {
  
  float D = D_GGX(material.linearRoughness, dotNH);
  float G = G_SmithGGXCorrelated_Fast(material.linearRoughness,
    material.dotNV, dotNL);
  vec3 F = F_Schlick(material.specularColor, dotVH);
  return (F*(G*D));
}




// Heitz 2014, "Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs"
// Moving Frostbite to Physically Based Rendering 3.0
float G_SmithGGXCorrelated(float a, float dotNV, float dotNL) {
  float a2 = a*a;
  // dotNL and dotNV are explicitly swapped. This is not a mistake
  float gv = dotNL * sqrt((dotNV - a2 * dotNV)*dotNV + a2);
  float gl = dotNV * sqrt((dotNL - a2 * dotNL)*dotNL + a2);
  // float gv = dotNL * sqrt((1.0-a2)*dotNV*dotNV + a2);
  // float gl = dotNV * sqrt((1.0-a2)*dotNL*dotNL + a2);
  return 0.5 / max(gl+gv, EPSILON);
}




float SpecularBRDF_ClearCoat(const in IncidentLight directLight, 
  const in GeometricContext geometry, const in Material material, 
  float dotNH, float dotVH, float dotLH,
  out float Fcc) {
  
  float D = D_GGX(material.linearClearCoatRoughness, dotNH);
  float V = V_Keleman(dotLH);
  float F = F_SchlickF(0.04, 1.0, dotVH) * clearCoat;
  Fcc = F;
  return F*V*D;
}

// RenderEquations(RE)
void RE_Direct(const in IncidentLight directLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  
  float dotNL = saturate(dot(geometry.normal, directLight.direction));
  vec3 irradiance = dotNL * directLight.color;

  vec3 H = normalize(directLight.direction + geometry.viewDir);
  float dotNH = saturate(dot(geometry.normal, H));
  float dotVH = saturate(dot(geometry.viewDir,H));
  float dotLH = saturate(dot(directLight.direction,H));
  
  // punctual light
  irradiance *= PI;
  
  vec3 Fd = irradiance * DiffuseBRDF(material.diffuseColor);
  vec3 Fr = irradiance * SpecularBRDF(directLight, geometry, material, dotNL, dotNH, dotVH);

  // clear coat
  float Fcc;
  vec3 Fc = irradiance * SpecularBRDF_ClearCoat(directLight, geometry, material, dotNH, dotVH, dotLH, Fcc);

  float attenuation = 1.0 - Fcc;
  float attenuation2 = attenuation * attenuation;
  reflectedLight.directDiffuse += Fd * attenuation;
  reflectedLight.directSpecular += Fr * attenuation2 * material.energyCompensation;
  reflectedLight.directSpecular += Fc;
  // reflectedLight.directDiffuse += Fd;
  // reflectedLight.directSpecular += Fr;
}

// IBLs
uniform samplerCube radianceMap;
uniform samplerCube irradianceMap;
uniform float indirectDiffuseIntensity;
uniform float indirectSpecularIntensity;

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
  return PI * GammaToLinear(textureCube(irradianceMap, queryVec), float(GAMMA_FACTOR)).rgb;
}

vec3 getLightProbeIndirectRadiance(const in vec3 V, const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {
  vec3 reflectVec = inverseTransformDirection(reflect(-V, N), viewMatrix);
  float specMipLevel = getSpecularMipLevel(blinnShininessExponent, maxMipLevel);
  vec3 queryVec = vec3(-reflectVec.x, reflectVec.yz); //flip
  return GammaToLinear(textureCubeLodEXT(radianceMap, queryVec, specMipLevel), float(GAMMA_FACTOR)).rgb;
}

void RE_IndirectDiffuse(const in vec3 irradiance, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  reflectedLight.indirectDiffuse += irradiance * DiffuseBRDF(material.diffuseColor) * indirectDiffuseIntensity;
}

void RE_IndirectSpecular(const in vec3 radiance, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {
  float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
  reflectedLight.indirectSpecular += radiance * EnvBRDFApprox(material.specularColor, material.specularRoughness, dotNV) * indirectSpecularIntensity;
}

//-------------------------------------------------------------------------
void PrepareMaterial(in GeometricContext geometry, inout Material material) {

  material.clearCoatRoughness = mix(MIN_ROUGHNESS, MAX_CLEAR_COAT_ROUGHNESS, clearCoatRoughness);
  material.linearClearCoatRoughness = material.clearCoatRoughness * material.clearCoatRoughness;

  material.specularRoughness = max(material.specularRoughness, material.clearCoatRoughness);
  material.linearRoughness = material.specularRoughness * material.specularRoughness;
  

  material.specularColor = mix(material.specularColor,
    f0ClearCoatToSurface(material.specularColor), clearCoat);

  material.dotNV = saturate(dot(geometry.normal,geometry.viewDir));

  // Prefiltered DFG term used for image-based lighting
  material.dfg = PrefilteredDFG(material.specularRoughness, material.dotNV);

  // Energy compensation for multiple scattering in a microfacet model
  // See "Multiple-Scattering Microfacet BSDFs with the Smith Model"
  material.energyCompensation = 1.0 + material.specularColor * (1.0 / material.dfg.y - 1.0);
  material.energyCompensation = mix(vec3(1.0), material.energyCompensation, energyCompensation);
  // material.energyCompensation = vec3(1.0);
}

void main() {
  GeometricContext geometry;
  geometry.position = -vViewPosition;
  geometry.normal = normalize(vNormal);
  geometry.viewDir = normalize(vViewPosition);

  vec3 baseColor = GammaToLinear(vec4(albedo,1.0), float(GAMMA_FACTOR)).xyz;
  
  Material material;
  material.diffuseColor = mix(baseColor, vec3(0.0), metallic);
  // Assumes an interface from air to an IOR of 1.5 for dielectrics
  material.specularColor = mix(vec3(0.04), baseColor, metallic);

  // Clamp the roughness to a minimum value to avoid divisions by 0 in the lighting code
  material.specularRoughness = clamp(roughness, MIN_ROUGHNESS, 1.0);

  PrepareMaterial(geometry, material);
  
  // Direct lighting
  
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 emissive = vec3(0.0);
  float opacity = 1.0;
  
  IncidentLight directLight;
  directLight.direction = dirLightDir;
  directLight.color = dirLightColor;
  directLight.visible = true;
  RE_Direct(directLight, geometry, material, reflectedLight);

  // Indirect lighting
  float blinnExponent = GGXRoughnessToBlinnExponent(material.specularRoughness);
  vec3 irradiance = getLightProbeIndirectIrradiance(geometry.normal, blinnExponent, 8);
  // irradiance = getLightProbeIndirectIrradianceSH(geometry.normal);
  RE_IndirectDiffuse(irradiance, geometry, material, reflectedLight);
  
  vec3 radiance = getLightProbeIndirectRadiance(geometry.viewDir, geometry.normal, blinnExponent, 8);
  RE_IndirectSpecular(radiance, geometry, material, reflectedLight);
  
  vec3 outgoingLight = emissive + reflectedLight.directDiffuse + reflectedLight.directSpecular + reflectedLight.indirectDiffuse + reflectedLight.indirectSpecular;

  // outgoingLight = vec3(clearCoat);
  // outgoingLight = vec3(clearCoatRoughness);
  // outgoingLight = material.specularColor;
  // outgoingLight = vec3(material.specularRoughness);
  // outgoingLight = vec3(material.dfg.xy, 0.0);
  // outgoingLight = vec3(1.0-material.dfg.y);
  // outgoingLight = vec3(1.0 / max(material.dfg.y,EPSILON)-1.0);
  // outgoingLight = material.energyCompensation;
  // outgoingLight = heatmap(material.energyCompensation.z);
  // outgoingLight = heatmap(luminance(material.energyCompensation));
  // outgoingLight = reflectedLight.directDiffuse;
  // outgoingLight = reflectedLight.directSpecular;
  // outgoingLight = reflectedLight.indirectDiffuse;
  // outgoingLight = reflectedLight.indirectSpecular;
  // outgoingLight = emissive;

  outgoingLight = Tonemap_ACES(outgoingLight);
  outgoingLight = LinearToGamma(vec4(outgoingLight,1.0), float(GAMMA_FACTOR)).xyz;
  
  gl_FragColor = vec4(outgoingLight, opacity);
}