varying vec3 vViewPosition;
varying vec3 vNormal;

// uniforms
uniform float metallic;
uniform float roughness;
uniform vec3 albedo;
uniform int diffuseType;

// defines
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6

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

// BRDFs

float F_ScalarSchlick(float product, float f0, float fd90) {
  return f0 + (fd90-f0) * pow(1.0 - product, 5.0);
}

vec3 LambertDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  return color * RECIPROCAL_PI;
}

vec3 DisneyDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float fd90 = 0.5 + 2.0 * dotLH * dotLH * a;
  float nl = F_ScalarSchlick(dotNL, 1.0, fd90);
  float nv = F_ScalarSchlick(dotNV, 1.0, fd90);
  return color * (nl*nv*RECIPROCAL_PI);
}

vec3 RenormalizedDisneyDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float energyBias = mix(0.0, 0.5, roughness);
  float energyFactor = mix(1.0, 1.0/1.51, roughness);
  float fd90 = energyBias + 2.0 * dotLH * dotLH * roughness;
  float nl = F_ScalarSchlick(dotNL, 1.0, fd90);
  float nv = F_ScalarSchlick(dotNV, 1.0, fd90);
  return color * (nl*nv*energyFactor*RECIPROCAL_PI);
}

vec3 OrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float theta_i = acos(dotNL);
  float theta_r = acos(dotNV);
  float cos_phi_diff = (dotLV - dotNL*dotNV) / (sin(theta_i)*sin(theta_r) + EPSILON);
  float alpha = max(theta_i, theta_r);
  float beta  = min(theta_i, theta_r);
  if (alpha > PI*0.5) {
    return vec3(0);
  }
  
  float C1 = 1.0 - 0.5*a/(a + 0.33);
  float C2 = 0.45 * a / (a + 0.09);
  if (cos_phi_diff >= 0.0) {
    C2 *= sin(alpha);
  }
  else {
    C2 *= (sin(alpha) - pow(2.0*beta/PI, 3.0));
  }
  float C3 = 0.125 * a / (a + 0.09) * pow((4.0*alpha*beta)/PI2, 2.0);
  
  float L1 = C1 + cos_phi_diff * C2 * tan(beta) + (1.0 - abs(cos_phi_diff)) * C3 * tan((alpha+beta)/2.0);
  float L2 = 0.17 * (a / (a + 0.13)) * (1.0 - cos_phi_diff * (4.0 * beta * beta) / (PI2));
  return color * (L1*RECIPROCAL_PI) + color * color * (L2*RECIPROCAL_PI);
}

vec3 QualitativeOrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float theta_i = acos(dotNL);
  float theta_r = acos(dotNV);
  float cos_phi_diff = (dotLV - dotNL*dotNV) / (sin(theta_i)*sin(theta_r) + EPSILON);
  float alpha = max(theta_i, theta_r);
  float beta  = min(theta_i, theta_r);
  if (alpha > PI*0.5) {
    return vec3(0);
  }
  
  float A = 1.0 - 0.5*a/(a+0.33);
  float B = 0.45*a/(a+0.09);
  float C = sin(alpha)*tan(beta);
  float L1 = A+B*max(0.0,cos_phi_diff)*C;
  return color*(L1*RECIPROCAL_PI);
}

vec3 ImprovedOrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float theta_i = acos(dotNL);
  float theta_r = acos(dotNV);
  float cos_phi_diff = (dotLV - dotNL*dotNV) / (sin(theta_i)*sin(theta_r) + EPSILON);
  
  float A1 = 1.0 - 0.5*a/(a+0.33);
  float A2 = 0.17*a/(a+0.13);
  float B = 0.45*a/(a+0.09);
  float s = cos_phi_diff * sin(theta_i) * sin(theta_r);
  float t = 1.0;
  if (s > 0.0) t = max(dotNL, dotNV);
  vec3 L1 = color*(A1+B*s/t);
  vec3 L2 = color*color*A2;
  return (L1+L2)*RECIPROCAL_PI;
}

vec3 FastImprovedOrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float s = (dotLV - dotNL*dotNV);
  float A = 1.0 / (PI+(PI/2.0-2.0/3.0)*roughness);
  float B = roughness*A;
  float t = 1.0;
  if (s > 0.0) t = max(dotNL, dotNV) + EPSILON;
  vec3 L1 = color*(A+B*s/t);
  return L1;
}

