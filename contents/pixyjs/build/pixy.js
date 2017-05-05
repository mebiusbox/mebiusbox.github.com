(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.PIXY = global.PIXY || {})));
}(this, (function (exports) { 'use strict';

	var accumulateFrag = "  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + emissive;";

	var ambientFrag = "  reflectedLight.indirectDiffuse += ambientColor * material.diffuseColor;";

	var ambientFragPars = "uniform vec3 ambientColor;\r\n\r\nvec3 getAmbientLightIrradiance(const in vec3 ambient) {\r\n  return ambient;\r\n}";

	var ambientHemisphereFrag = "  reflectedLight.indirectDiffuse += mix(groundColor, ambientColor, (dot(geometry.normal, normalize(skyDirection)) + 1.0) * 0.5) * material.diffuseColor;";

	var ambientHemisphereFragPars = "uniform vec3 groundColor;\r\nuniform vec3 skyDirection;";

	var ambientHemisphereUniforms = {
	  groundColor: { value: new THREE.Color(0x404040) },
	  skyDirection: { value: new THREE.Vector3(0,1,0) }
	};

	var ambientUniforms = {
	  ambientColor: { value: new THREE.Color(0x0) }
	};

	var anisotropyFrag = "// vec3 H = normalize(directLight.direction + geometry.viewDir);\r\n\r\n// reflectedLight.directDiffuse += material.diffuseColor * AnisotropyDiffuseTerm(material.diffuseColor, anisotropyColor, geometry.normal, directLight.direction, geometry.viewDir) * NoL * anisotropyStrength;\r\n  reflectedLight.directSpecular += AnisotropySpecularTerm(anisotropyExponent, geometry.normal, H, directLight.direction, geometry.viewDir, vTangent, vBinormal, anisotropyFresnel) * anisotropyColor * NoL * anisotropyStrength;\r\n\r\n// vec3 vObjPosition = normalize(geometry.position);\r\n// vec3 asHL = normalize(directLight.direction + vObjPosition);\r\n// vec3 asHH = normalize(asHL + geometry.viewDir);\r\n// float asHHU = dot(asHH, vTangent);\r\n// float asHHV = dot(asHH, vBinormal);\r\n// float asHHN = dot(asHH, vNormal);\r\n// float asHHK = dot(asHH, asHL);\r\n// float asHNU = 1.0;\r\n// float asHNV = anisotropyExponent;\r\n// float asHTerm1 = sqrt((asHNU + 1.0) * (asHNV + 1.0)) / (8.0 * PI);\r\n// float asHexponent = ((asHNU * asHHU * asHHU) + (asHNV * asHHV * asHHV)) / (1.0 - asHHN * asHHN);\r\n// float asHTerm2 = pow(asHHN, asHexponent);\r\n// float asHFresnelTerm = (anisotropyFresnel + (1.0 - anisotropyFresnel) * (1.0 - (pow2(asHHK) * pow3(asHHK))));\r\n// float asHSpecTerm = min(1.0, asHTerm1 * asHTerm2 * asHFresnelTerm * anisotropyStrength);\r\n// reflectedLight.directSpecular += asHSpecTerm * NoL * anisotropyColor;";

	var anisotropyFragPars = "// http://asura.iaigiri.com/XNA_GS/xna19.html\r\nuniform float anisotropyExponent;\r\nuniform float anisotropyStrength;\r\nuniform float anisotropyFresnel;\r\nuniform vec3 anisotropyColor;\r\n// varying vec3 vObjPosition;\r\n// vec3 AnisotropyDiffuseTerm(vec3 Rd, vec3 Rs, vec3 N, vec3 k1, vec3 k2) {\r\n//   vec3 term1 = ((28.0 * Rd) / (23.0 * PI)) * (1.0 - Rs);\r\n//   float term2 = (1.0 - pow5(1.0 - dot(N, k1) * 0.5));\r\n//   float term3 = (1.0 - pow5(1.0 - dot(N, k2) * 0.5));\r\n//   return term1 * term2 * term3;\r\n// }\r\n// float nu = 1.0\r\nfloat AnisotropySpecularTerm(float nv, vec3 N, vec3 H, vec3 L, vec3 V, vec3 T, vec3 B, float F) {\r\n  float HU = dot(H, T);\r\n  float HV = dot(H, B);\r\n  float HN = dot(H, N);\r\n  float HK = dot(H, L);\r\n  float NL = dot(N, L);\r\n  float NV = dot(N, V);\r\n//   float exponent = ((nu * HU * HU) + (nv * HV * HV)) / (1.0 - HN * HN);\r\n//   float term1 = sqrt((nu + 1.0) * (nv + 1.0)) / (8.0 * PI);\r\n  float exponent = ((HU * HU) + (nv * HV * HV)) / (1.0 - HN * HN);\r\n  float term1 = sqrt(2.0 * (nv + 1.0)) / (8.0 * PI);\r\n  float term2 = pow(HN, exponent) / (HK * max(NL, NV));\r\n  float fresnel = F + (1.0 - F) * (1.0 - pow5(HK));\r\n  return term1 * term2 * fresnel;\r\n}";

	var anisotropyUniforms = {
	  anisotropyExponent: { value: 100.0 },
	  anisotropyStrength: { value: 1.0 },
	  anisotropyFresnel: { value: 0.5 },
	  anisotropyColor: { value: new THREE.Color() }
	};

	var antiAliasFrag = "uniform sampler2D tDiffuse;\r\nuniform vec2 resolution;\r\n\r\n#define FXAA_REDUCE_MIN (1.0/128.0)\r\n#define FXAA_REDUCE_MUL (1.0/8.0)\r\n#define FXAA_SPAN_MAX 8.0\r\n\r\nvoid main() {\r\n  vec3 rgbNW = texture2D(tDiffuse, (gl_FragCoord.xy + vec2(-1.0, -1.0)) * resolution).xyz;\r\n  vec3 rgbNE = texture2D(tDiffuse, (gl_FragCoord.xy + vec2( 1.0, -1.0)) * resolution).xyz;\r\n  vec3 rgbSW = texture2D(tDiffuse, (gl_FragCoord.xy + vec2(-1.0,  1.0)) * resolution).xyz;\r\n  vec3 rgbSE = texture2D(tDiffuse, (gl_FragCoord.xy + vec2( 1.0,  1.0)) * resolution).xyz;\r\n  vec4 rgbaM = texture2D(tDiffuse, gl_FragCoord.xy * resolution);\r\n  vec3 rgbM = rgbaM.xyz;\r\n  vec3 luma = vec3(0.299, 0.587, 0.114);\r\n\r\n  float lumaNW = dot(rgbNW, luma);\r\n  float lumaNE = dot(rgbNE, luma);\r\n  float lumaSW = dot(rgbSW, luma);\r\n  float lumaSE = dot(rgbSE, luma);\r\n  float lumaM  = dot(rgbM,  luma);\r\n  float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\r\n  float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\r\n\r\n  vec2 dir;\r\n  dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\r\n  dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\r\n\r\n  float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\r\n  float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\r\n  dir = min(vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\r\n            max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * resolution;\r\n  vec4 rgbA = (1.0/2.0) * (\r\n    texture2D(tDiffuse, gl_FragCoord.xy * resolution + dir * (1.0/3.0 - 0.5)) +\r\n    texture2D(tDiffuse, gl_FragCoord.xy * resolution + dir * (2.0/3.0 - 0.5)));\r\n  vec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (\r\n    texture2D(tDiffuse, gl_FragCoord.xy * resolution + dir * (0.0/3.0 - 0.5)) +\r\n    texture2D(tDiffuse, gl_FragCoord.xy * resolution + dir * (3.0/3.0 - 0.5)));\r\n\r\n  float lumaB = dot(rgbB, vec4(luma, 0.0));\r\n\r\n  if ((lumaB < lumaMin) || (lumaB > lumaMax)) {\r\n    gl_FragColor = rgbA;\r\n  } else {\r\n    gl_FragColor = rgbB;\r\n  }\r\n}";

	var antiAliasUniforms = {
	  tDiffuse: { value: null },
	  resolution: { value: new THREE.Vector2(1/1024, 1/512) }
	};

	var antiAliasVert = "void main() {\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var aoMapFrag = "  float obscure = texture2D(tAO, vUv).r * aoStrength;\r\n  reflectedLight.directDiffuse *= obscure;\r\n  reflectedLight.directDiffuse += reflectedLight.directSpecular * obscure;\r\n  reflectedLight.directSpecular = vec3(0.0);";

	var aoMapFragPars = "uniform sampler2D tAO;\r\nuniform float aoStrength;";

	var aoMapUniforms = {
	  tAO: { value: null },
	  aoStrength: { value: 1.0 }
	};

	var beginFrag = "  GeometricContext geometry;\r\n  geometry.position = -vViewPosition;\r\n  geometry.normal = normalize(vNormal);\r\n  geometry.viewDir = normalize(vViewPosition);\r\n\r\n  Material material;\r\n  material.diffuseColor = diffuseColor;\r\n  material.opacity = opacity;\r\n\r\n  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));\r\n  vec3 emissive = vec3(0.0);";

	var billboardDefaultVert = "  mat3 invMatrix = mat3(ViewInverse[0].xyz, ViewInverse[1].xyz, ViewInverse[2].xyz);";

	var billboardRotZVertEnd = "  vec3 rotX = vec3(0.0);\r\n  vec3 rotY = vec3(0.0);\r\n  vec3 rotZ = vec3(0.0);\r\n  if (wscale.x > 0.0) rotX = row0 / wscale.x;\r\n  if (wscale.y > 0.0) rotY = row1 / wscale.y;\r\n  if (wscale.z > 0.0) rotZ = row2 / wscale.z;\r\n  vec3 pos = invMatrix * mat3(rotX, rotY, rotZ) * position;\r\n  vec3 wpos = pos * wscale + wtrans;\r\n  vec4 hpos = projectionMatrix * viewMatrix * vec4(wpos, 1.0);";

	var billboardUniforms = {
	  ViewInverse: { value: new THREE.Matrix4() }
	};

	var billboardVert = "void main() {\r\n  vec3 row0 = vec3(modelMatrix[0].x, modelMatrix[1].x, modelMatrix[2].x);\r\n  vec3 row1 = vec3(modelMatrix[0].y, modelMatrix[1].y, modelMatrix[2].y);\r\n  vec3 row2 = vec3(modelMatrix[0].z, modelMatrix[1].z, modelMatrix[2].z);\r\n  vec3 wscale = vec3(length(row0), length(row1), length(row2));\r\n  vec3 wtrans = modelMatrix[3].xyz;";

	var billboardVertEnd = "  vec3 pos = invMatrix * position;\r\n  vec3 wpos = pos * wscale + wtrans;\r\n  vec4 hpos = projectionMatrix * viewMatrix * vec4(wpos, 1.0);\r\n//   mat4 matrix = projectionMatrix * modelViewMatrix;\r\n//   vec4 hpos;\r\n//   hpos.x = dot(position, vec3(matrix[0].x, matrix[1].x, matrix[2].x)) + matrix[3].x;\r\n//   hpos.y = dot(position, vec3(matrix[0].y, matrix[1].y, matrix[2].y)) + matrix[3].y;\r\n//   hpos.z = dot(position, vec3(matrix[0].z, matrix[1].z, matrix[2].z)) + matrix[3].z;\r\n//   hpos.w = dot(position, vec3(matrix[0].w, matrix[1].w, matrix[2].w)) + matrix[3].w;\r\n//   hpos = matrix * vec4(position, 1.0);";

	var billboardVertPars = "uniform mat4 ViewInverse;";

	var billboardYVert = "  mat3 invMatrix;\r\n  invMatrix[2] = normalize(vec3(ViewInverse[2].x, 0.0, ViewInverse[2].z));\r\n  invMatrix[0] = normalize(cross(vec3(0.0, 1.0, 0.0), invMatrix[2]));\r\n  invMatrix[1] = cross(invMatrix[2], invMatrix[0]);";

	var bokehFrag = "#include <common>\r\n\r\nvarying vec2 vUv;\r\n\r\nuniform sampler2D tColor;\r\nuniform sampler2D tDepth;\r\nuniform float textureWidth;\r\nuniform float textureHeight;\r\n\r\nuniform float focalDepth;\r\nuniform float focalLength;\r\nuniform float fstop;\r\nuniform bool showFocus;\r\n\r\n// make sure that these two values are the same for your camera, otherwise distances will be wrong\r\nuniform float znear;\r\nuniform float zfar;\r\n\r\n// user variables\r\nconst int samples = SAMPLES;\r\nconst int rings = RINGS;\r\n\r\nconst int maxringsamples = rings * samples;\r\n\r\nuniform bool manualdof;\r\nfloat ndofstart = 1.0;\r\nfloat ndofdist = 2.0;\r\nfloat fdofstart = 1.0;\r\nfloat fdofdist = 3.0;\r\n\r\nfloat CoC = 0.03;\r\n\r\nuniform bool vignetting;\r\nfloat vignout = 1.3;\r\nfloat vignin = 0.0;\r\nfloat vignfade = 22.0;\r\n\r\nuniform bool shaderFocus;\r\n// disable if you use external focalDepth value\r\n\r\nuniform vec2 focusCoords;\r\n// autofocus point on screen (0.0, 0.0 - left lower corner, 1.0, 1.0 - upper right)\r\n// if center of screen use vec2(0.5, 0.5)\r\n\r\nuniform float maxblur;\r\n// clamp value o fmax blur (0.0 = no blur, 1.0 default)\r\n\r\nuniform float threshold;\r\nuniform float gain;\r\n\r\nuniform float bias;\r\nuniform float fringe;\r\n\r\nuniform bool noise;\r\n\r\nuniform float dithering;\r\n\r\nuniform bool depthblur;\r\nfloat dbsize = 1.25;\r\n\r\n// next part is experimental\r\n// not looking good with small sample and ring count\r\n// looks okay starting from samples = 4, rings = 4\r\n\r\nuniform bool pentagon;\r\nfloat feather = 0.4;\r\n\r\nfloat penta(vec2 coords) {\r\n// pentagonal shape\r\n  float scale = float(rings) - 1.3;\r\n  vec4 HS0 = vec4( 1.0,         0.0,         0.0, 1.0);\r\n  vec4 HS1 = vec4( 0.309016994, 0.951056516, 0.0, 1.0);\r\n  vec4 HS2 = vec4(-0.809016994, 0.587785252, 0.0, 1.0);\r\n  vec4 HS3 = vec4(-0.809016994,-0.587785252, 0.0, 1.0);\r\n  vec4 HS4 = vec4( 0.309016994,-0.951056516, 0.0, 1.0);\r\n  vec4 HS5 = vec4( 0.0,         0.0,         1.0, 1.0);\r\n  vec4 one = vec4(1.0);\r\n  vec4 P = vec4((coords), vec2(scale, scale));\r\n  vec4 dist = vec4(0.0);\r\n  float inorout = -4.0;\r\n\r\n  dist.x = dot(P, HS0);\r\n  dist.y = dot(P, HS1);\r\n  dist.z = dot(P, HS2);\r\n  dist.w = dot(P, HS3);\r\n\r\n  dist = smoothstep(-feather, feather, dist);\r\n\r\n  inorout += dot(dit, one);\r\n\r\n  dist.x = dot(P, HS4);\r\n  dist.y = HS5.w - abs(P.z);\r\n  dist = smoothstep(-feather, feather, dist);\r\n  inorout += dist.x;\r\n  return clamp(inorout, 0.0, 1.0);\r\n}\r\n\r\nfloat bdepth(vec2 coords) {\r\n// Depth buffer blur\r\n  float d = 0.0;\r\n  float kernel[9];\r\n  vec2 offset[9];\r\n  vec2 wh = vec2(1.0 / textureWidth, 1.0 / textureHeight) * dbsize;\r\n\r\n  offset[0] = vec2(-wh.x, -wh.y);\r\n  offset[1] = vec2(0.0,   -wh.y);\r\n  offset[2] = vec2(wh.x,  -wh.y);\r\n\r\n  offset[3] = vec2(-wh.x, 0.0);\r\n  offset[4] = vec2(0.0,   0.0);\r\n  offset[5] = vec2(wh.x,  0.0);\r\n\r\n  offset[6] = vec2(-wh.x, wh.y);\r\n  offset[7] = vec2(0.0,   wh.y);\r\n  offset[8] = vec2(wh.x,  wh.y);\r\n\r\n  kernel[0] = 1.0 / 16.0; kernel[1] = 2.0 / 16.0; kernel[2] = 1.0 / 16.0;\r\n  kernel[3] = 2.0 / 16.0; kernel[4] = 4.0 / 16.0; kernel[5] = 2.0 / 16.0;\r\n  kernel[6] = 1.0 / 16.0; kernel[7] = 2.0 / 16.0; kernel[8] = 1.0 / 16.0;\r\n\r\n  for (int i=0; i<9; i++) {\r\n    float tmp = texture2D(tDepth, coords + offset[i]).r;\r\n    d += tmp * kernel[i];\r\n  }\r\n\r\n  return d;\r\n}\r\n\r\nvec3 color(vec2 coords, float blur) {\r\n// processing the sample\r\n  vec3 col = vec3(0.0);\r\n  vec2 texel = vec2(1.0 / textureWidth, 1.0 / textureHeight);\r\n\r\n  col.r = texture2D(tColor, coords + vec2(0.0, 1.0) * texel * fringe * blur).r;\r\n  col.g = texture2D(tColor, coords + vec2(-0.866, -0.5) * texel * fringe * blur).g;\r\n  col.b = texture2D(tColor, coords + vec2(0.866, -0.5) * texel * fringe * blur).b;\r\n\r\n  vec3 lumcoeff = vec3(0.299, 0.587, 0.114);\r\n  float lum = dot(col.rgb, lumcoeff);\r\n  float thresh = max((lum - threshold) * gain, 0.0);\r\n  return col + mix(vec3(0.0), col, thresh * blur);\r\n}\r\n\r\nvec3 debugFocus(vec3 col, float blur, float depth) {\r\n  float edge = 0.002 * depth;\r\n  float m = clamp(smoothstep(0.0, edge, blur), 0.0, 1.0);\r\n  float e = clamp(smoothstep(1.0 - edge, 1.0, blur), 0.0, 1.0);\r\n\r\n  col = mix(col, vec3(1.0, 0.5, 0.0), (1.0 - m) * 0.6);\r\n  col = mix(col, vec3(0.0, 0.5, 1.0), ((1.0 - e) - (1.0 - m)) * 0.2);\r\n\r\n  return col;\r\n}\r\n\r\nfloat linearize(float depth) {\r\n  return -zfar * znear / (depth * (zfar - znear) - zfar);\r\n}\r\n\r\nfloat vignette() {\r\n  float dist = distance(vUv.xy, vec2(0.5, 0.5));\r\n  dist = smoothstep(vignout + (fstop / vignfade), vignin + (fstop / vignfade), dist);\r\n  return clamp(dist, 0.0, 1.0);\r\n}\r\n\r\nfloat gather(float i, float j, int ringsamples, inout vec3 col, float w, float h, float blur) {\r\n  float rings2 = float(rings);\r\n  step = PI * 2.0 / float(ringsamples);\r\n  float pw = cos(j * step) * i;\r\n  float ph = sin(j * step) * i;\r\n  float p = 1.0;\r\n  if (pentagon) {\r\n    p = penta(vec2(pw, ph));\r\n  }\r\n  col += color(vUv.xy + vec2(pw*w, ph*h), blur) * mix(1.0, i/rings2, bias) * p;\r\n  return 1.0 * mix(1.0, i/rings2, bias) * p;\r\n}\r\n\r\nvoid main() {\r\n// scene depth calculation\r\n  float depth = linearize(texture2D(tDepth, vUv.xy).x);\r\n\r\n// Blur depth?\r\n  if (depthblur) {\r\n    depth = linearize(bdepth(vUv.xy));\r\n  }\r\n\r\n// focal plane calculation\r\n  float fDepth = focalDepth;\r\n\r\n  if (shaderFocus) {\r\n    fDpeth = linearize(texture2D(tDepth, focusCoords).x);\r\n  }\r\n\r\n// dof blur factor calculation\r\n\r\n  float blur = 0.0;\r\n\r\n  if (manualdof) {\r\n    float a = depth - fDepth;\r\n    float b = (a - fdofstart) / fdofdist;\r\n    float c = (-a - ndofstart) / ndofdist;\r\n    blur = (a > 0.0) ? b : c;\r\n  } else {\r\n    float f = focalLength;\r\n    float d = fDepth * 1000.0;\r\n    float o = depth * 1000.0;\r\n\r\n    float a = (o*f) / (o-f);\r\n    float b = (d*f) / (d-f);\r\n    float c = (d-f) / (d * fstop * CoC);\r\n\r\n    blur = abs(a-b) * c;\r\n  }\r\n\r\n  blur = clamp(blur, 0.0, 1.0);\r\n\r\n// calculation of pattern for dithering\r\n\r\n  vec2 noise = vec2(rand(vUv.xy), rand(vUv.xy + vec2(0.4, 0.6))) * dithering * blur;\r\n\r\n// getting blur x and y step factor\r\n\r\n  float w = (1.0 / textureWidth) * blur * maxblur + noise.x;\r\n  float h = (1.0 / textureHeight) * blur * maxblur + noise.y;\r\n\r\n// calculation of final color\r\n\r\n  vec3 col = vec3(0.0);\r\n\r\n  if (blur < 0.05) {\r\n// some optimization thingy\r\n    col = texture2D(tColor, vUv.xy).rgb;\r\n  } else {\r\n    col = texture2D(tColor, vuv.xy).rgb;\r\n    float s = 1.0;\r\n    int ringsamples;\r\n\r\n    for (int i=1; i<=rings; i++) {\r\n// unboxstart\r\n      ringsamples = i * samples;\r\n      for (int j=0; j<maxringsamples; j++) {\r\n        if (j >= ringsamples) break;\r\n        s += gather(float(i), float(j), ringsamples, col, w, h, blur);\r\n      }\r\n// unboxend\r\n    }\r\n\r\n    col /= s;\r\n  }\r\n\r\n  if (showFocus) {\r\n    col = debugFocus(col, blur, depth);\r\n  }\r\n\r\n  if (vignetting) {\r\n    col *= vignette();\r\n  }\r\n\r\n  gl_FragColor.rgb = col;\r\n  gl_FragColor.a = 1.0;\r\n}";

	var bokehUniforms = {
	  textureWidth: { value: 1.0 },
	  textureHeight: { value: 1.0 },
	  focalDepth: { value: 1.0 },
	  focalLength: { value: 24.0 },
	  fstop: { value: 0.9 },
	  
	  tColor: { value: null },
	  tDepth: { value: null },
	  
	  maxblur: { value: 1.0 },
	  
	  showFocus: { value: 0 },
	  manualdof: { value: 0 },
	  vignetting: { value: 0 },
	  depthblur: { value: 0 },
	  
	  threshold: { value: 0.5 },
	  gain: { value: 2.0 },
	  bias: { value: 0.5 },
	  fringe: { value: 0.7 },
	  
	  znear: { value: 0.1 },
	  zfar: { value: 100 },
	  
	  noise: { value: 1 },
	  dithering: { value: 0.0001 },
	  pentagon: { value: 0 },
	  
	  shaderFocus: { value: 1 },
	  focusCoords: { value: new THREE.Vector2() }
	};

	var bokehVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var bsdfs = "vec3 DiffuseLambert(vec3 diffuseColor) {\r\n  return RECIPROCAL_PI * diffuseColor;\r\n}\r\n\r\n// KANSAI CEDEC2015: Final Fantasy 零式HD リマスター\r\nvec3 DiffuseOrenNayar(vec3 diffuseColor, float NoV, float NoL, float LoV, float roughness) {\r\n  float s = LoV - NoL * NoV;\r\n  float t = rcp(max(NoL, NoV) + 1e-5);\r\n  t = (s < 0.0) ? 1.0 : t;\r\n  float st = s*t;\r\n  \r\n  // ラフネスが 0.0 ～ 1.0 になるように限定すると高速近似可能\r\n  // 参照：A tiny improvement of Oren-Nayar reflectance model\r\n  // http://mimosa-pudica.net/improved-oren-nayar.html\r\n  float a = rcp((PI * 0.5 - 2.0/3.0) * roughness + PI);\r\n  float b = roughness * a;\r\n  return diffuseColor * NoL * (a + b*st);\r\n}\r\n\r\n// compute fresnel specular factor for given base specular and product\r\n// product could be NoV or VoH depending on used technique\r\n// vec3 F_Schlick(vec3 f0, float product) {\r\n//   return mix(f0, vec3(1.0), pow(1.0 - product, 5.0));\r\n// }\r\n\r\nvec3 F_Schlick(vec3 specularColor, vec3 H, vec3 V) {\r\n  return (specularColor + (1.0 - specularColor) * pow(1.0 - saturate(dot(V, H)), 5.0));\r\n}\r\n\r\nvec3 F_SchlickApprox(vec3 specularColor, float VoH) {\r\n\r\n  // Original approximation by Christophe Schlick '94\r\n  // float fresnel = pow(1.0 - product, 5.0);\r\n  \r\n  // Optimized variant (presented by Epic at SIGGRAPH '13)\r\n  float fresnel = exp2((-5.55473 * VoH - 6.98316) * VoH);\r\n  \r\n  // Anything less than 2% is physically impossible and is instead considered to be shadowing\r\n  // return specularColor + (saturate(50.0 * specularColor.g) - specularColor) * fresnel;\r\n  return specularColor + (vec3(1.0) - specularColor) * fresnel;\r\n}\r\n\r\nvec3 F_CookTorrance(vec3 specularColor, vec3 H, vec3 V) {\r\n  vec3 n = (1.0 + sqrt(specularColor)) / (1.0 - sqrt(specularColor));\r\n  float c = saturate(dot(V, H));\r\n  vec3 g = sqrt(n * n + c * c - 1.0);\r\n  \r\n  vec3 part1 = (g - c) / (g + c);\r\n  vec3 part2 = ((g + c) * c - 1.0) / ((g - c) * c + 1.0);\r\n  \r\n  return max(vec3(0.0), 0.5 * part1 * part1 * (1.0 + part2 + part2));\r\n}\r\n\r\n\r\n/// SPECULAR D: MICROFACET DISTRIBUTION FUNCTION\r\n\r\n// Microfacet Models for Refraction through Rough Surface - equation (33)\r\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\r\n// \"a\" is \"roughness squared\" in Disney 's reparameterization\r\nfloat D_GGX(float a, float NoH) {\r\n  // Isotropic ggx\r\n  float a2 = a*a;\r\n  float NoH2 = NoH*NoH;\r\n  float d = NoH2 * (a2 - 1.0) + 1.0;\r\n  return a2 / (PI * d * d);\r\n}\r\n\r\nfloat D_GGX_AreaLight(float a, float aP, float NoH) {\r\n  float a2 = a*a;\r\n  float aP2 = aP*aP;\r\n  float NoH2 = NoH*NoH;\r\n  float d = NoH2 * (a2 - 1.0) + 1.0;\r\n  return (a2*aP2) / (pow(NoH2 * (a2-1.0) + 1.0, 2.0) * PI);\r\n}\r\n\r\n// following functions are copies fo UE4\r\n// for computing cook-torrance specular lighitng terms\r\n// https://gist.github.com/galek/53557375251e1a942dfa\r\nfloat D_Blinn(in float a, in float NoH) {\r\n  float a2 = a * a;\r\n  float n = 2.0 / (a2*a2) - 2.0;\r\n  return (n + 2.0) / (2.0 * PI) * pow(NoH, n);\r\n}\r\n\r\nfloat D_BlinnPhong(float a, float NoH) {\r\n  float a2 = a * a;\r\n  return (1.0 / (PI * a2)) * pow(NoH, 2.0 / a2 - 2.0);\r\n}\r\n\r\n// https://gist.github.com/galek/53557375251e1a942dfa\r\nfloat D_Beckmann(float a, float NoH) {\r\n  float a2 = a * a;\r\n  float NoH2 = NoH * NoH;\r\n  \r\n  return (1.0 / (PI * a2 * NoH2 * NoH2 + 1e-5)) * exp((NoH2 - 1.0) / (a2 * NoH2));\r\n}\r\n\r\n\r\n/// SPECULAR G: GEOMETRIC ATTENUATION\r\n\r\n\r\nfloat G_Implicit(float a, float NoV, float NoL) {\r\n  return NoL * NoL;\r\n}\r\n\r\nfloat G_BlinngPhong_Implicit(float a, float NoV, float NoL) {\r\n  // geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\r\n  return 0.25;\r\n}\r\n\r\nfloat G_Newmann(float a, float NoV, float NoL) {\r\n  return (NoL * NoV) / max(NoL, NoV);\r\n}\r\n\r\nfloat G_CookTorrance(float a, float NoV, float NoL, float NoH, float VoH) {\r\n  return min(1.0, min((2.0 * NoH * NoV) / VoH, (2.0 * NoH * NoL) / VoH));\r\n}\r\n\r\nfloat G_Kelemen(float a, float NoV, float NoL, float LoV) {\r\n  return (2.0 * NoL * NoV) / (1.0 + LoV);\r\n}\r\n\r\nfloat G_Beckmann(float a, float product) {\r\n  float c = product / (a * sqrt(1.0 - product * product));\r\n  if (c >= 1.6) {\r\n    return 1.0;\r\n  }\r\n  else {\r\n    float c2 = c * c;\r\n    return (3.535 * c + 2.181 * c2) / (1.0 + 2.276 * c + 2.577 * c2);\r\n  }\r\n}\r\n\r\nfloat G_Smith_Beckmann(float a, float NoV, float NoL) {\r\n  return G_Beckmann(a, NoV) * G_Beckmann(a, NoL);\r\n}\r\n\r\n// Smith approx\r\n// Microfacet Models for Refraction through Rough Surface - equation (34)\r\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\r\n// \"a\" is \"roughness squared\" in Disney 's reparameterization\r\nfloat G_Smith_GGX(float a, float NoV, float NoL) {\r\n  // geometry term = dot(G(l), G(v)) / 4 * dot(n,l) * dot(n,v)\r\n  float a2 = a * a;\r\n  float gl = NoL + sqrt(a2 + (1.0 - a2) * pow2(NoL));\r\n  float gv = NoV + sqrt(a2 + (1.0 - a2) * pow2(NoV));\r\n  return 1.0 / (gl*gv);\r\n}\r\n\r\n// from page 12, listing 2 of http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\r\nfloat G_SmithCorrelated_GGX(float a, float NoV, float NoL) {\r\n  float a2 = a * a;\r\n  \r\n  // NoL and NoV are explicitly swapped. This is not a mistake\r\n  float gv = NoL * sqrt(a2 + (1.0 - a2) * pow2(NoV));\r\n  float gl = NoV * sqrt(a2 + (1.0 - a2) * pow2(NoL));\r\n  \r\n  return 0.5 / max(gv+gl, EPSILON);\r\n}\r\n\r\n// Schlick's Geometric approximation. Note this is edited by Epic to match\r\n// a modification disney made (And ignoring there modifications,\r\n// if you want to do your own research you need to know up front the Schlick originally\r\n// approximated the wrong fomula, so be careful to make sure you choose the corrected\r\n// Schlick if you find it online)\r\nfloat G_Smith_Schlick_GGX(float a, float NoV, float NoL) {\r\n  float k = a * a * 0.5;\r\n  float gl = NoL / (NoL * (1.0 - k) + k);\r\n  float gv = NoV / (NoV * (1.0 - k) + k);\r\n  return gl*gv;\r\n}\r\n\r\nfloat G_Schlick(in float a, in float NoV, in float NoL) {\r\n  float k = a * 0.5;\r\n  float V = NoV * (1.0 - k) + k;\r\n  float L = NoL * (1.0 - k) + k;\r\n  return 0.25 / (V * L);\r\n}\r\n\r\nfloat G_SchlickApprox(in float a, in float NdotV, in float NdotL) {\r\n  float V = NdotL * (NdotV * (1.0 - a) + a);\r\n  float L = NdotV * (NdotL * (1.0 - a) + a);\r\n  return 0.5 / (V + L + 1e-5);\r\n}\r\n\r\n// [ Lazarov 2013 \"Getting More Physical in Call of Duty: Black Ops II\" ]\r\n// Adaptation to fit our G term\r\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\r\n// BRDF_Specular_GGX_Environment\r\nvec3 EnvBRDFApprox(vec3 specularColor, float roughness, float NoV) {\r\n  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);\r\n  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04 );\r\n  vec4 r = roughness * c0 + c1;\r\n  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;\r\n  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;\r\n  return specularColor * AB.x + AB.y;\r\n}\r\n\r\n// three.js (bsdfs.glsl)\r\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\r\nfloat GGXRoughnessToBlinnExponent(const in float ggxRoughness) {\r\n  return 2.0 / pow2(ggxRoughness + 0.0001) - 2.0;\r\n}\r\n\r\nfloat BlinnExponentToGGXRoughness(const in float blinnExponent) {\r\n  return sqrt(2.0 / (blinnExponent + 2.0));\r\n}\r\n\r\n/// DISNEY\r\n\r\nfloat F_Schlick_Disney(float u) {\r\n  float m = saturate(1.0 - u);\r\n  float m2 = m * m;\r\n  return m2 * m2 * m;\r\n}\r\n\r\nfloat GTR2_aniso(float NoH, float HoX, float HoY, float ax, float ay) {\r\n  return 1.0 / (PI * ax*ay * pow2(pow2(HoX/ax) + pow2(HoY/ay) + NoH*NoH));\r\n}\r\n    \r\nfloat smithG_GGX(float NoV, float alphaG) {\r\n  float a = alphaG * alphaG;\r\n  float b = NoV * NoV;\r\n  return 1.0 / (NoV + sqrt(a + b - a*b));\r\n}\r\n    \r\nfloat GTR1(float NoH, float a) {\r\n  if (a >= 1.0) {\r\n    return 1.0 / PI;\r\n  }\r\n      \r\n  float a2 = a*a;\r\n  float t = 1.0 + (a2 - 1.0) * NoH * NoH;\r\n  return (a2 - 1.0) / (PI * log(a2) * t);\r\n}";

	var bumpMapFrag = "  geometry.normal = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd());";

	var bumpMapFragPars = "uniform sampler2D tNormal;\r\nuniform float bumpiness;\r\n\r\nvec2 dHdxy_fwd() {\r\n  vec2 dSTdx = dFdx(vUv);\r\n  vec2 dSTdy = dFdy(vUv);\r\n  float Hll = bumpiness * texture2D(tNormal, vUv).x;\r\n  float dBx = bumpiness * texture2D(tNormal, vUv + dSTdx).x - Hll;\r\n  float dBy = bumpiness * texture2D(tNormal, vUv + dSTdy).x - Hll;\r\n  return vec2(dBx, dBy);\r\n}\r\n\r\nvec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\r\n  vec3 vSigmaX = dFdx(surf_pos);\r\n  vec3 vSigmaY = dFdy(surf_pos);\r\n  vec3 vN = surf_norm; // normalized\r\n  vec3 R1 = cross(vSigmaY, vN);\r\n  vec3 R2 = cross(vN, vSigmaX);\r\n  float fDet = dot(vSigmaX, R1);\r\n  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);\r\n  return normalize(abs(fDet) * surf_norm - vGrad);\r\n}";

	var bumpMapUniforms = {
	  tNormal: { value: null },
	  bumpiness: { value: 1.0 }
	};

	var castShadowFrag = "  float d = vShadowMapUV.z / vShadowMapUV.w;\r\n  gl_FragColor = packDepthToRGBA(d);";

	var castShadowFragPars = "varying vec4 vShadowMapUV;";

	var castShadowUniforms = {
	  lightViewProjectionMatrix: { value: new THREE.Matrix4() }
	};

	var castShadowVert = "  vec4 hpos = lightViewProjectionMatrix * modelMatrix * vec4(position, 1.0);\r\n  vShadowMapUV = hpos;";

	var castShadowVertPars = "uniform mat4 lightViewProjectionMatrix;\r\nvarying vec4 vShadowMapUV;";

	var clippingPlaneFrag = "  if (dot(vViewPosition, clippingPlane.xyz) > clippingPlane.w) discard;";

	var clippingPlaneFragPars = "uniform vec4 clippingPlane;";

	var clippingPlaneUniforms = {
	  clippingPlane: { value: new THREE.Vector4() }
	};

	var cloudsFrag = "  vec2 cloudsUV = vec2(vUv.x + cloudsTranslation, vUv.y);\r\n  vec2 cloudsPerturb = texture2D(tCloudsPerturb, cloudsUV).xy * cloudsScale;\r\n  cloudsPerturb.xy += cloudsUV + vec2(cloudsTranslation);\r\n  vec3 sunLight = max(reflectedLight.indirectDiffuse, vec3(0.2));\r\n  reflectedLight.indirectDiffuse += texture2D(tClouds, cloudsPerturb).rgb * cloudsBrightness * sunLight;\r\n// reflectedLight.indirectDiffuse += texture2D(tClouds, vUv).rgb * cloudsBrightness;";

	var cloudsFragPars = "uniform sampler2D tClouds;\r\nuniform sampler2D tCloudsPerturb;\r\nuniform float cloudsTranslation;\r\nuniform float cloudsScale;\r\nuniform float cloudsBrightness;";

	var cloudsUniforms = {
	  tClouds: { value: null },
	  tCloudsPerturb: { value: null },
	  cloudsTranslation: { value: 0.0 },
	  cloudsScale: { value: 0.3 },
	  cloudsBrightness: { value: 0.5 }
	};

	var colorMap2Frag = "  vec4 color2RGBA = texture2D(tDiffuse2, uv);\r\n  material.diffuseColor.rgb = (1.0 - color2RGBA.a) * material.diffuseColor.rgb + color2RGBA.rgb * color2RGBA.a;";

	var colorMap2FragPars = "uniform sampler2D tDiffuse2;";

	var colorMap2Uniforms = {
	  tDiffuse2: { value: null }
	};

	var colorMapAlphaFrag = "  material.opacity *= colorRGBA.a;";

	var colorMapFrag = "  vec4 colorRGBA = texture2D(tDiffuse, uv);\r\n  material.diffuseColor.rgb *= colorRGBA.rgb;";

	var colorMapFragPars = "uniform sampler2D tDiffuse;";

	var colorMapUniforms = {
	  tDiffuse: { value: null }
	};

	var common = "#define PI 3.14159265359\r\n#define PI2 6.28318530718\r\n#define RECIPROCAL_PI 0.31830988618\r\n#define RECIPROCAL_PI2 0.15915494\r\n#define LOG2 1.442695\r\n#define EPSILON 1e-6\r\n\r\n// handy value clamping to 0 - 1 range\r\n// #define saturate(a) clamp(a, 0.0, 1.0)\r\n#define whiteCompliment(a) (1.0 - saturate(a))\r\n\r\nfloat pow2(const in float x) { return x*x; }\r\nfloat pow3(const in float x) { return x*x*x; }\r\nfloat pow4(const in float x) { float x2 = x*x; return x2*x2; }\r\nfloat pow5(const in float x) { float x2 = x*x; return x2*x2*x; }\r\nfloat average(const in vec3 color) { return dot(color, vec3(0.3333)); }\r\nfloat rcp(const in float x) { return 1.0/x; }\r\n\r\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\r\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\r\nhighp float rand(const in vec2 uv) {\r\n  const highp float a = 12.9898, b = 78.233, c = 43758.5453;\r\n  highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, PI);\r\n  return fract(sin(sn) * c);\r\n}\r\n\r\nstruct IncidentLight {\r\n  vec3 color;\r\n  vec3 direction;\r\n  bool visible;\r\n};\r\n\r\nstruct ReflectedLight {\r\n  vec3 directDiffuse;\r\n  vec3 directSpecular;\r\n  vec3 indirectDiffuse;\r\n  vec3 indirectSpecular;\r\n};\r\n\r\nstruct GeometricContext {\r\n  vec3 position;\r\n  vec3 normal;\r\n  vec3 viewDir;\r\n};\r\n\r\nstruct Material {\r\n  vec3 diffuseColor;\r\n  float opacity;\r\n  float specularRoughness;\r\n  vec3 specularColor;\r\n};\r\n\r\nvec3 transformDirection(in vec3 dir, in mat4 matrix) {\r\n  return normalize((matrix * vec4(dir, 0.0)).xyz);\r\n}\r\n\r\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\r\nvec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {\r\n  return normalize((vec4(dir, 0.0) * matrix).xyz);\r\n}\r\n\r\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {\r\n  float distance = dot(planeNormal, point - pointOnPlane);\r\n  return -distance * planeNormal + point;\r\n}\r\n\r\nfloat sideOfPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {\r\n  return sign(dot(point - pointOnPlane, planeNormal));\r\n}\r\n\r\nvec3 linePlaneIntersect(in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal) {\r\n  return lineDirection * (dot(planeNormal, pointOnPlane - pointOnLine) / dot(planeNormal, lineDirection)) + pointOnLine;\r\n}";

	var copyFrag = "uniform sampler2D tDiffuse;\r\nuniform float opacity;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n  gl_FragColor = texture2D(tDiffuse, vUv) * opacity;\r\n}";

	var copyUniforms = {
	  tDiffuse: { value: null },
	  opacity: { value: 1.0 }
	};

	var copyVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var deferredGeometryFrag = "#extension GL_EXT_draw_buffers : require\r\n#extension GL_OES_standard_derivatives : enable\r\nprecision mediump float;\r\n#include <packing>\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tRoughness;\r\nuniform sampler2D tNormal;\r\nuniform float bumpiness;\r\nvarying vec3 vViewPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nvec2 dHdxy_fwd() {\r\n  vec2 dSTdx = dFdx(vUv);\r\n  vec2 dSTdy = dFdy(vUv);\r\n  float Hll = bumpiness * texture2D(tNormal, vUv).x;\r\n  float dBx = bumpiness * texture2D(tNormal, vUv + dSTdx).x - Hll;\r\n  float dBy = bumpiness * texture2D(tNormal, vUv + dSTdy).x - Hll;\r\n  return vec2(dBx, dBy);\r\n}\r\n\r\nvec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\r\n  vec3 vSigmaX = dFdx(surf_pos);\r\n  vec3 vSigmaY = dFdy(surf_pos);\r\n  vec3 vN = surf_norm; // normalized\r\n  vec3 R1 = cross(vSigmaY, vN);\r\n  vec3 R2 = cross(vN, vSigmaX);\r\n  float fDet = dot(vSigmaX, R1);\r\n  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);\r\n  return normalize(abs(fDet) * surf_norm - vGrad);\r\n}\r\n\r\nvoid main() {\r\n  vec4 diffuseRGBA = texture2D(tDiffuse, vUv);\r\n  vec4 roughnessRGBA = texture2D(tRoughness, vUv);\r\n  vec3 Nn = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd());\r\n  gl_FragData[0] = vec4(Nn * 0.5 + 0.5, 0.0);\r\n  gl_FragData[1] = vec4(diffuseRGBA.xyz, roughnessRGBA.r);\r\n}";

	var deferredGeometryUniforms = {
	  tDiffuse: { value: null },
	  tRoughness: { value: null },
	  tNormal:  { value: null },
	  bumpiness: { value: 1.0 }
	};

	var deferredGeometryVert = "#extension GL_EXT_draw_buffers : require\r\nuniform mat4 projectionMatrix;\r\nuniform mat4 modelViewMatrix;\r\nuniform mat3 normalMatrix;\r\nattribute vec3 position;\r\nattribute vec3 normal;\r\nattribute vec2 uv;\r\nvarying vec3 vViewPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\r\n  gl_Position = projectionMatrix * mvPosition;\r\n  vViewPosition = -mvPosition.xyz;\r\n  vNormal = normalize(normalMatrix * normal);\r\n  vUv = uv;\r\n}";

	var deferredLightFrag = "#extension GL_EXT_draw_buffers : require\r\n#extension GL_EXT_shader_texture_lod : enable\r\nprecision mediump float;\r\n#include <packing>\r\n#define PI 3.14159265359\r\n#define RECIPROCAL_PI 0.31830988618\r\n#define saturate(x) clamp(x, 0.0, 1.0)\r\nfloat pow2(const in float x) { return x*x; }\r\nvec3 transformDirection(in vec3 dir, in mat4 matrix) {\r\n  return normalize((matrix * vec4(dir, 0.0)).xyz);\r\n}\r\nvec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {\r\n  return normalize((vec4(dir, 0.0) * matrix).xyz);\r\n}\r\nvec4 GammaToLinear(in vec4 value, in float gammaFactor) {\r\n  return vec4(pow(value.xyz, vec3(gammaFactor)), value.w);\r\n}\r\nvec4 LinearToGamma(in vec4 value, in float gammaFactor) {\r\n  return vec4(pow(value.xyz, vec3(1.0/gammaFactor)), value.w);\r\n}\r\n// #define NUM_POINT_LIGHT 300\r\nstruct PointLight {\r\n  vec3 position;\r\n  vec3 color;\r\n};\r\n\r\nuniform PointLight pointLights[NUM_POINT_LIGHT];\r\nuniform int numPointLights;\r\nuniform float cutoffDistance;\r\nuniform float decayExponent;\r\nuniform float metalness;\r\nuniform float reflectionStrength;\r\nuniform vec3 viewPosition;\r\nuniform mat4 viewInverse;\r\nuniform mat4 viewProjectionInverse;\r\nuniform sampler2D gbuf0; // [rgb-] normal\r\nuniform sampler2D gbuf1; // [rgb-] albedo [---w] roughness\r\nuniform sampler2D tDepth;\r\nuniform samplerCube tEnvMap;\r\nvarying vec2 vUv;\r\n\r\n\r\n// [ Lazarov 2013 \"Getting More Physical in Call of Duty: Black Ops II\" ]\r\n// Adaptation to fit our G term\r\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\r\n// BRDF_Specular_GGX_Environment\r\nvec3 EnvBRDFApprox(vec3 specularColor, float roughness, float NoV) {\r\n  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);\r\n  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04 );\r\n  vec4 r = roughness * c0 + c1;\r\n  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;\r\n  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;\r\n  return specularColor * AB.x + AB.y;\r\n}\r\n\r\n// three.js (bsdfs.glsl)\r\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\r\nfloat GGXRoughnessToBlinnExponent(const in float ggxRoughness) {\r\n  return 2.0 / pow2(ggxRoughness + 0.0001) - 2.0;\r\n}\r\n\r\nfloat BlinnExponentToGGXRoughness(const in float blinnExponent) {\r\n  return sqrt(2.0 / (blinnExponent + 2.0));\r\n}\r\n\r\n// taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html\r\nfloat getSpecularMipLevel(const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  float maxMipLevelScalar = float(maxMipLevel);\r\n  float desiredMipLevel = maxMipLevelScalar - 0.79248 - 0.5 * log2(pow2(blinnShininessExponent)+1.0);\r\n  \r\n  // clamp to allowable LOD ranges\r\n  return clamp(desiredMipLevel, 0.0, maxMipLevelScalar);\r\n}\r\n\r\nvec3 getLightProbeIndirectIrradiance(const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  return GammaToLinear(textureCubeLodEXT(tEnvMap, N, float(maxMipLevel)), 2.2).rgb * reflectionStrength;\r\n}\r\n\r\nvec3 getLightProbeIndirectRadiance(const in vec3 V, const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  vec3 reflectVec = reflect(-V, N);\r\n  float specMipLevel = getSpecularMipLevel(blinnShininessExponent, maxMipLevel);\r\n  return GammaToLinear(textureCubeLodEXT(tEnvMap, reflectVec, specMipLevel), 2.2).rgb * reflectionStrength;\r\n}\r\n\r\n\r\nvec3 DiffuseLambert(vec3 diffuseColor) {\r\n  return RECIPROCAL_PI * diffuseColor;\r\n}\r\n\r\nfloat D_GGX(float a, float NoH) {\r\n  // Isotropic ggx\r\n  float a2 = a*a;\r\n  float NoH2 = NoH*NoH;\r\n  float d = NoH2 * (a2 - 1.0) + 1.0;\r\n  return a2 / (PI * d * d);\r\n}\r\n\r\nfloat G_Smith_Schlick_GGX(float a, float NoV, float NoL) {\r\n  float k = a * a * 0.5;\r\n  float gl = NoL / (NoL * (1.0 - k) + k);\r\n  float gv = NoV / (NoV * (1.0 - k) + k);\r\n  return gl*gv;\r\n}\r\n\r\nvec3 F_Schlick(vec3 specularColor, float VoH) {\r\n\r\n  // Original approximation by Christophe Schlick '94\r\n  // \"float fresnel = pow(1.0 - product, 5.0);\",\r\n  \r\n  // Optimized variant (presented by Epic at SIGGRAPH '13)\r\n  float fresnel = exp2((-5.55473 * VoH - 6.98316) * VoH);\r\n  \r\n  return specularColor + (vec3(1.0) - specularColor) * fresnel;\r\n}\r\n\r\nfloat Specular_D(float a, float NoH) {\r\n  return D_GGX(a, NoH);\r\n}\r\n\r\nfloat Specular_G(float a, float NoV, float NoL, float NoH, float VoH, float LoV) {\r\n  return G_Smith_Schlick_GGX(a, NoV, NoL);\r\n}\r\n\r\nvec3 Specular_F(vec3 specularColor, vec3 H, vec3 V) {\r\n  return F_Schlick(specularColor, saturate(dot(H,V)));\r\n}\r\n\r\nvec3 Specular(vec3 specularColor, vec3 H, vec3 V, vec3 L, float a, float NoL, float NoV, float NoH, float VoH, float LoV) {\r\n  float D = Specular_D(a, NoH);\r\n  float G = Specular_G(a, NoV, NoL, NoH, VoH, LoV);\r\n  vec3 F = Specular_F(specularColor, V, H) / (4.0 * NoL * NoV + 1e-5);\r\n  return F * (G * D);\r\n}\r\n\r\nvec3 ComputeLight(vec3 albedoColor, vec3 specularColor, vec3 N, float roughness, vec3 L, vec3 Lc, vec3 V) {\r\n  // Compute some useful values\r\n  float NoL = saturate(dot(N, L));\r\n  float NoV = saturate(dot(N, V));\r\n  vec3 H = normalize(L+V);\r\n  float NoH = saturate(dot(N, H));\r\n  float VoH = saturate(dot(V, H));\r\n  float LoV = saturate(dot(L, V));\r\n  \r\n  float a = pow2(roughness);\r\n  \r\n  vec3 cdiff = DiffuseLambert(albedoColor);\r\n  vec3 cspec = Specular(specularColor, H, V, L, a, NoL, NoV, NoH, VoH, LoV);\r\n  \r\n  return Lc * NoL * (cdiff + cspec);\r\n}\r\n\r\nvoid main() {\r\n  vec4 normalDepth = texture2D(gbuf0, vUv);\r\n  if (normalDepth.x + normalDepth.y + normalDepth.z == 0.0) discard;\r\n  \r\n  vec4 diffuseRoughness = texture2D(gbuf1, vUv);\r\n  vec4 diffuse = GammaToLinear(diffuseRoughness, 2.2);\r\n  vec4 depthRGBA = texture2D(tDepth, vUv);\r\n  float depth = depthRGBA.x * 2.0 - 1.0;\r\n  vec4 HPos = viewProjectionInverse * vec4(vUv*2.0-1.0, depth, 1.0);\r\n  vec3 worldPosition = HPos.xyz / HPos.w;\r\n  vec3 Nn = normalDepth.xyz * 2.0 - 1.0;\r\n  Nn = transformDirection(Nn, viewInverse);\r\n  vec3 viewDir = normalize(viewPosition - worldPosition);\r\n  \r\n  float roughnessFactor = max(0.04, diffuseRoughness.w);\r\n  vec3 cdiff = mix(diffuse.xyz, vec3(0.0), metalness);\r\n  vec3 cspec = mix(vec3(0.04), diffuse.xyz, metalness);\r\n\r\n  vec3 finalColor = vec3(0.0);\r\n  for (int i=0; i<NUM_POINT_LIGHT; ++i) {\r\n    if (i >= numPointLights) break;\r\n    \r\n    vec3 L = pointLights[i].position - worldPosition;\r\n    float Ld = length(L);\r\n    if (cutoffDistance == 0.0 || Ld < cutoffDistance) {\r\n      \r\n      float Lc = pow(saturate(-Ld / cutoffDistance + 1.0), decayExponent);\r\n      vec3 irradiance = pointLights[i].color * Lc;\r\n      irradiance *= PI; // punctual light\r\n      \r\n      vec3 Ln = normalize(L);\r\n      finalColor += ComputeLight(cdiff, cspec, Nn, roughnessFactor, Ln, irradiance, viewDir);\r\n    }\r\n  }\r\n  \r\n  vec3 indirect_irradiance = getLightProbeIndirectIrradiance(Nn, GGXRoughnessToBlinnExponent(roughnessFactor), 10) * PI;\r\n  vec3 diffIBL = indirect_irradiance * DiffuseLambert(cdiff);\r\n  finalColor += diffIBL;\r\n  \r\n  float NoV = saturate(dot(Nn, viewDir));\r\n  vec3 radiance = getLightProbeIndirectRadiance(viewDir, Nn, GGXRoughnessToBlinnExponent(roughnessFactor), 10);\r\n  finalColor += radiance * EnvBRDFApprox(cspec, roughnessFactor, NoV);\r\n  \r\n  gl_FragColor = LinearToGamma(vec4(finalColor, 1.0), 2.2);\r\n}";

	var deferredLightUniforms = {
	  gbuf0: { value: null },
	  gbuf1: { value: null },
	  tDepth: { value: null },
	  tEnvMap: { value: null },
	  metalness: { value: 1.0 },
	  reflectionStrength: { value: 1.0 },
	  pointLights: { value: [] },
	  numPointLights: { value: 0 },
	  viewInverse: { value: new THREE.Matrix4() },
	  viewProjectionInverse: { value: new THREE.Matrix4() },
	  viewPosition: { value: new THREE.Vector3() },
	  cutoffDistance: { value: 10.0 },
	  decayExponent: { value: 3.0 }
	};

	var deferredLightVert = "uniform mat4 projectionMatrix;\r\nuniform mat4 modelViewMatrix;\r\nattribute vec3 position;\r\nattribute vec2 uv;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n  vUv = uv;\r\n}";

	var depthFrag = "  gl_FragData[0] = packDepthToRGBA(gl_FragCoord.z);";

	var depthFragPars = "#include <packing>";

	var depthShadowFrag = "  gl_FragColor.xyz = vec3(unpackRGBAToDepth(texture2D(tShadow, vUv)));\r\n// gl_FragColor.xyz = vec3(DecodeFloatRGBA(texture2D(tShadow, vUv)));\r\n// gl_FragColor.xyz = texture2D(tShadow, vUv).aaa;\r\n  gl_FragColor.a = 1.0;";

	var depthShadowFragPars = "uniform sampler2D tShadow;";

	var depthShadowReceiveFrag = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tShadow;\r\nvarying vec4 depth;\r\nvarying vec4 shadowMapUV;\r\nvarying vec2 vUv;\r\n\r\n// http://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/\r\nfloat DecodeFloatRGBA(vec4 rgba) {\r\n  return dot(rgba, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/16581375.0));\r\n}\r\n\r\nvoid main() {\r\n  float d = DecodeFloatRGBA(texture2DProj(tShadow, shadowMapUV));\r\n  vec4 diffuse = texture2D(tDiffuse, vUv);\r\n  vec4 color = (d * depth.w < depth.z-0.03) ? vec4(0) : vec4(1);\r\n  gl_FragColor = diffuse * color;\r\n  // gl_FragColor.rgb = vec3(shadowMapUV.x, shadowMapUV.y, 1.0);\r\n  // gl_FragColor.rgb = shadow.xxx;\r\n  // gl_FragColor.rgb = texture2D(tShadow, vUv).xxx;\r\n}";

	var depthShadowReceiveUniforms = {
	  mLightViewProjection: { value: new THREE.Matrix4() },
	  mShadowMatrix:        { value: new THREE.Matrix4() },
	  tDiffuse:             { value: null},
	  tShadow:              { value: null}
	};

	var depthShadowReceiveVert = "uniform mat4 mLightViewProjection;\r\nuniform mat4 mShadowMatrix;\r\nvarying vec4 depth;\r\nvarying vec4 shadowMapUV;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  depth = mLightViewProjection * modelMatrix * vec4(position, 1.0);\r\n  shadowMapUV = mShadowMatrix * modelMatrix * vec4(position, 1.0);\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var depthShadowUniforms = {
	  tShadow: { value: null }
	};

	var depthShadowVert = "uniform mat4 mLightViewProjection;\r\nvarying vec4 vShadowMapUV;\r\nvoid main() {\r\n  vec4 pos = mLightViewProjection * modelMatrix * vec4(position, 1.0);\r\n  gl_Position = pos;\r\n  vShadowMapUV = pos;\r\n}";

	var discardFrag = "  if (material.opacity <= 0.5) discard;";

	var displacementMapUniforms = {
	  tDisplacement: { value: null },
	  displacementScale: { value: 1.0 },
	  displacementBias: { value: 0.0 }
	};

	var displacementMapVert = "  transformed += normal * (texture2D(tDisplacement, uv).x * displacementScale + displacementBias);";

	var displacementMapVertPars = "uniform sampler2D tDisplacement;\r\nuniform float displacementScale;\r\nuniform float displacementBias;";

	var distortionFrag = "  vec4 distortionNormal = texture2D(tDistortion, vUv2);\r\n  vec3 distortion = (distortionNormal.rgb - vec3(0.5)) * distortionStrength;\r\n  uv += distortion.xy;\r\n// float distortionInfluence = 1.0;\r\n// material.diffuseColor.rgb *= texture2D(tDiffuse, vUv + distortion.xy * distortionInfluence).rgb;\r\n// material.diffuseColor.rgb *= texture2D(tDiffuse, vUv2 + distortion.xy).rgb;\r\n  // material.diffuseColor.rgb *= texture2D(tDiffuse, uv + distortion.xy).rgb;";

	var distortionFragPars = "varying vec2 vUv2;\r\nuniform sampler2D tDistortion;\r\nuniform float distortionStrength;";

	var distortionUniforms = {
	  tDistortion: { value: null },
	  distortionStrength: { value: 1.0 }
	};

	var distortionVert = "  vUv2 = uv;";

	var distortionVertPars = "varying vec2 vUv2;";

	var ditherFrag = "  // float threshold = bayer(1, vScreenPos.xy * 10.0);\r\n  // material.opacity = step(threshold, material.opacity);\r\n  mat4 StippleThresholdMatrix = mat4(\r\n    1.0 / 17.0, 9.0 / 17.0, 3.0 / 17.0, 11.0 / 17.0,\r\n    13.0 / 17.0, 5.0 / 17.0, 15.0 / 17.0, 7.0 / 17.0,\r\n    4.0 / 17.0, 12.0 / 17.0, 2.0 / 17.0, 10.0 / 17.0,\r\n    16.0 / 17.0, 8.0 / 17.0, 14.0 / 17.0, 6.0 / 17.0);\r\n  \r\n  vec4 thresholdVec = StippleThresholdMatrix[3];\r\n  float scrX = abs(mod(gl_FragCoord.x, 4.0));\r\n  if (scrX <= 1.0) {\r\n    thresholdVec = StippleThresholdMatrix[0];\r\n  }\r\n  else if (scrX <= 2.0) {\r\n    thresholdVec = StippleThresholdMatrix[1];\r\n  }\r\n  else if (scrX <= 3.0) {\r\n    thresholdVec = StippleThresholdMatrix[2];\r\n  }\r\n  \r\n  float threshold = thresholdVec.w;\r\n  float scrY = abs(mod(gl_FragCoord.y, 4.0));\r\n  if (scrY <= 1.0) {\r\n    threshold = thresholdVec.x;\r\n  }\r\n  else if (scrY <= 2.0) {\r\n    threshold = thresholdVec.y;\r\n  }\r\n  else if (scrX <= 3.0) {\r\n    threshold = thresholdVec.z;\r\n  }\r\n  if (material.opacity < threshold) {\r\n    discard;\r\n  }";

	var ditherFragPars = "varying vec4 vScreenPos;\r\n// http://fe0km.blog.fc2.com/blog-entry-122.html?sp\r\n// http://glslsandbox.com/e#30514.1\r\nfloat bayer(int iter, vec2 rc) {\r\n  float sum = 0.0;\r\n  for (int i=0; i<4; ++i) {\r\n    if (i >= iter) break;\r\n    vec2 bsize = vec2(pow(2.0, float(i+1)));\r\n    vec2 t = mod(rc, bsize) / bsize;\r\n    int idx = int(dot(floor(t*2.0), vec2(2.0, 1.0)));\r\n    float b = 0.0;\r\n    if (idx == 0) { b = 0.0; } else if (idx == 1) { b = 2.0; } else if (idx == 2) { b = 3.0; } else { b = 1.0; }\r\n    sum += b * pow(4.0, float(iter-i-1));\r\n  }\r\n  float phi = pow(4.0, float(iter)) + 1.0;\r\n  return (sum + 1.0) / phi;\r\n}";

	var edgeCompositeFrag = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tEdge;\r\nuniform vec3 edgeColor;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n  vec4 diffuse = texture2D(tDiffuse, vUv);\r\n  vec4 edge = texture2D(tEdge, vUv);\r\n  vec4 color = mix(diffuse, vec4(edgeColor, 1.0), edge.x);\r\n  gl_FragColor = vec4(color.xyz, 1.0);\r\n}";

	var edgeCompositeUniforms = {
	  tDiffuse: { value: null },
	  tEdge: { value: null },
	  edgeColor: { value: new THREE.Vector3() }
	};

	var edgeCompositeVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var edgeExpandFrag = "uniform sampler2D tDiffuse;\r\nuniform vec2 aspect;\r\nuniform float strength;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvarying vec2 vUv4;\r\nvarying vec2 vUv5;\r\nvarying vec2 vUv6;\r\nvarying vec2 vUv7;\r\nvoid main() {\r\n  vec2 dvu = vec2(4.0 / aspect.x, 0);\r\n  vec4 color = texture2D(tDiffuse, vUv0)\r\n             + texture2D(tDiffuse, vUv1)\r\n             + texture2D(tDiffuse, vUv2)\r\n             + texture2D(tDiffuse, vUv3)\r\n             + texture2D(tDiffuse, vUv4)\r\n             + texture2D(tDiffuse, vUv5)\r\n             + texture2D(tDiffuse, vUv6)\r\n             + texture2D(tDiffuse, vUv7)\r\n             + texture2D(tDiffuse, vUv0 + dvu)\r\n             + texture2D(tDiffuse, vUv1 + dvu)\r\n             + texture2D(tDiffuse, vUv2 + dvu)\r\n             + texture2D(tDiffuse, vUv3 + dvu)\r\n             + texture2D(tDiffuse, vUv4 + dvu)\r\n             + texture2D(tDiffuse, vUv5 + dvu)\r\n             + texture2D(tDiffuse, vUv6 + dvu)\r\n             + texture2D(tDiffuse, vUv7 + dvu);\r\n  gl_FragColor = vec4(color.xyz * strength, 1);\r\n}";

	var edgeExpandUniforms = {
	  tDiffuse: { value: null },
	  aspect: { value: new THREE.Vector2() },
	  strength: { value: 0.7 }
	};

	var edgeExpandVert = "uniform vec2 aspect;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvarying vec2 vUv4;\r\nvarying vec2 vUv5;\r\nvarying vec2 vUv6;\r\nvarying vec2 vUv7;\r\nvoid main() {\r\n  vec2 stepUV = vec2(1.0 / aspect.x, 1.0 / aspect.y);\r\n  vec2 stepUV3 = stepUV * 3.0;\r\n  vUv0 = uv + vec2(-stepUV3.x, -stepUV3.y);\r\n  vUv1 = uv + vec2(-stepUV3.x, -stepUV.y);\r\n  vUv2 = uv + vec2(-stepUV3.x, stepUV.y);\r\n  vUv3 = uv + vec2(-stepUV3.x, stepUV3.y);\r\n  vUv4 = uv + vec2(-stepUV.x, -stepUV3.y);\r\n  vUv5 = uv + vec2(-stepUV.x, -stepUV.y);\r\n  vUv6 = uv + vec2(-stepUV.x, stepUV.y);\r\n  vUv7 = uv + vec2(-stepUV.x, stepUV3.y);\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var edgeFrag = "uniform sampler2D tDiffuse;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvoid main() {\r\n  float d0 = texture2D(tDiffuse, vUv0).x - texture2D(tDiffuse, vUv1).x;\r\n  float d1 = texture2D(tDiffuse, vUv2).x - texture2D(tDiffuse, vUv3).x;\r\n  gl_FragColor = vec4(vec3(d0*d0 + d1*d1), 1);\r\n}";

	var edgeIDFrag = "uniform sampler2D tDiffuse;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvoid main() {\r\n  float t0 = texture2D(tDiffuse, vUv0).x;\r\n  float t1 = texture2D(tDiffuse, vUv1).x;\r\n  float t2 = texture2D(tDiffuse, vUv2).x;\r\n  float t3 = texture2D(tDiffuse, vUv3).x;\r\n  float t0t1 = t0 - t1;\r\n  float t2t3 = t2 - t3;\r\n  float id0 = t0t1 * t0t1;\r\n  float id1 = t2t3 * t2t3;\r\n  gl_FragColor = vec4(vec3((id0 + id1) * 64.0), 1.0);\r\n}";

	var edgeIDUniforms = {
	  tDiffuse: { value: null },
	  step:   { value: 2.0 },
	  aspect: { value: new THREE.Vector2() }
	};

	var edgeIDVert = "uniform vec2 aspect;\r\nuniform float step;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvoid main() {\r\n  vec2 stepUV = vec2(step / aspect.x, step / aspect.y);\r\n  vUv0 = uv + vec2(-stepUV.x, -stepUV.y);\r\n  vUv1 = uv + vec2( stepUV.x,  stepUV.y);\r\n  vUv2 = uv + vec2(-stepUV.x,  stepUV.y);\r\n  vUv3 = uv + vec2( stepUV.x, -stepUV.y);\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var edgeUniforms = {
	  tDiffuse: { value: null },
	  aspect: { value: new THREE.Vector2() }
	};

	var edgeVert = "uniform vec2 aspect;\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\nvoid main() {\r\n  vec2 stepUV = vec2(0.5 / aspect.x, 0.5 / aspect.y);\r\n  vUv0 = uv + vec2(-stepUV.x, -stepUV.y);\r\n  vUv1 = uv + vec2( stepUV.x,  stepUV.y);\r\n  vUv2 = uv + vec2(-stepUV.x,  stepUV.y);\r\n  vUv3 = uv + vec2( stepUV.x, -stepUV.y);\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var endFrag = "  gl_FragColor.xyz = outgoingLight;\r\n  gl_FragColor.a = material.opacity;";

	var fakeSunFrag = "uniform vec2 sunPos; // screen space\r\nuniform float aspect;\r\nuniform vec3 sunColor;\r\nuniform vec3 bgColor;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n  vec2 diff = vUv - sunPos;\r\n  \r\n  // Correct for aspect ratio\r\n  diff.x *= aspect;\r\n  \r\n  float prop = clamp(length(diff) / 0.5, 0.0, 1.0);\r\n  prop = 0.35 * pow(1.0 - prop, 3.0);\r\n  gl_FragColor.xyz = mix(sunColor, bgColor, 1.0 - prop);\r\n  gl_FragColor.a = 1.0;\r\n}";

	var fakeSunUniforms = {
	  sunPos:   { value: new THREE.Vector2() },
	  aspect:   { value: 1.0 },
	  sunColor: { value: new THREE.Color() },
	  bgColor:  { value: new THREE.Color() }
	};

	var fakeSunVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var fogFrag = "  outgoingLight = fogColor * vFogFactor + outgoingLight * (1.0 - vFogFactor);";

	var fogFragPars = "uniform vec3 fogColor;\r\nvarying float vFogFactor;";

	var fogUniforms = {
	  fogAlpha: { value: 1.0 },
	  fogFar: { value: 50.0 },
	  fogNear: { value: 1.0 },
	  fogColor: { value: new THREE.Color() }
	};

	var fogVert = "  float fogParamA = fogFar / (fogFar - fogNear);\r\n  float fogParamB = -1.0 / (fogFar - fogNear);\r\n  float fogFactor = 1.0 - (fogParamA + hpos.w * fogParamB);\r\n  vFogFactor = clamp(fogFactor, 0.0, 1.0) * fogAlpha;";

	var fogVertPars = "uniform float fogAlpha;\r\nuniform float fogFar;\r\nuniform float fogNear;\r\nvarying float vFogFactor;";

	var fresnelFrag = "  vec3 cameraToVertex = normalize(vWorldPosition - cameraPosition);\r\n\r\n  // Transforming Normal Vectors with the Inverse Transformation\r\n  vec3 worldNormal = inverseTransformDirection(geometry.normal, viewMatrix);\r\n\r\n  float krmin = reflectionStrength * fresnelReflectionScale;\r\n  float invFresnelExponent = 1.0 / fresnelExponent;\r\n  float ft = pow(abs(dot(worldNormal, cameraToVertex)), invFresnelExponent);\r\n  float fresnel = mix(reflectionStrength, krmin, ft);\r\n  vec3 vReflect = reflect(cameraToVertex, worldNormal);\r\n  vReflect.x = -vReflect.x; // flip\r\n  reflectedLight.indirectSpecular += textureCube(tEnvMap, vReflect).rgb * fresnel;";

	var fresnelFragPars = "uniform float fresnelExponent;\r\nuniform float fresnelReflectionScale;";

	var fresnelUniforms = {
	  fresnelExponent: { value: 3.5 },
	  fresnelReflectionScale: { value: 0.5 },
	};

	var glassFrag = "  vec4 glassPos = vScreenPos;\r\n  glassPos.xy += (geometry.viewDir.xy - geometry.normal.xy) * (glassCurvature * vScreenPos.w);\r\n  glassPos.xy /= glassPos.w;\r\n// vec4 distortionNormal = texture2D(tDistortion, vUv);\r\n// vec3 distortion = (distortionNormal.rgb - vec3(0.5)) * distortionStrength;\r\n  distortionNormal = texture2D(tDistortion, vUv + distortion.xy);\r\n  distortion = distortionNormal.rgb - vec3(0.5);\r\n  glassPos.xy += distortion.xy;\r\n  reflectedLight.directDiffuse = mix(reflectedLight.directDiffuse, texture2D(tBackBuffer, glassPos.xy).rgb, glassStrength);";

	var glassFragPars = "uniform sampler2D tBackBuffer;\r\nuniform float glassStrength;\r\nuniform float glassCurvature;\r\nvarying vec4 vScreenPos;";

	var glassUniforms = {
	  tBackBuffer: { value: null },
	  glassStrength: { value: 0.7 },
	  glassCurvature: { value: 0.5 }
	};

	var glassVert = "  vScreenPos.xy = vScreenPos.xy * 0.5 + (0.5 * hpos.w);";

	var godRayCompositeFrag = "uniform sampler2D tColors;\r\nuniform sampler2D tGodRays;\r\nuniform float intensity;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  // Since THREE.MeshDepthMaterial renders foreground objects white and background\r\n  // objects black, the god-rays will be white streaks. \r\n  // Therefore value is inverted\r\n  // before being combined with tColors\r\n  gl_FragColor = texture2D(tColors, vUv) + intensity * vec4(1.0 - texture2D(tGodRays, vUv).r);\r\n  gl_FragColor.a = 1.0;\r\n}";

	var godRayCompositeUniforms = {
	  intensity: { value: 1.0 },
	  tColors:   { value: null },
	  tGodRays:  { value: null }
	};

	var godRayCompositeVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var godRayFrag = "#define TAPS_PER_PASS 6.0\r\nuniform sampler2D tDiffuse;\r\nuniform vec2 sunPos;\r\nuniform float stepSize;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n\r\n  // delta from current pixel to sun position\r\n  vec2 delta = sunPos - vUv;\r\n  float dist = length(delta);\r\n  \r\n  // Step vector (uv space)\r\n  vec2 stepv = stepSize * delta / dist;\r\n  \r\n  // Number of iterations between pixel and sun\r\n  float iters = dist / stepSize;\r\n  vec2 uv = vUv.xy;\r\n  float col = 0.0;\r\n  \r\n  // Unrolling loop manuarry makes it work in ANGLE\r\n  if (0.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  if (1.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  if (2.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  if (3.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  if (4.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  if (5.0 <= iters && uv.y < 1.0) col += texture2D(tDiffuse, uv).r;\r\n  uv += stepv;\r\n  \r\n  // Should technicallry be dividing by 'iters', but 'TAPS_PER_PASS' smooths out\r\n  // objectionable artifacts, in particular near the position.\r\n  // The side effect is that the result is darker than it should be around the sun, \r\n  // as TAPS_PER_PASS is greater than the number of sampler actually accumulated.\r\n  // When the result is inverted (in the shader 'GodLaysCombine', \r\n  // this produces a slight bright spot at the position of the sun,\r\n  // even when it is occluded.\r\n  gl_FragColor = vec4(col / TAPS_PER_PASS);\r\n  gl_FragColor.a = 1.0;\r\n}";

	var godRayUniforms = {
	  tDiffuse: { value: null },
	  sunPos:   { value: new THREE.Vector2() },
	  stepSize: { value: 1.0 }
	};

	var godRayVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var grassUniforms = {
	  grassWindDirection: { value: new THREE.Vector3(1,0,0) },
	  grassWindPower: { value: 1.0 },
	  grassTime: { value: 0.0 }
	};

	var grassVert = "// transformed += grassWindDirection * grassWindPower * max(transformed.y, 0.0) * sin(grassTime);\r\n// vWorldPosition += grassWindDirection * grassWindPower * max(vWorldPosition.y, 0.0) * sin(grassTime);\r\n  float windStrength = (uv.y * uv.y) * (sin(grassTime + color.y * PI) * 0.5 + 0.5) * color.x;\r\n  vWorldPosition += offsets;\r\n  vWorldPosition += grassWindDirection * grassWindPower * windStrength;";

	var grassVertPars = "attribute vec3 offsets;\r\nattribute vec4 color;\r\nuniform vec3 grassWindDirection;\r\nuniform float grassWindPower;\r\nuniform float grassTime;";

	var heightFogFrag = "  outgoingLight = heightFogColor * vHeightFogFactor + outgoingLight * (1.0 - vHeightFogFactor);";

	var heightFogFragPars = "uniform vec3 heightFogColor;\r\nvarying float vHeightFogFactor;";

	var heightFogMapFrag = "  float heightFogFactor = vHeightFogFactor;\r\n  heightFogFactor *= texture2D(tHeightFog, vUv).r;\r\n  outgoingLight = heightFogColor * heightFogFactor + outgoingLight * (1.0 - vHeightFogFactor);";

	var heightFogMapFragPars = "uniform sampler2D tHeightFog;";

	var heightFogMapUniforms = {
	  tHeightFog: { value: null }
	};

	var heightFogUniforms = {
	  heightFogAlpha: { value: 1.0 },
	  heightFogFar: { value: 50.0 },
	  heightFogNear: { value: 1.0 },
	  heightFogColor: { value: new THREE.Color() }
	};

	var heightFogVert = "  float heightFogParamA = heightFogFar / (heightFogFar - heightFogNear);\r\n  float heightFogParamB = -1.0 / (heightFogFar - heightFogNear);\r\n  float heightFogFactor = 1.0 - (heightFogParamA + vWorldPosition.y * heightFogParamB);\r\n  vHeightFogFactor = clamp(heightFogFactor, 0.0, 1.0) * heightFogAlpha;";

	var heightFogVertPars = "uniform float heightFogAlpha;\r\nuniform float heightFogFar;\r\nuniform float heightFogNear;\r\nvarying float vHeightFogFactor;";

	var idFrag = "uniform float id;\r\nvoid main() {\r\n  gl_FragColor = vec4(vec3(id), 1);\r\n}";

	var idUniforms = {
	  id: { value: 1.0 }
	};

	var idVert = "void main() {\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var innerGlowFrag = "  float glow = 1.0 - max(0.0, dot(geometry.normal, geometry.viewDir));\r\n  float glowPow = max(glow / (innerGlowBase * (1.0 - glow) + glow), 0.0) * innerGlowSub;\r\n  glowPow = max(0.0, glowPow - innerGlowRange) * (1.0 / max(1.0 - innerGlowRange, 0.00001));\r\n  glowPow = min(glowPow, 1.0);\r\n  // glowPow = min(1.0, glowPow*step(innerGlowRange, glowPow));\r\n  reflectedLight.indirectSpecular += innerGlowColor * glowPow;\r\n  // reflectedLight.indirectSpecular += vec3(glowPow);\r\n  // reflectedLight.indirectSpecular += vec3(glow);";

	var innerGlowFragPars = "uniform vec3 innerGlowColor;\r\nuniform float innerGlowBase;\r\nuniform float innerGlowSub;\r\nuniform float innerGlowRange;";

	var innerGlowSubtractFrag = "  float glow = 1.0 - max(0.0, dot(geometry.normal, geometry.viewDir));\r\n  float glowPow = max(glow / (innerGlowBase * (1.0 - glow) + glow), 0.0) * innerGlowSub;\r\n  glowPow = -max(0.0, glowPow - innerGlowRange) * (1.0 / (1.0 - innerGlowRange));\r\n  reflectedLight.indirectSpecular += innerGlowColor * glowPow;";

	var innerGlowUniforms = {
	  innerGlowColor: { value: new THREE.Color() },
	  innerGlowBase: { value: 20.0 },
	  innerGlowSub: { value: 10.0 },
	  innerGlowRange: { value: 0.0 }
	};

	var instanceCastShadowVert = "  vec3 vPos = (modelMatrix * vec4(position, 1.0)).xyz;\r\n  float windStrength = (uv.y * uv.y) * (sin(grassTime + color.y * PI) * 0.5 + 0.5) * color.x;\r\n  vPos += offsets;\r\n  vPos += grassWindDirection * grassWindPower * windStrength;\r\n  vec4 hpos = lightViewProjectionMatrix * vec4(vPos, 1.0);\r\n  vShadowMapUV = hpos;";

	var instanceCastShadowVertPars = "// attribute vec3 offsets;\r\n// attribute vec4 colors;\r\nuniform mat4 lightViewProjectionMatrix;\r\nvarying vec4 vShadowMapUV;";

	var instanceColorMapDiscardFrag = "  if (texture2D(tDiffuse, vUv).a < 0.5) discard;";

	var lambertFrag = "  float NoL = max(dot(directLight.direction, geometry.normal), 0.0);\r\n  reflectedLight.directDiffuse += material.diffuseColor * directLight.color * NoL;";

	var lightMapFrag = "  reflectedLight.directDiffuse *= mix(vec3(1.0), texture2D(tLight, vUv).rgb * lightMapPower, lightMapStrength);;";

	var lightMapFragPars = "uniform sampler2D tLight;\r\nuniform float lightMapPower;\r\nuniform float lightMapStrength;";

	var lightMapUniforms = {
	  tLight: { value: null },
	  lightMapPower: { value: 1.0 },
	  lightMapStrength: { value: 1.0 }
	};

	var lightsAreaLightFrag = "  for (int i=0; i<PIXY_AREA_LIGHTS_NUM; ++i) {\r\n    computeAreaLight(areaLights[i], geometry, material, reflectedLight);\r\n  }";

	var lightsAreaLightFragUnroll = "  computeAreaLight(areaLights[0], geometry, material, reflectedLight);";

	var lightsAreaLightUniforms = {
	  areaLights: { value: [
	    // PIXY.AreaLight
	  ]}
	};

	var lightsDirectFrag = "  for (int i=0; i<PIXY_DIRECT_LIGHTS_NUM; ++i) {\r\n    getDirectLightIrradiance(directLights[i], geometry, directLight);\r\n    if (directLight.visible) {\r\n      updateLight(directLight);\r\n      computeLight(directLight, geometry, material, reflectedLight);\r\n    }\r\n  }";

	var lightsDirectFragUnroll = "  getDirectLightIrradiance(directLights[0], geometry, directLight);\r\n  if (directLight.visible) {\r\n    updateLight(directLight);\r\n    computeLight(directLight, geometry, material, reflectedLight);\r\n  }";

	var lightsDirectUniforms = {
	  directLights: { value: [
	    {
	      direction: new THREE.Vector3(0,0,1),
	      color: new THREE.Color(0xffffff)
	    }
	  ]}
	};

	var lightsFragPars = "bool testLightInRange(const in float lightDistance, const in float cutoffDistance) {\r\n  return any(bvec2(cutoffDistance == 0.0, lightDistance < cutoffDistance));\r\n}\r\n\r\nfloat punctualLightIntensityToIrradianceFactor(const in float lightDistance, const in float cutoffDistance, const in float decayExponent) {\r\n  \r\n  if (decayExponent > 0.0) {\r\n  \r\n// #if defined(PHYSICALLY_CORRECT_LIGHTS)\r\n  // based upon Frostbite 3 Moving to Physically-based Rendering\r\n  // page 32, equation 26: E[window1]\r\n  // http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\r\n  // this is intended to be used to spot and point lights who are represented as mulinouse intensity\r\n  // but who must be converted to luminous irradiance for surface lighting calculation\r\n  \r\n  // float distanceFalloff = 1.0 / max(pow(lightDistance, decayExponent), 0.01);\r\n  // float maxDistanceCutoffFactor = pow2(saturate(1.0 - pow4(lightDistance / cutoffDistance)));\r\n  // return distanceFalloff * maxDistanceCutoffFactor;\r\n// #else\r\n    return pow(saturate(-lightDistance / cutoffDistance + 1.0), decayExponent);\r\n// #endif\r\n  }\r\n\r\n  return 1.0;\r\n}\r\n\r\nstruct DirectLight {\r\n  vec3 direction;\r\n  vec3 color;\r\n};\r\n\r\nvoid getDirectLightIrradiance(const in DirectLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight) {\r\n  directLight.color = directionalLight.color;\r\n  directLight.direction = directionalLight.direction;\r\n  directLight.visible = true;\r\n}\r\n\r\nstruct PointLight {\r\n  vec3 position;\r\n  vec3 color;\r\n  float distance;\r\n  float decay;\r\n};\r\n\r\nvoid getPointDirectLightIrradiance(const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight) {\r\n  vec3 L = pointLight.position - geometry.position;\r\n  directLight.direction = normalize(L);\r\n\r\n  float lightDistance = length(L);\r\n\r\n  if (testLightInRange(lightDistance, pointLight.distance)) {\r\n    directLight.color = pointLight.color;\r\n    directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, pointLight.distance, pointLight.decay);\r\n    directLight.visible = true;\r\n  } else {\r\n    directLight.color = vec3(0.0);\r\n    directLight.visible = false;\r\n  }\r\n}\r\n\r\nstruct SpotLight {\r\n  vec3 position;\r\n  vec3 direction;\r\n  vec3 color;\r\n  float distance;\r\n  float decay;\r\n  float coneCos;\r\n  float penumbraCos;\r\n};\r\n\r\nvoid getSpotDirectLightIrradiance(const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight) {\r\n  vec3 L = spotLight.position - geometry.position;\r\n  directLight.direction = normalize(L);\r\n\r\n  float lightDistance = length(L);\r\n  float angleCos = dot(directLight.direction, spotLight.direction);\r\n\r\n  if (all(bvec2(angleCos > spotLight.coneCos, testLightInRange(lightDistance, spotLight.distance)))) {\r\n    float spotEffect = smoothstep(spotLight.coneCos, spotLight.penumbraCos, angleCos);\r\n    directLight.color = spotLight.color;\r\n    directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor(lightDistance, spotLight.distance, spotLight.decay);\r\n    directLight.visible = true;\r\n  } else {\r\n    directLight.color = vec3(0.0);\r\n    directLight.visible = false;\r\n  }\r\n}\r\n\r\nstruct AreaLight {\r\n  vec3 position;\r\n  vec3 color;\r\n  float distance;\r\n  float decay;\r\n  float radius;\r\n};\r\n\r\nstruct TubeLight {\r\n  vec3 start;\r\n  vec3 end;\r\n  vec3 color;\r\n  float distance;\r\n  float decay;\r\n  float radius;\r\n};\r\n\r\nstruct RectLight {\r\n  vec3 positions[4];\r\n  vec3 normal;\r\n  vec3 tangent;\r\n  vec3 color;\r\n  float intensity;\r\n  float width;\r\n  float height;\r\n  float distance;\r\n  float decay;\r\n  int numPositions;\r\n};";

	var lightsPars = "// taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html\r\nfloat getSpecularMipLevel(const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  float maxMipLevelScalar = float(maxMipLevel);\r\n  float desiredMipLevel = maxMipLevelScalar - 0.79248 - 0.5 * log2(pow2(blinnShininessExponent)+1.0);\r\n  \r\n  // clamp to allowable LOD ranges\r\n  return clamp(desiredMipLevel, 0.0, maxMipLevelScalar);\r\n}\r\n\r\nvec3 getLightProbeIndirectIrradiance(const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  vec3 worldNormal = inverseTransformDirection(N, viewMatrix);\r\n  vec3 queryVec = vec3(-worldNormal.x, worldNormal.yz); // flip\r\n  return GammaToLinear(textureCubeLodEXT(tEnvMap, queryVec, float(maxMipLevel)), 2.2).rgb * reflectionStrength;\r\n}\r\n\r\nvec3 getLightProbeIndirectRadiance(const in vec3 V, const in vec3 N, const in float blinnShininessExponent, const in int maxMipLevel) {\r\n  vec3 reflectVec = reflect(-V, N);\r\n  reflectVec = inverseTransformDirection(reflectVec, viewMatrix);\r\n  vec3 queryVec = vec3(-reflectVec.x, reflectVec.yz); // flip\r\n  float specMipLevel = getSpecularMipLevel(blinnShininessExponent, maxMipLevel);\r\n  return GammaToLinear(textureCubeLodEXT(tEnvMap, queryVec, specMipLevel), 2.2).rgb * reflectionStrength;\r\n}";

	var lightsPointFrag = "  for (int i=0; i<PIXY_POINT_LIGHTS_NUM; ++i) {\r\n    getPointDirectLightIrradiance(pointLights[i], geometry, directLight);\r\n    if (directLight.visible) {\r\n      updateLight(directLight);\r\n      computeLight(directLight, geometry, material, reflectedLight);\r\n    }\r\n  }";

	var lightsPointFragUnroll = "  getPointDirectLightIrradiance(pointLights[0], geometry, directLight);\r\n  if (directLight.visible) {\r\n    updateLight(directLight);\r\n    computeLight(directLight, geometry, material, reflectedLight);\r\n  }";

	var lightsPointUniforms = {
	  pointLights: { value: [
	      {
	        position: new THREE.Vector3(),
	        color: new THREE.Color(),
	        distance: 1.0,
	        decay: 0.0 
	      }
	    ]}
	};

	var lightsRectLightFrag = "for (int i=0; i<PIXY_RECT_LIGHTS_NUM; ++i) {\r\n  computeRectLight(rectLights[i], geometry, material, reflectedLight);\r\n}";

	var lightsRectLightFragUnroll = "  computeRectLight(rectLights[0], geometry, material, reflectedLight);";

	var lightsRectLightUniforms = {
	  rectLights: { value: [
	    // PIXY.RectLight
	  ]}
	};

	var lightsSpotFrag = "  for (int i=0; i<PIXY_SPOT_LIGHTS_NUM; ++i) {\r\n    getSpotDirectLightIrradiance(spotLights[i], geometry, directLight);\r\n    if (directLight.visible) {\r\n      updateLight(directLight);\r\n      computeLight(directLight, geometry, material, reflectedLight);\r\n    }\r\n  }";

	var lightsSpotFragUnroll = "  getSpotDirectLightIrradiance(spotLights[0], geometry, directLight);\r\n  if (directLight.visible) {\r\n    updateLight(directLight);\r\n    computeLight(directLight, geometry, material, reflectedLight);\r\n  }";

	var lightsSpotUniforms = {
	  spotLights: { value: [
	      {
	        position: new THREE.Vector3(0,0,10),
	        direction: new THREE.Vector3(0,0,-1),
	        color: new THREE.Color(), 
	        distance: 10.0, 
	        decay: 0.0,
	        coneCos: Math.PI / 4.0, 
	        penumbraCos: 1.0
	      } 
	  ]}
	};

	var lightsStandardDisneyFrag = "material.specularRoughness = roughnessFactor;\r\n\r\nfloat luminance = 0.3 * material.diffuseColor.x + 0.6 * material.diffuseColor.y + 0.1 * material.diffuseColor.z;\r\nvec3 tint = luminance > 0.0 ? material.diffuseColor / luminance : vec3(1.0);\r\nspecularColor = mix(0.5 * 0.08 * mix(vec3(1.0), tint, SpecularTint), material.diffuseColor, Metallic);\r\n\r\n//material.specularColor = mix(vec3(0.04), material.diffuseColor, metalnessFactor);\r\n//material.diffuseColor = material.diffuseColor * (1.0 - metalnessFactor);\r\nMetallic = metalnessFactor;";

	var lightsStandardFrag = "material.specularRoughness = roughnessFactor;\r\nmaterial.specularColor = mix(vec3(0.04), material.diffuseColor, metalnessFactor);\r\nmaterial.diffuseColor = material.diffuseColor * (1.0 - metalnessFactor);";

	var lightsTubeLightFrag = "for (int i=0; i<PIXY_TUBE_LIGHTS_NUM; ++i) {\r\n  computeTubeLight(tubeLights[i], geometry, material, reflectedLight);\r\n}";

	var lightsTubeLightFragUnroll = "  computeTubeLight(tubeLights[0], geometry, material, reflectedLight);";

	var lightsTubeLightUniforms = {
	  tubeLights: { value: [
	    // PIXY.TubeLight
	  ]}
	};

	var lineGlowFrag = "    float lineGlowDist = abs(dot(vWorldPosition, normalize(lineGlowPlane.xyz)) - lineGlowPlane.w);\r\n    reflectedLight.indirectSpecular += max(1.0 - lineGlowDist / lineGlowRange, 0.0) * lineGlowPower * lineGlowColor;";

	var lineGlowFragPars = "uniform vec4 lineGlowPlane;\r\nuniform vec3 lineGlowColor;\r\nuniform float lineGlowRange;\r\nuniform float lineGlowPower;";

	var lineGlowUniforms = {
	  lineGlowPlane: { value: new THREE.Vector4(0,1,0,0) },
	  lineGlowColor: { value: new THREE.Color(0xffffff) },
	  lineGlowRange: { value: 1.0 },
	  lineGlowPower: { value: 1.0 }
	};

	var luminosityFrag = "uniform sampler2D tDiffuse;\r\n\r\nvarying vUv;\r\n\r\nvoid main() {\r\n  vec4 texel = texture2D(tDiffuse, vUv);\r\n  vec3 luma = vec3(0.299, 0.587, 0.114);\r\n  float v = dot(texel.xyz, luma);\r\n  gl_FragColor = vec4(v, v, v, texel.w);\r\n}";

	var luminosityHighPassFrag = "uniform sampler2D tDiffuse;\r\nuniform vec3 defaultColor;\r\nuniform float defaultOpacity;\r\nuniform float luminosityThreshold;\r\nuniform float smoothWidth;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vec4 texel = texture2D(tDiffuse, vUv);\r\n  vec3 luma = vec3(0.299, 0.587, 0.114);\r\n  float v = dot(texel.xyz, luma);\r\n  vec4 outputColor = vec4(defaultColor.rgb, defaultOpacity);\r\n  float alpha = smoothstep(luminosityThreshold, luminosityThreshold + smoothWidth, v);\r\n  gl_FragColor = mix(outputColor, texel, alpha);\r\n}";

	var luminosityHighPassUniforms = {
	  tDiffuse: { value: null },
	  luminosityThreshold: { value: 1.0 },
	  smoothWidth: { value: 1.0 },
	  defaultColor: { value: new THREE.Color(0x000000) },
	  defaultOpacity: { value: 0.0 }
	};

	var luminosityHighPassVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var luminosityUniforms = {
	  tDiffuse: { value: null },
	};

	var luminosityVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var metalnessFrag = "  float metalnessFactor = metalness;";

	var metalnessMapFrag = "  vec4 metalnessRGBA = texture2D(tMetalness, uv);\r\n  metalnessFactor *= metalnessRGBA.r;";

	var metalnessMapFragPars = "uniform sampler2D tMetalness;";

	var metalnessMapUniforms = {
	  tMetalness: { value: null }
	};

	var nolitFrag = "  reflectedLight.directDiffuse += material.diffuseColor;";

	var normalMapFrag = "  vec4 normalRGBA = texture2D(tNormal, uv);\r\n  vec3 bump = (normalRGBA.rgb - vec3(0.5)) * bumpiness;\r\n  geometry.normal = normalize(vNormal + bump.x * vTangent + bump.y * vBinormal);\r\n// geometry.normal = perturbNormal2Arb(-vViewPosition, normalize(vNormal));";

	var normalMapFragPars = "uniform sampler2D tNormal;\r\nuniform float bumpiness;\r\n\r\n// Per-Pixel Tangent Space Normal Mapping\r\n// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\r\n\r\n// vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\r\n// \r\n// \tvec3 q0 = dFdx( eye_pos.xyz );\r\n// \tvec3 q1 = dFdy( eye_pos.xyz );\r\n// \tvec2 st0 = dFdx( vUv.st );\r\n// \tvec2 st1 = dFdy( vUv.st );\r\n// \r\n// \tvec3 S = normalize( q0 * st1.t - q1 * st0.t );\r\n// \tvec3 T = normalize( -q0 * st1.s + q1 * st0.s );\r\n// \tvec3 N = normalize( surf_norm );\r\n// \r\n// \tvec3 mapN = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\r\n// \tmapN.xy = bumpiness * mapN.xy;\r\n// \tmat3 tsn = mat3( S, T, N );\r\n// \treturn normalize( tsn * mapN );\r\n// \r\n// }";

	var normalMapUniforms = {
	  tNormal: { value: null },
	  bumpiness: { value: 1.0 }
	};

	var opacityFrag = "uniform sampler2D tDiffuse;\r\nvarying vec2 vUv;\r\nvoid main() {\r\n  float a = texture2D(tDiffuse, vUv).a;\r\n  gl_FragColor = vec4(a, a, a, 1.0);\r\n}";

	var opacityUniforms = {
	  tDiffuse: { value: null }
	};

	var opacityVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var overlayFrag = "// https://github.com/GameTechDev/CloudsGPUPro6/blob/master/fx/Terrain.fx\r\n// https://github.com/GameTechDev/CloudySky/blob/master/fx/Terrain.fx\r\n\r\n  vec4 mtrlWeights = texture2D(tOverlayMask, uv);\r\n  mtrlWeights /= max(dot(mtrlWeights, vec4(1.0,1.0,1.0,1.0)), 1.0);\r\n  float baseMaterialWeight = clamp(1.0 - dot(mtrlWeights, vec4(1,1,1,1)), 0.0, 1.0);\r\n  vec4 baseMaterialDiffuse = texture2D(tOverlay1, uv * overlay1Scale);\r\n  mat4 materialColors;\r\n  materialColors[0] = texture2D(tOverlay2, uv * overlay2Scale) * mtrlWeights.x;\r\n  materialColors[1] = texture2D(tOverlay3, uv * overlay3Scale) * mtrlWeights.y;\r\n  materialColors[2] = texture2D(tOverlay4, uv * overlay4Scale) * mtrlWeights.z;\r\n  materialColors[3] = texture2D(tOverlay5, uv * overlay5Scale) * mtrlWeights.w;\r\n  material.diffuseColor.rgb *= (baseMaterialDiffuse * baseMaterialWeight + materialColors * mtrlWeights).rgb;";

	var overlayFragPars = "// https://github.com/GameTechDev/CloudsGPUPro6/blob/master/fx/Terrain.fx\r\n// https://github.com/GameTechDev/CloudySky/blob/master/fx/Terrain.fx\r\n\r\nuniform sampler2D tOverlay1;\r\nuniform sampler2D tOverlay2;\r\nuniform sampler2D tOverlay3;\r\nuniform sampler2D tOverlay4;\r\nuniform sampler2D tOverlay5;\r\nuniform sampler2D tOverlayMask;\r\nuniform float overlay1Scale;\r\nuniform float overlay2Scale;\r\nuniform float overlay3Scale;\r\nuniform float overlay4Scale;\r\nuniform float overlay5Scale;";

	var overlayNormalFrag = "  vec4 baseNormal = texture2D(tOverlay1Normal, uv * overlay1Scale);\r\n  mat4 normals;\r\n  normals[0] = texture2D(tOverlay2Normal, uv * overlay2Scale) * mtrlWeights.x;\r\n  normals[1] = texture2D(tOverlay3Normal, uv * overlay3Scale) * mtrlWeights.y;\r\n  normals[2] = texture2D(tOverlay4Normal, uv * overlay4Scale) * mtrlWeights.z;\r\n  normals[3] = texture2D(tOverlay5Normal, uv * overlay5Scale) * mtrlWeights.w;\r\n  vec3 overlayNormal = (baseNormal * baseMaterialWeight + normals * mtrlWeights).xyz;\r\n  overlayNormal = overlayNormal - vec3(0.5);\r\n  geometry.normal = normalize(vNormal + overlayNormal.x * vTangent + overlayNormal.y * vBinormal);";

	var overlayNormalFragPars = "uniform sampler2D tOverlay1Normal;\r\nuniform sampler2D tOverlay2Normal;\r\nuniform sampler2D tOverlay3Normal;\r\nuniform sampler2D tOverlay4Normal;\r\nuniform sampler2D tOverlay5Normal;";

	var overlayNormalUniforms = {
	  tOverlay1Normal: { value: null },
	  tOverlay2Normal: { value: null },
	  tOverlay3Normal: { value: null },
	  tOverlay4Normal: { value: null },
	  tOverlay5Normal: { value: null }
	};

	var overlayUniforms = {
	  tOverlay1: { value: null },
	  tOverlay2: { value: null },
	  tOverlay3: { value: null },
	  tOverlay4: { value: null },
	  tOverlay5: { value: null },
	  tOverlayMask: { value: null },
	  overlay1Scale: { value: 1.0 },
	  overlay2Scale: { value: 1.0 },
	  overlay3Scale: { value: 1.0 },
	  overlay4Scale: { value: 1.0 },
	  overlay5Scale: { value: 1.0 }
	};

	var packing = "vec3 packNormalToRGB(const in vec3 normal) {\r\n  return normalize(normal) * 0.5 + 0.5;\r\n}\r\nvec3 unpackRGBToNormal(const in vec3 rgb) {\r\n  return 1.0 - 2.0 * rgb.xyz;\r\n}\r\n\r\nconst vec3 PackFactors = vec3(255.0, 65025.0, 16581375.0);\r\nconst vec4 UnpackFactors = vec4(1.0, 1.0 / PackFactors);\r\nconst float ShiftRight8 = 1.0 / 255.0;\r\n// const float PackUpscale = 256.0 / 255.0; // fraction -> 0..1 (including 1)\r\n// const float UnpackDownscale = 255.0 / 256.0; // 0..1 -> fraction (excluding 1)\r\n// const vec3 PackFactors = vec3(256.0, 65535.0, 16777216.0);\r\n// const vec4 UnpackFactors = UnpackDownscale / vec4(1.0, PackFactors);\r\n// const float ShiftRight8 = 1.0 / 256.0;\r\nvec4 packDepthToRGBA(float v) {\r\n  vec4 r = vec4(v, fract(PackFactors * v));\r\n  r.xyz -= r.yzw * ShiftRight8;\r\n//   return r * PackUpscale;\r\n  return r;\r\n}\r\n\r\nfloat unpackRGBAToDepth(vec4 rgba) {\r\n  return dot(rgba, UnpackFactors);\r\n}\r\n\r\n\r\n// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions\r\n\r\nfloat viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {\r\n  return (viewZ + near) / (near - far);\r\n}\r\n\r\nfloat orthographicDepthToViewZ(const in float linearClipZ, const in float near, const in float far) {\r\n  return linearClipZ * (near - far) - near;\r\n}\r\n\r\nfloat viewZToPerspectiveDepth(const in float viewZ, const in float near, const in float far) {\r\n  return ((near + viewZ) * far) / ((far - near) * viewZ);\r\n}\r\n\r\nfloat perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {\r\n  return (near * far) / ((far - near) * invClipZ - far);\r\n}";

	var parallaxFrag = "  vec3 T = normalize(vTangent);\r\n  vec3 B = normalize(vBinormal);\r\n  vec3 vv = -geometry.viewDir * mat3(T, B, -geometry.normal);\r\n  uv += parallaxHeight * vv.xy;";

	var parallaxMapFrag = "  vec3 vv = -geometry.viewDir * mat3(vTangent, vBinormal, -vNormal);\r\n  uv += (texture2D(tNormal, vUv).a * parallaxHeight + parallaxScale) * vv.xy;";

	var parallaxMapFragPars = "uniform float parallaxHeight;\r\nuniform float parallaxScale;";

	var parallaxMapUniforms = {
	  parallaxHeight: { value: 0.035 },
	  parallaxScale: { value: -0.03 }
	};

	var phongFrag = "  float NoL = max(dot(directLight.direction, geometry.normal), 0.0);\r\n  reflectedLight.directDiffuse += material.diffuseColor * directLight.color * NoL;\r\n\r\n  vec3 H = normalize(geometry.viewDir + directLight.direction);\r\n  float HoN = dot(H, geometry.normal);\r\n  float pw = max(HoN / (shininess * (1.0 - HoN) + HoN), 0.0);\r\n  float specPow = step(0.0, NoL) * pw;\r\n  reflectedLight.directSpecular += specPow * material.specularRoughness * directLight.color * NoL;";

	var phongFragPars = "uniform float shininess;";

	var phongUniforms = {
	  shininess: { value: 50.0 }
	};

	var projectionMapFrag = "  {\r\n    vec4 Vp = viewMatrix * vec4(projectionMapPos, 1.0);\r\n    vec3 Ln = normalize(Vp.xyz - projectionPos);\r\n    vec4 lightContrib = texture2DProj(tProjectionMap, projectionUv);\r\n    reflectedLight.indirectSpecular += projectionColor * lightContrib.xyz * max(dot(Ln,geometry.normal),0.0);\r\n  }";

	var projectionMapFragPars = "uniform sampler2D tProjectionMap;\r\nuniform vec3 projectionMapPos;\r\nuniform vec3 projectionColor;\r\nvarying vec3 projectionPos;\r\nvarying vec4 projectionUv;";

	var projectionMapUniforms = {
	  tProjectionMap: { value: null },
	  projectionMapMatrix: { value: new THREE.Matrix4() },
	  projectionMapPos: { value: new THREE.Vector3() },
	  projectionColor: { value: new THREE.Color() }
	};

	var projectionMapVert = "  projectionPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\r\n  projectionUv = projectionMapMatrix * modelMatrix * vec4(position, 1.0);";

	var projectionMapVertPars = "uniform mat4 projectionMapMatrix;\r\nvarying vec3 projectionPos;\r\nvarying vec4 projectionUv;";

	var receiveShadowFrag = "  float shadowDepth = unpackRGBAToDepth(texture2DProj(tShadow, vShadowMapUV));\r\n  float shadowColor = (shadowDepth * vDepth.w < vDepth.z-shadowBias) ? 1.0 - shadowDensity : 1.0;\r\n  directLight.color *= vec3(shadowColor);";

	var receiveShadowFragPars = "uniform sampler2D tShadow;\r\nuniform float shadowBias;\r\nuniform float shadowDensity;\r\nvarying vec4 vDepth;\r\nvarying vec4 vShadowMapUV;";

	var receiveShadowUniforms = {
	  lightViewProjectionMatrix: { value: new THREE.Matrix4() },
	  shadowMatrix: { value: new THREE.Matrix4() },
	  shadowBias: { value: 0.03 },
	  shadowDensity: { value: 1.0 },
	  tShadow: { value: null }
	};

	var receiveShadowVert = "  vDepth = lightViewProjectionMatrix * vec4(vWorldPosition, 1.0);\r\n  vShadowMapUV = shadowMatrix * vec4(vWorldPosition, 1.0);";

	var receiveShadowVertPars = "uniform mat4 lightViewProjectionMatrix;\r\nuniform mat4 shadowMatrix;\r\nvarying vec4 vDepth;\r\nvarying vec4 vShadowMapUV;";

	var reflectionFrag = "  vec3 cameraToVertex = normalize(vWorldPosition - cameraPosition);\r\n\r\n  // Transforming Normal Vectors with the Inverse Transformation\r\n  vec3 worldNormal = inverseTransformDirection(geometry.normal, viewMatrix);\r\n\r\n  vec3 vReflect = reflect(cameraToVertex, worldNormal);\r\n  vReflect.x = -vReflect.x; // flip\r\n  reflectedLight.indirectSpecular += textureCube(tEnvMap, vReflect).rgb * reflectionStrength;";

	var reflectionFragPars = "uniform samplerCube tEnvMap;\r\nuniform float reflectionStrength;";

	var reflectionStandardFrag = "  {\r\n    float blinnExponent = GGXRoughnessToBlinnExponent(material.specularRoughness);\r\n    \r\n    vec3 irradiance = getLightProbeIndirectIrradiance(geometry.normal, blinnExponent, 10);\r\n    irradiance *= PI; // punctual light\r\n    vec3 diffuse = irradiance * DiffuseLambert(material.diffuseColor);\r\n    reflectedLight.indirectDiffuse += diffuse;\r\n    \r\n    float NoV = saturate(dot(geometry.normal, geometry.viewDir));\r\n    vec3 radiance = getLightProbeIndirectRadiance(geometry.viewDir, geometry.normal, blinnExponent, 10);\r\n    vec3 specular = radiance * EnvBRDFApprox(material.specularColor, material.specularRoughness, NoV);\r\n    reflectedLight.indirectSpecular += specular * reflectionStrength;\r\n  }";

	var reflectionUniforms = {
	  reflectionStrength: { value: 1.0 },
	  tEnvMap: { value: null }
	};

	var rimLightFrag = "  float rim = 1.0 - saturate(dot(geometry.normal, geometry.viewDir));\r\n  float LE = pow(max(dot(-geometry.viewDir, directLight.direction), 0.0), 30.0);\r\n  reflectedLight.directSpecular += rimLightColor * rim * LE * rimLightCoef;";

	var rimLightFragPars = "uniform vec3 rimLightColor;\r\nuniform float rimLightCoef;";

	var rimLightUniforms = {
	  rimLightColor: { value: new THREE.Color() },
	  rimLightCoef: { value: 1.0 }
	};

	var roughnessFrag = "  float roughnessFactor = max(0.04, roughness);";

	var roughnessMapFrag = "  vec4 roughnessRGBA = texture2D(tRoughness, uv);\r\n  roughnessFactor *= roughnessRGBA.r;";

	var roughnessMapFragPars = "uniform sampler2D tRoughness;";

	var roughnessMapUniforms = {
	  tRoughness: { value: null }
	};

	var screenVert = "  vScreenPos = hpos;";

	var screenVertPars = "varying vec4 vScreenPos;";

	var skyDomeFrag = "  float h = normalize(vWorldPosition + offset).y;\r\n  reflectedLight.indirectDiffuse += mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0));";

	var skyDomeFragPars = "uniform vec3 topColor;\r\nuniform vec3 bottomColor;\r\nuniform float offset;\r\nuniform float exponent;";

	var skyDomeUniforms = {
	  topColor: { value: new THREE.Color(0x0077ff) },
	  bottomColor: { value: new THREE.Color(0xffffff) },
	  offset: { value: 33 },
	  exponent: { value: 0.6 }
	};

	var skyFrag = "  // https://github.com/SimonWallner/kocmoc-demo/blob/RTVIS/media/shaders/scattering.glsl\r\n\r\n  float sunfade = 1.0 - clamp(1.0 - exp((skySunPosition.y / 450000.0)), 0.0, 1.0);\r\n  // luminance = 1.0; // vPos.y / 450000.0 + 0.5; // skySunPosition.y / 450000.0 * 1.0 + 0.5\r\n  // reflectedLight.indirectDiffuse += vec3(sunfade);\",\r\n\r\n  float rayleighCoefficient = skyRayleigh - (1.0 * (1.0 - sunfade));\r\n\r\n  vec3 sunDirection = normalize(skySunPosition);\r\n\r\n  float sunE = sunIntensity(dot(sunDirection, up));\r\n\r\n  // extinction (absorbition + out scattering)\r\n  // rayleigh coefiiceneints\r\n  // vec3 betaR = totalRayleigh(lambda) * reyleighCoefficient;\r\n  vec3 betaR = simplifiedRayleigh() * rayleighCoefficient;\r\n\r\n  // mie coefficients\r\n  vec3 betaM = totalMie(lambda, K, skyTurbidity) * skyMieCoefficient;\r\n\r\n  // optical length\r\n  // cutoff angle at 90 to avoid singularity in next formula\r\n  float zenithAngle = acos(max(0.0, dot(up, -geometry.viewDir)));\r\n  float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\r\n  float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\r\n\r\n  // combined extinction factor\r\n  vec3 Fex = exp(-(betaR * sR + betaM * sM));\r\n\r\n  // in scattering\r\n\r\n  float cosTheta = dot(-geometry.viewDir, sunDirection);\r\n\r\n  // float rPhase = rayleighPhase(cosTheta);\r\n  float rPhase = rayleighPhase(cosTheta * 0.5 + 0.5);\r\n  vec3 betaRTheta = betaR * rPhase;\r\n\r\n  float mPhase = hgPhase(cosTheta, skyMieDirectionalG);\r\n  vec3 betaMTheta = betaM * mPhase;\r\n\r\n  // vec3 Lin = sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex);\r\n  vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex), vec3(1.5));\r\n  Lin *= mix(vec3(1.0), pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex, vec3(0.5)), clamp(pow(1.0 - dot(up, sunDirection), 5.0), 0.0, 1.0));\r\n\r\n  // nightsky\r\n  // float theta = acos(-geometry.viewDir.y); // elevation --> y-axis [-pi/2, pi/2]\r\n  // float phi = atan(-geometry.viewDir.z, -geometry.viewDir.x); // azimuth ---> x-axis [-pi/2, pi/2]\r\n  // vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);\r\n  // vec3 L0 = texture2D(tSky, uv).rgb * Fex;\r\n  // vec3 L0 = texture2D(tSky, uv).rgb + 0.1 * Fex;\r\n  vec3 L0 = vec3(0.1) * Fex;\r\n\r\n  // composition + solar disc\r\n  // if (cosTheta > sunAngularDiameterCos) {\r\n  //   L0 += sunE * Fex;\r\n  // }\r\n  float sundisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta);\r\n  // \"if (-geometry.viewDir.y > 0.0) {\r\n  L0 += (sunE * 19000.0 * Fex) * sundisk;\r\n\r\n  // vec3 whiteScale = 1.0 / Uncharted2ToneMapping(vec3(W));\r\n  vec3 whiteScale = 1.0 / Uncharted2Tonemap(vec3(W));\r\n  // vec3 whiteScale = Uncharted2Tonemap(vec3(toneMappingWhitePoint));\r\n\r\n  vec3 texColor = (Lin + L0);\r\n  texColor *= 0.04;\r\n  texColor += vec3(0.0, 0.001, 0.0025) * 0.3;\r\n\r\n  float g_fMaxLuminance = 1.0;\r\n  float fLumScaled = 0.1 / skyLuminance;\r\n  float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled);\r\n\r\n  float ExposureBias = fLumCompressed;\r\n\r\n  // vec3 curr = Uncharted2ToneMapping((log2(2.0 / pow(skyLuminance, 4.0))) * texColor);\r\n  vec3 curr = Uncharted2Tonemap((log2(2.0 / pow(skyLuminance, 4.0))) * texColor * toneMappingExposure);\r\n  vec3 color = curr * whiteScale;\r\n\r\n  reflectedLight.indirectDiffuse += pow(color, vec3(1.0 / (1.2 + (1.2 * sunfade))));\r\n  // reflectedLight.indirectDiffuse += vec3(uv.x, uv.y, 0.0);\r\n  // reflectedLight.indirectDiffuse += Lin + L0;\r\n  // reflectedLight.indirectDiffuse += texColor;\r\n  // reflectedLight.indirectDiffuse += L0;\r\n  // reflectedLight.indirectDiffuse += Lin;\r\n  // reflectedLight.indirectDiffuse += vec3(cosTheta);\r\n  // reflectedLight.indirectDiffuse += vec3(sundisk);\r\n  // reflectedLight.indirectDiffuse += vec3(max(dot(sunDirection, up), 0.0));\r\n  // reflectedLight.indirectDiffuse += vec3(sunE);";

	var skyFragPars = "// https://github.com/SimonWallner/kocmoc-demo/blob/RTVIS/media/shaders/scattering.glsl\r\n\r\n// uniform sampler2D tSky;\r\nuniform float skyLuminance;\r\nuniform float skyTurbidity;\r\nuniform float skyRayleigh;\r\nuniform float skyMieCoefficient;\r\nuniform float skyMieDirectionalG;\r\nuniform vec3 skySunPosition;\r\n\r\n// constants for atmospheric scattering\r\nconst float e = 2.71828182845904523536028747135266249775724709369995957;\r\nconst float pi = 3.141592653589793238462643383279502884197169;\r\nconst float n = 1.0003; // refractive index of air\r\nconst float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)\r\nconst float pn = 0.035; // depolatization factor for standard air\r\n\r\n// wavelength of used primaries, according to preetham\r\nconst vec3 lambda = vec3(680E-9, 550E-9, 450E-9);\r\n\r\n// mie stuff\r\n// K koefficient for the primaries\r\nconst vec3 K = vec3(0.686, 0.678, 0.666);\r\nconst float v = 4.0;\r\n\r\n// optical length at zenith for molecules\r\nconst float rayleighZenithLength = 8.4E3;\r\nconst float mieZenithLength = 1.25E3;\r\nconst vec3 up = vec3(0.0, 1.0, 0.0);\r\n\r\nconst float EE = 1000.0; \r\nconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324; // 66 arc seconds -> degrees, and the cosine of that\r\n\r\n// earth shadow hack\r\nconst float cutoffAngle = pi / 1.95;\r\nconst float steepness = 1.5;\r\n\r\n// Compute total rayleigh coefficient for a set of wavelengths (usually the tree primaries)\r\n// @param lambda wavelength in m\r\nvec3 totalRayleigh(vec3 lambda) {\r\n  return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));\r\n}\r\n\r\n// see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness\r\n// A simplied version of the total Rayleigh scattering to works on browsers that use ANGLE\r\nvec3 simplifiedRayleigh() {\r\n  return 0.0005 / vec3(94, 40, 18);\r\n//   return 0.0054532832366 / (3.0 * 2.545E25 * pow(lambda, vec3(4.0)) * 6.245);\r\n}\r\n\r\n// Reileight phase function as a function of cos(theta)\r\nfloat rayleighPhase(float cosTheta) {\r\n// NOTE: there are a few scale factors for the phase function\r\n// (1) as give bei Preetheam, normalized over the sphere with 4pi sr\r\n// (2) normalized to intergral = 1\r\n// (3) nasa: integrates to 9pi / 4, looks best\r\n  return (3.0 / (16.0 * pi)) * (1.0 + pow(cosTheta, 2.0));\r\n//   return (1.0 / (3.0 * pi)) * (1.0 + pow(cosTheta, 2.0));\r\n//   return (3.0 / 4.0) * (1.0 + pow(cosTheta, 2.0));\r\n}\r\n\r\n// total mie scattering coefficient\r\n// @param labmda set of wavelengths in m\r\n// @param K corresponding scattering param\r\n// @param T turbidity, somewhere in the range of 0 to 20\r\nvec3 totalMie(vec3 lambda, vec3 K, float T) {\r\n// not the formula given py Preetham\r\n  float c = (0.2 * T) * 10E-18;\r\n  return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;\r\n}\r\n\r\n// Henyey-Greenstein approximataion as a function of cos(theta)\r\n// @param cosTheta\r\n// @param g geometric constant that defines the shape of the ellipse\r\nfloat hgPhase(float cosTheta, float g) {\r\n  return (1.0 / (4.0 * pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0 * g * cosTheta + pow(g, 2.0), 1.5));\r\n}\r\n\r\nfloat sunIntensity(float zenithAngleCos) {\r\n// This function originally used 'exp(n)', but it returns an incorrect value\r\n// on Samsung S6 phones. So it has been replaced with the equivalent 'pow(e,n)'\r\n// See https://github.com/mrdoob/three.js/issues/8382\r\n  return EE * max(0.0, 1.0 - pow(e, -((cutoffAngle - acos(zenithAngleCos)) / steepness)));\r\n}\r\n\r\n// float logLuminance(vec3 c) {\r\n//   return log(c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722);\r\n// }\r\n\r\n// Filmic ToneMapping http://filmicgames.com/archives/75\",\r\nfloat A = 0.15;\r\nfloat B = 0.50;\r\nfloat C = 0.10;\r\nfloat D = 0.20;\r\nfloat E = 0.02;\r\nfloat F = 0.30;\r\nfloat W = 1000.0;\r\nvec3 Uncharted2Tonemap(vec3 x) {\r\n  return ((x*(A*x + C*B) + D*E) / (x*(A*x + B) + D*F)) - E/F;\r\n}";

	var skyUniforms = {
	  // tSky: { value: null },
	  skyLuminance: { value: 1.0 },
	  skyTurbidity: { value: 2.0 },
	  skyRayleigh: { value: 1.0 },
	  skyMieCoefficient: { value: 0.005 },
	  skyMieDirectionalG: { value: 0.8 },
	  skySunPosition: { value: new THREE.Vector3() }
	};

	var specularFrag = "  material.specularRoughness = specularStrength;";

	var specularFragPars = "uniform float specularStrength;";

	var specularMapFrag = "  material.specularRoughness = texture2D(tSpecular, vUv).r * specularStrength;";

	var specularMapFragPars = "uniform sampler2D tSpecular;\r\nuniform float specularStrength;";

	var specularMapUniforms = {
	  tSpecular: { value: null },
	  specularStrength: { value: 1.0 }
	};

	var specularUniforms = {
	  specularStrength: { value: 1.0 }
	};

	var ssao2BlurFrag = "#define KERNEL_RADIUS 4\r\nuniform sampler2D tAO;\r\nuniform vec4 blurParams;\r\nvarying vec2 vUv;\r\n\r\nfloat CrossBilateralWeight(float r, float ddiff, inout float w_total) {\r\n  float w = exp(-r*r*blurParams.z) * (ddiff < blurParams.w ? 1.0 : 0.0);\r\n  w_total += w;\r\n  return w;\r\n}\r\n\r\n// Performs a gaussian blur in one direction\r\nvec2 Blur(vec2 texScale) {\r\n  vec2 centerCoord = vUv;\r\n  float w_total = 1.0;\r\n  vec2 aoDepth = texture2D(tAO, centerCoord).xy;\r\n  float totalAo = aoDepth.x;\r\n  float centerZ = aoDepth.y;\r\n  // [unroll]\r\n  for (int i=-KERNEL_RADIUS; i<KERNEL_RADIUS; i++) {\r\n    vec2 texCoord = centerCoord + (float(i)*texScale);\r\n    vec2 sampleAoZ = texture2D(tAO, texCoord).xy;\r\n    float diff = abs(sampleAoZ.y - centerZ);\r\n    float weight = CrossBilateralWeight(float(i), diff, w_total);\r\n    totalAo += sampleAoZ.x * weight;\r\n  }\r\n  \r\n  return vec2(totalAo / w_total, centerZ);\r\n}\r\n\r\nvoid main() {\r\n  gl_FragColor = vec4(Blur(vec2(blurParams.x, blurParams.y)), 0.0, 1.0);\r\n}";

	var ssao2BlurUniforms = {
	  tAO: { value: null },
	  blurParams: { value: new THREE.Vector4() }
	};

	var ssao2CompositeFrag = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tAO;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vec4 colorRGBA = texture2D(tDiffuse, vUv);\r\n  vec4 aoRGBA = texture2D(tAO, vUv);\r\n  colorRGBA.rgb *= pow(aoRGBA.r, 2.0);\r\n  gl_FragColor = vec4(colorRGBA.rgb, 1.0);\r\n  // gl_FragColor = vec4(vec3(aoRGBA.r), 1.0);\r\n}";

	var ssao2CompositeUniforms = {
	  tDiffuse: { value: null },
	  tAO: { value: null }
	};

	var ssao2Frag = "#define PI 3.14159265359\r\n#define SAMPLE_FIRST_STEP 1\r\n#define NUM_STEPS 4\r\n#define MAX_STEPS 16\r\n#define NUM_DIRECTIONS 8\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\nuniform vec4 radiusParams;\r\nuniform vec4 biasParams;\r\nuniform vec4 screenParams;\r\nuniform vec4 uvToViewParams;\r\nuniform vec4 focalParams;\r\nuniform vec2 cameraParams;\r\nvarying vec2 vUv;\r\n\r\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\r\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\r\n// highp float rand(const in vec2 uv) {\r\n//   const highp float a = 12.9898, b = 78.233, c = 43758.5453;\r\n//   highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, PI);\r\n//   return fract(sin(sn) * c);\r\n// }\r\n// Value Noise by Inigo Quilez - iq/2013\r\n// https://www.shadertoy.com/view/lsf3WH\r\nvec2 rand(vec2 p) {\r\n  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));\r\n  return -1.0 + 2.0 * fract(sin(p)*43758.5453123);\r\n}\r\n\r\nvec2 round(vec2 a) {\r\n  return floor(a + 0.5);\r\n}\r\n\r\nfloat rsqrt(float a) {\r\n  return inversesqrt(a);\r\n}\r\n\r\nconst vec3 PackFactors = vec3(255.0, 65025.0, 16581375.0);\r\nconst vec4 UnpackFactors = vec4(1.0, 1.0 / PackFactors);\r\nconst float ShiftRight8 = 1.0 / 255.0;\r\nfloat unpackRGBAToDepth(vec4 rgba) {\r\n  return dot(rgba, UnpackFactors);\r\n}\r\n\r\nfloat viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {\r\n  return (viewZ + near) / (near - far);\r\n}\r\n\r\nfloat perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {\r\n  return (near * far) / ((far - near) * invClipZ - far);\r\n}\r\n\r\nvec3 uvToView(vec2 uv, float eye_z) {\r\n  uv = uvToViewParams.xy * uv + uvToViewParams.zw;\r\n  return vec3(uv * eye_z, eye_z);\r\n}\r\n\r\nvec3 viewPos(vec2 uv) {\r\n  float depth = texture2D(tDepth, uv).x;\r\n  float viewZ = -perspectiveDepthToViewZ(depth, cameraParams.x, cameraParams.y);\r\n  return uvToView(uv, viewZ);\r\n}\r\n\r\nfloat getLengthSqr(vec3 v) {\r\n  return dot(v,v);\r\n}\r\n\r\nvec3 minOfDiff(vec3 P, vec3 Pr, vec3 Pl) {\r\n  vec3 v1 = Pr - P;\r\n  vec3 v2 = P - Pl;\r\n  return (getLengthSqr(v1) < getLengthSqr(v2)) ? v1 : v2;\r\n}\r\n\r\nfloat falloffFactor(float d2) {\r\n  return d2 * radiusParams.z + 1.0;\r\n}\r\n\r\nvec2 snapUVOffset(vec2 uv) {\r\n  return round(uv * screenParams.xy) * screenParams.zw;\r\n}\r\n\r\nfloat TanToSin(float x) {\r\n  return x * rsqrt(x*x + 1.0);\r\n}\r\n\r\nfloat getTangent(vec3 T) {\r\n  return -T.z * rsqrt(dot(T.xy,T.xy));\r\n}\r\n\r\nfloat integerateOcclusion(\r\n  vec2 uv0,\r\n  vec2 snapped_duv,\r\n  vec3 P,\r\n  vec3 dPdu,\r\n  vec3 dPdv,\r\n  inout float tanH)\r\n{\r\n  float ao = 0.0;\r\n  \r\n  // Compute a tangent vector for snapped_duv\r\n  vec3 tangVec = snapped_duv.x * dPdu + snapped_duv.y * dPdv;\r\n  float invTanLen = rsqrt(dot(tangVec.xy,tangVec.xy));\r\n  float tanT = -tangVec.z * invTanLen;\r\n  tanT += biasParams.y;\r\n  \r\n  float sinT = TanToSin(tanT);\r\n  vec3 S = viewPos(uv0 + snapped_duv);\r\n  vec3 diff = S - P;\r\n  float tanS = getTangent(diff);\r\n  float sinS = TanToSin(tanS);\r\n  float d2 = getLengthSqr(diff);\r\n  \r\n  if ((d2 < radiusParams.y) && (tanS > tanT)) {\r\n    // Compute AO between the tangent plane and the sample\r\n    ao = falloffFactor(d2) * saturate(sinS - sinT);\r\n    \r\n    // Update the horizon angle\r\n    tanH = max(tanH, tanS);\r\n  }\r\n  \r\n  return ao;\r\n}\r\n\r\nfloat calculateHorizonOcclusion(\r\n  vec2 dUv, vec2 texelDeltaUV, vec2 uv0, vec3 P, float numSteps,\r\n  float randstep, vec3 dPdu, vec3 dPdv)\r\n{\r\n  float ao = 0.0;\r\n  \r\n  vec2 uv = uv0 + snapUVOffset(randstep * dUv);\r\n  vec2 deltaUV = snapUVOffset(dUv);\r\n  vec3 T = deltaUV.x * dPdu + deltaUV.y * dPdv;\r\n  \r\n  float invTanLen = rsqrt(dot(T.xy,T.xy));\r\n  float tanH = -T.z * invTanLen;\r\n  tanH += biasParams.y;\r\n  \r\n#if SAMPLE_FIRST_STEP\r\n// Take a first sample between uv0 and uv0 + deltaUV\r\nvec2 snapped_duv = snapUVOffset(randstep * deltaUV + texelDeltaUV);\r\nao = integerateOcclusion(uv0, snapped_duv, P, dPdu, dPdv, tanH);\r\n--numSteps;\r\n#endif\r\n\r\n  float sinH = TanToSin(tanH);\r\n  for (int j=1; j<MAX_STEPS; ++j) {\r\n    if (float(j) >= numSteps) {\r\n      break;\r\n    }\r\n    uv += deltaUV;\r\n    vec3 S = viewPos(uv);\r\n    vec3 diff = S - P;\r\n    float tanS = getTangent(diff);\r\n    float d2 = getLengthSqr(diff);\r\n    \r\n    // Use a merged dynamic branch\r\n    //[branch]\r\n    if ((d2 < radiusParams.y) && (tanS > tanH)) {\r\n      // Accumulate AO betrween the horizon and the sample\r\n      float sinS = TanToSin(tanS);\r\n      ao += falloffFactor(d2) * saturate(sinS - sinH);\r\n      \r\n      // Update the current horizon angle\r\n      tanH = tanS;\r\n      sinH = sinS;\r\n    }\r\n  }\r\n  \r\n  return ao;\r\n}\r\n\r\nvec2 rotateDirections(vec2 Dir, vec2 CosSin) {\r\n  return vec2(Dir.x*CosSin.x - Dir.y*CosSin.y, Dir.x*CosSin.y+Dir.y*CosSin.x);\r\n}\r\n\r\nvec3 randCosSinJitter(vec2 uv) {\r\n  vec2 r = rand(uv);\r\n\tfloat angle = 2.0 * PI * r.x / float(NUM_DIRECTIONS);\r\n  return vec3(cos(angle), sin(angle), r.y);\r\n}\r\n\r\nvoid calculateNumSteps(inout vec2 stepSizeInUV, inout float numSteps, float radiusInPixels, float rand) {\r\n  // Avoid oversampling if NUM_STEPS is greater than the kerenl radius in pixels\r\n  numSteps = min(float(NUM_STEPS), radiusInPixels);\r\n  \r\n  // Divide by Ns+1 so taht the farthest samples are not fully attenuated\r\n  float stepSizeInPixels = radiusInPixels / (numSteps+1.0);\r\n  \r\n  // Clamp numSteps if it is greater than the max kernel footprint\r\n  float maxNumSteps = radiusParams.w / stepSizeInPixels;\r\n  if (maxNumSteps < numSteps) {\r\n    // Use dithering to avoid AO discontinuities\r\n    numSteps = floor(maxNumSteps + rand);\r\n    numSteps = max(numSteps, 1.0);\r\n    stepSizeInPixels = radiusParams.w / numSteps;\r\n  }\r\n  \r\n  // Step size in uv space\r\n  stepSizeInUV = stepSizeInPixels * screenParams.zw;\r\n}\r\n\r\nvoid main() {\r\n  \r\n  vec2 uv = vUv;\r\n  // vec2 uv = vec2(0.5,0.5);\r\n  vec2 scr = vUv*screenParams.xy;\r\n  \r\n  vec3 posCenter = viewPos(uv);\r\n  \r\n  // (cos(alpha), sin(alpha), jitter)\r\n  vec3 rand = randCosSinJitter(uv);\r\n  // vec3 rand = randCosSinJitter(vUv*2.0-1.0);\r\n  // vec3 rand = randomTexture.Sample(PointWrapSampler, IN.position.xy / RANDOM_TEXTURE_WIDTH);\r\n  \r\n  // Compute projection of disk of radius g_R into uv space\r\n  // Multiply by 0.5 to scale from [-1,1]^2 to [0,1]^2\r\n  vec2 diskRadiusInUV = 0.5 * radiusParams.x * focalParams.xy / posCenter.z;\r\n  float radiusInPixels = diskRadiusInUV.x * screenParams.x;\r\n  if (radiusInPixels < 1.0) {\r\n    gl_FragColor = vec4(vec3(1.0), 1.0);\r\n    return;\r\n  }\r\n  \r\n  // vec3 rand = randomTexture.Load(int3(IN.position.xy,0) & 63);\r\n  //calculateNumSteps(stepSize, numSteps, radiusInPixels, rand.z);\r\n  \r\n  // Nearest neighbor pixels on the tangent plane\r\n  vec3 posRight  = viewPos(uv + vec2(screenParams.z, 0));\r\n  vec3 posLeft   = viewPos(uv + vec2(-screenParams.z, 0));\r\n  vec3 posTop    = viewPos(uv + vec2(0, screenParams.w));\r\n  vec3 posBottom = viewPos(uv + vec2(0,-screenParams.w));\r\n  \r\n  // Screen-aligned basis for the tangent plane\r\n  vec3 dPdu = minOfDiff(posCenter, posRight, posLeft);\r\n  vec3 dPdv = minOfDiff(posCenter, posTop, posBottom) * (screenParams.y * screenParams.z);\r\n  \r\n  float ao = 0.0;\r\n  float alpha = 2.0 * PI / float(NUM_DIRECTIONS);\r\n  //vec3 rand;\r\n  float numSteps;\r\n  vec2 stepSize;\r\n  for (int d=0; d<NUM_DIRECTIONS; ++d) {\r\n    //rand = randomTexture.Sample(PointWrapSampler, IN.uv * 100);\r\n    //rand = randomTexture.Load(int3(IN.position.xy + int2(d*5, d*17),0) & 31);\r\n    float angle = alpha * float(d);\r\n    \r\n    calculateNumSteps(stepSize, numSteps, radiusInPixels, rand.z);\r\n    vec2 dir = rotateDirections(vec2(cos(angle), sin(angle)), rand.xy);\r\n    vec2 deltaUV = dir * stepSize.xy;\r\n    vec2 texelDeltaUV = dir * screenParams.zw;\r\n    ao += calculateHorizonOcclusion(deltaUV, texelDeltaUV, uv, posCenter, numSteps, rand.z, dPdu, dPdv);\r\n    \r\n    // vec2 snapped_duv = snapUVOffset(deltaUV);\r\n    // vec2 snapped_uv = snapUVOffset(rand.z * snapped_duv + texelDeltaUV);\r\n    // vec2 snapped_scr = (uv + snapped_uv) * screenParams.xy;\r\n    // vec2 snapped_scr = (uv + snapped_uv) * screenParams.xy;\r\n    // vec2 snapped_scr = uv * screenParams.xy;\r\n    // if (snapped_scr.x >= scr.x && snapped_scr.x <= scr.x+1.0 && snapped_scr.y >= scr.y && snapped_scr.y <= scr.y+1.0) {\r\n    //   gl_FragColor = vec4(1.0,0.0,0.0,1.0);\r\n    //   return;\r\n    // }\r\n  }\r\n  \r\n  ao = 1.0 - ao / float(NUM_DIRECTIONS) * biasParams.z;\r\n  gl_FragColor = vec4(saturate(ao), posCenter.z, 0.0, 1.0);\r\n  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\r\n  // gl_FragColor = vec4(normalize(posCenter)*0.5+0.5, 1.0);\r\n  // gl_FragColor = vec4(vec3(saturate(ao)), 1.0);\r\n}\r\n  ";

	var ssao2Uniforms = {
	  tDiffuse: { value: null },
	  tDepth: { value: null },
	  angleBias: { value: 40.0 },
	  radius: { value: 4.5 },
	  maxRadius: { value: 0.5 },
	  strength: { value: 10.0 },
	  
	  radiusParams: { value: new THREE.Vector4() },
	  biasParams: { value: new THREE.Vector4() },
	  screenParams: { value: new THREE.Vector4() },
	  uvToViewParams: { value: new THREE.Vector4() },
	  focalParams: { value: new THREE.Vector4() },
	  cameraParams: { value: new THREE.Vector2() },
	};

	var ssaoFrag = "uniform float cameraNear;\r\nuniform float cameraFar;\r\nuniform bool onlyAO; // use only ambient occulusion pass?\r\nuniform vec2 size; // texture width, height\r\nuniform float aoClamp; // depth clamp - reduces haloing at screen edges\r\nuniform float lumInfluence;  // how much luminance affects occulusion\r\nuniform float radius; // ao radius\r\nuniform float diffArea; // self-shadowing reduction\r\nuniform float gDisplace; // gause bell center\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\nvarying vec2 vUv;\r\n\r\n// #define PI 3.14159265\r\n#define DL 2.399963229728653 // PI * (3.0 - sqrt(5.0))\r\n#define EULER 2.718281828459045\r\n\r\n// user variables\r\nconst int samples = 8; // ao sample count\r\n// const float radius = 5.0; // ao radius\r\nconst bool useNoise = false; // use noise instead of pattern for sample dithering\r\nconst float noiseAmount = 0.0003; // dithering amount\r\n// const float diffArea = 0.4; // self-shadowing reduction\r\n// const float gDisplace = 0.4; // gause bell center\r\n\r\n// generating noise / pattern texture for dithering\r\nvec2 rand(const vec2 coord) {\r\n  vec2 noise;\r\n  if (useNoise) {\r\n    float nx = dot(coord, vec2(12.9898, 78.233));\r\n    float ny = dot(coord, vec2(12.9898, 78.233) * 2.0);\r\n    noise = clamp(fract(43758.5453 * sin(vec2(nx, ny))), 0.0, 1.0);\r\n  } else {\r\n    float ff = fract(1.0 - coord.s * (size.x / 2.0));\r\n    float gg = fract(coord.t * (size.y / 2.0));\r\n    noise = vec2(0.25, 0.75) * vec2(ff) + vec2(0.75, 0.25) * gg;\r\n  }\r\n\r\n  return (noise * 2.0 - 1.0) * noiseAmount;\r\n}\r\n\r\nfloat readDepth(const in vec2 coord) {\r\n  float zfarPlusNear = cameraFar + cameraNear;\r\n  float zfarMinusNear = cameraFar - cameraNear;\r\n  float zcoef = 2.0 * cameraNear;\r\n\r\n//   return (2.0 * cameraNear) / (cameraFar + cameraNear - unpackDepth(texture2D(tDepth, coord)) * (cameraFar - cameraNear));\r\n  // return zcoef / (zfarPlusNear - unpackRGBAToDepth(texture2D(tDepth, coord)) * zfarMinusNear);\r\n  return zcoef / (zfarPlusNear - texture2D(tDepth, coord).r * zfarMinusNear);\r\n}\r\n\r\nfloat compareDepths(const in float depth1, const in float depth2, inout int far) {\r\n  float garea = 2.0; // gauss ball width\r\n  float diff = (depth1 - depth2) * 100.0; // depth difference (0-100)\r\n\r\n// reduce left bell width to avoid self-shadowing\r\n\r\n  if (diff < gDisplace) {\r\n    garea = diffArea;\r\n  } else {\r\n    far = 1;\r\n  }\r\n\r\n  float dd = diff - gDisplace;\r\n  float gauss = pow(EULER, -2.0 * dd * dd / (garea * garea));\r\n  return gauss;\r\n}\r\n\r\nfloat calcAO(float depth, float dw, float dh) {\r\n  float dd = radius - depth * radius;\r\n  vec2 vv = vec2(dw, dh);\r\n\r\n  vec2 coord1 = vUv + dd * vv;\r\n  vec2 coord2 = vUv - dd * vv;\r\n\r\n  float temp1 = 0.0;\r\n  float temp2 = 0.0;\r\n\r\n  int far = 0;\r\n  temp1 = compareDepths(depth, readDepth(coord1), far);\r\n\r\n// DEPTH EXTRAPOLATION\r\n\r\n  if (far > 0) {\r\n    temp2 = compareDepths(readDepth(coord2), depth, far);\r\n    temp1 += (1.0 - temp1) * temp2;\r\n  }\r\n\r\n  return temp1;\r\n}\r\n\r\nvoid main() {\r\n  vec2 noise = rand(vUv);\r\n  float depth = readDepth(vUv);\r\n  float tt = clamp(depth, aoClamp, 1.0);\r\n  float w = (1.0 / size.x) / tt + (noise.x * (1.0 - noise.x));\r\n  float h = (1.0 / size.y) / tt + (noise.y * (1.0 - noise.y));\r\n\r\n  float ao = 0.0;\r\n\r\n  float dz = 1.0 / float(samples);\r\n  float z = 1.0 - dz / 2.0;\r\n  float l = 0.0;\r\n\r\n  for (int i=0; i<=samples; i++) {\r\n    float r = sqrt(1.0 - z);\r\n    float pw = cos(l) * r;\r\n    float ph = sin(l) * r;\r\n    ao += calcAO(depth, pw * w, ph * h);\r\n    z = z - dz;\r\n    l = l + DL;\r\n  }\r\n\r\n  ao /= float(samples);\r\n  ao = 1.0 - ao;\r\n\r\n  vec3 color = texture2D(tDiffuse, vUv).rgb;\r\n\r\n  vec3 lumcoeff = vec3(0.299, 0.587, 0.114);\r\n  float lum = dot(color.rgb, lumcoeff);\r\n  vec3 luminance = vec3(lum);\r\n\r\n  vec3 final = vec3(color * mix(vec3(ao), vec3(1.0), luminance * lumInfluence)); // mix(color * ao, white, luminance)\r\n  if (onlyAO) {\r\n    final = vec3(mix(vec3(ao), vec3(1.0), luminance * lumInfluence));\r\n  }\r\n\r\n  gl_FragColor = vec4(final, 1.0);\r\n}";

	var ssaoUniforms = {
	  tDiffuse:     { value: null },
	  tDepth:       { value: null },
	  size:        { value: new THREE.Vector2(512, 512) },
	  cameraNear:  { value: 1 },
	  cameraFar:   { value: 100 },
	  onlyAO:      { value: 0 },
	  aoClamp:     { value: 0.5 },
	  lumInfluence: { value: 0.5 },
	  radius:       { value: 5.0 },
	  diffArea:     { value: 0.4 },
	  gDisplace:    { value: 0.4 }
	};

	var ssaoVert = "varying vec2 vUv;\r\nvoid main() {\r\n  vUv = uv;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";

	var standardAreaLightFrag = "void computeAreaLight(const in AreaLight areaLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {\r\n  vec3 L = areaLight.position - geometry.position;\r\n  float Ld = length(L);\r\n\r\n  if (areaLight.distance == 0.0 || Ld < areaLight.distance) {\r\n    \r\n    vec3 Ln = normalize(L);\r\n  \r\n    vec3 N = geometry.normal;\r\n    vec3 V = geometry.viewDir;\r\n  \r\n    vec3 r = reflect(-V,N);\r\n    vec3 centerToRay = dot(L,r)*r - L;\r\n    vec3 closestPoint = L + centerToRay * clamp(areaLight.radius / length(centerToRay), 0.0, 1.0);\r\n    Ln = normalize(closestPoint);\r\n    \r\n    float NoL = saturate(dot(N, Ln));\r\n    float NoV = saturate(dot(N, V));\r\n    vec3 H = normalize(Ln+V);\r\n    float NoH = saturate(dot(N, H));\r\n    float VoH = saturate(dot(V, H));\r\n    float LoV = saturate(dot(Ln, V));\r\n    float a = pow2(material.specularRoughness);\r\n    \r\n    float Lc = pow(saturate(-Ld / areaLight.distance + 1.0), areaLight.decay);\r\n    float alphaPrime = clamp(areaLight.distance / (Ld*2.0) + a, 0.0, 1.0);\r\n    float D = D_GGX_AreaLight(a, alphaPrime, NoH);\r\n    float G = PBR_Specular_G(material.specularRoughness, NoV, NoL, NoH, VoH, LoV);\r\n    vec3 F = PBR_Specular_F(material.specularColor, V, H) / (4.0 * NoL * NoV + 1e-5);\r\n    \r\n    vec3 cdiff = DiffuseLambert(material.diffuseColor);\r\n    vec3 cspec = F*(G*D);\r\n    \r\n    vec3 irradiance = areaLight.color * NoL * Lc;\r\n    irradiance *= PI; // punctual light\r\n    \r\n    reflectedLight.directDiffuse += irradiance * cdiff;\r\n    reflectedLight.directSpecular += irradiance * cspec;\r\n  }\r\n}";

	var standardDisneyFrag = "  vec3 X = vTangent;\r\n  vec3 Y = vBinormal;\r\n  float NoL = saturate(dot(N, L));\r\n  float NoV = saturate(dot(N, V));\r\n  vec3 H = normalize(L+V);\r\n  float NoH = saturate(dot(N, H));\r\n  float VoH = saturate(dot(V, H));\r\n  float LoV = saturate(dot(L, V));\r\n  float LoH = saturate(dot(L, H));\r\n  float a = max(0.001, pow2(material.specularRoughness));\r\n        \r\n  float luminance = 0.3 * material.diffuseColor.x + 0.6 * material.diffuseColor.y + 0.1 * material.diffuseColor.z;\r\n        \r\n  vec3 tint = luminance > 0.0 ? material.diffuseColor / luminance : vec3(1.0);\r\n  specularColor = mix(0.5 * 0.08 * mix(vec3(1.0), tint, SpecularTint), material.diffuseColor, Metallic);\r\n  vec3 CSheen = mix(vec3(1.0), tint, SheenTint);\r\n        \r\n  // Diffuse fresnel - go from 1 at normal incidence to .5 at grazing\r\n  // and mxi in diffuse retro-reflection based on roughness\r\n  float FL = F_Schlick_Disney(NoL);\r\n  float FV = F_Schlick_Disney(NoV);\r\n  float Fd90 = 0.5 + 2.0 * LoH * LoH * a;\r\n  float Fd = mix(1.0, Fd90, FL) * mix(1.0, Fd90, FV);\r\n        \r\n  // Based on Hanrahan-Krueger brdf approximation of isotropic bssrdf\r\n  // 1.25 scale is used to (roughly) preserve albedo\r\n  // Fss90 used to \"flatten\" retroreflection based on roughness\r\n  float Fss90 = LoH * LoH * a;\r\n  float Fss = mix(1.0, Fss90, FL) * mix(1.0, Fss90, FV);\r\n  float ss = 1.25 * (Fss * (1.0 / (NoL + NoV + 1e-5) - 0.5) + 0.5);\r\n        \r\n  // Specular\r\n  float aspect = sqrt(1.0 - Anisotropic * 0.9);\r\n  float ax = max(0.001, pow2(a) / aspect);\r\n  float ay = max(0.001, pow2(a) * aspect);\r\n  float Ds = GTR2_aniso(NoH, dot(H, X), dot(H, Y), ax, ay);\r\n  float FH = F_Schlick_Disney(LoH);\r\n  vec3 Fs = mix(specularColor, vec3(1.0), FH);\r\n  float roughg = pow2(a * 0.5 + 0.5);\r\n  float Gs = smithG_GGX(NoL , roughg) * smithG_GGX(NoV, roughg);\r\n        \r\n  // Sheen\r\n  vec3 Fsheen = FH * Sheen * CSheen;\r\n        \r\n  // Clearcoat (ior = 1.5 -> F0 = 0.04)\r\n  float Dr = GTR1(NoH, mix(0.1, 0.001, ClearcoatGloss));\r\n  float Fr = mix(0.04, 1.0, FH);\r\n  float Gr = smithG_GGX(NoL, 0.25) * smithG_GGX(NoV, 0.25);\r\n  diffuse = ((1.0 / PI) * mix(Fd, ss, Subsurface) * material.diffuseColor + Fsheen) * (1.0 - Metallic);\r\n  reflectedLight.directDiffuse += (diffuse + Gs*Fs*Ds + 0.25*Clearcoat*Gr*Fr*Dr) * NoL * Lc;\r\n  reflectedLight.directSpecular += (0.25*Clearcoat*Gr*Fr*Dr) * NoL * Lc;";

	var standardDisneyFragPars = "uniform float Subsurface;\r\nuniform float SpecularTint;\r\nuniform float Anisotropic;\r\nuniform float Sheen;\r\nuniform float SheenTint;\r\nuniform float Clearcoat;\r\nuniform float ClearcoatGloss;\r\nfloat Metallic;";

	var standardFrag = "  vec3 N = geometry.normal;\r\n  vec3 L = directLight.direction;\r\n  vec3 V = geometry.viewDir;\r\n\r\n  float NoL = saturate(dot(N, L));\r\n  float NoV = saturate(dot(N, V));\r\n  vec3 H = normalize(L+V);\r\n  float NoH = saturate(dot(N, H));\r\n  float VoH = saturate(dot(V, H));\r\n  float LoV = saturate(dot(L, V));\r\n          \r\n  float a = pow2(material.specularRoughness);\r\n\r\n  vec3 cdiff = DiffuseLambert(material.diffuseColor);\r\n  vec3 cspec = PBR_Specular_CookTorrance(material.specularColor, H, V, L, a, NoL, NoV, NoH, VoH, LoV);\r\n\r\n  vec3 irradiance = directLight.color * NoL;\r\n  irradiance *= PI; // punctual light\r\n\r\n  reflectedLight.directDiffuse += cdiff * irradiance;\r\n  reflectedLight.directSpecular += cspec * irradiance;";

	var standardFragPars = "uniform float roughness;\r\nuniform float metalness;\r\n\r\nfloat PBR_Specular_D(float a, float NoH) {\r\n  // return D_BlinnPhong(a, NoH);\r\n  // return D_Beckmann(a, NoH);\r\n  return D_GGX(a, NoH);\r\n}\r\n\r\nfloat PBR_Specular_G(float a, float NoV, float NoL, float NoH, float VoH, float LoV) {\r\n  // return G_Implicit(a, NoV, NoL);\r\n  // return G_Neuman(a, NoV, NoL);\r\n  // return G_CookTorrance(a, NoV, NoL, NoH, VoH);\r\n  // return G_Keleman(a, NoV, NoL, LoV);\r\n  // return G_Smith_Beckmann(a, NoV, NoL);\r\n  // return G_Smith_GGX(a, NoV, NoL);\r\n  return G_Smith_Schlick_GGX(a, NoV, NoL);\r\n  // return G_SmithCorrelated_GGX(a, NoV, NoL);\r\n}\r\n\r\nvec3 PBR_Specular_F(vec3 specularColor, vec3 H, vec3 V) {\r\n  // return F_None(specularColor);\r\n  // return F_Schlick(specularColor, H, V);\r\n  return F_SchlickApprox(specularColor, saturate(dot(H,V)));\r\n  // return F_CookTorrance(specularColor, H, V);\r\n}\r\n\r\n// Calculates specular intensity according to the Cook - Torrance model\r\n// F: Fresnel - 入射角に対する反射光の量\r\n// D: Microfacet Distribution - 与えられた方向に向いているマイクロファセットの割合\r\n// G: Geometrical Attenuation - マイクロファセットの自己シャドウ\r\nvec3 PBR_Specular_CookTorrance(vec3 specularColor, vec3 H, vec3 V, vec3 L, float a, float NoL, float NoV, float NoH, float VoH, float LoV) {\r\n  float D = PBR_Specular_D(a, NoH);\r\n  float G = PBR_Specular_G(a, NoV, NoL, NoH, VoH, LoV);\r\n  vec3 F = PBR_Specular_F(specularColor, V, H) / (4.0 * NoL * NoV + 1e-5);\r\n  return F * (D*G);\r\n}\r\n";

	var standardOrenNayarFrag = "vec3 N = geometry.normal;\r\nvec3 L = directLight.direction;\r\nvec3 V = geometry.viewDir;\r\n\r\nfloat NoL = saturate(dot(N, L));\r\nfloat NoV = saturate(dot(N, V));\r\nvec3 H = normalize(L+V);\r\nfloat NoH = saturate(dot(N, H));\r\nfloat VoH = saturate(dot(V, H));\r\nfloat LoV = saturate(dot(L, V));\r\n        \r\nfloat a = pow2(material.specularRoughness);\r\n\r\nvec3 cdiff = DiffuseOrenNayar(material.diffuseColor, NoV, NoL, LoV, material.specularRoughness);\r\nvec3 cspec = PBR_Specular_CookTorrance(material.specularColor, H, V, L, a, NoL, NoV, NoH, VoH, LoV);\r\n\r\nvec3 irradiance = directLight.color * NoL;\r\nirradiance *= PI; // punctual light\r\n\r\nreflectedLight.directDiffuse += cdiff * directLight.color * PI;\r\nreflectedLight.directSpecular += cspec * irradiance;";

	var standardRectLightFrag = "//------------------------------------------------------------\r\n// Real-time Collision Detection\r\nvec3 closestPointPToRay(in vec3 p, in vec3 start, in vec3 dir) {\r\n  float t = max(dot(p-start, dir) / dot(dir,dir), 0.0);\r\n  return start + dir*t;\r\n}\r\nvec3 closestPointPToSegment(in vec3 p, in vec3 a, in vec3 b) {\r\n  vec3 ab = b-a;\r\n  float t = dot(p-a,ab);\r\n  if (t <= 0.0) {\r\n    return a;\r\n  }\r\n  else {\r\n    float denom = dot(ab,ab);\r\n    if (t >= denom) {\r\n      return b;\r\n    }\r\n    \r\n    return a + ab*(t/denom);\r\n  }\r\n  // vec3 ab = b-a;\r\n  // float t = clamp(dot(p-a, ab) / dot(ab,ab), 0.0, 1.0);\r\n  // return a + ab*t;\r\n}\r\n\r\nvec3 closestPointPToTriangle(in vec3 p, in vec3 a, in vec3 b, in vec3 c) {\r\n  // Check if P in vertex region outside A\r\n  vec3 ap = p-a;\r\n  vec3 ab = b-a;\r\n  vec3 ac = c-a;\r\n  float d1 = dot(ab,ap);\r\n  float d2 = dot(ac,ap);\r\n  if (d1 <= 0.0 && d2 <= 0.0) {\r\n    return a; // voronoi=0. barycentric coordinates (1,0,0)\r\n  }\r\n  \r\n  vec3 bp = p-b;\r\n  \r\n  // Check if P in vertex region outside B\r\n  float d3 = dot(ab,bp);\r\n  float d4 = dot(ac,bp);\r\n  if (d3 >= 0.0 && d4 <= d3) {\r\n    return b; // voronoi=1. barycentric coordinates (0,1,0)\r\n  }\r\n  \r\n  // Check if P in edge region of AB,k if so return projection of P onto AB\r\n  float vc = d1*d4 - d3*d2;\r\n  if (vc <= 0.0 && d1 >= 0.0 && d3 <= 0.0) {\r\n    // float v = d1/(d1-d3)\r\n    return a + ab * (d1/(d1-d3)); // voronoi=2. barycentric coordinates (1-v,v,0)\r\n  }\r\n  \r\n  // Check if P in vertex region outside C\r\n  vec3 cp = p-c;\r\n  float d5 = dot(ab, cp);\r\n  float d6 = dot(ac, cp);\r\n  if (d6 >= 0.0 && d5 <= d6) {\r\n    return c; // voronoi=3. barycentric coordinates (0,0,1)\r\n  }\r\n  \r\n  // Check if P in edge region of AC, if so return projection of P onto AC\r\n  float vb = d5*d2 - d1*d6;\r\n  if (vb <= 0.0 && d2 >= 0.0 && d6 <= 0.0) {\r\n    // float w = d2/(d2-d6)\r\n    return a + ac * (d2/(d2-d6)); // voronoi=4. barycentric cooridnates (1-w,w,0)\r\n  }\r\n  \r\n  // Check if P in edge region of BC, if so return projection of P onto BC\r\n  float va = d3*d6 - d5*d4;\r\n  if (va <= 0.0 && (d4-d3) >= 0.0 && (d5-d6) >= 0.0) {\r\n    // float w = (d4-d3)/(d4-d3+d5-d6)\r\n    return b + (c-b) * ((d4-d3)/(d4-d3+d5-d6)); // voronoi=5. barycentric coordinates (0,1-w,w)\r\n  }\r\n  \r\n  // P inside face region. Compute Q through its barycentric coordinates (u,v,w)\r\n  float denom = 1.0 / (va+vb+vc);\r\n  float v = vb * denom;\r\n  float w = vc * denom;\r\n  return a + ab*v + ac*w; // voronoi=6\r\n}\r\n\r\nint pointInTriangle(in vec3 p, in vec3 a, in vec3 b, in vec3 c) {\r\n  a -= p;\r\n  b -= p;\r\n  c -= p;\r\n  float ab = dot(a,b);\r\n  float ac = dot(a,c);\r\n  float bc = dot(b,c);\r\n  float cc = dot(c,c);\r\n  if (bc*ac - cc*ab < 0.0) return 0;\r\n  float bb = dot(b,b);\r\n  if (ab*bc - ac*bb < 0.0) return 0;\r\n  return 1;\r\n}\r\n//--------------------------------------------------\r\nvec3 Specular_AreaLight(vec3 specularColor, vec3 N, float roughnessFactor, vec3 L, vec3 Lc, vec3 V) {\r\n  // Compute some useful values\r\n  float NoL = saturate(dot(N, L));\r\n  float NoV = saturate(dot(N, V));\r\n  vec3 H = normalize(L+V);\r\n  float NoH = saturate(dot(N, H));\r\n  float VoH = saturate(dot(V, H));\r\n  float LoV = saturate(dot(L, V));\r\n  \r\n  float a = pow2(roughnessFactor);\r\n  \r\n  vec3 cspec = PBR_Specular_CookTorrance(specularColor, H, V, L, a, NoL, NoV, NoH, VoH, LoV);\r\n  return Lc * NoL * cspec;\r\n}\r\n//--------------------------------------------------\r\nvoid computeRectLight_Triangle(const in RectLight rectLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {\r\n  \r\n  vec4 lpos[3];\r\n  vec3 lvec[3];\r\n  \r\n  // direction vectors from point to area light corners\r\n  for (int i=0; i<3; ++i) {\r\n    // lpos[i] = lightMatrixWorld * vec4(rectLight.positions[i], 1.0); // in world space\r\n    lpos[i] = vec4(rectLight.positions[i], 1.0); // in camera space\r\n    lvec[i] = normalize(lpos[i].xyz - geometry.position); // dir from vertex to area light\r\n  }\r\n  \r\n  // bail if the point is on the wrong side of the light... there must be a better way...\r\n  float tmp = dot(lvec[0], cross((lpos[2]-lpos[0]).xyz, (lpos[1]-lpos[0]).xyz));\r\n  if (tmp > 0.0) return;\r\n  \r\n  // vector irradiance at point\r\n  vec3 lightVec = vec3(0.0);\r\n  for (int i=0; i<3; ++i) {\r\n    vec3 v0 = lvec[i];\r\n    vec3 v1 = lvec[int(mod(float(i+1), float(3)))];\r\n    // if (tmp > 0.0) { // double side\r\n    //   lightVec += acos(dot(v0,v1)) * normalize(cross(v1,v0));\r\n    // }\r\n    // else {\r\n      lightVec += acos(dot(v0,v1)) * normalize(cross(v0,v1));\r\n    // }\r\n  }\r\n  \r\n  vec3 N = geometry.normal;\r\n  vec3 V = geometry.viewDir;\r\n  \r\n  // irradiance factor at point\r\n  float factor = max(dot(lightVec, N), 0.0) / (2.0 * PI);\r\n  \r\n  vec3 irradiance = rectLight.color * rectLight.intensity * factor;\r\n  irradiance *= PI; // punctual light\r\n  \r\n  \r\n  vec3 planePosition = (lpos[0].xyz + lpos[1].xyz + lpos[2].xyz) / 3.0;\r\n  vec3 planeNormal = rectLight.normal;\r\n  planeNormal = normalize(planeNormal - planePosition);\r\n  \r\n  // project onto plane and calculate direction from center to the projection\r\n  // vec3 projection = projectOnPlane(P, planePosition, planeNormal);\r\n  \r\n  // calculate distance from area\r\n  // vec3 nearestPointInside = closestPointPToTriangle(projection, lpos[0].xyz, lpos[1].xyz, lpos[2].xyz);\r\n  // float Ld = distance(P, nearestPointInside);\r\n  // if (cutoffDistance == 0.0 || Ld < cutoffDistance) {\r\n  //   float Lc = pow(saturate(-Ld / cutoffDistance + 1.0), 2.0);\r\n    // float Lc = pow(saturate(-Ld / cutoffDistance + 1.0), decayExponent);\r\n    float NoL = saturate(dot(N, lightVec));\r\n    reflectedLight.directDiffuse += irradiance * NoL * DiffuseLambert(material.diffuseColor);\r\n  // }\r\n  \r\n  /// SPECULAR\r\n  \r\n  // shoot a ray to calculate specular\r\n  vec3 R = reflect(-V, N);\r\n  vec3 E = linePlaneIntersect(geometry.position, -R, planePosition, planeNormal);\r\n  float specAngle = dot(-R, planeNormal);\r\n  if (specAngle > 0.0) {\r\n    \r\n    if (pointInTriangle(E, lpos[0].xyz, lpos[1].xyz, lpos[2].xyz) == 1) {\r\n      reflectedLight.directSpecular += Specular_AreaLight(material.specularColor, N, material.specularRoughness, R, irradiance * specAngle, V);\r\n    }\r\n    else {\r\n      vec3 nearestPointInside = closestPointPToTriangle(E, lpos[0].xyz, lpos[1].xyz, lpos[2].xyz);\r\n      float Ld = length(nearestPointInside-E);\r\n      \r\n      if (rectLight.distance == 0.0 || Ld < rectLight.distance) {\r\n        float Lc = pow(saturate(-Ld / rectLight.distance + 1.0), rectLight.decay);\r\n        reflectedLight.directSpecular += Specular_AreaLight(material.specularColor, N, material.specularRoughness, R, irradiance * Lc * specAngle, V);\r\n      }\r\n    }\r\n  }\r\n}\r\n//--------------------------------------------------\r\nvoid computeRectLight_Rectangle(const in RectLight rectLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {\r\n  \r\n  vec4 lpos[4];\r\n  vec3 lvec[4];\r\n  \r\n  // direction vectors from point to area light corners\r\n  for (int i=0; i<4; ++i) {\r\n    // lpos[i] = lightMatrixWorld * vec4(lightverts[i], 1.0); // in world space\r\n    lpos[i] = vec4(rectLight.positions[i], 1.0); // in camera space\r\n    lvec[i] = normalize(lpos[i].xyz - geometry.position); // dir from vertex to area light\r\n  }\r\n  \r\n  // bail if the point is on the wrong side of the light... there must be a better way...\r\n  float tmp = dot(lvec[0], cross((lpos[2]-lpos[0]).xyz, (lpos[1]-lpos[0]).xyz));\r\n  if (tmp > 0.0) return;\r\n  \r\n  // vector irradiance at point\r\n  vec3 lightVec = vec3(0.0);\r\n  for (int i=0; i<4; ++i) {\r\n    vec3 v0 = lvec[i];\r\n    vec3 v1 = lvec[int(mod(float(i+1), 4.0))];\r\n    // if (tmp > 0.0) { // double side\r\n    //   lightVec += acos(dot(v0,v1)) * normalize(cross(v1,v0));\r\n    // }\r\n    // else {\r\n      lightVec += acos(dot(v0,v1)) * normalize(cross(v0,v1));\r\n    // }\r\n  }\r\n  \r\n  vec3 N = geometry.normal;\r\n  vec3 V = geometry.viewDir;\r\n  \r\n  // irradiance factor at point\r\n  float factor = max(dot(lightVec, N), 0.0) / (2.0 * PI);\r\n  \r\n  vec3 irradiance = rectLight.color * rectLight.intensity * factor;\r\n  irradiance *= PI; // punctual light\r\n  \r\n  vec3 planePosition = (lpos[0].xyz + lpos[1].xyz + lpos[2].xyz + lpos[3].xyz) / 4.0;\r\n  vec3 planeNormal = rectLight.normal;\r\n  vec3 right = rectLight.tangent;\r\n  planeNormal = normalize(planeNormal - planePosition);\r\n  right = normalize(right - planePosition);\r\n  vec3 up = normalize(cross(right, planeNormal));\r\n  \r\n  // project onto plane and calculate direction from center to the projection\r\n  // vec3 projection = projectOnPlane(P, planePosition, planeNormal);\r\n  // vec3 dir = projection - planePosition;\r\n  \r\n  // calculate distance from area\r\n  // vec2 diagonal = vec2(dot(dir,right), dot(dir,up));\r\n  // vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));\r\n  // vec3 nearestPointInside = planePosition + (right*nearest2D.x + up*nearest2D.y);\r\n  \r\n  // float Ld = distance(P, nearestPointInside); // real distance to area rectangle\r\n  // if (cutoffDistance == 0.0 || Ld < cutoffDistance) {\r\n  //   float Lc = pow(saturate(-Ld / cutoffDistance + 1.0), 2.0);\r\n    float NoL = saturate(dot(N, lightVec));\r\n    reflectedLight.directDiffuse += irradiance * NoL * DiffuseLambert(material.diffuseColor);\r\n  // }\r\n  \r\n  // shoot a ray to calculate specular\r\n  vec3 R = reflect(-V, N);\r\n  vec3 E = linePlaneIntersect(geometry.position, -R, planePosition, planeNormal);\r\n  float specAngle = dot(-R, planeNormal);\r\n  if (specAngle > 0.0) {\r\n    vec3 dirSpec = E - planePosition;\r\n    vec2 dirSpec2D = vec2(dot(dirSpec,right), dot(dirSpec,up));\r\n    vec2 nearestSpec2D = vec2(clamp(dirSpec2D.x,-rectLight.width,rectLight.width), clamp(dirSpec2D.y,-rectLight.height,rectLight.height));\r\n    \r\n    float Ld = length(nearestSpec2D-dirSpec2D);\r\n    if (rectLight.distance == 0.0 || Ld < rectLight.distance) {\r\n      float Lc = pow(saturate(-Ld / rectLight.distance + 1.0), rectLight.decay);\r\n      reflectedLight.directSpecular += Specular_AreaLight(material.specularColor, N, material.specularRoughness, R, irradiance * Lc * specAngle, V);\r\n    }\r\n  }\r\n}\r\n//------------------------------------------------------------\r\nvoid computeRectLight(const in RectLight rectLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {\r\n  \r\n  if (rectLight.numPositions <= 3) {\r\n    computeRectLight_Triangle(rectLight, geometry, material, reflectedLight);\r\n  }\r\n  else {\r\n    computeRectLight_Rectangle(rectLight, geometry, material, reflectedLight);\r\n  }\r\n}";

	var standardTubeLightFrag = "void computeTubeLight(const in TubeLight tubeLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {\r\n  \r\n  vec3 N = geometry.normal;\r\n  vec3 V = geometry.viewDir;\r\n  \r\n  vec3 r = reflect(-V, N);\r\n  vec3 L0 = tubeLight.start - geometry.position;\r\n  vec3 L1 = tubeLight.end - geometry.position;\r\n  float Ld0 = length(L0);\r\n  float Ld1 = length(L1);\r\n  float NoL0 = dot(L0, N) / (2.0 * Ld0);\r\n  float NoL1 = dot(L1, N) / (2.0 * Ld1);\r\n  float NoL = (2.0 * clamp(NoL0 + NoL1, 0.0, 1.0)) / (Ld0 * Ld1 + dot(L0,L1) + 2.0);\r\n  vec3 Lv = L1-L0;\r\n  float RoL0 = dot(r, L0);\r\n  float RoLv = dot(r, Lv);\r\n  float LoLv = dot(L0, Lv);\r\n  float Ld = length(Lv);\r\n  float t = (RoL0 * RoLv - LoLv) / (Ld*Ld - RoLv*RoLv);\r\n  \r\n  vec3 closestPoint = L0 + Lv * clamp(t, 0.0, 1.0);\r\n  vec3 centerToRay = dot(closestPoint, r) * r - closestPoint;\r\n  closestPoint = closestPoint + centerToRay * clamp(tubeLight.radius / length(centerToRay), 0.0, 1.0);\r\n  vec3 Ln = normalize(closestPoint);\r\n  \r\n  // float NoL = saturate(dot(N, Ln));\r\n  float NoV = saturate(dot(N, V));\r\n  vec3 H = normalize(Ln+V);\r\n  float NoH = saturate(dot(N, H));\r\n  float VoH = saturate(dot(V, H));\r\n  float LoV = saturate(dot(Ln, V));\r\n  float a = pow2(material.specularRoughness);\r\n  \r\n  Ld = length(closestPoint);\r\n  float Lc = pow(saturate(-Ld / tubeLight.distance + 1.0), tubeLight.decay);\r\n  float alphaPrime = clamp(tubeLight.radius / (Ld*2.0) + a, 0.0, 1.0);\r\n  float D = D_GGX_AreaLight(a, alphaPrime, NoH);\r\n  float G = PBR_Specular_G(material.specularRoughness, NoV, NoL, NoH, VoH, LoV);\r\n  vec3 F = PBR_Specular_F(material.specularColor, V, H) / (4.0 * NoL * NoV + 1e-5);\r\n  \r\n  vec3 cdiff = DiffuseLambert(material.diffuseColor);\r\n  vec3 cspec = F*(G*D);\r\n  \r\n  // vec3 irradiance = areaLight.color * NoL * Lc;\r\n  vec3 irradiance = tubeLight.color * Lc;\r\n  irradiance *= PI; // punctual light\r\n  \r\n  reflectedLight.directDiffuse += irradiance * cdiff;\r\n  reflectedLight.directSpecular += irradiance * cspec;\r\n}";

	var standardUniforms = {
	  roughness: { value: 1.0 },
	  metalness: { value: 0.0 }
	};

	var tangentFragPars = "varying vec3 vTangent;\r\nvarying vec3 vBinormal;";

	var tangentVert = "  vNormal = normalize(normalMatrix * normal);\r\n  vTangent = normalize(normalMatrix * tangent.xyz);\r\n  vBinormal = normalize(cross(vNormal, vTangent) * tangent.w);";

	var tangentVertPars = "attribute vec4 tangent;\r\nvarying vec3 vTangent;\r\nvarying vec3 vBinormal;";

	var timePars = "uniform float time;";

	var timeUniforms = {
	  time: { value: 0.0 }
	};

	var toneMapFrag = "uniform float exposure;\r\nuniform float whitePoint;\r\nuniform sampler2D tDiffuse;\r\n\r\n// exposure only\r\nvec3 PixyLinearToneMapping(vec3 color) {\r\n  return exposure * color;\r\n}\r\n\r\n// source: https://www.cs.utah.edu/~reinhard/cdrom/\r\nvec3 PixyReinhardToneMapping(vec3 color) {\r\n  color *= exposure;\r\n  return saturate(color / (vec3(1.0) + color));\r\n}\r\n\r\n// source: http://filmicgames.com/archives/75\r\n#define PixyUncharted2Helper(x) max(((x * (0.15 * x + 0.10 * 0.50) + 0.20 * 0.02) / (x * (0.15 * x + 0.50) + 0.20 * 0.30)) - 0.02 / 0.30, vec3(0.0))\r\nvec3 PixyUncharted2ToneMapping(vec3 color) {\r\n// John Hable's filmic operator from Uncharted 2 video game\r\n  color *= exposure;\r\n  return saturate(PixyUncharted2Helper(color) / PixyUncharted2Helper(vec3(whitePoint)));\r\n}\r\n\r\n// source: http://filmicgames.com/archives/75\r\nvec3 PixyOptimizedCineonToneMapping(vec3 color) {\r\n// optimized filmic operator by Jim Hejl and Richard Burgess-Dawson\r\n  color *= exposure;\r\n  color = max(vec3(0.0), color - 0.004);\r\n  return pow((color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06), vec3(2.2));\r\n}\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n  vec4 colorRGBA = texture2D(tDiffuse, vUv);\r\n  gl_FragColor = vec4(PixyUncharted2ToneMapping(colorRGBA.rgb), 1.0);\r\n  \r\n}";

	var toneMappingFrag = "  outgoingLight.rgb = toneMapping(outgoingLight.rgb);";

	var toneMappingFragPars = "// uniform float toneMappingExposure;\r\n// uniform float toneMappingWhitePoint;\r\n// \r\n// // exposure only\r\n// vec3 LinearToneMapping(vec3 color) {\r\n//   return toneMappingExposure * color;\r\n// }\r\n// \r\n// // source: https://www.cs.utah.edu/~reinhard/cdrom/\r\n// vec3 ReinhardToneMapping(vec3 color) {\r\n//   color *= toneMappingExposure;\r\n//   return saturate(color / (vec3(1.0) + color));\r\n// }\r\n// \r\n// // source: http://filmicgames.com/archives/75\r\n// #define Uncharted2Helper(x) max(((x * 0.15 * x + 0.10 * 0.50) + 0.20 * 0.02)\r\n// vec3 Uncharted2ToneMapping(vec3 color) {\r\n// // John Hable's filmic operator from Uncharted 2 video game\r\n//   color *= toneMappingExposure;\r\n//   return saturate(Uncharted2Helper(color) / Uncharted2Helper(vec3(toneMappingWhitePoint)));\r\n// }\r\n// \r\n// // source: http://filmicgames.com/archives/75\r\n// vec3 OptimizedCineonToneMapping(vec3 color) {\r\n// // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson\r\n//   color *= toneMappingExposure;\r\n//   color = max(vec3(0.0), color - 0.004);\r\n//   return pow((color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06), vec3(2.2));\r\n// \"}\"";

	var toneMappingUniforms = {
	  toneMappingExposure: 3.0,
	  toneMappingWhitePoint: 5.0
	};

	var toneMapUniforms = {
	  exposure: { value: 3.0 },
	  whitePoint: { value: 5.0 },
	  tDiffuse: { value: null }
	};

	var toneMapVert = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n  vUv = uv;\r\n}";

	var toonFrag = "  float NoL = dot(directLight.direction, geometry.normal);\r\n  vec3 H = normalize(geometry.viewDir + directLight.direction);\r\n  float HoN = max(dot(H, geometry.normal), 0.0);\r\n\r\n  vec2 toonUV = vec2(NoL * 0.495 + 0.5, 1.0 - (HoN * 0.98 + 0.01));\r\n  vec3 toonColor = texture2D(tToon, toonUV).rgb;\r\n  reflectedLight.directDiffuse += material.diffuseColor * directLight.color * toonColor;\r\n\r\n  // reflectedLight.directSpecular += material.specularStrength * directLight.color * toonColor;";

	var toonFragPars = "uniform sampler2D tToon;";

	var toonUniforms = {
	  tToon : { value: null },
	};

	var uvFrag = "  vec2 uv = vUv;";

	var uvHemiSphericalFrag = "  vec3 wdir = normalize(vWorldPosition);\r\n  float theta = acos(wdir.y); // y-axis [0, pi]\r\n  float phi = atan(wdir.z, wdir.x); // x-axis [-pi/2, pi/2]\r\n  // uv = vec2(0.5, 1.0) - vec2(phi, theta * 2.0 - PI) / vec2(2.0*PI, PI);\r\n  uv = vec2(0.5 - phi / (2.0 * PI), 1.0 - theta * 2.0 / PI);";

	var uvProjectionVert = "  vUv = hpos.xy / hpos.w;";

	var uvScaleFrag = "  uv *= uvScale;";

	var uvScaleFragPars = "uniform float uvScale;";

	var uvScaleUniforms = {
	  uvScale: { value: 1.0 }
	};

	var uvScroll2Vert = "  vUv2 += fract(vec2(uvScrollSpeedU, uvScrollSpeedV) * uvScrollTime);";

	var uvScrollUniforms = {
	  uvScrollTime: { value: 0.0 },
	  uvScrollSpeedU: { value: 1.0 },
	  uvScrollSpeedV: { value: 1.0 }
	};

	var uvScrollVert = "  vUv += fract(vec2(uvScrollSpeedU, uvScrollSpeedV) * uvScrollTime);";

	var uvScrollVertPars = "uniform float uvScrollTime;\r\nuniform float uvScrollSpeedU;\r\nuniform float uvScrollSpeedV;";

	var uvSphericalFrag = "  vec3 wdir = normalize(vWorldPosition);\r\n  float theta = acos(wdir.y); // y-axis [0, pi]\r\n  float phi = atan(wdir.z, wdir.x); // x-axis [-pi/2, pi/2]\r\n  uv = vec2(0.5, 1.0) - vec2(phi, theta) / vec2(2.0*PI, PI);";

	var uvVert = "  vUv = uv;";

	var uvVertFragPars = "varying vec2 vUv;";

	var velvetFrag = "  // float NoL = max(dot(directLight.direction, geometry.normal), 0.0);\r\n  reflectedLight.directDiffuse += surfaceColor * directLight.color * NoL;\r\n\r\n  float subLamb = max(smoothstep(-rollOff, 1.0, NoL) - smoothstep(0.0, 1.0, NoL), 0.0);\r\n  reflectedLight.directDiffuse += subColor * subLamb * velvetStrength;\r\n\r\n  float VoN = 1.0 - dot(geometry.viewDir, geometry.normal);\r\n  reflectedLight.directSpecular += (vec3(VoN) * fuzzySpecColor) * velvetStrength;";

	var velvetFragPars = "uniform vec3 surfaceColor;\r\nuniform vec3 fuzzySpecColor;\r\nuniform vec3 subColor;\r\nuniform float rollOff;\r\nuniform float velvetStrength;";

	var velvetUniforms = {
	  surfaceColor: { value: new THREE.Color() },
	  fuzzySpecColor: { value: new THREE.Color() },
	  subColor: { value: new THREE.Color() },
	  rollOff: { value: 0.3 },
	  velvetStrength: { value: 0.3 }
	};

	var viewFrag = "#include <packing>\r\nuniform sampler2D tDiffuse;\r\nuniform int type;\r\nuniform float cameraNear;\r\nuniform float cameraFar;\r\nvarying vec2 vUv;\r\n\r\nfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n  float fragCoordZ = texture2D(depthSampler, coord).x;\r\n  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n}\r\n\r\nvoid main() {\r\n  vec4 diffuse = texture2D(tDiffuse, vUv);\r\n  if (type == 0) {\r\n    gl_FragColor = vec4(diffuse.xyz, 1.0);\r\n  } else if (type == 1) {\r\n    gl_FragColor = vec4(diffuse.www, 1.0);\r\n  } else if (type == 2) {\r\n    gl_FragColor = vec4(diffuse.xxx, 1.0);\r\n  } else if (type == 3) {\r\n    gl_FragColor = vec4(diffuse.yyy, 1.0);\r\n  } else if (type == 4) {\r\n    gl_FragColor = vec4(diffuse.zzz, 1.0);\r\n  } else if (type == 5) {\r\n    gl_FragColor = vec4(diffuse.xyz*2.0-1.0, 1.0);\r\n  } else if (type == 6) {\r\n    float depth = unpackRGBAToDepth(diffuse);\r\n    gl_FragColor = vec4(depth, depth, depth, 1.0);\r\n  } else if (type == 7) {\r\n    float depth = readDepth(tDiffuse, vUv);\r\n    gl_FragColor = vec4(depth, depth, depth, 1.0);\r\n  } else {\r\n    gl_FragColor = diffuse;\r\n  }\r\n}";

	var viewUniforms = {
	  tDiffuse: { value: null },
	  type: { value: 0 },
	  cameraNear: { value: 1.0 },
	  cameraFar: { value: 100.0 }
	};

	var worldPositionVert = "  vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;";

	var worldPositionVertFragPars = "varying vec3 vWorldPosition;";

	var ShaderChunk = {
		accumulateFrag: accumulateFrag,
		ambientFrag: ambientFrag,
		ambientFragPars: ambientFragPars,
		ambientHemisphereFrag: ambientHemisphereFrag,
		ambientHemisphereFragPars: ambientHemisphereFragPars,
		ambientHemisphereUniforms: ambientHemisphereUniforms,
		ambientUniforms: ambientUniforms,
		anisotropyFrag: anisotropyFrag,
		anisotropyFragPars: anisotropyFragPars,
		anisotropyUniforms: anisotropyUniforms,
		antiAliasFrag: antiAliasFrag,
		antiAliasUniforms: antiAliasUniforms,
		antiAliasVert: antiAliasVert,
		aoMapFrag: aoMapFrag,
		aoMapFragPars: aoMapFragPars,
		aoMapUniforms: aoMapUniforms,
		beginFrag: beginFrag,
		billboardDefaultVert: billboardDefaultVert,
		billboardRotZVertEnd: billboardRotZVertEnd,
		billboardUniforms: billboardUniforms,
		billboardVert: billboardVert,
		billboardVertEnd: billboardVertEnd,
		billboardVertPars: billboardVertPars,
		billboardYVert: billboardYVert,
		bokehFrag: bokehFrag,
		bokehUniforms: bokehUniforms,
		bokehVert: bokehVert,
		bsdfs: bsdfs,
		bumpMapFrag: bumpMapFrag,
		bumpMapFragPars: bumpMapFragPars,
		bumpMapUniforms: bumpMapUniforms,
		castShadowFrag: castShadowFrag,
		castShadowFragPars: castShadowFragPars,
		castShadowUniforms: castShadowUniforms,
		castShadowVert: castShadowVert,
		castShadowVertPars: castShadowVertPars,
		clippingPlaneFrag: clippingPlaneFrag,
		clippingPlaneFragPars: clippingPlaneFragPars,
		clippingPlaneUniforms: clippingPlaneUniforms,
		cloudsFrag: cloudsFrag,
		cloudsFragPars: cloudsFragPars,
		cloudsUniforms: cloudsUniforms,
		colorMap2Frag: colorMap2Frag,
		colorMap2FragPars: colorMap2FragPars,
		colorMap2Uniforms: colorMap2Uniforms,
		colorMapAlphaFrag: colorMapAlphaFrag,
		colorMapFrag: colorMapFrag,
		colorMapFragPars: colorMapFragPars,
		colorMapUniforms: colorMapUniforms,
		common: common,
		copyFrag: copyFrag,
		copyUniforms: copyUniforms,
		copyVert: copyVert,
		deferredGeometryFrag: deferredGeometryFrag,
		deferredGeometryUniforms: deferredGeometryUniforms,
		deferredGeometryVert: deferredGeometryVert,
		deferredLightFrag: deferredLightFrag,
		deferredLightUniforms: deferredLightUniforms,
		deferredLightVert: deferredLightVert,
		depthFrag: depthFrag,
		depthFragPars: depthFragPars,
		depthShadowFrag: depthShadowFrag,
		depthShadowFragPars: depthShadowFragPars,
		depthShadowReceiveFrag: depthShadowReceiveFrag,
		depthShadowReceiveUniforms: depthShadowReceiveUniforms,
		depthShadowReceiveVert: depthShadowReceiveVert,
		depthShadowUniforms: depthShadowUniforms,
		depthShadowVert: depthShadowVert,
		discardFrag: discardFrag,
		displacementMapUniforms: displacementMapUniforms,
		displacementMapVert: displacementMapVert,
		displacementMapVertPars: displacementMapVertPars,
		distortionFrag: distortionFrag,
		distortionFragPars: distortionFragPars,
		distortionUniforms: distortionUniforms,
		distortionVert: distortionVert,
		distortionVertPars: distortionVertPars,
		ditherFrag: ditherFrag,
		ditherFragPars: ditherFragPars,
		edgeCompositeFrag: edgeCompositeFrag,
		edgeCompositeUniforms: edgeCompositeUniforms,
		edgeCompositeVert: edgeCompositeVert,
		edgeExpandFrag: edgeExpandFrag,
		edgeExpandUniforms: edgeExpandUniforms,
		edgeExpandVert: edgeExpandVert,
		edgeFrag: edgeFrag,
		edgeIDFrag: edgeIDFrag,
		edgeIDUniforms: edgeIDUniforms,
		edgeIDVert: edgeIDVert,
		edgeUniforms: edgeUniforms,
		edgeVert: edgeVert,
		endFrag: endFrag,
		fakeSunFrag: fakeSunFrag,
		fakeSunUniforms: fakeSunUniforms,
		fakeSunVert: fakeSunVert,
		fogFrag: fogFrag,
		fogFragPars: fogFragPars,
		fogUniforms: fogUniforms,
		fogVert: fogVert,
		fogVertPars: fogVertPars,
		fresnelFrag: fresnelFrag,
		fresnelFragPars: fresnelFragPars,
		fresnelUniforms: fresnelUniforms,
		glassFrag: glassFrag,
		glassFragPars: glassFragPars,
		glassUniforms: glassUniforms,
		glassVert: glassVert,
		godRayCompositeFrag: godRayCompositeFrag,
		godRayCompositeUniforms: godRayCompositeUniforms,
		godRayCompositeVert: godRayCompositeVert,
		godRayFrag: godRayFrag,
		godRayUniforms: godRayUniforms,
		godRayVert: godRayVert,
		grassUniforms: grassUniforms,
		grassVert: grassVert,
		grassVertPars: grassVertPars,
		heightFogFrag: heightFogFrag,
		heightFogFragPars: heightFogFragPars,
		heightFogMapFrag: heightFogMapFrag,
		heightFogMapFragPars: heightFogMapFragPars,
		heightFogMapUniforms: heightFogMapUniforms,
		heightFogUniforms: heightFogUniforms,
		heightFogVert: heightFogVert,
		heightFogVertPars: heightFogVertPars,
		idFrag: idFrag,
		idUniforms: idUniforms,
		idVert: idVert,
		innerGlowFrag: innerGlowFrag,
		innerGlowFragPars: innerGlowFragPars,
		innerGlowSubtractFrag: innerGlowSubtractFrag,
		innerGlowUniforms: innerGlowUniforms,
		instanceCastShadowVert: instanceCastShadowVert,
		instanceCastShadowVertPars: instanceCastShadowVertPars,
		instanceColorMapDiscardFrag: instanceColorMapDiscardFrag,
		lambertFrag: lambertFrag,
		lightMapFrag: lightMapFrag,
		lightMapFragPars: lightMapFragPars,
		lightMapUniforms: lightMapUniforms,
		lightsAreaLightFrag: lightsAreaLightFrag,
		lightsAreaLightFragUnroll: lightsAreaLightFragUnroll,
		lightsAreaLightUniforms: lightsAreaLightUniforms,
		lightsDirectFrag: lightsDirectFrag,
		lightsDirectFragUnroll: lightsDirectFragUnroll,
		lightsDirectUniforms: lightsDirectUniforms,
		lightsFragPars: lightsFragPars,
		lightsPars: lightsPars,
		lightsPointFrag: lightsPointFrag,
		lightsPointFragUnroll: lightsPointFragUnroll,
		lightsPointUniforms: lightsPointUniforms,
		lightsRectLightFrag: lightsRectLightFrag,
		lightsRectLightFragUnroll: lightsRectLightFragUnroll,
		lightsRectLightUniforms: lightsRectLightUniforms,
		lightsSpotFrag: lightsSpotFrag,
		lightsSpotFragUnroll: lightsSpotFragUnroll,
		lightsSpotUniforms: lightsSpotUniforms,
		lightsStandardDisneyFrag: lightsStandardDisneyFrag,
		lightsStandardFrag: lightsStandardFrag,
		lightsTubeLightFrag: lightsTubeLightFrag,
		lightsTubeLightFragUnroll: lightsTubeLightFragUnroll,
		lightsTubeLightUniforms: lightsTubeLightUniforms,
		lineGlowFrag: lineGlowFrag,
		lineGlowFragPars: lineGlowFragPars,
		lineGlowUniforms: lineGlowUniforms,
		luminosityFrag: luminosityFrag,
		luminosityHighPassFrag: luminosityHighPassFrag,
		luminosityHighPassUniforms: luminosityHighPassUniforms,
		luminosityHighPassVert: luminosityHighPassVert,
		luminosityUniforms: luminosityUniforms,
		luminosityVert: luminosityVert,
		metalnessFrag: metalnessFrag,
		metalnessMapFrag: metalnessMapFrag,
		metalnessMapFragPars: metalnessMapFragPars,
		metalnessMapUniforms: metalnessMapUniforms,
		nolitFrag: nolitFrag,
		normalMapFrag: normalMapFrag,
		normalMapFragPars: normalMapFragPars,
		normalMapUniforms: normalMapUniforms,
		opacityFrag: opacityFrag,
		opacityUniforms: opacityUniforms,
		opacityVert: opacityVert,
		overlayFrag: overlayFrag,
		overlayFragPars: overlayFragPars,
		overlayNormalFrag: overlayNormalFrag,
		overlayNormalFragPars: overlayNormalFragPars,
		overlayNormalUniforms: overlayNormalUniforms,
		overlayUniforms: overlayUniforms,
		packing: packing,
		parallaxFrag: parallaxFrag,
		parallaxMapFrag: parallaxMapFrag,
		parallaxMapFragPars: parallaxMapFragPars,
		parallaxMapUniforms: parallaxMapUniforms,
		phongFrag: phongFrag,
		phongFragPars: phongFragPars,
		phongUniforms: phongUniforms,
		projectionMapFrag: projectionMapFrag,
		projectionMapFragPars: projectionMapFragPars,
		projectionMapUniforms: projectionMapUniforms,
		projectionMapVert: projectionMapVert,
		projectionMapVertPars: projectionMapVertPars,
		receiveShadowFrag: receiveShadowFrag,
		receiveShadowFragPars: receiveShadowFragPars,
		receiveShadowUniforms: receiveShadowUniforms,
		receiveShadowVert: receiveShadowVert,
		receiveShadowVertPars: receiveShadowVertPars,
		reflectionFrag: reflectionFrag,
		reflectionFragPars: reflectionFragPars,
		reflectionStandardFrag: reflectionStandardFrag,
		reflectionUniforms: reflectionUniforms,
		rimLightFrag: rimLightFrag,
		rimLightFragPars: rimLightFragPars,
		rimLightUniforms: rimLightUniforms,
		roughnessFrag: roughnessFrag,
		roughnessMapFrag: roughnessMapFrag,
		roughnessMapFragPars: roughnessMapFragPars,
		roughnessMapUniforms: roughnessMapUniforms,
		screenVert: screenVert,
		screenVertPars: screenVertPars,
		skyDomeFrag: skyDomeFrag,
		skyDomeFragPars: skyDomeFragPars,
		skyDomeUniforms: skyDomeUniforms,
		skyFrag: skyFrag,
		skyFragPars: skyFragPars,
		skyUniforms: skyUniforms,
		specularFrag: specularFrag,
		specularFragPars: specularFragPars,
		specularMapFrag: specularMapFrag,
		specularMapFragPars: specularMapFragPars,
		specularMapUniforms: specularMapUniforms,
		specularUniforms: specularUniforms,
		ssao2BlurFrag: ssao2BlurFrag,
		ssao2BlurUniforms: ssao2BlurUniforms,
		ssao2CompositeFrag: ssao2CompositeFrag,
		ssao2CompositeUniforms: ssao2CompositeUniforms,
		ssao2Frag: ssao2Frag,
		ssao2Uniforms: ssao2Uniforms,
		ssaoFrag: ssaoFrag,
		ssaoUniforms: ssaoUniforms,
		ssaoVert: ssaoVert,
		standardAreaLightFrag: standardAreaLightFrag,
		standardDisneyFrag: standardDisneyFrag,
		standardDisneyFragPars: standardDisneyFragPars,
		standardFrag: standardFrag,
		standardFragPars: standardFragPars,
		standardOrenNayarFrag: standardOrenNayarFrag,
		standardRectLightFrag: standardRectLightFrag,
		standardTubeLightFrag: standardTubeLightFrag,
		standardUniforms: standardUniforms,
		tangentFragPars: tangentFragPars,
		tangentVert: tangentVert,
		tangentVertPars: tangentVertPars,
		timePars: timePars,
		timeUniforms: timeUniforms,
		toneMapFrag: toneMapFrag,
		toneMappingFrag: toneMappingFrag,
		toneMappingFragPars: toneMappingFragPars,
		toneMappingUniforms: toneMappingUniforms,
		toneMapUniforms: toneMapUniforms,
		toneMapVert: toneMapVert,
		toonFrag: toonFrag,
		toonFragPars: toonFragPars,
		toonUniforms: toonUniforms,
		uvFrag: uvFrag,
		uvHemiSphericalFrag: uvHemiSphericalFrag,
		uvProjectionVert: uvProjectionVert,
		uvScaleFrag: uvScaleFrag,
		uvScaleFragPars: uvScaleFragPars,
		uvScaleUniforms: uvScaleUniforms,
		uvScroll2Vert: uvScroll2Vert,
		uvScrollUniforms: uvScrollUniforms,
		uvScrollVert: uvScrollVert,
		uvScrollVertPars: uvScrollVertPars,
		uvSphericalFrag: uvSphericalFrag,
		uvVert: uvVert,
		uvVertFragPars: uvVertFragPars,
		velvetFrag: velvetFrag,
		velvetFragPars: velvetFragPars,
		velvetUniforms: velvetUniforms,
		viewFrag: viewFrag,
		viewUniforms: viewUniforms,
		worldPositionVert: worldPositionVert,
		worldPositionVertFragPars: worldPositionVertFragPars,
	};

	var ShaderUtils = {
	  
	  UpdateShaderParameters: function(shader, parameters, camera) {
	    camera.updateMatrixWorld();
	    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
	    var viewMatrix = camera.matrixWorldInverse; // alias
	    
	    if (shader.isEnable(['AMBIENT','HEMISPHERE'])) {
	      shader.uniforms.skyDirection.value.set(parameters.skyDirectionX, parameters.skyDirectionY, parameters.skyDirectionZ).normalize().transformDirection(viewMatrix);
	    }
	    
	    var numDirectLight = shader.enables['DIRECTLIGHT'] || 0;
	    var numPointLight = shader.enables['POINTLIGHT'] || 0;
	    var numSpotLight = shader.enables['SPOTLIGHT'] || 0;
	    if (numDirectLight > 0) {
	      for (var i=0; i<numDirectLight; ++i) {
	        shader.uniforms.directLights.value[i].direction.set(parameters.directLightX, parameters.directLightY, parameters.directLightZ).normalize().transformDirection(viewMatrix);
	      }
	    }
	    
	    if (numPointLight > 0) {
	      for (var i=0; i<numPointLight; ++i) {
	        shader.uniforms.pointLights.value[i].position.set(parameters.pointLightX, parameters.pointLightY, parameters.pointLightZ);
	        shader.uniforms.pointLights.value[i].position.applyMatrix4(viewMatrix);
	      }
	    }
	    
	    if (numSpotLight > 0) {
	      for (var i=0; i<numSpotLight; ++i) {
	        shader.uniforms.spotLights.value[i].position.set(parameters.spotLightX, parameters.spotLightY, parameters.spotLightZ);
	        shader.uniforms.spotLights.value[i].position.applyMatrix4(viewMatrix);
	        shader.uniforms.spotLights.value[i].direction.copy(shader.uniforms.spotLights.value[i].position).normalize();
	      }
	    }
	  },

	  GenerateShaderParametersGUI: function(shader, callback) {
	  
	    var gui = new dat.GUI();
	    var h;
	    var parameters = {};
	    if (callback === undefined) callback = function(key, value) {};
	    var updateCallback = function(key, value) {
	      shader.uniforms[key].value = value;
	      callback(key, value);
	    };

	    {
	      h = gui.addFolder("Base");
	      
	      if (shader.isEnable("SKYDOME")) {
	        parameters.topColor = shader.uniforms.topColor.value.getHex();
	        parameters.bottomColor = shader.uniforms.bottomColor.value.getHex();
	        parameters.exponent = shader.uniforms.exponent.value;
	      
	        h.addColor(parameters, "topColor").onChange(function(value) {
	          shader.uniforms.topColor.value.setHex(value);
	          callback("topColor", value);
	        });
	        h.addColor(parameters, "bottomColor").onChange(function(value) {
	          shader.uniforms.bottomColor.value.setHex(value);
	          callback("bottomColor", value);
	        });
	        h.add(parameters, "exponent", 0.0, 1.0).onChange(function(value) { updateCallback("exponent", value); });
	      }
	      else {
	        parameters.baseColor = shader.uniforms.diffuseColor.value.getHex();
	        parameters.opacity = shader.uniforms.opacity.value;
	      
	        h.addColor(parameters, "baseColor").onChange(function(value) {
	          shader.uniforms.diffuseColor.value.setHex(value);
	          callback("baseColor", value);
	        });
	        h.add(parameters, "opacity", 0.0, 1.0).onChange(function(value) { updateCallback("opacity", value); });
	      }
	      
	      if (shader.isEnable("STANDARD")) {
	        parameters.roughness = shader.uniforms.roughness.value;
	        parameters.metalness = shader.uniforms.metalness.value;
	        h.add(parameters, "roughness", 0.0, 1.0, 0.01).onChange(function(value) { updateCallback("roughness", value); });
	        h.add(parameters, "metalness", 0.0, 1.0, 0.01).onChange(function(value) { updateCallback("metalness", value); });
	      }
	    }
	    
	    if (shader.isEnable(['+PHONG', '+FRESNEL', '+REFLECTION', '+ANISOTROPY'])) {
	      h = gui.addFolder("Specular");
	      
	      if (shader.isEnable('FRESNEL')) {
	        parameters.fresnelExponent = shader.uniforms.fresnelExponent.value;
	        parameters.fresnelReflectionScale = shader.uniforms.fresnelReflectionScale.value;
	        h.add(parameters, "fresnelExponent", 0.0, 5.0, 0.025).name("fresnel exponent").onChange(function(value) { updateCallback("fresnelExponent", value); });
	        h.add(parameters, "fresnelReflectionScale", 0.0, 1.0, 0.025).name("fresnel scale").onChange(function(value) { updateCallback("fresnelReflectionScale", value); });
	      }
	      
	      if (shader.isEnable('REFLECTION')) {
	        parameters.reflectionStrength = shader.uniforms.reflectionStrength.value;
	        h.add(parameters, "reflectionStrength", 0.0, 1.0, 0.025).name("reflectionStrength").onChange(function(value) { updateCallback("reflectionStrength", value); });
	      }
	        
	      if (shader.isEnable('PHONG')) {
	        parameters.shininess = shader.uniforms.shininess.value;
	        h.add(parameters, "shininess", 1.0, 400.0, 1.0).onChange(function(value) { updateCallback("shininess", value); });
	      }
	      
	      if (shader.isEnable(['+PHONG', '+SPECULARMAP'])) {
	        parameters.specularStrength = shader.uniforms.specularStrength.value;
	        h.add(parameters, "specularStrength", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("specularStrength", value); });
	      }
	      
	      if (shader.isEnable('ANISOTROPY')) {
	        parameters.anisotropyExponent = shader.uniforms.anisotropyExponent.value;
	        parameters.anisotropyStrength = shader.uniforms.anisotropyStrength.value;
	        parameters.anisotropyFresnel = shader.uniforms.anisotropyFresnel.value;
	        parameters.anisotropyColor = shader.uniforms.anisotropyColor.value.getHex();
	        h.add(parameters, "anisotropyExponent", 0.0, 5000.0, 1.0).onChange(function(value) { updateCallback("anisotropyExponent", value); });
	        h.add(parameters, "anisotropyStrength", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("anisotropyStrength", value); });
	        h.add(parameters, "anisotropyFresnel", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("anisotropyFresnel", value); });
	        h.addColor(parameters, "anisotropyColor").onChange(function(value) {
	          shader.uniforms.anisotropyColor.value.setHex(value);
	          callback("anisotropyColor", value);
	        });
	      }
	    }
	    
	    if (shader.isEnable(['+NORMALMAP', '+BUMPMAP', '+PARALLAXMAP'])) {
	      h = gui.addFolder("Bump");
	      
	      if (shader.isEnable(['+NORMALMAP', '+BUMPMAP'])) {
	        parameters.bumpiness = shader.uniforms.bumpiness.value;
	        h.add(parameters, "bumpiness", 0.0, 1.0, 0.01).onChange(function(value) { updateCallback("bumpiness", value); });
	      }
	      
	      if (shader.isEnable('PARALLAXMAP')) {
	        parameters.parallaxHeight = shader.uniforms.parallaxHeight.value;
	        parameters.parallaxScale = shader.uniforms.parallaxScale.value;
	        h.add(parameters, "parallaxHeight", -1.0, 1.0, 0.025).onChange(function(value) { updateCallback("parallaxHeight", value); });
	        h.add(parameters, "parallaxScale", -1.0, 1.0, 0.025).onChange(function(value) { updateCallback("parallaxScale", value); });
	      }
	    }
	    
	    if (shader.isEnable(['BUMPOFFSET'])) {
	      h = gui.addFolder("Parallax");
	      parameters.parallaxHeight = shader.uniforms.parallaxHeight.value;
	      h.add(parameters, "parallaxHeight", 0.0, 0.5, 0.001).onChange(function(value) { updateCallback("parallaxHeight", value); });
	    }
	    
	    if (shader.isEnable("AOMAP")) {
	      h = gui.addFolder("Ambient Occlusion");
	      parameters.aoStrength = shader.uniforms.aoStrength.value;
	      h.add(parameters, "aoStrength", 0.0, 1.0, 0.01).onChange(function(value) { updateCallback("aoStrength", value); });
	    }
	    
	    if (shader.isEnable('VELVET')) {
	      h = gui.addFolder("Velvet");
	      
	      parameters.surfaceColor = shader.uniforms.surfaceColor.value.getHex();
	      parameters.fuzzySpecColor = shader.uniforms.fuzzySpecColor.value.getHex();
	      parameters.subColor = shader.uniforms.subColor.value.getHex();
	      parameters.rollOff = shader.uniforms.rollOff.value;
	      parameters.velvetStrength = shader.uniforms.velvetStrength.value;
	      h.addColor(parameters, "surfaceColor").onChange(function(value) {
	        shader.unifomrs.surfaceColor.value.setHex(value);
	        callback("surfaceColor", value);
	      });
	      h.addColor(parameters, "fuzzySpecColor").onChange(function(value) {
	        shader.uniforms.fuzzySpecColor.value.setHex(value);
	        callback("fuzzySpecColor", value);
	      });
	      h.addColor(parameters, "subColor").onChange(function(value) {
	        shader.uniforms.subColor.value.setHex(value);
	        callback("subColor", value);
	      });
	      h.add(parameters, "rollOff", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("rollOff", value); });
	      h.add(parameters, "velvetStrength", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("velvetStrength", value); });
	    }
	    
	    if (shader.isEnable('INNERGLOW')) {
	      h = gui.addFolder("InnerGlow");
	      
	      parameters.innerGlowColor = shader.uniforms.innerGlowColor.value.getHex();
	      parameters.innerGlowBase = shader.uniforms.innerGlowBase.value;
	      parameters.innerGlowSub = shader.uniforms.innerGlowSub.value;
	      parameters.innerGlowRange = shader.uniforms.innerGlowRange.value;
	      h.addColor(parameters, "innerGlowColor").onChange(function(value) {
	        shader.uniforms.innerGlowColor.value.setHex(value);
	        callback("innerGlowColor", value);
	      });
	      h.add(parameters, "innerGlowBase", 0.0, 128.0, 0.1).onChange(function(value) { updateCallback("innerGlowBase", value); });
	      h.add(parameters, "innerGlowSub", 0.0, 10.0, 0.05).onChange(function(value) { updateCallback("innerGlowSub", value); });
	      h.add(parameters, "innerGlowRange", 0.0, 1.0, 0.05).onChange(function(value) { updateCallback("innerGlowRange", value); });
	    }
	    
	    if (shader.isEnable('LINEGLOW')) {
	      h = gui.addFolder("LineGlow");
	      
	      parameters.lineGlowRange = shader.uniforms.lineGlowRange.value;
	      parameters.lineGlowPower = shader.uniforms.lineGlowPower.value;
	      parameters.lineGlowPlaneX = shader.uniforms.lineGlowPlane.value.x;
	      parameters.lineGlowPlaneY = shader.uniforms.lineGlowPlane.value.y;
	      parameters.lineGlowPlaneZ = shader.uniforms.lineGlowPlane.value.z;
	      
	      var cb = function(value) {
	        shader.uniforms.lineGlowPlane.value.set(parameters.lineGlowPlaneX, parameters.lineGlowPlaneY, parameters.lineGlowPlaneZ,
	          shader.uniforms.lineGlowPlane.value.w);
	        callback("lienGlowPlane", shader.uniforms.lineGlowPlane.value);
	      };
	      
	      // h.addColor(effectparametersController, "lineGlowColor").onChange(callback);
	      h.add(parameters, "lineGlowRange", 0.0, 5.0, 0.05).onChange(function(value) { updateCallback("lineGlowRange", value); });
	      h.add(parameters, "lineGlowPower", 0.0, 10.0, 0.05).onChange(function(value) { updateCallback("lineGlowPower", value); });
	      h.add(parameters, "lineGlowPlaneX", 0.0, 1.0, 0.05).onChange(cb);
	      h.add(parameters, "lineGlowPlaneY", 0.0, 1.0, 0.05).onChange(cb);
	      h.add(parameters, "lineGlowPlaneZ", 0.0, 1.0, 0.05).onChange(cb);
	    }
	    
	    if (shader.isEnable('DISTORTION')) {
	      h = gui.addFolder("Distortion");
	      
	      parameters.distortionStrength = shader.uniforms.distortionStrength.value;
	      h.add(parameters, "distortionStrength", -5.0, 5.0, 0.05).onChange(function(value) { updateCallback("distortionStrength", value); });
	    }
	    
	    if (shader.isEnable('UVSCROLL')) {
	      h = gui.addFolder('UV Scroll');
	      
	      parameters.uvScrollSpeedU = shader.uniforms.uvScrollSpeedU.value;
	      parameters.uvScrollSpeedV = shader.uniforms.uvScrollSpeedV.value;
	      h.add(parameters, "uvScrollSpeedU", -5.0, 5.0, 0.01).onChange(function(value) { updateCallback("uvScrollSpeedU", value); });
	      h.add(parameters, "uvScrollSpeedV", -5.0, 5.0, 0.01).onChange(function(value) { updateCallback("uvScrollSpeedV", value); });
	    }
	    
	    if (shader.isEnable('GLASS')) {
	      h = gui.addFolder('Glass');
	      
	      parameters.glassStrength = shader.uniforms.glassStrength.value;
	      parameters.glassCurvature = shader.uniforms.glassCurvature.value;
	      h.add(parameters, "glassStrength", 0.0, 1.0, 0.01).onChange(function(value) { updateCallback("glassStrength", value); });
	      h.add(parameters, "glassCurvature", 0.0, 2.0, 0.01).onChange(function(value) { updateCallback("glassCurvature", value); });
	    }
	    
	    if (shader.isEnable('AMBIENT')) {
	      h = gui.addFolder("Ambient Light");
	      
	      parameters.ambientColor = shader.uniforms.ambientColor.value.getHex();
	      h.addColor(parameters, "ambientColor").onChange(function(value) {
	        shader.uniforms.ambientColor.value.setHex(value);
	        callback("ambientColor", value);
	      });
	      
	      if (shader.isEnable('HEMISPHERE')) {
	        // var skyDirectionCallback = function(value) {
	        //   shader.uniforms.skyDirection.value.set(parameters.skyDirectionX, parameters.skyDirectionY, parameters.skyDirectionZ);
	        //   callback("skyDirection", shader.uniforms.skyDirection.value);
	        // };
	        
	        parameters.skyDirectionX = shader.uniforms.skyDirection.value.x;
	        parameters.skyDirectionY = shader.uniforms.skyDirection.value.y;
	        parameters.skyDirectionZ = shader.uniforms.skyDirection.value.z;
	        parameters.groundColor = shader.uniforms.groundColor.value.getHex();
	        h.add(parameters, "skyDirectionX", 0.0, 1.0, 0.025).onChange(function(value) { callback("skyDirectionX", value); });
	        h.add(parameters, "skyDirectionY", 0.0, 1.0, 0.025).onChange(function(value) { callback("skyDirectionY", value); });
	        h.add(parameters, "skyDirectionZ", 0.0, 1.0, 0.025).onChange(function(value) { callback("skyDirectionZ", value); });
	        // h.add(parameters, "skyDirectionX", 0.0, 1.0, 0.025).onChange(skyDirectionCallback);
	        // h.add(parameters, "skyDirectionY", 0.0, 1.0, 0.025).onChange(skyDirectionCallback);
	        // h.add(parameters, "skyDirectionZ", 0.0, 1.0, 0.025).onChange(skyDirectionCallback);
	        h.addColor(parameters, "groundColor").onChange(function(value) {
	          shader.uniforms.groundColor.value.setHex(value);
	          callback("groundColor", value);
	        });
	      }
	    }
	    
	    var numDirectLight = shader.enables['DIRECTLIGHT'] || 0;
	    var numPointLight = shader.enables['POINTLIGHT'] || 0;
	    var numSpotLight = shader.enables['SPOTLIGHT'] || 0;
	    if (numDirectLight > 0 || numPointLight > 0 || numSpotLight > 0) {
	      
	      if (numDirectLight > 0) {
	        h = gui.addFolder("Direct Light");
	        
	        parameters.directLightX = shader.uniforms.directLights.value[0].direction.x;
	        parameters.directLightY = shader.uniforms.directLights.value[0].direction.y;
	        parameters.directLightZ = shader.uniforms.directLights.value[0].direction.z;
	        parameters.directLightColor = shader.uniforms.directLights.value[0].color.getHex();
	        
	        // var directLightDirCallback = function(value) {
	        //   shader.uniforms.directLights.value[0].direction.set(parameters.directLightX, parameters.directLightY, parameters.directLightZ).normalize();
	        //   callback("directLightDirection", shader.uniforms.directLights.value[0].direction);
	        // };
	        // h.add(parameters, "directLightX", -1.0, 1.0, 0.025).name("x").onChange(directLightDirCallback);
	        // h.add(parameters, "directLightY", -1.0, 1.0, 0.025).name("y").onChange(directLightDirCallback);
	        // h.add(parameters, "directLightZ", -1.0, 1.0, 0.025).name("z").onChange(directLightDirCallback);
	        h.add(parameters, "directLightX", -1.0, 1.0, 0.025).name("x").onChange(function(value) { callback("directLightX", value); });
	        h.add(parameters, "directLightY", -1.0, 1.0, 0.025).name("y").onChange(function(value) { callback("directLightY", value); });
	        h.add(parameters, "directLightZ", -1.0, 1.0, 0.025).name("z").onChange(function(value) { callback("directLightZ", value); });
	        h.addColor(parameters, "directLightColor").name("color").onChange(function(value) {
	          shader.uniforms.directLights.value[0].color.setHex(value);
	          callback("directLightColor", value);
	        });
	      }
	      
	      if (numPointLight > 0) {
	        h = gui.addFolder("Point Light");
	        
	        parameters.pointLightX = shader.uniforms.pointLights.value[0].position.x;
	        parameters.pointLightY = shader.uniforms.pointLights.value[0].position.y;
	        parameters.pointLightZ = shader.uniforms.pointLights.value[0].position.z;
	        parameters.pointLightColor = shader.uniforms.pointLights.value[0].color.getHex();
	        parameters.pointLightDistance = shader.uniforms.pointLights.value[0].distance;
	        parameters.pointLightDecay = shader.uniforms.pointLights.value[0].decay;
	        // var pointLightPosCallback = function(value) {
	        //   shader.uniforms.pointLights.value[0].position.set(parameters.pointLightX, parameters.pointLightY, parameters.pointLightZ);
	        //   callback("pointLightPosition", shader.uniforms.pointLights.value[0].position);
	        // };
	        // 
	        // h.add(parameters, "pointLightX", -10.0, 10.0, 0.025).name("x").onChange(pointLightPosCallback);
	        // h.add(parameters, "pointLightY", -10.0, 10.0, 0.025).name("y").onChange(pointLightPosCallback);
	        // h.add(parameters, "pointLightZ", -10.0, 10.0, 0.025).name("z").onChange(pointLightPosCallback);
	        h.add(parameters, "pointLightX", -10.0, 10.0, 0.025).name("x").onChange(function(value) { callback("pointLightX", value); });
	        h.add(parameters, "pointLightY", -10.0, 10.0, 0.025).name("y").onChange(function(value) { callback("pointLightY", value); });
	        h.add(parameters, "pointLightZ", -10.0, 10.0, 0.025).name("z").onChange(function(value) { callback("pointLightZ", value); });
	        h.addColor(parameters, "pointLightColor").name("color").onChange(function(value) {
	          shader.uniforms.pointLights.value[0].color.setHex(value);
	          callback("pointLightColor", value);
	        });
	        h.add(parameters, "pointLightDistance", 0.0, 100.0, 1.0).onChange(function(value) {
	          shader.uniforms.pointLights.value[0].distance = value;
	          callback("pointLightDistance", value);
	        });
	        h.add(parameters, "pointLightDecay", 0.0, 10.0, 0.025).onChange(function(value) {
	          shader.uniforms.pointLights.value[0].decay = value;
	          callback("pointLightDecay", value);
	        });
	      }
	      
	      if (numSpotLight > 0) {
	        h = gui.addFolder("Spot Light");
	        
	        parameters.spotLightX = shader.uniforms.spotLights.value[0].position.x;
	        parameters.spotLightY = shader.uniforms.spotLights.value[0].position.y;
	        parameters.spotLightZ = shader.uniforms.spotLights.value[0].position.z;
	        parameters.spotLightColor = shader.uniforms.spotLights.value[0].color.getHex();
	        parameters.spotLightDistance = shader.uniforms.spotLights.value[0].distance;
	        parameters.spotLightDecay = shader.uniforms.spotLights.value[0].decay;
	        parameters.spotLightAngle = shader.uniforms.spotLights.value[0].coneCos;
	        parameters.spotLightPenumbra = shader.uniforms.spotLights.value[0].penumbraCos;
	        // var spotLightPosCallback = function(value) {
	        //   shader.uniforms.spotLights.value[0].position.set(parameters.spotLightX, parameters.spotLightY, parameters.spotLightZ);
	        //   shader.uniforms.spotLights.value[0].direction.copy(shader.uniforms.spotLights.value[0].position).normalize();
	        //   callback("spotLightPosition", shader.uniforms.spotLights.value[0].position);
	        // };
	        // 
	        // h.add(parameters, "spotLightX", -10.0, 10.0, 0.025).name("x").onChange(spotLightPosCallback);
	        // h.add(parameters, "spotLightY", -10.0, 10.0, 0.025).name("y").onChange(spotLightPosCallback);
	        // h.add(parameters, "spotLightZ", -10.0, 10.0, 0.025).name("z").onChange(spotLightPosCallback);
	        h.add(parameters, "spotLightX", -10.0, 10.0, 0.025).name("x").onChange(function(value) { callback("spotLightX", value); });
	        h.add(parameters, "spotLightY", -10.0, 10.0, 0.025).name("y").onChange(function(value) { callback("spotLightY", value); });
	        h.add(parameters, "spotLightZ", -10.0, 10.0, 0.025).name("z").onChange(function(value) { callback("spotLightZ", value); });
	        h.addColor(parameters, "spotLightColor").name("color").onChange(function(value) {
	          shader.uniforms.spotLights.value[0].color.setHex(value);
	          callback("spotLightColor", value);
	        });
	        h.add(parameters, "spotLightDistance", 0.0, 50.0, 1.0).onChange(function(value) {
	          shader.uniforms.spotLights.value[0].distance = value;
	          callback("spotLightDistance", value); 
	        });
	        h.add(parameters, "spotLightDecay", 1.0, 10.0, 0.025).onChange(function(value) {
	          shader.uniforms.spotLights.value[0].decay = value;
	          callback("spotLightDecay", value); 
	        });
	        h.add(parameters, "spotLightAngle", 0.0001, Math.PI/2.0, 0.025).onChange(function(value) {
	          shader.uniforms.spotLights.value[0].coneCos = Math.cos(value);
	          callback("spotLightConeCos", value); 
	        });
	        h.add(parameters, "spotLightPenumbra", 0.0, 1.0, 0.025).onChange(function(value) {
	          shader.uniforms.spotLights.value[0].penumbraCos = Math.cos(parameters.spotLightAngle * (1.0 - value));
	          callback("spotLightPenumbraCos", value); 
	        });
	      }
	    }
	    
	    if (shader.isEnable('RIMLIGHT')) {
	      h = gui.addFolder("Rim Light");
	      
	      parameters.rimLightColor = shader.uniforms.rimLightColor.value.getHex();
	      parameters.rimLightCoef = shader.uniforms.rimLightCoef.value;
	      h.addColor(parameters, "rimLightColor").onChange(function(value) {
	        shader.uniforms.rimLightColor.value.setHex(value);
	        callback("rimLightColor", value);
	      });
	      h.add(parameters, "rimLightCoef", 0.0, 1.0, 0.05).onChange(function(value) { updateCallback("rimLightCoef", value); });
	    }
	    
	    if (shader.isEnable('LIGHTMAP')) {
	      h = gui.addFolder('Light Map');
	      
	      parameters.lightMapPower = shader.uniforms.lightMapPower.value;
	      parameters.lightMapStrength = shader.uniforms.lightMapStrength.value;
	      h.add(parameters, "lightMapPower", 0.0, 10.0, 0.025).onChange(function(value) { updateCallback("lightMapPower", value); });
	      h.add(parameters, "lightMapStrength", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("lightMapStrength", value); });
	    }

	    if (shader.isEnable(['+FOG', '+HEIGHTFOG'])) {
	      h = gui.addFolder("Fog");
	      
	      if (shader.isEnable('FOG')) {
	        parameters.fogAlpha = shader.uniforms.fogAlpha.value;
	        parameters.fogFar = shader.uniforms.fogFar.value;
	        parameters.fogNear = shader.uniforms.fogNear.value;
	        parameters.fogColor = shader.uniforms.fogColor.value.getHex();
	        h.add(parameters, "fogAlpha", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("fogAlpha", value); });
	        h.add(parameters, "fogFar", 0.0, 100.0, 0.1).onChange(function(value) { updateCallback("fogFar", value); });
	        h.add(parameters, "fogNear", 0.0, 100.0, 0.1).onChange(function(value) { updateCallback("fogNear", value); });
	        h.addColor(parameters, "fogColor").onChange(function(value) {
	          shader.uniforms.fogColor.value.setHex(value);
	          callback("fogColor", value);
	        });
	      }
	      
	      if (shader.isEnable("HEIGHTFOG")) {
	        parameters.heightFogAlpha = shader.uniforms.heightFogAlpha.value;
	        parameters.heightFogFar = shader.uniforms.heightFogFar.value;
	        parameters.heightFogNear = shader.uniforms.heightFogNear.value;
	        parameters.heightFogColor = shader.uniforms.heightFogColor.value.getHex();
	        h.add(parameters, "heightFogAlpha", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("heightFogAlpha", value); });
	        h.add(parameters, "heightFogFar", 0.0, 100.0, 0.1).onChange(function(value) { updateCallback("heightFogFar", value); });
	        h.add(parameters, "heightFogNear", 0.0, 100.0, 0.1).onChange(function(value) { updateCallback("heightFogNear", value); });
	        h.addColor(parameters, "heightFogColor").onChange(function(value) {
	          shader.uniforms.heightFogColor.value.setHex(value);
	          callback("heightFogColor", value);
	        });
	      }
	    }
	    
	    // if (shader.isEnable("PROJECTIONMAP")) {
	    //   h = gui.addFolder("Projection Map");
	    //   
	    //   parameters.projectionScale = shader.uniforms.projectionScale.value;
	    //   h.add(parameters, "projectionScale", 0.0, 10.0, 0.025).onChange(function(value) { updateCallback("projectionScale", value); });
	    // }
	    
	    if (shader.isEnable('DISPLACEMENT')) {
	      h = gui.addFolder("Displacement");
	      
	      parameters.displacementScale = shader.uniforms.displacementScale.value;
	      parameters.displacementBias = shader.uniforms.displacementBias.value;
	      h.add(parameters, "displacementScale", 0.0, 10.0, 0.025).onChange(function(value) { updateCallback("displacementScale", value); });
	      h.add(parameters, "displacementBias", 0.0, 10.0, 0.025).onChange(function(value) { updateCallback("displacementBias", value); });
	    }
	    
	    if (shader.isEnable("SKY")) {
	      h = gui.addFolder("Sky");
	      
	      parameters.skyTurbidity = shader.uniforms.skyTurbidity.value;
	      parameters.skyRayleigh = shader.uniforms.skyRayleigh.value;
	      parameters.skyMieCoefficient = shader.uniforms.skyMieCoefficient.value;
	      parameters.skyMieDirectionalG = shader.uniforms.skyMieDirectionalG.value;
	      parameters.skyLuminance = shader.uniforms.skyLuminance.value;
	      // parameters.skyInclinataion = shader.uniforms.skyInclination.value;
	      // parameters.skyAzimuth = shader.uniforms.skyAzimuth.value;
	      h.add(parameters, "skyTurbidity", 1.0, 20.0, 0.1).onChange(function(value) { updateCallback("skyTurbidity", value); });
	      h.add(parameters, "skyRayleigh", 0.0, 4.0, 0.001).onChange(function(value) { updateCallback("skyRayleigh", value); });
	      h.add(parameters, "skyMieCoefficient", 0.0, 0.1, 0.001).onChange(function(value) { updateCallback("skyMieCoefficient", value); });
	      h.add(parameters, "skyMieDirectionalG", 0.0, 1.0, 0.001).onChange(function(value) { updateCallback("skyMieDirectionalG", value); });
	      h.add(parameters, "skyLuminance", 0.0, 2.0, 0.1).onChange(function(value) { updateCallback("skyLuminance", value); });
	      // h.add(parameters, "skyInclination", 0, 1.0, 0.001).onChange(function(value) { updateCallback("skyInclination", value); });
	      // h.add(parameters, "skyAzimuth", 0, 1.0, 0.001).onChange(function(value) { updateCallback("skyAzimuth", value); });
	    }
	    
	    if (shader.isEnable("GRASS")) {
	      h = gui.addFolder("Grass");
	      
	      parameters.grassWindDirectionX = shader.uniforms.grassWindDirection.value.x;
	      parameters.grassWindDirectionY = shader.uniforms.grassWindDirection.value.y;
	      parameters.grassWindDirectionZ = shader.uniforms.grassWindDirection.value.z;
	      parameters.grassWindPower = shader.uniforms.grassWindPower.value;
	      
	      var grassCallback = function(value) {
	        shader.uniforms.grassWindDirection.value.set(parameters.grassWindDirectionX, parameters.grassWindDirectionY, parameters.grassWindDirectionZ);
	        callback("grassWindDirection", shader.uniforms.grassWindDirection.value);
	      };
	      
	      h.add(parameters, "grassWindDirectionX", 0.0, 1.0, 0.025).onChange(grassCallback);
	      h.add(parameters, "grassWindDirectionY", 0.0, 1.0, 0.025).onChange(grassCallback);
	      h.add(parameters, "grassWindDirectionZ", 0.0, 1.0, 0.025).onChange(grassCallback);
	      h.add(parameters, "grassWindPower", 0.0, 2.0, 0.025).onChange(function(value) { updateCallback("grassWindPower", value); });
	    }
	    
	    if (shader.isEnable("CLOUDS")) {
	      h = gui.addFolder("Clouds");
	      
	      parameters.cloudsScale = shader.uniforms.cloudsScale.value;
	      parameters.cloudsBrightness = shader.uniforms.cloudsBrightness.value;
	      // parameters.cloudsSpeed = shader.uniforms.cloudsSpeed.value;
	      h.add(parameters, "cloudsScale", 0.0, 1.0).onChange(function(value) { updateCallback("cloudsScale", value); });
	      h.add(parameters, "cloudsBrightness", 0.0, 1.0).onChange(function(value) { updateCallback("cloudsBrightness", value); });
	      // h.add(parameters, "cloudsSpeed", 0.0, 2.0).onChange(function(value) { updateCallback("cloudsSpeed", value); });
	    }
	    
	    if (shader.isEnable("GODRAY")) {
	      h = gui.addFolder("GodRay");
	      
	      parameters.godRayStrength = shader.uniforms.godRayStrength.value;
	      parameters.godRayIntensity = shader.uniforms.godRayIntensity.value;
	      parameters.godRaySunColor = shader.uniforms.godRaySunColor.value.getHex();
	      parameters.godRayBgColor = shader.uniforms.godRayBgColor.value.getHex();
	      h.add(parameters, "godRayStrength", 0.0, 1.0).onChange(function(value) { updateCallback("godRayStrength", value); });
	      h.add(parameters, "godRayIntensity", 0.0, 2.0).onChange(function(value) { updateCallback("godRayIntensity", value); });
	      h.addColor(parameters, "godRaySunColor").onChange(function(value) {
	        shader.uniforms.godRaySunColor.value.setHex(value);
	        callback("godRaySunColor", value);
	      });
	      h.addColor(parameters, "godRayBgColor").onChange(function(value) {
	        shader.uniforms.godRayBgColor.value.setHex(value);
	        callback("godRayBgColor", value);
	      });
	    }
	    
	    if (shader.isEnable("RECEIVESHADOW")) {
	      h = gui.addFolder("Shadow");
	      
	      parameters.shadowBias = shader.uniforms.shadowBias.value;
	      parameters.shadowDensity = shader.uniforms.shadowDensity.value;
	      h.add(parameters, "shadowBias", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("shadowBias", value); });
	      h.add(parameters, "shadowDensity", 0.0, 1.0, 0.025).onChange(function(value) { updateCallback("shadowDensity", value); });
	    }
	    
	    if (shader.isEnable("TONEMAPPING")) {
	      h = gui.addFolder("ToneMapping", 0, 10);
	      
	      parameters.toneMappingExposure = shader.uniforms.toneMappingExposure.value;
	      parameters.toneMappingWhitePoint = shader.uniforms.toneMappingWhitePoint.value;
	      h.add(parameters, "toneMappingExposure", 0.0, 10.0).onChange(function(value) { updateCallback("toneMappingExposure", value); });
	      h.add(parameters, "toneMappingWhitePoint", 0.0, 10.0).onChange(function(value) { updateCallback("toneMappingWhitePoint", value); });
	    }
	    
	    return {gui: gui, parameters: parameters};
	  }
	};

	function Shader() {
	  this.enables = {};
	  this.uniforms = [];
	  this.material = null;
	}

	Object.assign(Shader.prototype, {
	  
	  enable: function(key, value) {
	    this.enables[key] = (value === undefined) ? 1 : value;
	  },
	  
	  clear: function() {
	    this.enables = {};
	  },
	  
	  setParameter: function(key, value) {
	    if (key in this.uniforms) {
	      if (this.uniforms[key].value instanceof THREE.Color) {
	        if (value instanceof THREE.Color) {
	          this.uniforms[key].value.copy(value);  
	        }
	        else {
	          this.uniforms[key].value.copy(new THREE.Color(value));
	        }
	      }
	      else if (this.uniforms[key].value instanceof THREE.Color ||
	          this.uniforms[key].value instanceof THREE.Vector2 ||
	          this.uniforms[key].value instanceof THREE.Vector3 ||
	          this.uniforms[key].value instanceof THREE.Vector4 ||
	          this.uniforms[key].value instanceof THREE.Matrix3 ||
	          this.uniforms[key].value instanceof THREE.Matrix4) {
	        this.uniforms[key].value.copy(value);
	      }
	      else if (this.uniforms[key].value instanceof THREE.CubeTexture ||
	               this.uniforms[key].value instanceof THREE.Texture) {
	        this.uniforms[key].value = value;
	      }
	      else if (this.uniforms[key].value instanceof Array) {
	        for (var i=0; i<value.length; ++i) {
	          this.uniforms[key].value[i] = value[i];
	        }
	      }
	      else {
	        this.uniforms[key].value = value;
	      }
	    }
	  },
	  
	  setParameters: function(values) {
	    for (var key in values) {
	      this.setParameter(key, values[key]);
	    }
	  },
	  
	  setArrayParameter: function(arrayKey, index , key, value) {
	    if (arrayKey in this.uniforms) {
	      if (key in this.uniforms[arrayKey].value[index]) {
	        if (this.uniforms[arrayKey].value[index][key] instanceof THREE.Color ||
	            this.uniforms[arrayKey].value[index][key] instanceof THREE.Vector2 ||
	            this.uniforms[arrayKey].value[index][key] instanceof THREE.Vector3 ||
	            this.uniforms[arrayKey].value[index][key] instanceof THREE.Vector4 ||
	            this.uniforms[arrayKey].value[index][key] instanceof THREE.Matrix3 ||
	            this.uniforms[arrayKey].value[index][key] instanceof THREE.Matrix4) {
	          this.uniforms[arrayKey].value[index][key].copy(value);
	        }
	        else if (this.uniforms[arrayKey].value[index][key] instanceof THREE.CubeTexture ||
	                 this.uniforms[arrayKey].value[index][key] instanceof THREE.Texture) {
	          this.uniforms[arrayKey].value[index][key] = value;
	        }
	        else if (this.uniforms[arrayKey].value[index][key] instanceof Array) {
	          for (var i=0; i<value.length; ++i) {
	            this.uniforms[arrayKey].value[index][key][i] = value[i];
	          }
	        }
	        else {
	          this.uniforms[arrayKey].value[index][key] = value;
	        }
	      }
	    }
	  },
	  
	  setLightParameter: function(index, light, camera) {
	    
	    camera.updateMatrixWorld();
	    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
	    
	    if (light instanceof THREE.DirectionalLight) {
	      var direction = light.position.clone().applyMatrix4(camera.matrixWorldInverse);
	      var targetPos = light.target.position.clone().applyMatrix4(camera.matrixWorldInverse);
	      direction.sub(targetPos).normalize();
	      this.setDirectLightParameter(index, direction, light.color);
	    }
	    else if (light instanceof THREE.PointLight) {
	      var viewPos = light.position.clone();
	      viewPos.applyMatrix4(camera.matrixWorldInverse);
	      this.setPointLightParameter(index, viewPos, light.color, light.distance, light.decay);
	    }
	    else if (light instanceof THREE.SpotLight) {
	      var viewPos = light.position.clone();
	      viewPos.applyMatrix4(camera.matrixWorldInverse);
	      var viewDir = viewPos.clone().normalize();
	      this.setSpotLightParameter(index, viewPos, viewDir, light.color, light.distance, light.decay,
	        Math.cos(light.angle), Math.cos(light.angle * (1.0 - light.penumbra)));
	    }
	    else if (light instanceof THREE.AmbientLight) {
	      this.setParameter("ambientColor", light.color);
	    }
	    else if (light instanceof PIXY.AreaLight) {
	      var viewPos = light.position.clone();
	      viewPos.applyMatrix4(camera.matrixWorldInverse);
	      this.setAreaLightParameter(index, viewPos, light.color, light.distance, light.decay, light.radius);
	    }
	    else if (light instanceof PIXY.TubeLight) {
	      var start = new THREE.Vector3().copy(light.start);
	      start.applyMatrix4(camera.matrixWorldInverse);
	      var end = new THREE.Vector3().copy(light.end);
	      end.applyMatrix4(camera.matrixWorldInverse);
	      this.setTubeLightParameter(index, start, end, light.color, light.distance, light.decay, light.radius);
	    }
	    else if (light instanceof PIXY.RectLight) {
	      
	      var matrix = new THREE.Matrix4();
	      matrix.copy(camera.matrixWorldInverse);
	      matrix.multiply(light.matrix);
	      
	      var positions = [];
	      for (var i=0; i<light.positions.length; ++i) {
	        var p = new THREE.Vector3().copy(light.positions[i]);
	        p.applyMatrix4(matrix);
	        positions.push(p);
	      }
	      
	      var normal = new THREE.Vector3(0,0,1).applyMatrix4(matrix);
	      var tangent = new THREE.Vector3(1,0,0).applyMatrix4(matrix);
	      
	      this.setRectLightParameter(index, positions, normal, tangent, light.width, light.height, light.color, light.intensity, light.distance, light.decay);
	    }
	  },
	  
	  setDirectLightParameter: function(index, direction, color) {
	    this.setArrayParameter("directLights", index, "direction", direction);
	    this.setArrayParameter("directLights", index, "color", color);
	  },
	  
	  setPointLightParameter: function(index, position, color, distance, decay) {
	    this.setArrayParameter("pointLights", index, "position", position);
	    this.setArrayParameter("pointLights", index, "color", color);
	    this.setArrayParameter("pointLights", index, "distance", distance);
	    this.setArrayParameter("pointLights", index, "decay", decay);
	  },
	  
	  setSpotLightParameter: function(index, position, direction, color, distance, decay, coneCos, penumbraCos) {
	    this.setArrayParameter("spotLights", index, "position", position);
	    this.setArrayParameter("spotLights", index, "direction", direction);
	    this.setArrayParameter("spotLights", index, "color", color);
	    this.setArrayParameter("spotLights", index, "distance", distance);
	    this.setArrayParameter("spotLights", index, "decay", decay);
	    this.setArrayParameter("spotLights", index, "coneCos", coneCos);
	    this.setArrayParameter("spotLights", index, "penumbraCos", penumbraCos);
	  },
	  
	  setAreaLightParameter: function(index, position, color, distance, decay, radius) {
	    this.setArrayParameter("areaLights", index, "position", position);
	    this.setArrayParameter("areaLights", index, "color", color);
	    this.setArrayParameter("areaLights", index, "distance", distance);
	    this.setArrayParameter("areaLights", index, "decay", decay);
	    this.setArrayParameter("areaLights", index, "radius", radius);
	  },
	  
	  setTubeLightParameter: function(index, start, end, color, distance, decay, radius) {
	    this.setArrayParameter("tubeLights", index, "start", start);
	    this.setArrayParameter("tubeLights", index, "end", end);
	    this.setArrayParameter("tubeLights", index, "color", color);
	    this.setArrayParameter("tubeLights", index, "distance", distance);
	    this.setArrayParameter("tubeLights", index, "decay", decay);
	    this.setArrayParameter("tubeLights", index, "radius", radius);
	  },
	  
	  setRectLightParameter: function(index, positions, normal, tangent, width, height, color, intensity, distance, decay) {
	    this.setArrayParameter("rectLights", index, "numPositions", positions.length);
	    for (var i=0; i<positions.length; ++i) {
	      this.uniforms.rectLights.value[index].positions[i].copy(positions[i]);
	    }
	    this.setArrayParameter("rectLights", index, "normal", normal);
	    this.setArrayParameter("rectLights", index, "tangent", tangent);
	    this.setArrayParameter("rectLights", index, "width", width);
	    this.setArrayParameter("rectLights", index, "height", height);
	    this.setArrayParameter("rectLights", index, "color", color);
	    this.setArrayParameter("rectLights", index, "intensity", intensity);
	    this.setArrayParameter("rectLights", index, "distance", distance);
	    this.setArrayParameter("rectLights", index, "decay", decay);
	  },
	  
	  ////////////////////////////////////////////////////////////////////////////
	  
	  // +AAA : OR
	  // -BBB : NOT
	  isEnable: function(keys) {
	    
	    if (!keys) return true;
	    
	    if (keys instanceof Array) {
	      if (keys.length === 0) {
	        return true;
	      }
	    
	      var check = 0;
	      for (var i in keys) {
	        if (keys[i][0] === '-') {
	          if (this.isEnable(keys[i].substr(1))) {
	            return false;
	          }
	        }
	        else if (keys[i][0] === '+') {
	          if (check === 0) {
	            check = 1;
	          }
	          if (this.isEnable(keys[i].substr(1))) {
	            check = 2;
	          }
	        }
	        else {
	          if (this.isEnable(keys[i]) === false) {
	            return false;
	          }
	        }
	      }
	      
	      if (check > 0 && check < 2) {
	        return false;
	      }
	      
	      return true;
	    }
	    else {
	      return keys in this.enables;
	    }
	    
	    return false;
	  },
	  
	  _addUniform: function(uniforms, keys, chunk) {
	    if (this.isEnable(keys)) {
	      uniforms.push(ShaderChunk[chunk]);
	    }
	  },
	  
	  // MARK: UNIFORMS
	  _generateUniforms: function() {
	    var result = [];
	    
	    result.push({
	      "diffuseColor": { value: new THREE.Color() },
	      "opacity": { value: 1.0 },
	    });
	    
	    var numDirectLight = this.enables["DIRECTLIGHT"] || 0;
	    var numPointLight = this.enables["POINTLIGHT"] || 0;
	    var numSpotLight = this.enables["SPOTLIGHT"] || 0;
	    if (numDirectLight > 0) result.push(ShaderChunk.lightsDirectUniforms);
	    if (numPointLight > 0) result.push(ShaderChunk.lightsPointUniforms);
	    if (numSpotLight > 0) result.push(ShaderChunk.lightsSpotUniforms);
	    
	    var numAreaLight = this.enables["AREALIGHT"] || 0;
	    var numTubeLight = this.enables["TUBELIGHT"] || 0;
	    var numRectLight = this.enables["RECTLIGHT"] || 0;
	    if (numAreaLight > 0) result.push(ShaderChunk.lightsAreaLightUniforms);
	    if (numTubeLight > 0) result.push(ShaderChunk.lightsTubeLightUniforms);
	    if (numRectLight > 0) result.push(ShaderChunk.lightsRectLightUniforms);
	    
	    this._addUniform(result, ["AMBIENT"], "ambientUniforms");
	    this._addUniform(result, ["AMBIENT", "HEMISPHERE"], "ambientHemisphereUniforms");
	    this._addUniform(result, ["PHONG"], "phongUniforms");
	    this._addUniform(result, ["PHONG", "SPECULARMAP"], "specularMapUniforms");
	    this._addUniform(result, ["PHONG", "-SPECULARMAP"], "specularUniforms");
	    this._addUniform(result, ["STANDARD"], "standardUniforms");
	    this._addUniform(result, ["ROUGHNESSMAP"], "roughnessMapUniforms");
	    this._addUniform(result, ["METALNESSMAP"], "metalnessMapUniforms");
	    this._addUniform(result, ["TOON"], "toonUniforms");
	    this._addUniform(result, ["REFLECTION"], "reflectionUniforms");
	    this._addUniform(result, ["REFLECTION", "FRESNEL"], "fresnelUniforms");
	    this._addUniform(result, ["VELVET"], "velvetUniforms");
	    this._addUniform(result, ["INNERGLOW"], "innerGlowUniforms");
	    this._addUniform(result, ["LINEGLOW"], "lineGlowUniforms");
	    this._addUniform(result, ["RIMLIGHT"], "rimLightUniforms");
	    this._addUniform(result, ["COLORMAP"], "colorMapUniforms");
	    this._addUniform(result, ["COLORMAP2"], "colorMap2Uniforms");
	    this._addUniform(result, ["NORMALMAP"], "normalMapUniforms");
	    this._addUniform(result, ["BUMPMAP"], "bumpMapUniforms");
	    this._addUniform(result, ["+BUMPOFFSET","+PARALLAXMAP"], "parallaxMapUniforms");
	    this._addUniform(result, ["DISTORTION"], "distortionUniforms");
	    this._addUniform(result, ["+UVSCROLL","+UVSCROLL2"], "uvScrollUniforms");
	    this._addUniform(result, ["UVSCALE"], "uvScaleUniforms");
	    this._addUniform(result, ["GLASS"], "glassUniforms");
	    this._addUniform(result, ["ANISOTROPY"], "anisotropyUniforms");
	    this._addUniform(result, ["AOMAP"], "aoMapUniforms");
	    this._addUniform(result, ["LIGHTMAP"], "lightMapUniforms");
	    this._addUniform(result, ["BILLBOARD"], "billboardUniforms");
	    this._addUniform(result, ["FOG"], "fogUniforms");
	    this._addUniform(result, ["HEIGHTFOG"], "heightFogUniforms");
	    this._addUniform(result, ["HEIGHTFOG", "HEIGHTFOGMAP"], "heightFogMapUniforms");
	    this._addUniform(result, ["PROJECTIONMAP"], "projectionMapUniforms");
	    this._addUniform(result, ["DISPLACEMENTMAP"], "displacementMapUniforms");
	    this._addUniform(result, ["CLIPPINGPLANE"], "clippingPlaneUniforms");
	    this._addUniform(result, ["SKY"], "skyUniforms");
	    this._addUniform(result, ["SKYDOME"], "skyDomeUniforms");
	    this._addUniform(result, ["GRASS"], "grassUniforms");
	    this._addUniform(result, ["OVERLAY"], "overlayUniforms");
	    this._addUniform(result, ["OVERLAYNORMAL"], "overlayNormalUniforms");
	    this._addUniform(result, ["+DITHER"], "timeUniforms");
	    this._addUniform(result, ["CASTSHADOW"], "castShadowUniforms");
	    this._addUniform(result, ["RECEIVESHADOW"], "receiveShadowUniforms");
	    this._addUniform(result, ["DEPTHSHADOW"], "depthShadowUniforms");
	    this._addUniform(result, ["CLOUDS"], "cloudsUniforms");
	    this._addUniform(result, ["TONEMAPPING"], "toneMappingUniforms");
	    this._addUniform(result, ["DEFERRED_GEOMETRY"], "deferredGeometryUniforms");
	    this._addUniform(result, ["DEFERRED_LIGHT"], "deferredLightUniforms");
	    this._addUniform(result, ["VIEW"], "viewUniforms");
	    return THREE.UniformsUtils.clone(THREE.UniformsUtils.merge(result));
	  },
	  
	  _addCode: function(codes, keys, chunk, chunk2) {
	    if (this.isEnable(keys)) {
	      codes.push("// begin [" + chunk + "]");
	      codes.push(ShaderChunk[chunk]);
	      codes.push("// end [" + chunk + "]");
	      codes.push("");
	    }
	    else if (chunk2 !== undefined) {
	      codes.push("// begin [" + chunk2 + "]");
	      codes.push(ShaderChunk[chunk2]);
	      codes.push("// end [" + chunk2 + "]");
	      codes.push("");
	    }
	  },
	  
	  // MARK: VERTEX
	  _generateVertexShader: function() {
	    var codes = [];
	    
	    // DEFFERED
	    
	    if (this.isEnable("DEFERRED_GEOMETRY")) {
	      this._addCode(codes, [], "deferredGeometryVert");
	      return codes.join("\n");
	    }
	    if (this.isEnable("DEFERRED_LIGHT")) {
	      this._addCode(codes, [], "deferredLightVert");
	      return codes.join("\n");
	    }
	    
	    // FORWARD
	    
	    this._addCode(codes, [], "common");
	    this._addCode(codes, ["+CASTSHADOW", "+RECEIVESHADOW"], "packing");
	    this._addCode(codes, [], "worldPositionVertFragPars");
	    codes.push("varying vec3 vViewPosition;");
	    codes.push("varying vec3 vNormal;");
	    codes.push("");
	    
	    this._addCode(codes, ["+COLORMAP","+NORMALMAP","+BUMPMAP","+PROJECTIONMAP","+OVERLAY","+DEPTHSHADOW","+CLOUDS", "+VIEW"], "uvVertFragPars");
	    this._addCode(codes, ["+NORMALMAP","+BUMPOFFSET","+ANISOTROPY","+OVERLAYNORMAL"], "tangentVertPars");
	    this._addCode(codes, ["+UVSCROLL","+UVSCROLL2"], "uvScrollVertPars");
	    this._addCode(codes, ["+GLASS","+DITHER"], "screenVertPars");
	    this._addCode(codes, ["DISTORTION"], "distortionVertPars");
	    this._addCode(codes, ["ANISOTROPY"], "anisotropyVertPars");
	    this._addCode(codes, ["FOG"], "fogVertPars");
	    this._addCode(codes, ["HEIGHTFOG"], "heightFogVertPars");
	    this._addCode(codes, ["PROJECTIONMAP"], "projectionMapVertPars");
	    this._addCode(codes, ["DISPLACEMENTMAP"], "displacementMapVertPars");
	    this._addCode(codes, ["GRASS"], "grassVertPars");
	    this._addCode(codes, ["CASTSHADOW", "GRASS"], "instanceCastShadowVertPars");
	    this._addCode(codes, ["CASTSHADOW", "-GRASS"], "castShadowVertPars");
	    this._addCode(codes, ["RECEIVESHADOW"], "receiveShadowVertPars");
	    
	    if (this.isEnable(["BILLBOARD"])) {
	      this._addCode(codes, [], "billboardVertPars");
	      this._addCode(codes, [], "billboardVert");
	      this._addCode(codes, ["BILLBOARDY"], "billboardYVert", "billboardDefaultVert");
	      this._addCode(codes, ["BILLBOARDROTZ"], "billboardRotZVertEnd", "billboardVertEnd");
	    }
	    else if (this.isEnable(["CASTSHADOW"])) {
	      codes.push("void main() {");
	      this._addCode(codes, ["GRASS"], "instanceCastShadowVert");
	      this._addCode(codes, ["-GRASS"], "castShadowVert");
	    }
	    else {
	      codes.push("void main() {");
	      codes.push("  vec3 transformed = position;");
	      codes.push("  vec3 objectNormal = vec3(normal);");
	      
	      this._addCode(codes, ["DISPLACEMENTMAP"], "displacementMapVert");
	      this._addCode(codes, [], "worldPositionVert");
	      this._addCode(codes, ["GRASS"], "grassVert");
	      
	      codes.push("  vec4 mvPosition = viewMatrix * vec4(vWorldPosition, 1.0);");
	      codes.push("  vec4 hpos = projectionMatrix * mvPosition;");
	    
	      if (this.isEnable(["+NORMALMAP","+ANISOTROPY","+OVERLAYNORMAL"])) {
	        codes.push("  vNormal.xyz = inverseTransformDirection(objectNormal, modelMatrix);");
	      }
	      else {
	        codes.push("  vNormal.xyz = normalMatrix * objectNormal;");
	      }
	    
	      codes.push("  vViewPosition = -mvPosition.xyz;");
	      codes.push("");
	    }
	    
	    // chunk here
	    if (this.isEnable(["+COLORMAP","+NORMALMAP","+BUMPMAP","+OVERLAY","+DEPTHSHADOW","+CLOUDS","+VIEW"])) {
	      this._addCode(codes, ["UVPROJECTION"], "uvProjectionVert", "uvVert");
	      this._addCode(codes, ["UVSCROLL"], "uvScrollVert");
	      this._addCode(codes, ["DISTORTION"], "distortionVert");
	      this._addCode(codes, ["UVSCROLL2"], "uvScroll2Vert");
	    }
	    
	    this._addCode(codes, ["+NORMALMAP","+BUMPOFFSET","+ANISOTROPY","+OVERLAYNORMAL"], "tangentVert");
	    this._addCode(codes, ["+GLASS","+DITHER"], "screenVert");
	    this._addCode(codes, ["GLASS"], "glassVert");
	    this._addCode(codes, ["ANISOTRPY"], "anisotropyVert");
	    this._addCode(codes, ["FOG"], "fogVert");
	    this._addCode(codes, ["HEIGHTFOG"], "heightFogVert");
	    this._addCode(codes, ["PROJECTIONMAP"], "projectionMapVert");
	    this._addCode(codes, ["RECEIVESHADOW"], "receiveShadowVert");
	    
	    codes.push("  gl_Position = hpos;");
	    codes.push("}");
	    
	    return codes.join("\n");
	  },
	  
	  // MARK: FRAGMENTS
	  _generateFragmentShader: function() {
	    var codes = [];
	    
	    // DEFERRED
	    
	    if (this.isEnable("DEFERRED_GEOMETRY")) {
	      this._addCode(codes, [], "deferredGeometryFrag");
	      return codes.join("\n");
	    }
	    if (this.isEnable("DEFERRED_LIGHT")) {
	      this._addCode(codes, [], "deferredLightFrag");
	      return codes.join("\n");
	    }
	    
	    // FORWARD
	    
	    if (this.isEnable("VIEW")) {
	      this._addCode(codes, [], "viewFrag");
	      return codes.join("\n");
	    }
	    
	    this._addCode(codes, [], "common");
	    
	    if (this.isEnable(["CASTSHADOW"])) {
	      this._addCode(codes, [], "packing");
	      this._addCode(codes, [], "castShadowFragPars");
	      this._addCode(codes, ["GRASS"], "uvVertFragPars");
	      this._addCode(codes, ["GRASS"], "colorMapFragPars");
	      
	      codes.push("");
	      codes.push("void main() {");
	      
	      this._addCode(codes, ["GRASS"], "instanceColorMapDiscardFrag");
	      this._addCode(codes, [], "castShadowFrag");
	      
	      codes.push("}");
	      return codes.join("\n");
	    }
	    
	    if (this.isEnable(["DEPTHSHADOW"])) {
	      this._addCode(codes, [], "packing");
	      this._addCode(codes, [], "uvVertFragPars");
	      this._addCode(codes, [], "depthShadowFragPars");
	      
	      codes.push("");
	      codes.push("void main() {");
	      
	      this._addCode(codes, [], "depthShadowFrag");
	      
	      codes.push("}");
	      return codes.join("\n");
	    }
	    
	    if (this.isEnable(["DEPTH"])) {
	      // this._addCode(codes, [], "packing");
	      this._addCode(codes, [], "depthFragPars");
	      
	      codes.push("");
	      codes.push("void main() {");
	      
	      this._addCode(codes, [], "depthFrag");
	      
	      codes.push("}");
	      return codes.join("\n");
	    }
	    
	    this._addCode(codes, ["RECEIVESHADOW"], "packing");
	    this._addCode(codes, ["AMBIENT"], "ambientFragPars");
	    this._addCode(codes, ["AMBIENT", "HEMISPHERE"], "ambientHemisphereFragPars");
	    // this._addCode(codes, ["DEPTH"], "depthFragPars");
	    
	    var numDirectLight = this.enables["DIRECTLIGHT"] || 0;
	    var numPointLight = this.enables["POINTLIGHT"] || 0;
	    var numSpotLight = this.enables["SPOTLIGHT"] || 0;
	    codes.push(this._generateLightsFragPars(numDirectLight, numPointLight, numSpotLight));
	    
	    var numAreaLight = this.enables["AREALIGHT"] || 0;
	    var numTubeLight = this.enables["TUBELIGHT"] || 0;
	    var numRectLight = this.enables["RECTLIGHT"] || 0;
	    codes.push(this._generateAreaLightsFragPars(numAreaLight, numTubeLight, numRectLight));
	    
	    codes.push("uniform vec3 diffuseColor;");
	    codes.push("uniform float opacity;");
	    codes.push("varying vec3 vNormal;");
	    codes.push("varying vec3 vViewPosition;");
	    codes.push("");
	    
	    this._addCode(codes, [], "worldPositionVertFragPars");
	    this._addCode(codes, ["STANDARD"], "bsdfs");
	    this._addCode(codes, ["STANDARD"], "standardFragPars");
	    this._addCode(codes, ["STANDARD", "ROUGHNESSMAP"], "roughnessMapFragPars");
	    this._addCode(codes, ["STANDARD", "METALNESSMAP"], "metalnessMapFragPars");
	    this._addCode(codes, ["PHONG"], "phongFragPars");
	    this._addCode(codes, ["PHONG", "SPECULARMAP"], "specularMapFragPars");
	    this._addCode(codes, ["PHONG", "-SPECULARMAP"], "specularFragPars");
	    this._addCode(codes, ["TOON"], "toonFragPars");
	    this._addCode(codes, ["REFLECTION"], "reflectionFragPars");
	    this._addCode(codes, ["REFLECTION", "FRESNEL"], "fresnelFragPars");
	    this._addCode(codes, ["REFLECTION", "-FRESNEL", "STANDARD"], "lightsPars");
	    this._addCode(codes, ["VELVET"], "velvetFragPars");
	    this._addCode(codes, ["INNERGLOW"], "innerGlowFragPars");
	    this._addCode(codes, ["LINEGLOW"], "lineGlowFragPars");
	    this._addCode(codes, ["RIMLIGHT"], "rimLightFragPars");
	    this._addCode(codes, ["+COLORMAP","+NORMALMAP","+PROJECTIONMAP","+OVERLAY","+CLOUDS"], "uvVertFragPars");
	    this._addCode(codes, ["UVSCALE"], "uvScaleFragPars");
	    this._addCode(codes, ["COLORMAP"], "colorMapFragPars");
	    this._addCode(codes, ["COLORMAP2"], "colorMap2FragPars");
	    this._addCode(codes, ["+NORMALMAP","+BUMPOFFSET","+ANISOTROPY","+OVERLAYNORMAL"], "tangentFragPars");
	    this._addCode(codes, ["NORMALMAP"], "normalMapFragPars");
	    this._addCode(codes, ["+BUMPOFFSET", "+PARALLAXMAP"], "parallaxMapFragPars");
	    this._addCode(codes, ["BUMPMAP"], "bumpMapFragPars");
	    this._addCode(codes, ["PROJECTIONMAP"], "projectionMapFragPars");
	    this._addCode(codes, ["DISTORTION"], "distortionFragPars");
	    this._addCode(codes, ["GLASS"], "glassFragPars");
	    this._addCode(codes, ["ANISOTROPY"], "anisotropyFragPars");
	    this._addCode(codes, ["AOMAP"], "aoMapFragPars");
	    this._addCode(codes, ["LIGHTMAP"], "lightMapFragPars");
	    this._addCode(codes, ["FOG"], "fogFragPars");
	    this._addCode(codes, ["HEIGHTFOG"], "heightFogFragPars");
	    this._addCode(codes, ["HEIGHTFOG", "HEIGHTFOGMAP"], "heightFogMapFragPars");
	    this._addCode(codes, ["CLIPPINGPLANE"], "clippingPlaneFragPars");
	    this._addCode(codes, ["SKY"], "skyFragPars");
	    this._addCode(codes, ["SKYDOME"], "skyDomeFragPars");
	    this._addCode(codes, ["OVERLAY"], "overlayFragPars");
	    this._addCode(codes, ["OVERLAYNORMAL"], "overlayNormalFragPars");
	    this._addCode(codes, ["DITHER"], "ditherFragPars");
	    this._addCode(codes, ["+DITHER"], "timeFragPars");
	    this._addCode(codes, ["RECEIVESHADOW"], "receiveShadowFragPars");
	    this._addCode(codes, ["CLOUDS"], "cloudsFragPars");
	    this._addCode(codes, ["TONEMAPPING"], "toneMappingFragPars");
	    
	    // if (this.check(["TONEMAPPING"])) {
	    //   codes.push("vec3 toneMapping(vec3) { return " + this.enables["TONEMAPPING"] + "ToneMapping(x); }");
	    // }
	    
	    if (numAreaLight > 0) {
	      this._addCode(codes, [], "standardAreaLightFrag");
	    }
	    if (numTubeLight > 0) {
	      this._addCode(codes, [], "standardTubeLightFrag");
	    }
	    if (numRectLight > 0) {
	      this._addCode(codes, [], "standardRectLightFrag");
	    }
	    
	    if (numDirectLight > 0 || numPointLight > 0 || numSpotLight > 0) {
	    
	      codes.push("void updateLight(inout IncidentLight directLight) {");
	        
	        this._addCode(codes, ["-SKY", "-NOLIT", "RECEIVESHADOW"], "receiveShadowFrag");
	        
	      codes.push("}");
	      codes.push("");
	      codes.push("void computeLight(const in IncidentLight directLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight) {");
	      
	        // lighting chunk here
	        this._addCode(codes, ["PHONG", "TOON"], "toonFrag");
	        this._addCode(codes, ["PHONG", "-TOON"], "phongFrag");
	        this._addCode(codes, ["STANDARD", "ORENNAYAR"], "standardOrenNayarFrag");
	        this._addCode(codes, ["STANDARD", "-ORENNAYAR"], "standardFrag");
	        this._addCode(codes, ["-STANDARD", "-PHONG"], "lambertFrag");
	        this._addCode(codes, ["VELVET"], "velvetFrag");
	        this._addCode(codes, ["RIMLIGHT"], "rimLightFrag");
	        this._addCode(codes, ["ANISOTROPY"], "anisotropyFrag");
	      
	      codes.push("}");
	      codes.push("");
	    }
	    
	    codes.push("void main() {");
	    
	      this._addCode(codes, ["CLIPPINGPLANE"], "clippingPlaneFrag");
	      this._addCode(codes, [], "beginFrag");
	      // this._addCode(codes, ["CLIPPINGPLANEALPHA"], "clippingPlaneFrag");
	      
	      // chunk here
	      this._addCode(codes, ["AMBIENT", "HEMISPHERE"], "ambientHemisphereFrag");
	      this._addCode(codes, ["AMBIENT", "-HEMISPHERE"], "ambientFrag");
	      this._addCode(codes, ["+COLORMAP", "+NORMALMAP", "+BUMPMAP", "+OVERLAY", "+CLOUDS"], "uvFrag");
	      this._addCode(codes, ["UVSPHERICAL"], "uvSphericalFrag");
	      this._addCode(codes, ["UVHEMISPHERICAL"], "uvHemiSphericalFrag");
	      this._addCode(codes, ["UVSCALE"], "uvScaleFrag");
	      this._addCode(codes, ["PARALLAXMAP"], "parallaxMapFrag");
	      this._addCode(codes, ["BUMPOFFSET"], "parallaxFrag");
	      this._addCode(codes, ["DISTORTION"], "distortionFrag");
	      this._addCode(codes, ["COLORMAP"], "colorMapFrag");
	      this._addCode(codes, ["COLORMAP", "COLORMAPALPHA"], "colorMapAlphaFrag");
	      this._addCode(codes, ["COLORMAP2"], "colorMap2Frag");
	      this._addCode(codes, ["OPACITY"], "opacityFrag");
	      this._addCode(codes, ["DITHER"], "ditherFrag");
	      this._addCode(codes, ["DISCARD"], "discardFrag");
	      this._addCode(codes, ["OVERLAY"], "overlayFrag");
	      this._addCode(codes, ["OVERLAYNORMAL"], "overlayNormalFrag");
	      this._addCode(codes, ["NORMALMAP"], "normalMapFrag");
	      this._addCode(codes, ["BUMPMAP"], "bumpMapFrag");
	      this._addCode(codes, ["PHONG", "SPECULARMAP"], "specularMapFrag");
	      this._addCode(codes, ["PHONG", "-SPECULARMAP"], "specularFrag");
	      this._addCode(codes, ["STANDARD"], "roughnessFrag");
	      this._addCode(codes, ["STANDARD", "ROUGHNESSMAP"], "roughnessMapFrag");
	      this._addCode(codes, ["STANDARD"], "metalnessFrag");
	      this._addCode(codes, ["STANDARD", "METALNESSMAP"], "metalnessMapFrag");
	      this._addCode(codes, ["STANDARD"], "lightsStandardFrag");
	      this._addCode(codes, ["SKY"], "skyFrag");
	      this._addCode(codes, ["-SKY", "NOLIT"], "nolitFrag");
	      if (this.isEnable(["-SKY", "-NOLIT"])) {
	        codes.push(this._generateLightsFrag(numDirectLight, numPointLight, numSpotLight));
	        codes.push(this._generateAreaLightsFrag(numAreaLight, numTubeLight, numRectLight));
	      }
	      this._addCode(codes, ["SKYDOME"], "skyDomeFrag");
	      this._addCode(codes, ["REFLECTION", "FRESNEL"], "fresnelFrag");
	      this._addCode(codes, ["REFLECTION", "-FRESNEL", "STANDARD"], "reflectionStandardFrag");
	      this._addCode(codes, ["REFLECTION", "-FRESNEL", "-STANDARD"], "reflectionFrag");
	      this._addCode(codes, ["LIGHTMAP"], "lightMapFrag");
	      this._addCode(codes, ["GLASS"], "glassFrag");
	      this._addCode(codes, ["AOMAP"], "aoMapFrag");
	      this._addCode(codes, ["PROJECTIONMAP"], "projectionMapFrag");
	      this._addCode(codes, ["INNERGLOW", "INNERGLOWSUBTRACT"], "innerGlowSubtractFrag");
	      this._addCode(codes, ["INNERGLOW", "-INNERGLOWSUBTRACT"], "innerGlowFrag");
	      this._addCode(codes, ["LINEGLOW"], "lineGlowFrag");
	      // this._addCode(codes, ["DEPTH"], "depthFrag");
	      this._addCode(codes, ["CLOUDS"], "cloudsFrag");
	      
	      this._addCode(codes, [], "accumulateFrag");
	      
	      this._addCode(codes, ["FOG"], "fogFrag");
	      this._addCode(codes, ["HEIGHTFOG", "HEIGHTFOGMAP"], "heightFogMapFrag");
	      this._addCode(codes, ["HEIGHTFOG", "-HEIGHTFOGMAP"], "heightFogFrag");
	      this._addCode(codes, ["TONEMAPPING"], "toneMappingFrag");
	      
	      this._addCode(codes, [], "endFrag");
	    codes.push("}");
	    
	    return codes.join("\n");
	  },
	  
	  _generateLightsFragPars: function(numDirect, numPoint, numSpot) {
	    if (numDirect <= 0 && numPoint <= 0 && numSpot <= 0) {
	      return "";
	    }
	    
	    var code = [];
	    code.push(ShaderChunk["lightsFragPars"]);
	    
	    if (numDirect > 0) {
	      code.push("#define PIXY_DIRECT_LIGHTS_NUM " + numDirect);
	      code.push("uniform DirectLight directLights[ PIXY_DIRECT_LIGHTS_NUM ];");
	    }
	    
	    if (numPoint > 0) {
	      code.push("#define PIXY_POINT_LIGHTS_NUM " + numPoint);
	      code.push("uniform PointLight pointLights[ PIXY_POINT_LIGHTS_NUM ];");
	    }
	    
	    if (numSpot > 0) {
	      code.push("#define PIXY_SPOT_LIGHTS_NUM " + numSpot);
	      code.push("uniform SpotLight spotLights[ PIXY_SPOT_LIGHTS_NUM ];");
	    }
	    
	    return code.join("\n");
	  },
	  
	  _generateAreaLightsFragPars: function(numArea, numTube, numRect) {
	    if (numArea <= 0 && numTube <= 0 && numRect <= 0) {
	      return "";
	    }
	    
	    var code = [];
	    code.push(ShaderChunk["lightsFragPars"]);
	    
	    if (numArea > 0) {
	      code.push("#define PIXY_AREA_LIGHTS_NUM " + numArea);
	      code.push("uniform AreaLight areaLights[ PIXY_AREA_LIGHTS_NUM ];");
	    }
	    
	    if (numTube > 0) {
	      code.push("#define PIXY_TUBE_LIGHTS_NUM " + numTube);
	      code.push("uniform TubeLight tubeLights[ PIXY_TUBE_LIGHTS_NUM ];");
	    }
	    
	    if (numRect > 0) {
	      code.push("#define PIXY_RECT_LIGHTS_NUM " + numRect);
	      code.push("uniform RectLight rectLights[ PIXY_RECT_LIGHTS_NUM ];");
	    }
	    
	    return code.join("\n");
	  },
	  
	  _generateLightsFrag: function(numDirect, numPoint, numSpot) {
	    if (numDirect <= 0 && numPoint <= 0 && numSpot <= 0) {
	      return "";
	    }
	    
	    var code = [];
	    
	    code.push("  IncidentLight directLight;");
	    
	    if (numDirect == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsDirectFragUnroll"]);
	    }
	    else if (numDirect > 0) {
	      code.push(ShaderChunk["lightsDirectFrag"]);
	    }
	    
	    if (numPoint == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsPointFragUnroll"]);
	    }
	    else if (numPoint > 0) {
	      code.push(ShaderChunk["lightsPointFrag"]);
	    }
	    
	    if (numSpot == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsSpotFragUnroll"]);
	    }
	    else if (numSpot > 0) {
	      code.push(ShaderChunk["lightsSpotFrag"]);
	    }
	    
	    return code.join("\n");
	  },
	  
	  _generateAreaLightsFrag: function(numArea, numTube, numRect) {
	    if (numArea <= 0 && numTube <= 0 && numRect <= 0) {
	      return "";
	    }
	    
	    var code = [];
	    
	    code.push("  IncidentLight directLight;");
	    
	    if (numArea == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsAreaLightFragUnroll"]);
	    }
	    else if (numArea > 0) {
	      code.push(ShaderChunk["lightsAreaLightFrag"]);
	    }
	    
	    if (numTube == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsTubeLightFragUnroll"]);
	    }
	    else if (numTube > 0) {
	      code.push(ShaderChunk["lightsTubeLightFrag"]);
	    }
	    
	    if (numRect == 1) {
	      // THREE.WebGLProgram: gl.getProgramInfoLog() C:\fakepath(496,3-100): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
	      code.push(ShaderChunk["lightsRectLightFragUnroll"]);
	    }
	    else if (numRect > 0) {
	      code.push(ShaderChunk["lightsRectLightFrag"]);
	    }
	    
	    return code.join("\n");
	  },
	  
	  build: function(options) {
	    this.uniforms = this._generateUniforms();
	    
	    var params = {
	      uniforms: this.uniforms,
	      vertexShader: this._generateVertexShader(),
	      fragmentShader: this._generateFragmentShader()
	    };
	    
	    if (this.isEnable(["+DEFERRED_GEOMETRY", "+DEFERRED_LIGHT"])) {
	      this.material = new THREE.RawShaderMaterial(Object.assign(params, options));
	      return;
	    }
	    
	    this.material = new THREE.ShaderMaterial(Object.assign(params, options));
	    
	    if (/* this.isEnable('NORMALMAP') || */this.isEnable('BUMPMAP')) {
	      this.material.extensions.derivatives = true;
	    }
	    
	    if (this.isEnable(['STANDARD', 'REFLECTION'])) {
	      this.material.extensions.shaderTextureLOD = true;
	    }
	  }
	});

	var ShaderLib = {
	  
	  copy: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.copyUniforms
	    ]),
	    vertexShader: ShaderChunk.copyVert,
	    fragmentShader: ShaderChunk.copyFrag
	  },
	  
	  // convolution: {
	  //   uniforms: THREE.UniformsUtils.merge([
	  //     ShaderChunk.convolutionUniforms
	  //   ]),
	  //   vertexShader: ShaderChunk.convolutionVert,
	  //   fragmentShader: ShaderChunk.convolutionFrag
	  // },
	  
	  id: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.idUniforms
	    ]),
	    vertexShader: ShaderChunk.idVert,
	    fragmentShader: ShaderChunk.idFrag
	  },
	  
	  edge: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.edgeUniforms
	    ]),
	    vertexShader: ShaderChunk.edgeVert,
	    fragmentShader: ShaderChunk.edgeFrag
	  },
	  
	  edgeExpand: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.edgeExpandUniforms
	    ]),
	    vertexShader: ShaderChunk.edgeExpandVert,
	    fragmentShader: ShaderChunk.edgeExpnadFrag
	  },
	  
	  edgeID: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.edgeIDUniforms
	    ]),
	    vertexShader: ShaderChunk.edgeIDVert,
	    fragmentShader: ShaderChunk.edgeIDFrag
	  },
	  
	  edgeComposite: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.edgeCompositeUniforms
	    ]),
	    vertexShader: ShaderChunk.edgeCompositeVert,
	    fragmentShader: ShaderChunk.edgeCompositeFrag
	  },
	  
	  
	  luminosityHighPass: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.luminosityHighPassUniforms
	    ]),
	    vertexShader: ShaderChunk.luminosityHighPassVert,
	    fragmentShader: ShaderChunk.luminosityHighPassFrag
	  },
	  
	  luminosity: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.luminosityUniforms
	    ]),
	    vertexShader: ShaderChunk.luminosityVert,
	    fragmentShader: ShaderChunk.luminosityFrag
	  },
	  
	  toneMap: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.toneMapUniforms
	    ]),
	    vertexShader: ShaderChunk.toneMapVert,
	    fragmentShader: ShaderChunk.toneMapFrag
	  },
	  
	  ssao: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.ssaoUniforms
	    ]),
	    vertexShader: ShaderChunk.ssaoVert,
	    fragmentShader: ShaderChunk.ssaoFrag
	  },
	  
	  ssao2: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.ssao2Uniforms
	    ]),
	    vertexShader: ShaderChunk.ssaoVert,
	    fragmentShader: ShaderChunk.ssao2Frag
	  },
	  
	  ssao2Blur: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.ssao2BlurUniforms
	    ]),
	    vertexShader: ShaderChunk.copyVert,
	    fragmentShader: ShaderChunk.ssao2BlurFrag
	  },
	  
	  ssao2Composite: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.ssao2CompositeUniforms
	    ]),
	    vertexShader: ShaderChunk.copyVert,
	    fragmentShader: ShaderChunk.ssao2CompositeFrag
	  },
	  
	  fxaa: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.antiAliasUniforms
	    ]),
	    vertexShader: ShaderChunk.antiAliasVert,
	    fragmentShader: ShaderChunk.antiAliasFrag
	  },
	  
	  view: {
	    uniforms: THREE.UniformsUtils.merge([
	      ShaderChunk.viewUniforms
	    ]),
	    vertexShader: ShaderChunk.copyVert,
	    fragmentShader: ShaderChunk.viewFrag
	  }
	};

	//-------------------------------------------------------------------------
	// http://stackoverflow.com/questions/23674744/what-is-the-equivalent-of-python-any-and-all-functions-in-javascript
	function any(iterable) {
		for (var i=0; i<iterable.length; ++i) {
			if (iterable[i]) {
				return true;
			}
		}
		return false;
	}

	function all(iterable) {
		for (var i=0; i<iterable.length; ++i) {
			if (!iterable[i]) {
				return false;
			}
		}
		return true;
	}
	//-------------------------------------------------------------------------
	function radians(deg) {
	  return deg * Math.PI / 180;
	}

	function degrees(rad) {
	  return rad * 180 / Math.PI;
	}

	function pow2(x) {
	  return x*x;
	}
	//-------------------------------------------------------------------------
	// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.
	function gauss(x, sigma) {
		return Math.exp(-(x * x) / (2.0 * sigma * sigma));
	}
	//-------------------------------------------------------------------------
	function buildKernel(sigma) {
		var kMaxKernelSize = 25;
		var kernelSize = 2 * Math.ceil(sigma * 3.0) + 1;
		if (kernelSize > kMaxKernelSize) {
			kernelSize = kMaxKernelSize;
		}
		var halfWidth = (kernelSize - 1) * 0.5;

		var values = new Array(kernelSize);
		var sum = 0.0;
		var i;
		for (i=0; i<kernelSize; ++i) {
			values[i] = gauss(i - halfWidth, sigma);
			sum += values[i];
		}

		// normalize the kenrel
		for (i=0; i<kernelSize; ++i) {
			values[i] /= sum;
		}

		return values;
	}
	//-------------------------------------------------------------------------
	function buildGause(sigma, num) {
		var weights = new Array(num);
		var t = 0.0;
		var d = sigma * sigma;
		for (i=0; i<weights.length; ++i) {
			var r = 1.0 + 2.0 * i;
			weights[i] = Math.exp(-0.5 * (r*r)/d);
			t += weights[i];
		}
		for (i=0; i<weights.length; ++i) {
			weights[i] /= t;
		}
		return weights;
	}
	//-------------------------------------------------------------------------
	function createCubeMap() {
		var path = "assets/textures/cubemap/parliament/";
		var format = '.jpg';
		var urls = [
			path + "posx" + format, path + 'negx' + format,
			path + "posy" + format, path + 'negy' + format,
			path + "posz" + format, path + 'negz' + format
		];

		var textureCube = THREE.ImageUtils.loadTextureCube(urls);
		return textureCube;
	}
	//-------------------------------------------------------------------------
	function createMesh(geom, texture, normal) {
		geom.computeVertexNormals();
		if (normal) {
			var t = THREE.ImageUtils.loadTexture("assets/textures/general/" + texture);
			var m = THREE.ImageUtils.loadTexture("assets/textures/general/" + normal);
			var mat2 = new THREE.MeshPhongMaterial({
				map: t,
				normalMap: m
			});
			var mesh = new THREE.Mesh(geom, mat2);
			return mesh;
		} else {
			var t = THREE.ImageUtils.loadTexture("assets/textures/general/" + texture);
			var mat1 = new THREE.MeshPhongMaterial({});
			var mesh = new THREE.Mesh(geom, mat1);
			return mesh;
		}

		// geom.computeTangents();

		return mesh;
	}
	//-------------------------------------------------------------------------
	function createPlaneReflectMatrix(n, d) {
		var matrix = new THREE.Matrix4();
		matrix.set(
			1 - Math.pow(2*n.x, 2.0), -2*n.x*n.y, -2*n.x*n.z, 0,
			-2*n.x*n.y, 1-Math.pow(2*n.y, 2.0), -2*n.y*n.z, 0,
			-2*n.x*n.z, -2*n.y*n.z, 1-Math.pow(2*n.z,2.0), 0,
			-2*d*n.x, -2*d*n.y, -2*d*n.z, 1
		);
		return matrix;
	}
	//-------------------------------------------------------------------------
	function createShadowedLight(x, y, z, color, intensity) {
		var light = new THREE.DirectionalLight(color, intensity);
		var d = 1;
		light.position.set(x, y, z);
		light.castShadow = true;
		light.shadow.camera.left = -d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = -d;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 4;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		light.shadow.bias = -0.005;
		return light;
	}
	//-------------------------------------------------------------------------
	function clearTextOut(id) {
		document.getElementById(id).innerHTML = "";
	}
	//-------------------------------------------------------------------------
	function textOut(id, text) {
		document.getElementById(id).innerHTML += text + "<br>";
	}
	//-------------------------------------------------------------------------
	function textOutMatrix4(matrix) {
		var s = "";
		for (i=0; i<4; ++i) {
			s += ("        " + matrix.elements[i*4+0]).substr(-8) + ", ";
			s += ("        " + matrix.elements[i*4+1]).substr(-8) + ", ";
			s += ("        " + matrix.elements[i*4+2]).substr(-8) + ", ";
			s += ("        " + matrix.elements[i*4+3]).substr(-8) + "<br>";
		}
		textOut(s.replace(/\ /g, "&nbsp;"));
	}
	//-------------------------------------------------------------------------
	function floatFormat(number, n) {
		var _pow = Math.pow(10, n);
		return Math.ceil(number * _pow) / _pow;
	}
	//-------------------------------------------------------------------------
	function dumpMatrix4(matrix) {
		var s = "";
		for (var i=0; i<4; ++i) {
			// s += ("        " + matrix.elements[i*4+0]).substr(-8) + ", ";
			// s += ("        " + matrix.elements[i*4+1]).substr(-8) + ", ";
			// s += ("        " + matrix.elements[i*4+2]).substr(-8) + ", ";
			// s += ("        " + matrix.elements[i*4+3]).substr(-8) + "\n";
			s += ("        " + floatFormat(matrix.elements[i*4+0], 5)).substr(-8) + ", ";
			s += ("        " + floatFormat(matrix.elements[i*4+1], 5)).substr(-8) + ", ";
			s += ("        " + floatFormat(matrix.elements[i*4+2], 5)).substr(-8) + ", ";
			s += ("        " + floatFormat(matrix.elements[i*4+3], 5)).substr(-8) + "\n";
		}
		console.log(s);
	}

	var Solar = {

	// https://github.com/LocusEnergy/solar-calculations/blob/master/src/main/java/com/locusenergy/solarcalculations/SolarCalculations.java

	calcJulianDate: function(date) {
	  var year = date.getFullYear();
	  var month = date.getMonth() + 1;
	  var day = date.getDate();
	  if (month <= 2) {
	    year--;
	    month += 12;
	  }
	  
	  var a = Math.floor(year / 100);
	  var b = 2 - a + Math.floor(a/4);
	  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
	},

	calcTimeDecimal: function(date) {
	  return date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
	},

	getOffset: function(date) {
	  // UTC -> JST
	  return (9 * 60 * 60 * 1000) / 3600000; // msec
	},

	// assumes datetime given in local time
	calcTimeJulian: function(date) {
	  var jd = this.calcJulianDate(date);
	  var time = this.calcTimeDecimal(date);
	  var offset = this.getOffset(date);
	  return (jd + (time - offset)/24 - 2451545) / 36525;
	},

	calcMeanObliquityOfEcliptic: function(timeJulian) {
	  var seconds = 21.448 - timeJulian * (46.8150 + timeJulian * (0.00059 - timeJulian * (0.001813)));
	  return 23 + (26 + seconds/60)/60;
	},

	calcObliquityCorrection: function(timeJulian) {
	  var e0 = this.calcMeanObliquityOfEcliptic(timeJulian);
	  var omega = 125.04 - 1934.136 * timeJulian;
	  return e0 + 0.00256 * Math.cos(PIXY.radians(omega));
	},

	calcGeomMeanLongSun: function(timeJulian) {
	  var output = 280.46646 + timeJulian * (36000.76983 + 0.0003032 * timeJulian);
	  while (output > 360) output -= 360;
	  while (output < 0) output += 360;
	  return output;
	},

	calcGeomMeanAnomalySun: function(timeJulian) {
	  return 357.52911 + timeJulian * (35999.05029 - 0.0001537 * timeJulian);
	},

	calcEccentricityEarthOrbit: function(timeJulian) {
	  return 0.016708634 - timeJulian * (0.000042037 + 0.0000001267 * timeJulian);
	},

	calcSunEqOfCenter: function(timeJulian) {
	  var m = this.calcGeomMeanAnomalySun(timeJulian);
	  return Math.sin(PIXY.radians(m)) * (1.914602 - timeJulian * (0.004817 + 0.000014 * timeJulian)) + Math.sin(PIXY.radians(m*2)) * (0.019993 - 0.000101 * timeJulian) + Math.sin(PIXY.radians(m*3)) * 0.000289;
	},

	calcSunTrueLong: function(timeJulian) {
	  return this.calcGeomMeanLongSun(timeJulian) + this.calcSunEqOfCenter(timeJulian);
	},

	calcSunApparentLong: function(timeJulian) {
	  var o = this.calcSunTrueLong(timeJulian);
	  var omega = 125.04 - 1934.136 * timeJulian;
	  return o - 0.00569 - 0.00478 * Math.sin(PIXY.radians(omega));
	},

	calcSolarDeclination: function(date) {
	  var timeJulian = this.calcTimeJulian(date);
	  var e = this.calcObliquityCorrection(timeJulian);
	  var lambda = this.calcSunApparentLong(timeJulian);
	  var sint = Math.sin(PIXY.radians(e)) * Math.sin(PIXY.radians(lambda));
	  return PIXY.degrees(Math.asin(sint));
	},

	calcEquationOfTime: function(date) {
	  var timeJulian = this.calcTimeJulian(date);
	  var epsilon = this.calcObliquityCorrection(timeJulian);
	  var l0 = this.calcGeomMeanLongSun(timeJulian);
	  var e = this.calcEccentricityEarthOrbit(timeJulian);
	  var m = this.calcGeomMeanAnomalySun(timeJulian);
	  var y = PIXY.pow2(Math.tan(PIXY.radians(epsilon/2)));
	  var sin2l0 = Math.sin(PIXY.radians(2*l0));
	  var sinm = Math.sin(PIXY.radians(m));
	  var cos2l0 = Math.cos(PIXY.radians(2*l0));
	  var sin4l0 = Math.sin(PIXY.radians(4*l0));
	  var sin2m = Math.sin(PIXY.radians(2*m));
	  var eqTime = y*sin2l0 - 2*e*sinm + 4*e*y*sinm*cos2l0 - 0.5*y*y*sin4l0 - 1.25*e*e*sin2m;
	  return PIXY.degrees(eqTime)*4;
	},

	calcTrueSolarTime: function(date, longitude) {
	  var eqTime = this.calcEquationOfTime(date);
	  var time = this.calcTimeDecimal(date);
	  var offset = this.getOffset(date);
	  var solarTimeFix = eqTime + 4 * longitude - 60*offset;
	  var trueSolarTime = time*60 + solarTimeFix;
	  while (trueSolarTime > 1440) trueSolarTime -= 1440;
	  return trueSolarTime;
	},

	calcHourAngle: function(date, longitude) {
	  var trueSolarTime = this.calcTrueSolarTime(date, longitude);
	  var hourAngle = trueSolarTime / 4 - 180;
	  if (hourAngle < -180) hourAngle += 360;
	  return hourAngle;
	},

	calcSolarZenith: function(date, latitude, longitude, refraction) {
	  var solarDeclination = this.calcSolarDeclination(date);
	  var hourAngle = this.calcHourAngle(date, longitude);
	  
	  var solarDeclinationSin = Math.sin(PIXY.radians(solarDeclination));
	  var solarDeclinationCos = Math.cos(PIXY.radians(solarDeclination));
	  var latitudeSin = Math.sin(PIXY.radians(latitude));
	  var latitudeCos = Math.cos(PIXY.radians(latitude));
	  var hourAngleCos = Math.cos(PIXY.radians(hourAngle));
	  
	  var csz = latitudeSin * solarDeclinationSin + latitudeCos * solarDeclinationCos * hourAngleCos;
	  var solarZenith = PIXY.degrees(Math.acos(csz));
	  
	  if (refraction) {
	    var solarElevation = 90 - solarZenith;
	    var refractionCorrection = 0;
	    var te = Math.tan(PIXY.radians(solarElevation));
	    if (solarElevation <= 85 && solarElevation > 5) {
	      refractionCorrection = 58.1 / te - 0.07 / Math.pow(te, 3) + 0.000086 / Math.pow(te, 5);
	    }
	    else if (solarElevation <= 85 && solarElevation > -0.575) {
	      refractionCorrection = 1735 + solarElevation*(-518.2 + solarElevation*(103.4 + solarElevation*(-12.79 + solarElevation*0.711)));
	    }
	    else {
	      refractionCorrection = -20.774/te;
	    }
	    
	    solarZenith -= refractionCorrection;
	  }
	  
	  return solarZenith;
	},

	calcSolarAzimuth: function(date, latitude, longitude) {
	  var solarDeclination = this.calcSolarDeclination(date);
	  var hourAngle = this.calcHourAngle(date, longitude);
	  var solarZenith = this.calcSolarZenith(date, latitude, longitude, false);
	  
	  var hourAngleSign = Math.sign(hourAngle);
	  var solarZenithSin = Math.sin(PIXY.radians(solarZenith));
	  var solarZenithCos = Math.cos(PIXY.radians(solarZenith));
	  var latitudeSin = Math.sin(PIXY.radians(latitude));
	  var latitudeCos = Math.cos(PIXY.radians(latitude));
	  
	  var output = Math.acos((solarZenithCos * latitudeSin - Math.sin(PIXY.radians(solarDeclination))) / (solarZenithSin * latitudeCos));
	  var output = PIXY.degrees(output);
	  if (hourAngle > 0) {
	    return (output + 180) % 360;
	  }
	  else {
	    return (540 - output) % 360;
	  }
	},

	calcSolarAltitude: function(date, latitude, longitude) {
	  return 90 - this.calcSolarZenith(date, latitude, longitude);
	},

	calcAirMass: function(date, latitude, longitude) {
	  var solarZenith = this.calcSolarZenith(date, latitude, longitude);
	  if (solarZenith < 90) {
	    var rad = PIXY.radians(solarZenith);
	    var a = 1.002432 * Math.pow(Math.cos(rad), 2.0);
	    var b = 0.148386 * Math.cos(rad);
	    var X = a + b + 0.0096467;
	    var c = Math.pow(Math.cos(rad), 3.0);
	    var d = 0.149864 * Math.pow(Math.cos(rad), 2.0);
	    var e = 0.0102963 * Math.cos(rad);
	    var Y = c + d + e + 0.000303978;
	    return X / Y;
	  }
	  else {
	    return 0;
	  }
	},

	calcExtraIrradiance: function(date) {
	  var start = new Date(date.getFullYear(), 0, 0);
	  var diff = date.getTime() - start.getTime();
	  var oneDay = 1000 * 60 * 60 * 24;
	  // var day = Math.ceil(diff / oneDay);
	  // var day = Math.floor(diff / oneDay);
	  var day = diff / oneDay;
	  
	  // 1367 = accepted solar constant [W/m^2]
	  return 1367 * (1.0 + Math.cos(PIXY.radians(360 * day / 365)) / 30);
	},

	calcSolarAttenuation: function(theta, turbitity) {
	  var beta = 0.04608365822050 * turbitity - 0.04586025928522;
	  var tauR, tauA;
	  var tau = [0.0,0.0,0.0];
	  var tmp = 93.885 - theta / Math.PI * 180.0;
	  if (tmp < 0) {
	    return tau;
	  }
	  var m = 1.0 / (Math.cos(theta) + 0.15 * Math.pow(93.885 - theta / Math.PI * 180.0, -1.253)); // Relative Optical Mass
	  var lambda = [0.65, 0.57, 0.475];
	  for (var i=0; i<3; i++) {
	    // Rayleigh Scattering
	    // lambda in um
	    tauR = Math.exp(-m * 0.008735 * Math.pow(lambda[i], -4.08));
	    
	    // Aerosal (water + dust) attenuation
	    // beta - amount of aerosols present
	    // alpha - ratio of small to large particle sizes. (0:4, usually 1.3)
	    var alpha = 1.3;
	    tauA = Math.exp(-m * beta * Math.pow(lambda[i], -alpha)); // lambda should be in um
	    
	    tau[i] = tauR * tauA;
	  }
	  
	  return tau;
	}

	};

	var OceanShader = {
	  uniforms: {
	    mirrorSampler: { value: null },
	    normalSampler: { value: null },
	    envSampler: { value: null },
	    alpha: { value: 1.0 },
	    time: { value: 0.0 },
	    distortionScale: { value: 20.0 },
	    reflectionScale: { value: 0.05 },
	    noiseScale: { value: 1.0 },
	    sunColor: { value: new THREE.Color(0x7f7f7f) },
	    sunDirection: { value: new THREE.Vector3(0.70707, 0x70707, 0) },
	    eye: { value: new THREE.Vector3() },
	    waterColor: { value: new THREE.Color(0x555555) },
	    textureMatrix: { value: new THREE.Matrix4() }
	  },
	  
	  vertexShader: [
	    "uniform mat4 textureMatrix;",
	    "uniform float time;",
	    "varying vec4 mirrorCoord;",
	    "varying vec3 worldPosition;",
	    "varying vec3 worldNormal;",
	    
	    "void main() {",
	    "  mirrorCoord = modelMatrix * vec4(position, 1.0);",
	    "  worldPosition = mirrorCoord.xyz;",
	    "  mirrorCoord = textureMatrix * mirrorCoord;",
	    "  worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);",
	    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	    "}"
	  ].join("\n"),
	  
	  fragmentShader: [
	    "precision highp float;",
	    
	    "uniform sampler2D mirrorSampler;",
	    "uniform float alpha;",
	    "uniform float time;",
	    "uniform float distortionScale;",
	    "uniform float reflectionScale;",
	    "uniform sampler2D normalSampler;",
	    "uniform vec3 sunColor;",
	    "uniform vec3 sunDirection;",
	    "uniform vec3 eye;",
	    "uniform vec3 waterColor;",
	    "uniform samplerCube envSampler;",
	    
	    "varying vec4 mirrorCoord;",
	    "varying vec3 worldPosition;",
	    "varying vec3 worldNormal;",
	    
	    "vec4 getNoise(vec2 uv) {",
	    "  vec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);",
	    "  vec2 uv1 = uv / 107.0 - vec2(time / -19.0, time / 31.0);",
	    "  vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(time / 101.0, time / 97.0);",
	    "  vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(time / 109.0, time / -113.0);",
	    "  vec4 noise = texture2D(normalSampler, uv0) + ",
	    "    texture2D(normalSampler, uv1) + ",
	    "    texture2D(normalSampler, uv2) + ",
	    "    texture2D(normalSampler, uv3);",
	    "  return noise * 0.5 - 1.0;",
	    "}",
	    
	    "void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {",
	    "  vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));",
	    "  float direction = max(0.0, dot(eyeDirection, reflection));",
	    "  specularColor += pow(direction, shiny) * sunColor * spec;",
	    "  diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;",
	    "}",
	    
	    THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
	    
	    "void main() {",
	    "  vec4 noise = getNoise(worldPosition.xz);",
	    "  vec3 surfaceNormal = normalize(noise.xzy * vec3(1.5, 1.0, 1.5));",
	    // "  vec3 surfaceNormal = normalize(worldNormal + noise.xzy * vec3(1.5, 1.0, 1.5) * distortionScale);",
	    
	    "  vec3 diffuseLight = vec3(0.0);",
	    "  vec3 specularLight = vec3(0.0);",
	    
	    "  vec3 worldToEye = eye - worldPosition;",
	    "  vec3 eyeDirection = normalize(worldToEye);",
	    "  sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);",
	    
	    "  float distance = length(worldToEye);",
	    
	    // "  vec3 reflection = reflect(-eyeDirection, normalize(worldNormal + noise.xzy * reflectionScale));",
	    // "  vec3 reflectionSample = textureCube(envSampler, vec3(-reflection.x, reflection.yz)).rgb;",
	    "  vec2 distortion = surfaceNormal.xz * (0.001 + 1.0 / distance) * distortionScale;",
	    "  vec3 reflectionSample = vec3(texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.z + distortion));",
	    
	    "  float theta = max(dot(eyeDirection, surfaceNormal), 0.0);",
	    "  float rf0 = 0.3;",
	    "  float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta), 5.0);",
	    "  vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor;",
	    "  vec3 albedo = mix(sunColor * diffuseLight * 0.3 + scatter, (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);",
	    "  vec3 outgoingLight = albedo;",
	    THREE.ShaderChunk[ "fog_fragment" ],
	    "  gl_FragColor = vec4(outgoingLight, alpha);",
	    THREE.ShaderChunk[ "tonemapping_fragment" ],
	    "}"
	  ].join("\n")
	};

	var Ocean = function(renderer, camera, scene, options) {
	  
	  THREE.Object3D.call(this);
	  
	  this.name = "ocean_" + this.id;
	  
	  function optionalParameter(value, defaultValue) {
	    return value !== undefined ? value : defaultValue;
	  }
	  
	  options = options || {};
	  
	  this.matrixNeedsUpdate = true;
	  
	  var width = optionalParameter(options.textureWidth, 512);
	  var height = optionalParameter(options.textureHeight, 512);
	  this.clipBias = optionalParameter(options.clipBias, 0.0);
	  this.alpha = optionalParameter(options.alpha, 1.0);
	  this.time = optionalParameter(options.time, 0.0);
	  this.normalSampler = optionalParameter(options.waterNormals, null);
	  this.sunDirection = optionalParameter(options.sunDirection, new THREE.Vector3(0.70707, 0.70707, 0.0));
	  this.sunColor = new THREE.Color(optionalParameter(options.sunColor, 0xffffff));
	  this.waterColor = new THREE.Color(optionalParameter(options.waterColor, 0x7f7f7f));
	  this.eye = optionalParameter(options.eye, new THREE.Vector3(0,0,0));
	  this.distortionScale = optionalParameter(options.distortionScale, 20.0);
	  this.reflectionScale = optionalParameter(options.reflectionScale, 0.01);
	  this.side = optionalParameter(options.side, THREE.FrontSide);
	  this.fog = optionalParameter(options.fog, false);
	  this.envSampler = optionalParameter(options.envMap, null);
	  
	  this.renderer = renderer;
	  this.scene = scene;
	  this.mirrorPlane = new THREE.Plane();
	  this.normal = new THREE.Vector3(0,0,1);
	  this.mirrorWorldPosition = new THREE.Vector3();
	  this.cameraWorldPosition = new THREE.Vector3();
	  this.rotationMatrix = new THREE.Matrix4();
	  this.lookAtPosition = new THREE.Vector3(0,0,-1);
	  this.clipPlane = new THREE.Vector4();
	  
	  if (camera instanceof THREE.PerspectiveCamera) {
	    this.camera = camera;
	  }
	  else {
	    this.camera = new THERE.PerspectiveCamera();
	    console.log(this.name + ': camera is not a PerspectiveCamera');
	  }
	  
	  this.textureMatrix = new THREE.Matrix4();
	  this.mirrorCamera = this.camera.clone();
	  this.mirrorCamera.matrixAutoUpdate = true;
	  
	  this.renderTarget = new THREE.WebGLRenderTarget(width, height);
	  // this.renderTarget2 = new THREE.WebGLRenderTarget(width, height);
	  
	  var mirrorShader = OceanShader;
	  var mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);
	  
	  this.material = new THREE.ShaderMaterial({
	    fragmentShader: mirrorShader.fragmentShader,
	    vertexShader: mirrorShader.vertexShader,
	    uniforms: mirrorUniforms,
	    transparent: true,
	    side: this.side,
	    fog: this.fog,
	    // wireframe: true
	  });
	  this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
	  this.material.uniforms.textureMatrix.value = this.textureMatrix;
	  this.material.uniforms.alpha.value = this.alpha;
	  this.material.uniforms.time.value = this.time;
	  this.material.uniforms.normalSampler.value = this.normalSampler;
	  this.material.uniforms.sunColor.value = this.sunColor;
	  this.material.uniforms.waterColor.value = this.waterColor;
	  this.material.uniforms.sunDirection.value = this.sunDirection;
	  this.material.uniforms.distortionScale.value = this.distortionScale;
	  this.material.uniforms.reflectionScale.value = this.reflectionScale;
	  this.material.uniforms.eye.value = this.eye;
	  this.material.uniforms.envSampler.value = this.envSampler;
	  
	  if (!THREE.Math.isPowerOfTwo(width) || !THREE.Math.isPowerOfTwo(height)) {
	    this.renderTarget.texture.generateMipmaps = false;
	    this.renderTarget.texture.minFilter = THREE.LinearFilter;
	    // this.renderTarget2.texture.generateMipmaps = false;
	    // this.renderTarget2.texture.minFilter = THREE.LinearFilter;
	  }
	  
	  this.updateTextureMatrix();
	  this.render();
	};

	Ocean.prototype = Object.create(THREE.Object3D.prototype);
	Ocean.prototype.constructor = Ocean;

	Ocean.prototype.updateTextureMatrix = function() {
	  
	  function sign(x) {
	    return x ? x < 0 ? -1 : 1 : 0;
	  }

	  this.updateMatrixWorld();
	  this.camera.updateMatrixWorld();
	  
	  this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
	  this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);
	  
	  this.rotationMatrix.extractRotation(this.matrixWorld);
	  
	  this.normal.set(0,0,1);
	  this.normal.applyMatrix4(this.rotationMatrix);
	  
	  var view = this.mirrorWorldPosition.clone().sub(this.cameraWorldPosition);
	  view.reflect(this.normal).negate();
	  view.add(this.mirrorWorldPosition);
	  
	  this.rotationMatrix.extractRotation(this.camera.matrixWorld);
	  
	  this.lookAtPosition.set(0, 0, -1);
	  this.lookAtPosition.applyMatrix4(this.rotationMatrix);
	  this.lookAtPosition.add(this.cameraWorldPosition);
	  
	  var target = this.mirrorWorldPosition.clone().sub(this.lookAtPosition);
	  target.reflect(this.normal).negate();
	  target.add(this.mirrorWorldPosition);
	  
	  this.up.set(0, -1, 0);
	  this.up.applyMatrix4(this.rotationMatrix);
	  this.up.reflect(this.normal).negate();
	  
	  this.mirrorCamera.position.copy(view);
	  this.mirrorCamera.up = this.up;
	  this.mirrorCamera.lookAt(target);
	  
	  this.mirrorCamera.updateProjectionMatrix();
	  this.mirrorCamera.updateMatrixWorld();
	  this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld);
	  
	  // Update the texture matrix
	  this.textureMatrix.set(0.5, 0.0, 0.0, 0.5,
	                         0.0, 0.5, 0.0, 0.5,
	                         0.0, 0.0, 0.5, 0.5,
	                         0.0, 0.0, 0.0, 1.0);
	  this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
	  this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);
	  
	  // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
	  this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal, this.mirrorWorldPosition);
	  this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);
	  
	  this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant);
	  
	  var q = new THREE.Vector4();
	  var projectionMatrix = this.mirrorCamera.projectionMatrix;
	  q.x = (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
	  q.y = (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
	  q.z = -1.0;
	  q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
	  
	  // Calculate the scaled plane vector
	  var c = new THREE.Vector4();
	  c = this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(q));
	  
	  // Replacing the third row of the projection matrix
	  projectionMatrix.elements[2] = c.x;
	  projectionMatrix.elements[6] = c.y;
	  projectionMatrix.elements[10] = c.z + 1.0 - this.clipBias;
	  projectionMatrix.elements[14] = c.w;
	  
	  var worldCoordinate = new THREE.Vector3();
	  worldCoordinate.setFromMatrixPosition(this.camera.matrixWorld);
	  this.eye = worldCoordinate;
	  this.material.uniforms.eye.value = this.eye;
	};

	Ocean.prototype.render = function() {

	  if (this.matrixNeedsUpdate) this.updateTextureMatrix();
	  
	  this.matrixNeedsUpdate = true;
	  
	  // Render the mirrored view of the current scene into the target texture
	  var scene = this;
	  
	  while (scene.parent !== null) {
	    scene = scene.parent;
	  }

	  if (scene !== undefined && scene instanceof THREE.Scene) {
	    // We can't render ourself to ourself
	    var visible = this.material.visible;
	    this.material.visible = false;
	    this.renderer.render(scene, this.mirrorCamera, this.renderTarget, true);
	    this.material.visible = visible;
	  }
	};



	// Ocean.prototype.renderTemp = function() {
	//   
	//   if (this.matrixNeedsUpdate) this.updateTextureMatrix();
	//   
	//   this.matrixNeedsUpdate = true;
	//   
	//   // Render the mirrored view of the current scene into the target textrue
	//   var scene = this;
	//   while (scene.parent !== null) {
	//     scene = scene.parent;
	//   }
	//   
	//   if (scene !== undefined && scene instanceof THREE.Scene) {
	//     this.renderer.render(scene, this.mirrorCamera, this.renderTarget2, true);
	//   }
	// };

	/**
	 * A shadow Mesh that follows a shadow-casting Mesh in the scene, but is confined to a single plane.
	 * 
	 * based on: Three.js/samples/js/objects/shadowMesh.js
	 */
	var ShadowMesh = function(mesh, materialOption) {
	  
	  var shadowMaterial = new THREE.MeshBasicMaterial(Object.assign({
	    color: 0x000000,
	    transparent: true,
	    opacity: 0.6,
	    depthWrite: false
	  }, materialOption));
	  
	  THREE.Mesh.call(this, mesh.geometry, shadowMaterial);
	  
	  this.meshMatrix = mesh.matrixWorld;
	  this.frustumCulled = false;
	  this.matrixAutoUpdate = false;
	};

	ShadowMesh.prototype = Object.create(THREE.Mesh.prototype);
	ShadowMesh.prototype.constructor = ShadowMesh;

	ShadowMesh.prototype.update = function() {
	  
	  var shadowMatrix = new THREE.Matrix4();
	  
	  return function(plane, lightPosition4D) {
	    // based on
	    // https://www.opengl.org/archives/resources/features/StencilTalk/tsld021.htm
	    
	    var dot = plane.normal.x * lightPosition4D.x +
	      plane.normal.y * lightPosition4D.y + 
	      plane.normal.z * lightPosition4D.z + 
	      - plane.constant * lightPosition4D.w;
	      
	    var sme = shadowMatrix.elements;
	    
	    sme[ 0] = dot - lightPosition4D.x * plane.normal.x;
	    sme[ 4] = - lightPosition4D.x * plane.normal.y;
	    sme[ 8] = - lightPosition4D.x * plane.normal.z;
	    sme[12] = - lightPosition4D.x * - plane.constant;
	    
	    sme[ 1] = - lightPosition4D.y * plane.normal.x;
	    sme[ 5] = dot - lightPosition4D.y * plane.normal.y;
	    sme[ 9] = - lightPosition4D.y * plane.normal.z;
	    sme[13] = - lightPosition4D.y * - plane.constant;
	    
	    sme[ 2] = - lightPosition4D.z * plane.normal.x;
	    sme[ 6] = - lightPosition4D.z * plane.normal.y;
	    sme[10] = dot - lightPosition4D.z * plane.normal.z;
	    sme[14] = - lightPosition4D.z * - plane.constant;
	    
	    sme[ 3] = - lightPosition4D.w * plane.normal.x;
	    sme[ 7] = - lightPosition4D.w * plane.normal.y;
	    sme[11] = - lightPosition4D.w * plane.normal.z;
	    sme[15] = dot - lightPosition4D.w * - plane.constant;
	    
	    this.matrix.multiplyMatrices(shadowMatrix, this.meshMatrix);
	  };
	}();

	var GPUParticleShader = {
	  uniforms: {
	    tDiffuse: { value: null },
	    time: { value: 0.0 },
	    timeRange: { value: 5.0 },
	    color: { value: new THREE.Color(1,1,1)},
	    opacity: { value: 1.0 },
	    particleSize: { value: 0.75 },
	    screenWidth: { value: window.innerWidth },
	    timeOffset: { value: 0.0 },
	    numFrames: { value: 1 },
	    frameDuration: { value: 1 },
	    additiveFactor: { value: 0 },
	    viewSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
	    tDepth: { value: null },
	    cameraNearFar: { value: new THREE.Vector2(1,100) }
	  },
	  
	  vertexShader: [
	    "precision highp float;",
	    
	    "uniform mat4 modelViewMatrix;",
	    "uniform mat4 projectionMatrix;",
	    "uniform float time;",
	    "uniform float timeRange;",
	    "uniform float timeOffset;",
	    "uniform float particleSize;",
	    "uniform float screenWidth;",
	    
	    "attribute vec3 position;",
	    "attribute vec4 velocitySpinStart;",
	    "attribute vec4 accelerationSpinSpeed;",
	    "attribute vec4 startSizeEndSizeStartTimeLifeTime;",
	    
	    "varying vec4 vSpinLifeTime;",
	    "varying vec4 vClipPosition;",
	    
	    "void main() {",
	    "  float startSize = startSizeEndSizeStartTimeLifeTime.x;",
	    "  float endSize = startSizeEndSizeStartTimeLifeTime.y;",
	    "  float startTime = startSizeEndSizeStartTimeLifeTime.z;",
	    "  float lifeTime = startSizeEndSizeStartTimeLifeTime.w;",
	    "  vec3 velocity = velocitySpinStart.xyz;",
	    "  float spinStart = velocitySpinStart.w;",
	    "  vec3 acceleration = accelerationSpinSpeed.xyz;",
	    "  float spinSpeed = accelerationSpinSpeed.w;",
	    
	    "  float localTime = mod((time - timeOffset - startTime), timeRange);",
	    "  float percentLife = localTime / lifeTime;",
	    
	    "  vec3 newPosition = position + velocity * localTime + acceleration * localTime * localTime;",
	    "  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);",
	    "  gl_Position = projectionMatrix * mvPosition;",
	    "  vClipPosition = gl_Position;",
	    
	    "  float currentSize = particleSize * mix(startSize, endSize, percentLife);",
	    "  currentSize *= step(0.0, percentLife);",
	    "  currentSize *= step(-1.0, -percentLife);",
	    "  if (currentSize == 0.0) gl_Position = vec4(-100000000.0);",
	    
	    "  vec4 projectedCorner = projectionMatrix * vec4(currentSize, currentSize, mvPosition.z, mvPosition.w);",
	    "  gl_PointSize = screenWidth * projectedCorner.x / projectedCorner.w;",
	    "  percentLife *= step(0.0, percentLife);",
	    "  percentLife *= step(-1.0, -percentLife);",
	    "  vSpinLifeTime = vec4(spinStart, spinSpeed, percentLife, localTime);",
	    "}"
	  ].join("\n"),
	  
	  fragmentShader: [
	    "precision highp float;",
	    
	    "uniform sampler2D tDiffuse;",
	    "uniform sampler2D tDepth;",
	    "uniform vec3 color;",
	    "uniform float opacity;",
	    "uniform float time;",
	    "uniform float numFrames;",
	    "uniform float frameDuration;",
	    "uniform vec2 cameraNearFar;",
	    "uniform vec2 viewSize;",
	    "uniform float additiveFactor;",
	    
	    "varying vec4 vSpinLifeTime;",
	    "varying vec4 vClipPosition;",
	    
	    "float linearizeDepth(float depth, vec2 cameraNearFar) {",
	    "  return -cameraNearFar.y * cameraNearFar.x / (depth * (cameraNearFar.y - cameraNearFar.x) - cameraNearFar.y);",
	    "}",
	    
	    "void main() {",
	    "  float spinStart = vSpinLifeTime.x;",
	    "  float spinSpeed = vSpinLifeTime.y;",
	    "  float percentLife = vSpinLifeTime.z;",
	    "  float localTime = vSpinLifeTime.w;",
	    
	    "  const float frameStart = 0.0;",
	    "  vec2 texcoord = vec2(gl_PointCoord.x, 1.0-gl_PointCoord.y)-0.5;",
	    "  float s = sin(spinStart + spinSpeed * time);",
	    "  float c = cos(spinStart + spinSpeed * time);",
	    "  vec2 rotatedCoord1 = vec2(texcoord.x * c + texcoord.y * s, -texcoord.x * s + texcoord.y * c) + 0.5;",
	    "  rotatedCoord1 = clamp(rotatedCoord1, 0.0, 1.0);",
	    // "  vec2 rotatedCoord2 = rotatedCoord1;",
	    
	    "  float frame1 = mod(floor(localTime / frameDuration + frameStart), numFrames);",
	    "  float uOffset1 = frame1 / numFrames;",
	    "  rotatedCoord1.x = uOffset1 + (rotatedCoord1.x) * (1.0 / numFrames);",
	    "  vec4 pixel1 = texture2D(tDiffuse, rotatedCoord1);",
	    // "  pixel1.xyz *= pixel1.xyz;",
	    
	    // INTERPORATE PARTICLE FRAMES
	    // "  float frame2 = mod(floor(localTime / frameDuration + frameStart + 1.0), numFrames);",
	    // "  float uOffset2 = frame2 / numFrames;",
	    // "  float frameTime = fract(localTime / frameDuration + frameStart);",
	    // "  rotatedCoord2.x = uOffset2 + rotatedCoord2.x * (1.0 / numFrames);",
	    // "  vec4 pixel2 = texture2D(tDiffuse, rotatedCoord2);",
	    // "  pixel2.xyz *= pixel2.xyz;",
	    // "  pixel1 = mix(pixel1, pixel2, frameTime);",
	    
	    "  if (pixel1.a < 0.001) discard;",
	    
	    "  vec2 screenCoord = gl_FragCoord.xy / viewSize;",
	    "  float myDepth = vClipPosition.z / vClipPosition.w;",
	    "  float myLinearDepth = linearizeDepth(myDepth, cameraNearFar);",
	    "  float sceneDepth = texture2D(tDepth, screenCoord).x * 2.0 - 1.0;",
	    "  float sceneLinearDepth = linearizeDepth(sceneDepth, cameraNearFar);",
	    "  const float scale = 0.1;",
	    "  float zFade = clamp(scale * abs(myLinearDepth - sceneLinearDepth), 0.0, 1.0);",
	    "  if (myDepth > sceneDepth) discard;",
	    
	    "  vec4 particleColor = pixel1 * vec4(color, opacity);",
	    "  particleColor.a *= zFade;",
	    "  gl_FragColor = particleColor;",
	    "}"
	  ].join("\n")
	};

	var GPUParticle = function(numParticles, initCallback) {
	  
	  var geo = new THREE.BufferGeometry();
	  var positions = new Float32Array(numParticles * 3);
	  var velocitySpinStartArray = new Float32Array(numParticles * 4);
	  var accelerationSpinSpeedArray = new Float32Array(numParticles * 4);
	  var startSizeEndSizeStartTimeLifeTimeArray = new Float32Array(numParticles * 4);
	  
	  var pars = {
	    position: new THREE.Vector3(),
	    velocity: new THREE.Vector3(),
	    acceleration: new THREE.Vector3(),
	    spinStart: 0,
	    spinSpeed: 0,
	    startSize: 1,
	    endSize: 1,
	    startTime: 0,
	    lifeTime: 1
	  };
	  
	  var ofs3 = 0;
	  var ofs4 = 0;
	  for (var i=0; i<numParticles; ++i) {
	    
	    initCallback(i, pars);
	    
	    positions[ofs3+0] = pars.position.x;
	    positions[ofs3+1] = pars.position.y;
	    positions[ofs3+2] = pars.position.z;
	    
	    velocitySpinStartArray[ofs4+0] = pars.velocity.x;
	    velocitySpinStartArray[ofs4+1] = pars.velocity.y;
	    velocitySpinStartArray[ofs4+2] = pars.velocity.z;
	    
	    accelerationSpinSpeedArray[ofs4+0] = pars.acceleration.x;
	    accelerationSpinSpeedArray[ofs4+1] = pars.acceleration.y;
	    accelerationSpinSpeedArray[ofs4+2] = pars.acceleration.z;
	    
	    velocitySpinStartArray[ofs4+3] = pars.spinStart;
	    accelerationSpinSpeedArray[ofs4+3] = pars.spinSpeed;
	    
	    startSizeEndSizeStartTimeLifeTimeArray[ofs4+0] = pars.startSize;
	    startSizeEndSizeStartTimeLifeTimeArray[ofs4+1] = pars.endSize;
	    startSizeEndSizeStartTimeLifeTimeArray[ofs4+2] = pars.startTime;
	    startSizeEndSizeStartTimeLifeTimeArray[ofs4+3] = pars.lifeTime;
	    
	    ofs3 += 3;
	    ofs4 += 4;
	  }
	  
	  geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	  geo.addAttribute('velocitySpinStart', new THREE.BufferAttribute(velocitySpinStartArray, 4));
	  geo.addAttribute('accelerationSpinSpeed', new THREE.BufferAttribute(accelerationSpinSpeedArray, 4));
	  geo.addAttribute('startSizeEndSizeStartTimeLifeTime', new THREE.BufferAttribute(startSizeEndSizeStartTimeLifeTimeArray, 4));
	  
	  var material = new THREE.RawShaderMaterial({
	    uniforms: THREE.UniformsUtils.clone(GPUParticleShader.uniforms),
	    vertexShader: GPUParticleShader.vertexShader,
	    fragmentShader: GPUParticleShader.fragmentShader,
	    transparent: true,
	    depthTest: true,
	    depthWrite: false,
	    blending: THREE.AdditiveBlending
	  });
	  
	  THREE.Points.call(this, geo, material);
	};

	GPUParticle.prototype = Object.create(THREE.Points.prototype);
	GPUParticle.prototype.constructor = GPUParticle;

	var HeightField = function() {
	  
	  this.generate = function(img, scale) {
	    var data = this.__getHeightData(img, scale);
	    var geo = new THREE.PlaneBufferGeometry(img.width, img.height, img.width-1, img.height-1);
	    geo.rotateX(-Math.PI / 2);
	    var vertices = geo.attributes.position.array;
	    for (var i=0; i<data.length; i++) {
	      vertices[i*3+1] = data[i];
	    }
	    geo.computeVertexNormals();
	    return geo;
	  };
	  
	  this.__getHeightData = function(img, scale) {
	    var canvas = document.createElement('canvas');
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var context = canvas.getContext('2d');
	    var size = img.width * img.height;
	    var data = new Float32Array(size);
	    
	    context.drawImage(img, 0, 0);
	    
	    for (var i=0; i<size; i++) {
	      data[i] = 0;
	    }
	    
	    var imgd = context.getImageData(0, 0, img.width, img.height);
	    var pix = imgd.data;
	    
	    var j=0;
	    for (var i=0; i<pix.length; i += 4) {
	      var all = pix[i] + pix[i+1] + pix[i+2];
	      data[j++] = all / (12*scale);
	    }
	    
	    return data;
	  };
	  
	  this.generateHeight = function(params) {
	    
	    function optionalParameter(value, defaultValue) {
	      return value !== undefined ? value : defaultValue;
	    }
	    
	    params = params || {};
	    
	    this.widthExtents = optionalParameter(params.widthExtents, 100);
	    this.depthExtents = optionalParameter(params.depthExtents, 100);
	    this.width = optionalParameter(params.width, 128);
	    this.depth = optionalParameter(params.depth, 128);
	    this.maxHeight = optionalParameter(params.maxHeight, 2);
	    this.minHeight = optionalParameter(params.minHeight, -2);
	    this.heightData = this.__generateHeight(this.width, this.depth, this.minHeight, this.maxHeight);
	    
	    var geo = new THREE.PlaneBufferGeometry(this.widthExtents, this.depthExtents, this.width - 1, this.depth - 1);
	    geo.rotateX(-Math.PI / 2);
	    var vertices = geo.attributes.position.array;
	    for (var i=0, j=0, l=vertices.length; i<l; i++, j += 3) {
	      // j + 1 because it is the y component that we modify
	      vertices[j+1] = this.heightData[i];
	    }
	    geo.computeVertexNormals();
	    return geo;
	  };
	  
	  this.__generateHeight = function(width, depth, minHeight, maxHeight) {
	    // Generates the height data (a sinus wave)
	    var size = width * depth;
	    var data = new Float32Array(size);
	    var hRange = maxHeight - minHeight;
	    var w2 = width / 2;
	    var d2 = depth / 2;
	    var phaseMult = 24;
	    
	    var p = 0;
	    for (var j=0; j<depth; j++) {
	      for (var i=0; i<width; i++) {
	        var radius = Math.sqrt(Math.pow((i-w2)/w2, 2.0) + Math.pow((j-d2)/d2, 2.0));
	        var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
	        data[p] = height;
	        p++;
	      }
	    }
	    
	    return data;
	  };
	};

	var ScreenSprite = function(material, canvas) {
	  
	  var sw = window.innerWidth;
	  var sh = window.innerHeight;
	  if (canvas) {
	    sw = canvas.width;
	    sh = canvas.height;
	  }
	  
	  var scope = this;
	  var frame = {
	    x: 10, y: 10, width: sw, height: sh
	  };
	  
	  var camera = new THREE.OrthographicCamera(-sw/2, sw/2, sh/2, -sh/2, 1, 10);
	  camera.position.set(0,0,2);
	  var scene = new THREE.Scene();
	  var plane = new THREE.PlaneBufferGeometry(frame.width, frame.height);
	  var mesh = new THREE.Mesh(plane, material);
	  scene.add(mesh);
	  
	  function resetPosition() {
	    scope.position.set(scope.position.x, scope.position.y);
	  }
	  
	  // API
	  
	  // Set to false to disable displaying this sprite
	  this.enabled = true;
	  
	  // Set the size of the displayed sprite on the HUD
	  this.size = {
	    width: frame.width,
	    height: frame.height,
	    set: function(width, height) {
	      this.width = width;
	      this.height = height;
	      mesh.scale.set(this.width / frame.width, this.height / frame.height, 1);
	      
	      // Reset the position as it is off when we scale stuff
	      resetPosition();
	    }
	  };
	  
	  // Set the position of the displayed sprite on the HUD
	  this.position = {
	    x: frame.x,
	    y: frame.y,
	    set: function(x,y) {
	      this.x = x;
	      this.y = y;
	      var width = scope.size.width;
	      var height = scope.size.height;
	      mesh.position.set(-sw/2 + width / 2 + this.x, sh/2 - height/2 - this.y, 0);
	    }
	  };
	  
	  this.render = function(renderer) {
	    if (this.enabled) {
	      // console.log(camera);
	      renderer.render(scene, camera);
	    }
	  };
	  
	  this.updateForWindowResize = function() {
	    if (this.enabled) {
	      sw = window.innerWidth;
	      sh = window.innerHeight;
	      camera.left = -window.innerWidth / 2;
	      camera.right = window.innerWidth / 2;
	      camera.top = window.innerHeight / 2;
	      camera.bottom = -window.innerHeight / 2;
	    }
	  };
	  
	  this.updateForCanvasResize = function(canvas) {
	    if (this.enabled) {
	      sw = canvas.width;
	      sh = canvas.height;
	      camera.left = -canvas.width / 2;
	      camera.right = canvas.width / 2;
	      camera.top = canvas.height / 2;
	      camera.bottom = -canvas.height / 2;
	    }
	  };
	  
	  this.update = function() {
	    this.position.set(this.position.x, this.position.y);
	    this.size.set(this.size.width, this.size.height);
	  };
	  
	  // Force an update to set position/size
	  this.update();
	};

	ScreenSprite.prototype.constructor = ScreenSprite;

	//// COMPOSER

	var Composer = function(renderer) {
	  
	  this.renderer = renderer;
	  this.passes = [];

	};

	Object.assign(Composer.prototype, {
	  
	  addPass: function(pass, readRenderTarget, writeRenderTarget, clear, clearDepth) {
	    this.passes.push({
	      pass: pass, 
	      readBuffer: readRenderTarget, 
	      writeBuffer: writeRenderTarget, 
	      clear: clear,
	      clearDepth: clearDepth});
	    // var size = this.renderer.getSize();
	    // pass.setSize(size.width, size.height);
	  },
	  
	  insertPass: function(pass, index) {
	    this.passes.splice(index, 0, pass);
	  },
	  
	  render: function(delta) {
	    var maskActive = false;
	    var pass, i, il = this.passes.length;
	    
	    for (i=0; i<il; i++) {
	      pass = this.passes[i];
	      if (pass.pass.enabled === false) continue;
	      
	      var oldAutoClear = this.renderer.autoClear;
	      var oldAutoClearDepth = this.renderer.autoClearDepth;
	      
	      if (pass.clear !== undefined) {
	        this.renderer.autoClear = pass.clear;
	      }
	      if (pass.clearDepth !== undefined) {
	        this.renderer.autoClearDepth = pass.clearDepth;
	      }
	      
	      pass.pass.render(this.renderer, pass.writeBuffer, pass.readBuffer, delta, maskActive);
	      
	      this.renderer.autoClear = oldAutoClear;
	      this.renderer.autoClearDepth = oldAutoClearDepth;
	      
	      // if (pass.needsSwap) {
	      //   if (maskActive) {
	      //     var context = this.renderer.context;
	      //     context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
	      //     this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
	      //     context.stencilFunc(context.EQUAL, 1, 0xffffffff);
	      //   }
	      //   
	      //   this.swapBuffers();
	      // }
	      // 
	      // if (THREE.MaskPass !== undefined) {
	      //   if (pass instanceof THREE.MaskPass) {
	      //     maskActive = true;
	      //   } else if (pass instanceof THREE.ClearMaskPass) {
	      //     maskActive = false;
	      //   }
	      // }
	    }
	  },
	  
	  // reset: function(renderTarget) {
	  //   
	  //   if (renderTarget === undefined) {
	  //     var size = renderTarget.getSize();
	  //     renderTarget = this.renderTarget1.clone();
	  //     renderTarget.setSize(size.width, size.height);
	  //   }
	  //   
	  //   this.renderTarget1.dispose();
	  //   this.renderTarget2.dispose();
	  //   this.renderTarget1 = renderTarget;
	  //   this.renderTarget2 = renderTarget.clone();
	  //   this.writeBuffer = this.renderTarget1;
	  //   this.readBuffer = this.renderTarget2;
	  // },
	  // 
	  // setSize: function(width, height) {
	  //   this.renderTarget1.setSize(width, height);
	  //   this.renderTarget2.setSize(width, height);
	  //   
	  //   for (var i=0; i<this.passes.length; i++) {
	  //     this.passes[i].setSize(width, height);
	  //   }
	  // }
	});

	//// BASE PASS

	var Pass = function() {
	  
	  // if set to true, the pass is processes by the composer
	  this.enabled = true;
	  
	  // if set to true, the pass indicates to swap read and write buffer after rendering
	  this.needsSwap = true;
	  
	  // if set to true, the pass clears its buffer before rendering
	  this.clear = false;
	  
	  // if set to true, the result of the pass is rendering to screen
	  this.renderToScreen = false;
	};

	Object.assign(Pass.prototype, {
	  
	  setSize: function(width, height) {
	  },
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    console.error("PIXY.Pass: .render() must be implemented in derived pass.");
	  }
	});

	//// CLEAR PASS

	var ClearPass = function(clearColor, clearAlpha) {
	  
	  Pass.call(this);
	  
	  this.needsSwap = false;
	  this.clearColor = (clearColor !== undefined) ? clearColor : 0x000000;
	  this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;
	  // this.clearDepth;
	  // this.colorMask;
	};

	ClearPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: ClearPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    var oldClearColor, oldClearAlpha, oldClearDepth;
	    
	    if (this.clearColor) {
	      oldClearColor = renderer.getClearColor().getHex();
	      oldClearAlpha = renderer.getClearAlpha();
	      renderer.setClearColor(this.clearColor, this.clearAlpha);
	    }
	    
	    if (this.clearDepth) {
	      oldAutoClearDepth = renderer.autoClearDepth;
	      renderer.autoClearDepth = this.clearDepth;
	    }
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(this.colorMask[0], this.colorMask[1], this.colorMask[2], this.colorMask[3]);
	    }
	    
	    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
	    renderer.clear();
	    
	    if (this.clearColor) {
	      renderer.setClearColor(oldClearColor, oldClearAlpha);
	    }
	    
	    if (this.clearDepth) {
	      renderer.autoClearDepth = oldAutoClearDepth;
	    }
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(true, true, true, true);
	    }
	  }
	});

	//// MASK PASS

	var MaskPass = function(scene, camera) {
	  
	  Pass.call(this);
	  
	  this.scene = scene;
	  this.camera = camera;
	  this.clear = true;
	  this.needsSwap = false;
	  this.inverse = false;
	};

	MaskPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: MaskPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    var context = renderer.context;
	    var state = renderer.state;
	    
	    // don't update color or depth
	    
	    state.buffers.color.setMask(false);
	    state.buffers.depth.setMask(false);
	    
	    // lock buffers
	    
	    state.buffers.color.setLocked(true);
	    state.buffers.depth.setLocked(true);
	    
	    // set up stencil
	    
	    var writeValue, clearValue;
	    
	    if (this.inverse) {
	      writeValue = 0;
	      clearValue = 1;
	    } else {
	      writeValue = 1;
	      clearValue = 0;
	    }
	    
	    state.buffers.stencil.setTest(true);
	    state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
	    state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
	    state.buffers.stencil.setClear(clearValue);
	    
	    // draw into the stencil buffer
	    
	    // renderer.render(this.scene, this.camera, readBuffer, this.clear);
	    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	    
	    // only render where stencil is set to 1
	    
	    state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1
	    state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
	  }
	});

	//// CLEAR MASK PASS

	var ClearMaskPass = function() {
	  
	  ClearMaskPass.call(this);
	  
	  this.needsSwap = false;
	};

	ClearMaskPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    renderer.state.buffers.stencil.setTest(false);
	  }
	});

	//// RENDER PASS

	var RenderPass = function(scene, camera, overrideMaterial, clearColor, clearAlpha) {
	  
	  Pass.call(this);
	  
	  this.scene = scene;
	  this.camera = camera;
	  this.overrideMaterial = overrideMaterial;
	  this.clearColor = clearColor;
	  this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;
	  this.clear = true;
	  this.clearDepth = true;
	  // this.colorMask = null;
	  this.needsSwap = false;
	};

	RenderPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: RenderPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    var oldAutoClear = renderer.autoClear;
	    var oldAutoClearDepth = renderer.autoClearDepth;
	    renderer.autoClear = false;
	    renderer.autoClearDepth = this.clearDepth;
	    
	    this.scene.overrideMaterial = this.overrideMaterial;
	    
	    var oldClearColor, oldClearAlpha;
	    
	    if (this.clearColor) {
	      oldClearColor = renderer.getClearColor().getHex();
	      oldClearAlpha = renderer.getClearAlpha();
	      renderer.setClearColor(this.clearColor, this.clearAlpha);
	    }
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(this.colorMask[0], this.colorMask[1], this.colorMask[2], this.colorMask[3]);
	    }
	    
	    renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer, this.clear);
	    
	    if (this.clearColor) {
	      renderer.setClearColor(oldClearColor, oldClearAlpha);
	    }
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(true, true, true, true);
	    }
	    
	    this.scene.overrideMaterial = null;
	    renderer.autoClear = oldAutoClear;
	    renderer.autoClearDepth = oldAutoClearDepth;
	  }
	});

	//// SHADER PASS

	var ShaderPass = function(shader, textureID) {
	  
	  Pass.call(this);
	  
	  this.textureID = (textureID !== undefined) ? textureID : "tDiffuse";
	  
	  if (shader instanceof THREE.ShaderMaterial) {
	    this.uniforms = shader.uniforms;
	    this.material = shader;
	  } else if (shader) {
	    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
	    this.material = new THREE.ShaderMaterial({
	      defines: shader.defines || {},
	      uniforms: this.uniforms,
	      vertexShader: shader.vertexShader,
	      fragmentShader: shader.fragmentShader,
	      depthTest: false,
	      depthWrite: false
	    });
	  }
	  
	  this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	  this.scene = new THREE.Scene();
	  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null);
	  this.scene.add(this.quad);
	};

	ShaderPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: ShaderPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    if (this.uniforms[ this.textureID ]) {
	      this.uniforms[ this.textureID ].value = readBuffer.texture;
	    }
	    
	    this.quad.material = this.material;
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(this.colorMask[0], this.colorMask[1], this.colorMask[2], this.colorMask[3]);
	    }
	    
	    if (this.renderToScreen) {
	      renderer.render(this.scene, this.camera);
	    } else {
	      renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	    }
	    
	    if (this.colorMask) {
	      renderer.getContext().colorMask(true, true, true, true);
	    }
	  }
	});

	//// SCREEN PASS

	var ScreenPass = function() {
	  
	  Pass.call(this);
	  
	  this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	  this.scene = new THREE.Scene();
	  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null);
	  this.scene.add(this.quad);
	};

	ScreenPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: ScreenPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	  }
	});

	var CopyPass = function() {
	  
	  ShaderPass.call(this, ShaderLib.copy);
	  
	};

	CopyPass.prototype = Object.assign(Object.create(ShaderPass.prototype), {
	  
	  constructor: CopyPass
	  
	});

	var EdgePass = function(aspect, strength, color, idedge, resolution) {
	  
	  ScreenPass.call(this);
	  
	  this.aspect = aspect;
	  this.strength = strength;
	  this.color = color;
	  this.idedge = idedge;
	  this.source = null;
	  
	  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	  this.edgeBuffer = new THREE.WebGLRenderTarget(resolution, resolution, pars);
	  this.edgeExpandBuffer = new THREE.WebGLRenderTarget(resolution, resolution, pars);
	  
	  var edgeShader = ShaderLib.edge;
	  this.edgeUniforms = THREE.UniformsUtils.clone(edgeShader.uniforms);
	  this.edgeMaterial = new THREE.ShaderMaterial({
	    uniforms: this.edgeUniforms,
	    vertexShader: edgeShader.vertexShader,
	    fragmentShader: edgeShader.fragmentShader
	  });
	  
	  var edgeExpandShader = ShaderLib.edgeExpand;
	  this.edgeExpandUniforms = THREE.UniformsUtils.clone(edgeExpandShader.uniforms);
	  this.edgeExpandMaterial = new THREE.ShaderMaterial({
	    uniforms: this.edgeExpandUniforms,
	    vertexShader: edgeExpandShader.vertexShader,
	    fragmentShader: edgeExpandShader.fragmentShader
	  });
	  
	  var edgeIDShader = ShaderLib.edgeID;
	  this.idUniforms = THREE.UniformsUtils.clone(edgeIDShader.uniforms);
	  this.idMaterial = new THREE.ShaderMaterial({
	    uniforms: this.idUniforms,
	    vertexShader: edgeIDShader.vertexShader,
	    fragmentShader: edgeIDShader.fragmentShader
	  });
	  
	  var compositeShader = ShaderLib.edgeComposite;
	  this.compositeUniforms = THREE.UniformsUtils.clone(compositeShader.uniforms);
	  this.compositeMaterial = new THREE.ShaderMaterial({
	    uniforms: this.compositeUniforms,
	    vertexShader: compositeShader.vertexShader,
	    fragmentShader: compositeShader.fragmentShader
	  });
	};

	EdgePass.prototype = Object.assign(Object.create(ScreenPass.prototype), {
	  
	  constructor: EdgePass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    if (this.idedge) {
	      this.idUniforms.aspect.value = this.aspect;
	      this.idUniforms.step.value = 1.0;
	      this.idUniforms.tDiffuse.value = this.source;
	      this.quad.material = this.idMaterial;
	      renderer.render(this.scene, this.camera, this.edgeBuffer);
	      this.quad.material = null;
	    } else {
	      this.edgeUniforms.aspect.value = this.aspect;
	      this.edgeUniforms.tDiffuse.value = this.source;
	      this.quad.material = this.edgeMaterial;
	      renderer.render(this.scene, this.camera, this.edgeBuffer);
	      this.quad.material = null;
	    }
	    
	    var edgeTexture = this.edgeBuffer.texture;
	    if (this.strength > 0.0) {
	      this.edgeExpandUniforms.aspect.value = this.aspect;
	      this.edgeExpandUniforms.strength.value = this.strength;
	      this.edgeExpandUniforms.tDiffuse.value = this.edgeBuffer.texture;
	      this.quad.material = this.edgeExpandMaterial;
	      renderer.render(this.scene, this.camera, this.edgeExpandBuffer);
	      this.quad.material = null;
	      edgeTexture = this.edgeExpandBuffer.texture;
	    }
	    
	    
	    this.compositeUniforms.edgeColor.value = this.color;
	    // this.compositeUniforms.edgeColor.value = new THREE.Vector3(1.0, 0.0, 0.0);
	    this.compositeUniforms.tEdge.value = edgeTexture;
	    this.compositeUniforms.tDiffuse.value = readBuffer.texture;
	    this.quad.material = this.compositeMaterial;
	    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	    this.quad.material = null;
	    
	    // this.quad.material = new THREE.MeshBasicMaterial({map: this.edgeBuffer.texture});
	    // this.quad.material = new THREE.MeshBasicMaterial({map: this.source});
	    // renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	    // this.quad.material = null;
	  }
	});

	/**
	 * Supersample Anti-Aliasing Render Pass
	 *
	 * This manual approach to SSAA re-renders the scene ones for each sample with camera jitter and accumulates the results.
	 */
	var SSAARenderPass = function(scene, camera, clearColor, clearAlpha) {
	  
	  Pass.call(this);
	  
	  this.scene = scene;
	  this.camera = camera;
	  this.sampleLevel = 4; // specified as n, where the number of samples is 2^n, so sampleLevel = 4, is 2^4 samples, 16.
	  this.unbiased = true;
	  
	  // as we need to clear the buffer in this pass, clearColor must be set to something, defaults to black.
	  this.clearColor = (clearColor !== undefined) ? clearColor : 0x000000;
	  this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;
	  
	  // if (THREE.CopyShader === undefined) {
	  //   console.error("PIXY.SSAARenderPass rlies on THREEE.CopyShader");
	  // }
	  
	  var copyShader = ShaderLib.copy;
	  this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);
	  this.copyMaterial = new THREE.ShaderMaterial({
	    uniforms: this.copyUniforms,
	    vertexShader: copyShader.vertexShader,
	    fragmentShader: copyShader.fragmentShader,
	    premultipliedAlpha: true,
	    transparent: true,
	    blending: THREE.AdditiveBlending,
	    depthTest: false,
	    depthWrite: false
	  });
	  
	  this.camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	  this.scene2 = new THREE.Scene();
	  this.quad2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copyMaterial);
	  this.quad2.frustumCulled = false; // Avoid getting clipped
	  this.scene2.add(this.quad2);
	};

	SSAARenderPass.prototype = Object.assign(Object.create(Pass.prototype), {
	  
	  constructor: SSAARenderPass,
	  
	  dispose: function() {
	    if (this.sampleRenderTarget) {
	      this.sampleRenderTarget.dispose();
	      this.sampleRenderTarget = null;
	    }
	  },
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    if (!this.sampleRenderTarget) {
	      this.sampleRenderTarget = new THREE.WebGLRenderTarget(readBuffer.width, readBuffer.height, 
	        { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
	    }
	    
	    var jitterOffsets = SSAARenderPass.JitterVectors[ Math.max(0, Math.min(this.sampleLevel, 5)) ];
	    var autoClear = renderer.autoClear;
	    renderer.autoClear = false;
	    
	    var oldClearColor = renderer.getClearColor().getHex();
	    var oldClearAlpha = renderer.getClearAlpha();
	    
	    var baseSampleWeight = 1.0 / jitterOffsets.length;
	    var roundingRange = 1/32;
	    this.copyUniforms["tDiffuse"].value = this.sampleRenderTarget.texture;
	    
	    var width = readBuffer.width, height = readBuffer.height;
	    
	    // render the scene multiple times, each slightly jitter offset from the last and accumulate the results
	    for (var i=0; i<jitterOffsets.length; i++) {
	      var jitterOffset = jitterOffsets[i];
	      if (this.camera.setViewOffset) {
	        this.camera.setViewOffset(width, height, jitterOffset[0] * 0.0625, jitterOffset[1] * 0.0625, // 0.0625 = 1/16
	          width, height);
	      }
	      
	      var sampleWeight = baseSampleWeight;
	      if (this.unbiased) {
	        // the theory is that equal weights for each sample lead to an accumulation of rounding errors.
	        // The following equation varies the sampleWeight per sample so that it is uniformly distributed
	        // across a range of values whose rounding errors cancel each other out.
	        var uniformCenteredDistribution = (-0.5 + (i + 0.5) / jitterOffsets.length);
	        sampleWeight += roundingRange * uniformCenteredDistribution;
	      }
	      
	      this.copyUniforms["opacity"].value = sampleWeight;
	      renderer.setClearColor(this.clearColor, this.clearAlpha);
	      renderer.render(this.scene, this.camera, this.sampleRenderTarget, true);

	      if (i === 0) {
	        renderer.setClearColor(0x000000, 1.0);
	      }
	      renderer.render(this.scene2, this.camera2, writeBuffer, (i === 0));
	    }
	    
	    
	    if (this.camera.clearViewOffset) {
	      this.camera.clearViewOffset();
	    }
	    
	    renderer.autoClear = autoClear;
	    renderer.setClearColor(oldClearColor, oldClearAlpha);
	  }
	});

	// These jitter vectors are specified in integers because it is easier.
	// I am assuming a [-8, 8] integer grid, but it needs to be mapped onto [-0.5,0.5)
	// before being used, thus these integers needs to be scaled by 1/16
	//
	// 
	// Sample patterns reference: https://msdn.microsoft.com/en-us/library/windows/desktop/ff476218%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
	SSAARenderPass.JitterVectors = [
	  [
	    [ 0, 0 ]
	  ],
	  [
	    [ 4, 4 ], [ - 4, - 4 ]
	  ],
	  [
	    [ - 2, - 6 ], [ 6, - 2 ], [ - 6, 2 ], [ 2, 6 ]
	  ],
	  [
	    [ 1, - 3 ], [ - 1, 3 ], [ 5, 1 ], [ - 3, - 5 ],
	    [ - 5, 5 ], [ - 7, - 1 ], [ 3, 7 ], [ 7, - 7 ]
	  ],
	  [
	    [ 1, 1 ], [ - 1, - 3 ], [ - 3, 2 ], [ 4, - 1 ],
	    [ - 5, - 2 ], [ 2, 5 ], [ 5, 3 ], [ 3, - 5 ],
	    [ - 2, 6 ], [ 0, - 7 ], [ - 4, - 6 ], [ - 6, 4 ],
	    [ - 8, 0 ], [ 7, - 4 ], [ 6, 7 ], [ - 7, - 8 ]
	  ],
	  [
	    [ - 4, - 7 ], [ - 7, - 5 ], [ - 3, - 5 ], [ - 5, - 4 ],
	    [ - 1, - 4 ], [ - 2, - 2 ], [ - 6, - 1 ], [ - 4, 0 ],
	    [ - 7, 1 ], [ - 1, 2 ], [ - 6, 3 ], [ - 3, 3 ],
	    [ - 7, 6 ], [ - 3, 6 ], [ - 5, 7 ], [ - 1, 7 ],
	    [ 5, - 7 ], [ 1, - 6 ], [ 6, - 5 ], [ 4, - 4 ],
	    [ 2, - 3 ], [ 7, - 2 ], [ 1, - 1 ], [ 4, - 1 ],
	    [ 2, 1 ], [ 6, 2 ], [ 0, 4 ], [ 4, 4 ],
	    [ 2, 5 ], [ 7, 5 ], [ 5, 6 ], [ 3, 7 ]
	  ]
	];

	/**
	 * Temporal Anti-Aliasing Render Pass
	 *
	 * When there is no motion in the scene, the TAA render pass accumulates jittered camera samples across frames to create a high quality anti-aliased result.
	 *
	 * TODO: Add support for motion vector pas so that accumulation of samples across frames can occur on dynamics scenes.
	 */
	var TAARenderPass = function(scene, camera, params) {
	  
	  if (SSAARenderPass === undefined) {
	    console.error("PIXY.TAARenderPass relise on PIXY.SSAARenderPass");
	  }
	  
	  SSAARenderPass.call(this, scene, camera, params);
	  
	  this.sampleLevel = 0;
	  this.accumulate = false;
	};

	TAARenderPass.JitterVectors = SSAARenderPass.JitterVectors;

	TAARenderPass.prototype = Object.assign(Object.create(SSAARenderPass.prototype), {
	  
	  constructor: TAARenderPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta) {
	    
	    if (!this.accumulate) {
	      SSAARenderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta);
	      this.accumulateIndex = -1;
	      return;
	    }
	    
	    var jitterOffsets = TAARenderPass.JitterVectors[5];
	    if (!this.sampleRenderTarget) {
	      this.sampleRenderTarget = new THREE.WebGLRenderTarget(readBuffer.width, readBuffer.eheight, this.params);
	    }
	    
	    if (!this.holdRenderTarget) {
	      this.holdRenderTarget = new THREE.WebGLRenderTarget(readBuffer.width, readBuffer.eheight, this.params);
	    }
	    
	    if (this.accumulate && this.accumulateIndex === -1) {
	      SSAARenderPass.prototype.render.call(this, renderer, this.holdRenderTarget, readBuffer, delta);
	      this.accumulateIndex = 0;
	    }
	    
	    var autoClear = renderer.autoClear;
	    renderer.autoClear = false;
	    
	    var sampleWeight = 1.0 / jitterOffsets.length;
	    if (this.accumulateIndex >= 0 && this.accumulateIndex < jitterOffsets.length) {
	      this.copyUniforms["opacity"].value = sampleWeight;
	      this.copyUniforms["tDiffsue"].value = writeBuffer.texture;
	      
	      // render the scene multiple times, each slightly jitter offset from the last and accumulate the results
	      var numSamplesPerFrame = Math.pow(2, this.sampleLevel);
	      for (var i=0; i<numSamplesPerFrame; i++) {
	        var j = this.accumulateIndex;
	        var jitterOffset = jitterOffsets[j];
	        if (this.camera.setViewOffset) {
	          this.camera.setViewOffset(readBuffer.width, readBuffer.height, 
	            jitterOffset[0] * 0.0625, jitterOffset[1] * 0.0625, // 0.0625 = 1/16
	            readBuffer.width, readBuffer.height);
	        }
	        
	        renderer.render(this.scene, this.camera, writeBuffer, true);
	        renderer.render(this.scene2, this.camera2, this.sampleRenderTarget, (this.accumulateIndex === 0));
	        
	        this.accumulateIndex++;
	        if (this.accumulateIndex >= jitterOffsets.length) {
	          break;
	        }
	      }
	      
	      if (this.camera.clearViewOffset) {
	        this.camera.clearViewOffset();
	      }
	    }
	    
	    var accumulationWeight = this.accumulateIndex * sampleWeight;
	    if (accumulationWeight > 0) {
	      this.copyUniforms["opacity"].value = 1.0;
	      this.copyUniforms["tDiffuse"].value = this.sampleRenderTarget.texture;
	      renderer.render(this.scene2, this.camera2, writeBuffer, true);
	    }
	    if (accumulationWeight < 1.0) {
	      this.copyUniforms["opacity"].value = 1.0 - accumulationWeight;
	      this.copyUniforms["tDiffuse"].value = this.holdRenderTarget.texture;
	      renderer.render(this.scene2, this.camera2, writeBuffer, (accumulationWeight === 0));
	    }
	    
	    renderer.autoClear = autoClear;
	  }
	});

	var UnrealBloomPass = function(resolution, strength, radius, threshold) {
	  
	  ScreenPass.call(this);
	  
	  this.strength = (strength !== undefined) ? strength : 1;
	  this.radius = (radius !== undefined) ? radius : 1.0;
	  this.threshold = (threshold !== undefined) ? threshold : 1.0;
	  this.resolution = (resolution !== undefined) ? new THREE.Vector2(resolution.x, resolution.y) : new THREE.Vector2(256, 256);
	  
	  var pars = {
	    minFilter: THREE.LinearFilter,
	    magFilter: THREE.LinearFilter,
	    format: THREE.RGBAFormat
	  };
	  this.rtHori = [];
	  this.rtVert = [];
	  this.nMips = 5;
	  var resx = Math.round(this.resolution.x/2);
	  var resy = Math.round(this.resolution.y/2);
	  
	  this.rtBright = new THREE.WebGLRenderTarget(resx, resy, pars);
	  this.rtBright.texture.generateMipmaps = false;
	  
	  for (var i=0; i<this.nMips; i++) {
	    
	    var rt = new THREE.WebGLRenderTarget(resx, resy, pars);
	    rt.texture.generateMipmaps = false;
	    this.rtHori.push(rt);
	    
	    rt = new THREE.WebGLRenderTarget(resx, resy, pars);
	    rt.texture.generateMipmaps = false;
	    this.rtVert.push(rt);
	    
	    resx = Math.round(resx/2);
	    resy = Math.round(resy/2);
	  }
	  
	  // luminosity high pass material
	  
	  // if (LuminosityHighPassShader === undefined) {
	  //   console.error("PIXY.UnrealBloomPass relies on PIXY.LuminosityHighPassShader");
	  // }
	  
	  var shader = ShaderLib.luminosityHighPass;
	  this.highPassUniforms = THREE.UniformsUtils.clone(shader.uniforms);
	  this.highPassUniforms.luminosityThreshold.value = this.threshold;
	  this.highPassUniforms.smoothWidth.value = 0.01;
	  
	  this.highPassMaterial = new THREE.ShaderMaterial({
	    uniforms: this.highPassUniforms,
	    vertexShader: shader.vertexShader,
	    fragmentShader: shader.fragmentShader,
	    depthTest: false,
	    depthWrite: false
	  });
	  
	  // Gaussian Blur Materials
	  this.separableBlurMaterials = [];
	  var kernelSizeArray = [3, 5, 7, 9, 11];
	  var resx = Math.round(this.resolution.x/2);
	  var resy = Math.round(this.resolution.y/2);
	  for (var i=0; i<this.nMips; i++) {
	    this.separableBlurMaterials.push(this.getSeparableBlurMaterial(kernelSizeArray[i]));
	    this.separableBlurMaterials[i].uniforms.texSize.value = new THREE.Vector2(resx, resy);
	    
	    resx = Math.round(resx/2);
	    resy = Math.round(resy/2);
	  }
	  
	  // Composite material
	  
	  this.compositeMaterial = this.getCompositeMaterial(this.nMips);
	  this.compositeMaterial.uniforms.blurTexture1.value = this.rtVert[0].texture;
	  this.compositeMaterial.uniforms.blurTexture2.value = this.rtVert[1].texture;
	  this.compositeMaterial.uniforms.blurTexture3.value = this.rtVert[2].texture;
	  this.compositeMaterial.uniforms.blurTexture4.value = this.rtVert[3].texture;
	  this.compositeMaterial.uniforms.blurTexture5.value = this.rtVert[4].texture;
	  this.compositeMaterial.uniforms.bloomStrength.value = this.strength;
	  this.compositeMaterial.uniforms.bloomRadius.value = 0.1;
	  this.compositeMaterial.needsUpdate = true;
	  
	  var bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2];
	  this.compositeMaterial.uniforms.bloomFactors.value = bloomFactors;
	  this.bloomTintColors = [
	    new THREE.Vector3(1,1,1),
	    new THREE.Vector3(1,1,1),
	    new THREE.Vector3(1,1,1),
	    new THREE.Vector3(1,1,1),
	    new THREE.Vector3(1,1,1)
	  ];
	  this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors;
	  
	  // Copy material
	  
	  // if (THREE.CopyShader === undefined) {
	  //   console.error("PIXY.UnrealBloomPass relies on THREE.CopyShader");
	  // }
	  
	  var copyShader = ShaderLib.copy;
	  this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);
	  this.copyUniforms.opacity.value = 1.0;
	  this.copyMaterial = new THREE.ShaderMaterial({
	    uniforms: this.copyUniforms,
	    vertexShader: copyShader.vertexShader,
	    fragmentShader: copyShader.fragmentShader,
	    blending: THREE.AdditiveBlending,
	    depthTest: false,
	    depthWrite: false,
	    transparent: true
	  });
	  
	  this.enabled = true;
	  this.needsSwap = false;
	  this.oldClearColor = new THREE.Color();
	  this.oldClearAlpha = 1;
	  this.quad.frustumCulled = false; // Avoid getting clipped
	};

	UnrealBloomPass.prototype = Object.assign(Object.create(ScreenPass.prototype), {
	  
	  constructor: UnrealBloomPass,
	  
	  dispose: function() {
	    for (var i=0; i<this.rtHori.length(); i++) {
	      this.rtHori[i].dispose();
	    }
	    for (var i=0; i<this.rtVert.length(); i++) {
	      this.rtVert[i].dispose();
	    }
	    this.rtBright.dispose();
	  },

	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    this.oldClearColor.copy(renderer.getClearColor());
	    this.oldClearAlpha = renderer.getClearAlpha();
	    
	    var oldAutoClear = renderer.autoClear;
	    renderer.autoClear = false;
	    renderer.setClearColor(new THREE.Color(0,0,0), 0);
	    
	    if (maskActive) {
	      renderer.context.disable(renderer.context.STENCIL_TEST);
	    }
	    
	    // 1. Extract Bright Areas
	    this.highPassUniforms.tDiffuse.value = readBuffer.texture;
	    this.highPassUniforms.luminosityThreshold.value = this.threshold;
	    this.quad.material = this.highPassMaterial;
	    renderer.render(this.scene, this.camera, this.rtBright, true);
	    
	    // 2. Blur All the mips progressively
	    var inputRenderTarget = this.rtBright;
	    
	    for (var i=0; i<this.nMips; i++) {
	      
	      this.quad.material = this.separableBlurMaterials[i];
	      this.separableBlurMaterials[i].uniforms.tDiffuse.value = inputRenderTarget.texture;
	      this.separableBlurMaterials[i].uniforms.direction.value = UnrealBloomPass.BlurDirectionX;
	      renderer.render(this.scene, this.camera, this.rtHori[i], true);
	      
	      this.separableBlurMaterials[i].uniforms.tDiffuse.value = this.rtHori[i].texture;
	      this.separableBlurMaterials[i].uniforms.direction.value = UnrealBloomPass.BlurDirectionY;
	      renderer.render(this.scene, this.camera, this.rtVert[i], true);
	      
	      inputRenderTarget = this.rtVert[i];
	    }
	    
	    // Composite All the mips
	    this.quad.material = this.compositeMaterial;
	    this.compositeMaterial.uniforms.bloomStrength.value = this.strength;
	    this.compositeMaterial.uniforms.bloomRadius.value = this.radius;
	    this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors;
	    renderer.render(this.scene, this.camera, this.rtHori[0], true);
	    
	    // Blend it additively over the input texture
	    this.quad.material = this.copyMaterial;
	    this.copyUniforms.tDiffuse.value = this.rtHori[0].texture;
	    
	    if (maskActive) {
	      renderer.context.enable(renderer.context.STENCIL_TEST);
	    }
	    
	    renderer.render(this.scene, this.camera, writeBuffer, false);
	    
	    renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
	    renderer.autoClear = oldAutoClear;
	  },
	  
	  getSeparableBlurMaterial: function(kernelRadius) {
	    
	    return new THREE.ShaderMaterial({
	      defines: {
	        "KERNEL_RADIUS": kernelRadius,
	        "SIGMA": kernelRadius
	      },
	      
	      uniforms: {
	        "tDiffuse": { value: null },
	        "texSize": { value: new THREE.Vector2(0.5, 0.5) },
	        "direction": { value: new THREE.Vector2(0.5, 0.5) }
	      },
	      
	      vertexShader: [
	        "varying vec2 vUv;",
	        "void main() {",
	        "  vUv = uv;",
	        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	        "}",
	      ].join("\n"),
	      
	      fragmentShader: [
	        "#include <common>",
	        "varying vec2 vUv;",
	        "uniform sampler2D tDiffuse;",
	        "uniform vec2 texSize;",
	        "uniform vec2 direction;",
	        
	        "float gaussianPdf(in float x, in float sigma) {",
	        "  return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;",
	        "}",
	        
	        "void main() {",
	        "  vec2 invSize = 1.0 / texSize;",
	        "  float fSigma = float(SIGMA);",
	        "  float weightSum = gaussianPdf(0.0, fSigma);",
	        "  vec3 diffuseSum = texture2D(tDiffuse, vUv).rgb * weightSum;",
	        "  for (int i=0; i<KERNEL_RADIUS; i++) {",
	        "    float x = float(i);",
	        "    float w = gaussianPdf(x, fSigma);",
	        "    vec2 uvOffset = direction * invSize * x;",
	        "    vec3 sample1 = texture2D(tDiffuse, vUv + uvOffset).rgb;",
	        "    vec3 sample2 = texture2D(tDiffuse, vUv - uvOffset).rgb;",
	        "    diffuseSum += (sample1 + sample2) * w;",
	        "    weightSum += 2.0 * w;",
	        "  }",
	        "  gl_FragColor = vec4(diffuseSum / weightSum, 1.0);",
	        "}"
	      ].join("\n"),
	      
	      depthTest: false,
	      depthWrite: false
	    });
	  },
	    
	  getCompositeMaterial: function(nMips) {
	    
	    return new THREE.ShaderMaterial({
	      defines: {
	        "NUM_MIPS": nMips
	      },
	      
	      uniforms: {
	        "blurTexture1": { value: null },
	        "blurTexture2": { value: null },
	        "blurTexture3": { value: null },
	        "blurTexture4": { value: null },
	        "blurTexture5": { value: null },
	        "dirtTexture": { value: null },
	        "bloomStrength": { value: 1.0 },
	        "bloomFactors": { value: null },
	        "bloomTintColors": { value: null },
	        "bloomRadius": { value: 0.0 }
	      },
	      
	      vertexShader: [
	        "varying vec2 vUv;",
	        "void main() {",
	        "  vUv = uv;",
	        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	        "}"
	      ].join("\n"),
	      
	      fragmentShader: [
	        "varying vec2 vUv;",
	        "uniform sampler2D blurTexture1;",
	        "uniform sampler2D blurTexture2;",
	        "uniform sampler2D blurTexture3;",
	        "uniform sampler2D blurTexture4;",
	        "uniform sampler2D blurTexture5;",
	        "uniform sampler2D dirtTexture;",
	        "uniform float bloomStrength;",
	        "uniform float bloomRadius;",
	        "uniform float bloomFactors[NUM_MIPS];",
	        "uniform vec3 bloomTintColors[NUM_MIPS];",
	        
	        "float lerpBloomFactor(const in float factor) {",
	        "  float mirrorFactor = 1.2 - factor;",
	        "  return mix(factor, mirrorFactor, bloomRadius);",
	        "}",
	        
	        "void main() {",
	        "  gl_FragColor = bloomStrength * ",
	        "    (lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + ",
	        "     lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + ",
	        "     lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + ",
	        "     lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + ",
	        "     lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv));",
	        "}"
	      ].join("\n"),
	      
	      depthTest: false,
	      depthWrite: false
	    });
	  }
	});

	UnrealBloomPass.BlurDirectionX = new THREE.Vector2(1.0, 0.0);
	UnrealBloomPass.BlurDirectionY = new THREE.Vector2(0.0, 1.0);

	var SSAOPass = function(parameters) {
	  
	  ScreenPass.call(this);
	  
	  this.angleBias = parameters.angleBias || 40.0;
	  this.radius = parameters.radius || 4.5;
	  this.maxRadius = parameters.maxRadius || 0.5;
	  this.strength = parameters.strength || 10.0;
	  this.resolution = parameters.resolution || new THREE.Vector2(512,512);
	  this.depthTexture = parameters.depthTexture || null;
	  this.sceneCamera = parameters.camera || null;
	  this.downsampling = parameters.downsampling || 2;
	  this.ssaoOnly = false;
	  
	  var pars = {
	    minFilter: THREE.LinearFilter,
	    magFilter: THREE.LinearFilter,
	    format: THREE.RGBFormat,
	    generateMipmaps: false,
	    stencilBuffer: false
	  };
	  
	  this.rtBlur1 = new THREE.WebGLRenderTarget(this.resolution.x/this.downsampling, this.resolution.y/this.downsampling, pars);
	  this.rtBlur2 = new THREE.WebGLRenderTarget(this.resolution.x/this.downsampling, this.resolution.y/this.downsampling, pars);
	  
	  this.makeUniforms = THREE.UniformsUtils.clone(ShaderLib.ssao2.uniforms);
	  this.makeMaterial = new THREE.ShaderMaterial({
	    uniforms: this.makeUniforms,
	    vertexShader: ShaderLib.ssao2.vertexShader,
	    fragmentShader: ShaderLib.ssao2.fragmentShader,
	    depthTest: false,
	    depthWrite: false
	  });
	  
	  this.blurXUniforms = THREE.UniformsUtils.clone(ShaderLib.ssao2Blur.uniforms);
	  this.blurXMaterial = new THREE.ShaderMaterial({
	    uniforms: this.blurXUniforms,
	    vertexShader: ShaderLib.ssao2Blur.vertexShader,
	    fragmentShader: ShaderLib.ssao2Blur.fragmentShader,
	    depthTest: false,
	    depthWrite: false
	  });
	  
	  this.blurYUniforms = THREE.UniformsUtils.clone(ShaderLib.ssao2Blur.uniforms);
	  this.blurYMaterial = new THREE.ShaderMaterial({
	    uniforms: this.blurYUniforms,
	    vertexShader: ShaderLib.ssao2Blur.vertexShader,
	    fragmentShader: ShaderLib.ssao2Blur.fragmentShader,
	    depthTest: false,
	    depthWrite: false
	  });
	  
	  var INV_LN2 = 1.44269504;
	  var SQRT_LN2 = 0.832554611;
	  var blurSigma = (4.0 + 1.0) * 0.5;
	  var blurFalloff = INV_LN2 / (2.0 * blurSigma * blurSigma);
	  var blurDepthThreshold = 2.0 * SQRT_LN2 * 0.2;
	  var texSizeInvWidth = 1.0 / this.resolution.x;
	  var texSizeInvHeight = 1.0 / this.resolution.y;
	  this.blurXUniforms.tAO.value = this.rtBlur1.texture;
	  this.blurXUniforms.blurParams.value.set(texSizeInvWidth, 0.0, blurFalloff, 1.0);
	  this.blurYUniforms.tAO.value = this.rtBlur2.texture;
	  this.blurYUniforms.blurParams.value.set(0.0, texSizeInvWidth, blurFalloff, 1.0);
	  
	  this.compositeUniforms = THREE.UniformsUtils.clone(ShaderLib.ssao2Composite.uniforms);
	  this.compositeMaterial = new THREE.ShaderMaterial({
	    uniforms: this.compositeUniforms,
	    vertexShader: ShaderLib.ssao2Composite.vertexShader,
	    fragmentShader: ShaderLib.ssao2Composite.fragmentShader,
	    depthTest: false, depthWrite: false
	  });
	  
	  this.viewUniforms = THREE.UniformsUtils.clone(ShaderLib.view.uniforms);
	  this.viewMaterial = new THREE.ShaderMaterial({
	    uniforms: this.viewUniforms,
	    vertexShader: ShaderLib.view.vertexShader,
	    fragmentShader: ShaderLib.view.fragmentShader,
	    depthTest: false, depthWrite: false
	  });
	  this.viewUniforms.type.value = PIXY.ViewR;
	  // this.viewUniforms.type.value = PIXY.ViewRGB;
	};

	SSAOPass.prototype = Object.assign(Object.create(ScreenPass.prototype), {
	  
	  constructor: SSAOPass,
	  
	  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
	    
	    if (maskActive) {
	      renderer.context.disable(renderer.context.STENCIL_TEST);
	    }
	    
	    var rad = this.radius;
	    var rad2 = rad*rad;
	    var negInvRad2 = -1.0 / rad2;
	    
	    var angleBias = radians(this.angleBias);
	    var tanAngleBias = Math.tan(angleBias);
	    
	    var cot = 1.0 / Math.tan(radians(this.sceneCamera.fov*0.5));
	    var resX = this.resolution.x;
	    var resY = this.resolution.y;
	    var maxRadius = this.maxRadius * Math.min(this.resolution.x, this.resolution.y);
	    var invAoResX = 1.0 / this.resolution.x;
	    var invAoResY = 1.0 / this.resolution.y;
	    var focal1 = cot * (this.resolution.y / this.resolution.x);
	    var focal2 = cot;
	    var invFocal1 = 1.0 / focal1;
	    var invFocal2 = 1.0 / focal2;
	    var uvToVA0 = 2.0 * invFocal1;
	    var uvToVA1 = -2.0 * invFocal2;
	    var uvToVB0 = -1.0 * invFocal1;
	    var uvToVB1 = 1.0 * invFocal2;
	    
	    this.makeUniforms.radiusParams.value.set(rad, rad2, negInvRad2, maxRadius);
	    this.makeUniforms.biasParams.value.set(angleBias, tanAngleBias, this.strength, 1.0);
	    this.makeUniforms.screenParams.value.set(resX, resY, invAoResX, invAoResY);
	    this.makeUniforms.uvToViewParams.value.set(uvToVA0, uvToVA1, uvToVB0, uvToVB1);
	    this.makeUniforms.focalParams.value.set(focal1, focal2, invFocal1, invFocal2);
	    this.makeUniforms.cameraParams.value.set(this.sceneCamera.near, this.sceneCamera.far);
	    this.makeUniforms.tDepth.value = this.depthTexture;
	    
	    // MAKE SSAO
	    this.quad.material = this.makeMaterial;
	    renderer.render(this.scene, this.camera, this.rtBlur1, false);
	    
	    for (var i=0; i<2; ++i) {
	      this.quad.material = this.blurXMaterial;
	      renderer.render(this.scene, this.camera, this.rtBlur2, false);
	      
	      this.quad.material = this.blurYMaterial;
	      renderer.render(this.scene, this.camera, this.rtBlur1, false);
	    }
	    
	    var target = this.rtBlur1;
	    
	    if (this.ssaoOnly) {
	      this.quad.material = this.viewMaterial;
	      this.viewUniforms.tDiffuse.value = target.texture;
	    }
	    else {
	      this.quad.material = this.compositeMaterial;
	      this.compositeUniforms.tDiffuse.value = readBuffer.texture;
	      this.compositeUniforms.tAO.value = target.texture;
	    }
	    
	    renderer.render(this.scene, this.camera, writeBuffer, false);
	  }
	});

	var AreaLight = function() {
	  
	  this.position = new THREE.Vector3();
	  this.color = new THREE.Color(0xffffff);
	  this.distance = 50.0;
	  this.decay = 1.0;
	  this.radius = 1.0;

	};

	Object.assign(AreaLight.prototype, {
	  
	  constructor: AreaLight
	  
	});

	var TubeLight = function() {
	  
	  this.start = new THREE.Vector3();
	  this.end = new THREE.Vector3();
	  this.color = new THREE.Color(0xffffff);
	  this.distance = 50.0;
	  this.decay = 1.0;
	  this.radius = 1.0;

	};

	Object.assign(TubeLight.prototype, {
	  
	  constructor: TubeLight
	  
	});

	var RectLight = function() {
	  
	  this.positions = [];
	  this.normal = new THREE.Vector3(0,0,1);
	  this.tangent = new THREE.Vector3(1,0,0);
	  this.color = new THREE.Color(0xffffff);
	  this.intensity = 1.0;
	  this.width = 1.0;
	  this.height = 1.0;
	  this.distance = 50.0;
	  this.decay = 1.0;
	  this.matrix = new THREE.Matrix4();
	  this.numPositions = 4;
	};

	Object.assign(RectLight.prototype, {
	  
	  constructor: RectLight
	  
	});

	var ViewRGB = 0;
	var ViewAlpha = 1;
	var ViewR = 2;
	var ViewG = 3;
	var ViewB = 4;
	var ViewDecodeRGB = 5;
	var ViewDecodeDepth = 6;
	var ViewDepth = 7;

	// import './polyfills.js';

	exports.ShaderChunk = ShaderChunk;
	exports.ShaderUtils = ShaderUtils;
	exports.Shader = Shader;
	exports.ShaderLib = ShaderLib;
	exports.Solar = Solar;
	exports.Ocean = Ocean;
	exports.ShadowMesh = ShadowMesh;
	exports.GPUParticle = GPUParticle;
	exports.HeightField = HeightField;
	exports.ScreenSprite = ScreenSprite;
	exports.Composer = Composer;
	exports.Pass = Pass;
	exports.ClearPass = ClearPass;
	exports.MaskPass = MaskPass;
	exports.ClearMaskPass = ClearMaskPass;
	exports.RenderPass = RenderPass;
	exports.ShaderPass = ShaderPass;
	exports.ScreenPass = ScreenPass;
	exports.CopyPass = CopyPass;
	exports.EdgePass = EdgePass;
	exports.SSAARenderPass = SSAARenderPass;
	exports.TAARenderPass = TAARenderPass;
	exports.UnrealBloomPass = UnrealBloomPass;
	exports.SSAOPass = SSAOPass;
	exports.AreaLight = AreaLight;
	exports.TubeLight = TubeLight;
	exports.RectLight = RectLight;
	exports.any = any;
	exports.all = all;
	exports.radians = radians;
	exports.degrees = degrees;
	exports.pow2 = pow2;
	exports.gauss = gauss;
	exports.buildKernel = buildKernel;
	exports.buildGause = buildGause;
	exports.createCubeMap = createCubeMap;
	exports.createMesh = createMesh;
	exports.createPlaneReflectMatrix = createPlaneReflectMatrix;
	exports.createShadowedLight = createShadowedLight;
	exports.clearTextOut = clearTextOut;
	exports.textOut = textOut;
	exports.textOutMatrix4 = textOutMatrix4;
	exports.floatFormat = floatFormat;
	exports.dumpMatrix4 = dumpMatrix4;
	exports.ViewRGB = ViewRGB;
	exports.ViewAlpha = ViewAlpha;
	exports.ViewR = ViewR;
	exports.ViewG = ViewG;
	exports.ViewB = ViewB;
	exports.ViewDecodeRGB = ViewDecodeRGB;
	exports.ViewDecodeDepth = ViewDecodeDepth;
	exports.ViewDepth = ViewDepth;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