vec3 NormalizedOrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float f0 = 0.04;
  float fdiff = 1.05 * (1.0-f0) * (1.0 - pow(1.0-dotNL, 5.0)) * (1.0 - pow(1.0-dotNV, 5.0));
  float A = 1.0 - 0.5*a/(a+0.65);
  float B = 0.45*a/(a+0.09);
  float Bp = dotLV - dotNV*dotNL;
  float Bm = min(1.0, dotNL/(dotNV+EPSILON));
  float L1 = (1.0-f0) * (fdiff*dotNL*A + B*Bp*Bm);
  return color*(L1*RECIPROCAL_PI);
}

vec3 GGXOrenNayarDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float f0 = 0.04;
  float theta_i = acos(dotNL);
  float theta_r = acos(dotNV);
  float cos_phi_diff = (dotLV - dotNL*dotNV) / (sin(theta_i)*sin(theta_r) + EPSILON);
  
  float Fr1 = (1.0 - (0.542026*a + 0.303573*roughness) / (a + 1.36053));
  float Fr2 = (1.0 - (pow(1.0 - dotNV, 5.0 - 4.0*a)) / (a + 1.36053));
  float Fr3 = (-0.733996*a*roughness + 1.50912*a - 1.16402*roughness);
  float Fr4 = (pow(1.0 - dotNV, 1.0 + (1.0 / (39.0*a*a + 1.0))));
  float Fr = Fr1*Fr2*(Fr3*Fr4+1.0);
  float Lm1 = (max(1.0 - (2.0*roughness), 0.0)*(1.0 - pow(1.0 - dotNL, 5.0)) + min(2.0*roughness, 1.0)); 
  float Lm2 = ((1.0 - 0.5*roughness)*dotNL + (0.5*roughness)*(pow(dotNL, 2.0)));
	float Lm = Lm1 * Lm2;
	float Vd1 = (a / ((a + 0.09)*(1.31072 + 0.995584*dotNV)));
  float Vd2 = (1.0 - (pow(1.0 - dotNL, (1.0 - 0.3726732*(dotNV*dotNV)) / (0.188566 + 0.38841*dotNV))));
  float Vd = Vd1*Vd2;
  float Bp = dotLV - (dotNV*dotNL);
	if (Bp < 0.0) Bp *= 1.4*dotNV*dotNL;
  float L1 = 1.05*(1.0 - f0)*(Fr*Lm + Vd*Bp);
  return color*(L1*RECIPROCAL_PI);
}

vec3 GGXApproxDiffuse(vec3 color, float dotNL, float dotNV, float dotNH, float dotLH, float dotLV, float roughness, float a) {
  float facing = 0.5 + 0.5*dotLV;
  float rough  = facing*(0.9-0.4*facing)*((0.5+dotNH)/dotNH);
  float Smooth = 1.05*(1.0-pow(1.0-dotNL, 5.0)) * (1.0-pow(1.0-dotNV, 5.0));
  float single = mix(Smooth, rough, a) * RECIPROCAL_PI;
  float multi  = 0.1159*a;
  return color*(vec3(single) + color*multi);
}

// Normalized Lambert
vec3 DiffuseBRDF(const in IncidentLight directLight, const in GeometricContext geometry, vec3 diffuseColor, float roughnessFactor) {
  vec3 N = geometry.normal;
  vec3 V = geometry.viewDir;
  vec3 L = directLight.direction;
  
  float dotNL = saturate(dot(N,L));
  float dotNV = saturate(dot(N,V));
  vec3 H = normalize(L+V);
  float dotNH = saturate(dot(N,H));
  float dotVH = saturate(dot(V,H));
  float dotLH = saturate(dot(L,H));
  float dotLV = saturate(dot(L,V));
  float a = roughnessFactor * roughnessFactor;
  
  if (diffuseType >= 9) {
    return GGXApproxDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 8) {
    return GGXOrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 7) {
    return NormalizedOrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 6) {
    return FastImprovedOrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 5) {
    return ImprovedOrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 4) {
    return QualitativeOrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 3) {
    return OrenNayarDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 2) {
    return RenormalizedDisneyDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else if (diffuseType >= 1) {
    return DisneyDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
  else {
    return LambertDiffuse(diffuseColor, dotNL, dotNV, dotLH, dotVH, dotLV, roughnessFactor, a);
  }
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
  
  reflectedLight.directDiffuse += irradiance * DiffuseBRDF(directLight, geometry, material.diffuseColor, material.specularRoughness);
  // reflectedLight.directSpecular += irradiance * SpecularBRDF(directLight, geometry, material.specularColor, material.specularRoughness);
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
  
  vec3 outgoingLight = emissive + reflectedLight.directDiffuse + reflectedLight.directSpecular + reflectedLight.indirectDiffuse + reflectedLight.indirectSpecular;
  
  gl_FragColor = vec4(outgoingLight, opacity);
}