PixSpriteStudioShaderChunks = {
  
  //// COMMON CHUNK
  
  common: [
    "#extension GL_OES_standard_derivatives : enable",
    "precision highp float;",
    "#define PI 3.14159265359",
    "#define PI2 6.28318530718",
    "#define RECIPROCAL_PI 0.31830988618",
    "#define RECIPROCAL_PI2 0.15915494",
    "#define LOG2 1.442695",
    "#define EPSILON 1e-6",
    "",
    // handy value clamping to 0 - 1 range
    // "#define saturate(a) clamp(a, 0.0, 1.0)",
    "#define whiteCompliment(a) (1.0 - saturate(a))",
    "",
    "float pow2(const in float x) { return x*x; }",
    "float pow3(const in float x) { return x*x*x; }",
    "float pow4(const in float x) { float x2 = x*x; return x2*x2; }",
    "float pow5(const in float x) { float x2 = x*x; return x2*x2*x; }",
    "float averate(const in vec3 color) { return dot(color, vec3(0.3333)); }",
    "",
    "struct PSInput {",
    "  vec2 position;",
    "  vec2 mouse;",
    "  vec2 coord;",
    "  vec2 uv;",
    "};",
    "",
    "struct PSOutput {",
    "  vec3 color;",
    "  float opacity;",
    "};",
    // expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
    // do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
    "highp float rand(const in vec2 uv) {",
    "  const highp float a = 12.9898, b = 78.233, c = 43758.5453;",
    "  highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, PI);",
    "  return fract(sin(sn) * c);",
    "}",
    "float rgb2gray(vec3 c) {",
    "  return dot(c, vec3(0.3, 0.59, 0.11));",
    "}",
    "",
    "float rgb2l(vec3 c) {",
    "  float fmin = min(min(c.r, c.g), c.b);",
    "  float fmax = max(max(c.r, c.g), c.b);",
    "  return (fmax + fmin) * 0.5;", // Luminance
    "}",
    "",
    // https://github.com/liovch/GPUImage/blob/master/framework/Source/GPUImageColorBalanceFilter.m
    "vec3 rgb2hsl(vec3 c) {",
    "  vec3 hsl;",
    "  float fmin = min(min(c.r, c.g), c.b);",
    "  float fmax = max(max(c.r, c.g), c.b);",
    "  float delta = fmax - fmin;",
    
    "  hsl.z = (fmax + fmin) * 0.5;", // Luminance
    
    "  if (delta == 0.0) {",  // This is a gray, no chroma...
    "    hsl.x = 0.0;", // Hue
    "    hsl.y = 0.0;", // Saturation
    "  } else {", // Chromatic data...
    "    if (hsl.z < 0.5) {",
    "      hsl.y = delta / (fmax + fmin);", // Saturation
    "    } else {",
    "      hsl.y = delta / (2.0 - fmax - fmin);", // Saturation
    "    }",
    
    "    float deltaR = (((fmax - c.r) / 6.0) + (delta / 2.0)) / delta;",
    "    float deltaG = (((fmax - c.g) / 6.0) + (delta / 2.0)) / delta;",
    "    float deltaB = (((fmax - c.b) / 6.0) + (delta / 2.0)) / delta;",
    
    "    if (c.r == fmax) {",
    "      hsl.x = deltaB - deltaG;", // Hue
    "    } else if (c.g == fmax) {",
    "      hsl.x = (1.0 / 3.0) + deltaR - deltaB;", // Hue
    "    } else if (c.b == fmax) {",
    "      hsl.x = (2.0 / 3.0) + deltaG - deltaR;", // Hue
    "    }",
    
    "    if (hsl.x < 0.0) {",
    "      hsl.x += 1.0;", // Hue
    "    } else if (hsl.x > 1.0) {",
    "      hsl.x -= 1.0;", // Hue
    "    }",
    "  }",
    "  return hsl;",
    "}",
    "",
    "float hue2rgb(float f1, float f2, float hue) {",
    "  if (hue < 0.0) {",
    "    hue += 1.0;",
    "  } else if (hue > 1.0) {",
    "    hue -= 1.0;",
    "  }",
    "  float res;",
    "  if ((6.0*hue) < 1.0) {",
    "    res = f1 + (f2-f1) * 6.0 * hue;",
    "  } else if ((2.0 * hue) < 1.0) {",
    "    res = f2;",
    "  } else if ((3.0 * hue) < 2.0) {",
    "    res = f1 + (f2-f1) * ((2.0/3.0) - hue) * 6.0;",
    "  } else {",
    "    res = f1;",
    "  }",
    "  return res;",
    "}",
    "",
    "vec3 hsl2rgb(vec3 hsl) {",
    "  vec3 rgb;",
    "  if (hsl.y == 0.0) {",
    "    rgb = vec3(hsl.z);", // Luminace
    "  } else {",
    "    float f2;",
    "    if (hsl.z < 0.5) {",
    "      f2 = hsl.z * (1.0 + hsl.y);",
    "    } else {",
    "      f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);",
    "    }",
    "    float f1 = 2.0 * hsl.z - f2;",
    "    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));",
    "    rgb.g = hue2rgb(f1, f2, hsl.x);",
    "    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));",
    "  }",
    "  return rgb;",
    "}",
    "",
    "vec3 hsv2rgb(vec3 c) {",
    "  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
    "  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
    "  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
    "}",
    "",
    "float interpolate(float a, float b, float x) {",
    "  float f = (1.0 - cos(x * PI)) * 0.5;",
    "  return a * (1.0 - f) + b * f;",
    "}",
    "",
    "float rnd(vec2 p) {",
    "  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);",
    "}",
    "",
    "float irnd(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec4 v = vec4(rnd(vec2(i.x,       i.y)),",
    "                rnd(vec2(i.x + 1.0, i.y)),",
    "                rnd(vec2(i.x,       i.y + 1.0)),",
    "                rnd(vec2(i.x + 1.0, i.y + 1.0)));",
    "  return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);",
    "}",
    "",
    "float noise(vec2 p) {",
    "  float t = 0.0;",
    "  for (int i=0; i<NOISE_OCTAVE; i++) {",
    "    float freq = pow(2.0, float(i));",
    "    float amp  = pow(NOISE_PERSISTENCE, float(NOISE_OCTAVE - i));",
    "    t += irnd(vec2(p.x / freq, p.y / freq)) * amp;",
    "  }",
    "  return t;",
    "}",
    "",
    "float snoise(vec2 p, vec2 q, vec2 r) {",
    "  return noise(vec2(p.x,       p.y      )) *        q.x  *        q.y +",
    "         noise(vec2(p.x,       p.y + r.y)) *        q.x  * (1.0 - q.y) +",
    "         noise(vec2(p.x + r.x, p.y      )) * (1.0 - q.x) *        q.y +",
    "         noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);",
    "}",
    // https://www.shadertoy.com/view/Xd23Dh
    // Created by inigo quilez - iq/2014
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    // This is a procedural pattern that has 2 parameters, that generalizes cell-noise, 
    // perlin-noise and voronoi, all of which can be written in terms of the former as:
    //
    // cellnoise(x) = pattern(0,0,x)
    // perlin(x) = pattern(0,1,x)
    // voronoi(x) = pattern(1,0,x)
    //
    // From this generalization of the three famouse patterns, a new one (which I call 
    // "Voronoise") emerges naturally. It's like perlin noise a bit, but within a jittered 
    // grid like voronoi):
    //
    // voronoise(x) = pattern(1,1,x)
    //
    // Not sure what one would use this generalization for, because it's slightly slower 
    // than perlin or voronoise (and certainly much slower than cell noise), and in the 
    // end as a shading TD you just want one or another depending of the type of visual 
    // features you are looking for, I can't see a blending being needed in real life.  
    // But well, if only for the math fun it was worth trying. And they say a bit of 
    // mathturbation can be healthy anyway!
    // Use the mouse to blend between different patterns:
    // ell noise    u=0,v=0
    // voronoi      u=1,v=0
    // perlin noise u=0,v1=
    // voronoise    u=1,v=1
    // More info here: http://iquilezles.org/www/articles/voronoise/voronoise.htm
    "vec3 iqhash3( vec2 p )",
    "{",
    "    vec3 q = vec3( dot(p,vec2(127.1,311.7)), ",
    "				   dot(p,vec2(269.5,183.3)), ",
    "				   dot(p,vec2(419.2,371.9)) );",
    "	return fract(sin(q)*43758.5453);",
    "}",

    "float iqnoise( in vec2 x, float u, float v )",
    "{",
    "    vec2 p = floor(x);",
    "    vec2 f = fract(x);",
    
    "  float k = 1.0+63.0*pow(1.0-v,4.0);",
    "	float va = 0.0;",
    "	float wt = 0.0;",
    "    for( int j=-2; j<=2; j++ )",
    "    for( int i=-2; i<=2; i++ )",
    "    {",
    "        vec2 g = vec2( float(i),float(j) );",
    "		vec3 o = iqhash3( p + g )*vec3(u,u,1.0);",
    "		vec2 r = g - f + o.xy;",
    "		float d = dot(r,r);",
    "		float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );",
    "		va += o.z*ww;",
    "		wt += ww;",
    "    }",
    "    return va/wt;",
    "}",
  ].join("\n"),
  
  fragPars: [
    "uniform vec2 resolution;",
    "uniform vec2 mouse;",
    "uniform float time;",
    "uniform vec3 cameraPos;",
    "uniform vec3 cameraDir;",
    "uniform sampler2D tDiffuse;",
  ].join("\n"),
  
  frag: [
    "  PSInput pin;",
    "  pin.position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);",
    "  pin.mouse = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);",
    "  pin.coord = gl_FragCoord.xy;",
    "  pin.uv = gl_FragCoord.xy / resolution;",
    "",
    "  PSOutput pout;",
    "  pout.color = vec3(0.0);",
    "  pout.opacity = 1.0;"
  ].join("\n"),
  
  fragEnd: [
    "  gl_FragColor = vec4(pout.color, pout.opacity);",
  ].join("\n"),
  
  
  //// TOON CHUNK
  
  toonUniforms: {
  },
  
  toonFragPars: [
  ].join("\n"),
  
  toonFrag: [
    "  float c = pout.color.x;",
    "  if (c > 0.5) c = 1.0;",
    "  else if (c > 0.3) c = 0.5;",
    "  else if (c > 0.1) c = 0.2;",
    "  else c = 0.0;",
    "  pout.color = vec3(c);",
  ].join("\n"),
  
  //// MANDELBLOT CHUNK
  
  mandelblotFrag: [
    "int j=0;",
    "vec2 x = pin.position + vec2(-0.5, 0.0);",
    "float y = 1.5 - pin.mouse.x * 0.5;",
    "vec2 z = vec2(0.0);",
    
    "for (int i=0; i<360; i++) {",
    "  j++;",
    "  if (length(z) > 2.0) break;",
    "  z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x * y;",
    "}",
    
    "float h = mod(time * 20.0, 360.0) / 360.0;",
    "vec3 color = hsv2rgb(vec3(h, 1.0, 1.0));",
    
    "float t = float(j) / 360.0;",
    "pout.color = color * t;",
  ].join("\n"),
  
  
  //// JULIA CHUNK
  
  juliaFrag: [
    "int j=0;",
    "vec2 x = vec2(-0.345, 0.654);",
    "vec2 y = vec2(time * 0.005, 0.0);",
    "vec2 z = pin.position;",
    
    "for (int i=0; i<360; i++) {",
    "  j++;",
    "  if (length(z) > 2.0) break;",
    "  z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x + y;",
    "}",
    
    "float h = abs(mod(time * 15.0 - float(j), 360.0) / 360.0);",
    "vec3 color = hsv2rgb(vec3(h, 1.0, 1.0));",
    
    "float t = float(j) / 360.0;",
    "pout.color = color * t;"
  ].join("\n"),
  
  
  //// WOOD CHUNK
  
  woodUniforms: {
    "frequency": { value: 30.0 },
    "powerExponent": { value: 1.0 },
  },
  
  woodFragPars: [
    "uniform float frequency;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  woodFrag: [
    "float t = sin(length(pin.position) * frequency + time * 5.0);",
    // "float t = sin(length(pin.mouse - pin.position) * 30.0 + time * 5.0);",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// CIRCLE CHUNK
  
  circleUniforms: {
    "circleRadius": { value: 1.1 },
    "powerExponent": { value: 1.0 },
  },
  
  circleFragPars: [
    "uniform float circleRadius;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  circleFrag: [
    // "float t = 1.1 - length(pin.mouse - pin.position);",
    "float t = circleRadius - length(pin.position);",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// SOLAR CHUNK
  
  solarUniforms: {
    "intensity": { value: 10.0 },
    "powerExponent": { value: 1.0 },
  },
  
  solarFragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  solarFrag: [
    // "float t = 1.0 / (length(pin.position) * solarIntensity);",
    "float t = intensity / (length(pin.position));",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// SPARK CHUNK
  
  sparkUniforms: {
    "intensity": { value: 10.0 },
    "powerExponent": { value: 1.0 },
  },
  
  sparkFragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  sparkFrag: [
    "vec2 n = normalize(pin.position);",
    "float t = intensity / length(pin.position);",
    "float r = noise(n*resolution+time) * 2.0;",
    "r = max(t-r, 0.0);",
    "r = pow(r, powerExponent);",
    "pout.color = vec3(r);",
  ].join("\n"),
  
  
  //// RING CHUNK
  
  ringUniforms: {
    "ringRadius": { value: 0.5 },
    "ringWidth": { value: 0.1 },
    "powerExponent": { value: 1.0 },
  },
  
  ringFragPars: [
    "uniform float ringRadius;",
    "uniform float ringWidth;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  ringFrag: [
    "float t = ringWidth / (abs(ringRadius - length(pin.position)));",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// RING ANIMATION CHUNK
  
  ringAnimFrag: [
    "float t = 0.02 / abs(sin(time) - length(pin.position));",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// GRADATION CHUNK
  
  gradationUniforms: {
    "direction": { value: new THREE.Vector2(0.0, 1.0) },
    "powerExponent": { value: 1.0 }
  },
  
  gradationFragPars: [
    "uniform vec2 direction;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  gradationFrag: [
    "float len = length(direction);",
    "if (len == 0.0) {",
    "  pout.color = vec3(1.0);",
    "} else {",
      "vec2 n = normalize(direction);",
      "vec2 pos = pin.position - (-direction);",
      "float t = (dot(pos, n) * 0.5) / len;",
      "t = pow(t, powerExponent);",
      "pout.color = vec3(t);",
    "}",
  ].join("\n"),
  
  
  gradationLineUniforms: {
    "direction": { value: new THREE.Vector2(0.0, 1.0) },
    "powerExponent": { value: 1.0 },
    "gradationOffset": { value: 0.0 }
  },
  
  gradationLineFragPars: [
    "uniform vec2 direction;",
    "uniform float powerExponent;",
    "uniform float gradationOffset;",
  ].join("\n"),
  
  gradationLineFrag: [
    "float len = length(direction);",
    "if (len == 0.0) {",
    "  pout.color = vec3(1.0);",
    "} else {",
      "vec2 n = normalize(direction);",
      "vec2 pos = pin.position - (-direction);",
      "float t = (dot(pos, n) * 0.5 + gradationOffset) / len;",
      "float r = rnd(vec2(pin.uv.x, 0.0)) + 1e-6;",
      "float a = 1.0 / (1.0 - r);",
      "t = a*t - a*r;",
      "t = pow(t, powerExponent);",
      "pout.color = vec3(t);",
    "}",
  ].join("\n"),
  
  
  //// FLASH CHUNK (ZOOM LINE)
  
  flashUniforms: {
    "frequency": { value: 10.0 },
    "powerExponent": { value: 1.0 }
  },
  
  flashFragPars: [
    "uniform float frequency;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  flashFrag: [
    "float t = atan(pin.position.y, pin.position.x) + time;",
    "t = sin(t * frequency);",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// CONE CHUNK
  
  coneUniforms: {
    "direction": { value: new THREE.Vector2(0.0, 1.0) },
    "powerExponent": { value: 1.0 }
  },
  
  coneFragPars: [
    "uniform vec2 direction;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  coneFrag: [
    "vec2 n = normalize(direction);",
    "float len = length(direction);",
    "vec2 pos = pin.position - (-direction);",
    "float t = (dot(pos, n) * 0.5) / len;",
    // "t /= (length(pin.position) * len * 0.5);",
    "t /= (length(pos) * len * 0.5);",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// FLOWER CHUNK
  
  flowerUniforms: {
    "flowerPetals": { value: 6.0 },
    "flowerRadius": { value: 0.5 },
    "intensity": { value: 0.1 },
    "powerExponent": { value: 1.0 }
  },
  
  flowerFragPars: [
    "uniform float flowerPetals;",
    "uniform float flowerRadius;",
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  flowerFrag: [
    "float u = sin((atan(pin.position.y, pin.position.x) + time * 0.5) * flowerPetals) * flowerRadius;",
    "float t = intensity / abs(u - length(pin.position));",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// FLOWER+FUN CHUNK
  
  flowerFunUniforms: {
    "flowerPetals": { value: 6.0 },
    "flowerRadius": { value: 0.5 },
    "flowerOffset": { value: 0.2 },
    "intensity": { value: 0.1 },
    "powerExponent": { value: 1.0 }
  },
  
  flowerFunFragPars: [
    "uniform float flowerPetals;",
    "uniform float flowerRadius;",
    "uniform float flowerOffset;",
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  flowerFunFrag: [
    "float u = abs(sin((atan(pin.position.y, pin.position.x) - length(pin.position) + time) * flowerPetals) * flowerRadius) + flowerOffset;",
    "float t = intensity / abs(u - length(pin.position));",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// WAVE RING CHUNK
  
  waveRingUniforms: {
    "ringRadius": { value: 0.5 },
    "ringWidth": { value: 0.01 },
    "frequency": { value: 20.0 },
    "amplitude": { value: 0.01 },
    "powerExponent": { value: 1.0 }
  },
  
  waveRingFragPars: [
    "uniform float ringRadius;",
    "uniform float ringWidth;",
    "uniform float frequency;",
    "uniform float amplitude;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  waveRingFrag: [
    "float u = sin((atan(pin.position.y, pin.position.x) + time * 0.5) * frequency) * amplitude;",
    "float t = ringWidth / abs(ringRadius + u - length(pin.position));",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  //// NOISE CHUNK
  
  noiseFrag: [
    "vec2 t = pin.coord + vec2(time * 10.0);",
    "float n = noise(t);",
    "pout.color = vec3(n);",
  ].join("\n"),
  
  
  //// SEEMLESS NOISE CHUNK
  
  seemlessNoiseUniforms: {
    "noiseScale": { value: 64.0 }
  },
  
  seemlessNoiseFragPars: [
    "uniform float noiseScale;"
  ].join("\n"),
  
  seemlessNoiseFrag: [
    "float map = min(resolution.x, resolution.y) * noiseScale;",
    "vec2 t = mod(pin.coord.xy + vec2(time * 10.0), map);",
    "float n = snoise(t, t / map, vec2(map));",
    "pout.color = vec3(n);",
  ].join("\n"),
  
  
  //// HEIGHT2NORMAL CHUNK
  
  height2NormalUniforms: {
    "heightScale": { value: 10.0 },
  },
  
  height2NormalFragPars: [
    "uniform float heightScale;",
  ].join("\n"),
    
  // height2NormalFrag: [
  //   // Determine the offsets
  //   "vec3 vPixelSize = vec3(1.0 / resolution.x, 0.0, -1.0 / resolution.x);",
  //   
  //   // Take three samples to determine two vectors that can be
  //   // use to generate the normal at this pixel
  //   "float h0 = texture2D(tDiffuse, pin.uv).r;",
  //   "float h1 = texture2D(tDiffuse, pin.uv + vPixelSize.xy).r;",
  //   "float h2 = texture2D(tDiffuse, pin.uv + vPixelSize.yx).r;",
  //   
  //   "vec3 v01 = vec3(vPixelSize.xy, h1-h0);",
  //   "vec3 v02 = vec3(vPixelSize.yx, h2-h0);",
  //   "vec3 n = cross(v01, v02);",
  //   
  //   // Can be useful to scale the Z component to tweak the
  //   // amount bumps show up, less than 1.0 will make them
  //   // more apparent, greater than 1.0 will smooth them out
  //   "n.z *= 0.5;",
  //   
  //   "pout.color = n;",
  //   
  // ].join("\n"),
  
  height2NormalFrag: [
    "const vec2 size = vec2(2.0, 0.0);",
    "vec3 vPixelSize = vec3(1.0 / resolution.x, 0.0, -1.0 / resolution.x);",
    "float s01 = texture2D(tDiffuse, pin.uv + vPixelSize.xy).x;",
    "float s21 = texture2D(tDiffuse, pin.uv + vPixelSize.zy).x;",
    "float s10 = texture2D(tDiffuse, pin.uv + vPixelSize.yx).x;",
    "float s12 = texture2D(tDiffuse, pin.uv + vPixelSize.yz).x;",
    "vec3 va = normalize(vec3(size.xy,(s21-s01)*heightScale));",
    "vec3 vb = normalize(vec3(size.yx,(s10-s12)*heightScale));",
    "vec3 n = cross(va,vb);",
    "pout.color = n*0.5 + 0.5;",
  ].join("\n"),
  
  // THREE.JS (NormalMapShader.js)
  // height2NormalFrag: [
  //   "vec3 vPixelSize = vec3(1.0 / resolution.x, 0.0, -1.0 / resolution.x);",
  //   "float s11 = texture2D(tDiffuse, pin.uv).x;",
  //   "float s01 = texture2D(tDiffuse, pin.uv + vPixelSize.xy).x;",
  //   "float s10 = texture2D(tDiffuse, pin.uv + vPixelSize.yx).x;",
  //   "vec3 n = normalize(vec3((s11-s10) * heightScale, (s11-s01)*heightScale, 2.0));",
  //   "pout.color = n*0.5 + 0.5;",
  // ].join("\n"),
  
  // height2NormalFrag: [
  //   "vec3 vPixelSize = vec3(1.0 / resolution.x, 0.0, -1.0 / resolution.x);",
  //   "float s01 = texture2D(tDiffuse, pin.uv + vPixelSize.xy).x;",
  //   "float s21 = texture2D(tDiffuse, pin.uv + vPixelSize.zy).x;",
  //   "float s10 = texture2D(tDiffuse, pin.uv + vPixelSize.yx).x;",
  //   "float s12 = texture2D(tDiffuse, pin.uv + vPixelSize.yz).x;",
  //   "vec3 n = normalize(vec3((s11-s10) * heightScale, (s11-s01)*heightScale, 2.0));",
  //   "pout.color = n*0.5 + 0.5;",
  // ].join("\n"),
  
  height2NormalSobelFrag: [
    "vec3 vPixelSize = vec3(1.0 / resolution.x, 0.0, -1.0 / resolution.x);",
    
    /*
			Coordinates are laid out as follows:
			
			    0,0 | 1,0 | 2,0
			    ----+-----+----
			    0,1 | 1,1 | 2,1
			    ----+-----+----
			    0,2 | 1,2 | 2,2
			*/
			
			// Use of the sobel filter requires the eight samples
			// surrounding the current pixel:
			"float h00 = texture2D( tDiffuse, pin.uv + vPixelSize.zz ).r;",
			"float h10 = texture2D( tDiffuse, pin.uv + vPixelSize.yz ).r;",
			"float h20 = texture2D( tDiffuse, pin.uv + vPixelSize.xz ).r;",

			"float h01 = texture2D( tDiffuse, pin.uv + vPixelSize.zy ).r;",
			"float h21 = texture2D( tDiffuse, pin.uv + vPixelSize.xy ).r;",

			"float h02 = texture2D( tDiffuse, pin.uv + vPixelSize.zx ).r;",
			"float h12 = texture2D( tDiffuse, pin.uv + vPixelSize.yx ).r;",
			"float h22 = texture2D( tDiffuse, pin.uv + vPixelSize.xx ).r;",
			
			// The Sobel X kernel is:
			//
			// [ 1.0  0.0  -1.0 ]
			// [ 2.0  0.0  -2.0 ]
			// [ 1.0  0.0  -1.0 ]
			
			"float Gx = h00 - h20 + 2.0 * h01 - 2.0 * h21 + h02 - h22;",
						
			// The Sobel Y kernel is:
			//
			// [  1.0    2.0    1.0 ]
			// [  0.0    0.0    0.0 ]
			// [ -1.0   -2.0   -1.0 ]
			
			"float Gy = h00 + 2.0 * h10 + h20 - h02 - 2.0 * h12 - h22;",
			
			// Generate the missing Z component - tangent
			// space normals are +Z which makes things easier
			// The 0.5f leading coefficient can be used to control
			// how pronounced the bumps are - less than 1.0 enhances
			// and greater than 1.0 smoothes.
			"float Gz = 0.5 * sqrt( 1.0 - Gx * Gx - Gy * Gy );",

			// Make sure the returned normal is of unit length
      "vec3 n = normalize( vec3( heightScale * Gx, heightScale * Gy, Gz ) );",
      
      // Encode
      "pout.color = n*0.5 + 0.5;",
  ].join("\n"),
  
  
  //// COLOR BALANCE
  // http://stackoverflow.com/questions/23213925/interpreting-color-function-and-adjusting-pixels-values
  
  colorBalanceUniforms: {
    // x: cyan red, y: magenta green, z: yellow blue, w: tone
    "colorBalanceShadows": { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    "colorBalanceMidtones": { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    "colorBalanceHighlights": { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    "colorBalancePreserveLuminosity": { value: false }
  },
  
  colorBalanceFragPars: [
    "uniform vec3 colorBalanceShadows;",
    "uniform vec3 colorBalanceMidtones;",
    "uniform vec3 colorBalanceHighlights;",
    "uniform bool colorBalancePreserveLuminosity;"
  ].join("\n"),
  
  // https://gist.github.com/liovch/3168961
  // https://github.com/liovch/GPUImage/blob/master/framework/Source/GPUImageColorBalanceFilter.m
  colorBalanceFrag: [
    "vec4 texel = texture2D(tDiffuse, pin.uv);",
    
    "float lightness = rgb2l(texel.rgb);",
    
    "const float a = 0.25;",
    "const float b = 0.333;",
    "const float scale = 0.7;",
    
    "float c1 = clamp((lightness - b) / -a + 0.5, 0.0, 1.0);",
    "float c2 = clamp((lightness - b) / a + 0.5, 0.0, 1.0);",
    "float c3 = clamp((lightness + b - 1.0) / -a + 0.5, 0.0, 1.0);",
    "float c4 = clamp((lightness + b - 1.0) / a + 0.5, 0.0, 1.0);",
    "vec3 shadows = colorBalanceShadows * (c1 * scale);",
    "vec3 midtones = colorBalanceMidtones * (c2 * c3 * scale);",
    "vec3 highlights = colorBalanceHighlights * (c4 * scale);",
    
    "vec3 newColor = texel.rgb + shadows + midtones + highlights;",
    "newColor = clamp(newColor, 0.0, 1.0);",
    
    "if (colorBalancePreserveLuminosity) {",
      "vec3 newHSL = rgb2hsl(newColor);",
      "pout.color = hsl2rgb(vec3(newHSL.x, newHSL.y, lightness));",
    "} else {",
    "  pout.color = newColor.xyz;",
    "}",
    "pout.opacity = texel.w;",
  ].join("\n"),
  
  
  //// POLAR CONVERSION CHUNK
  
  // https://gist.github.com/KeyMaster-/70c13961a6ed65b6677d
  // polarConversionFrag: [
  //   "vec2 polar;",
  //   "polar.y = sqrt(dot(pin.position, pin.position));",
  //   "polar.y /= resolution.x / 0.5;",
  //   "polar.y = 1.0 - polar.y;",
  //   
  //   "polar.x = atan(pin.position.y, pin.position.x);",
  //   "polar.x -= 1.57079632679;",
  //   "if (polar.x < 0.0) polar.x += 6.28318530718;",
  //   "polar.x /= 6.28318530718;",
  //   "polar.x = 1.0 - polar.x;",
  //   
  //   "vec4 c = texture2D(tDiffuse, polar);",
  //   "pout.color = c.rgb;",
  // ].join("\n"),
  
  polarConversionFragPars: [
    "vec2 cartesian(vec2 coords) {",
    "  return coords - vec2(0.5);",
    "}",
    
    "vec2 cartToPolar(vec2 coords) {",
    "  float mag = length(coords) / 0.5;",
    "  if (mag > 1.0) return vec2(0.0);",
    "  mag = clamp(mag, 0.0, 1.0);",
    "  float angle = atan(coords.y, coords.x);",
    // "  angle += 1.57079632679;",
    "  if (angle < 0.0) angle += 6.28318530718;",
    "  angle /= 6.28318530718;",
    "  return vec2(angle, mag);",
    "}"
  ].join("\n"),
  
  polarConversionFrag: [
    "vec2 coords = pin.uv - vec2(0.5);", // cartesian
    // cartesian -> polar
    "float mag = length(coords) * 2.0;", // length(coords) / 0.5
    "if (mag > 1.0) {",
    "  pout.color = vec3(0.0);",
    "} else {",
    "  mag = clamp(mag, 0.0, 1.0);",
    "  float angle = atan(coords.y, coords.x);",
    "  angle -= 1.57079632679;",
    "  if (angle < 0.0) angle += 6.28318530718;",
    "  angle /= 6.28318530718;",
    "  vec4 c = texture2D(tDiffuse, vec2(angle, mag));",
    "  pout.color = c.rgb;",
    "}",
  ].join("\n"),
  
  //// COPY CHUNK
  
  copyFrag: [
    "vec4 texel = texture2D(tDiffuse, pin.uv);",
    "pout.color = texel.rgb;",
    "pout.opacity = texel.a;"
  ].join("\n"),
  
  
  //// KOCH CUREVE CHUNK
  // https://www.shadertoy.com/view/XdcGzH
  
  kochCurveFragPars: [
    "#define A2B PI/360.0",
    "#define MaxIter 14",
    
    "const float DRadius = 0.7;",
    "const float Width = 1.4;",
    "const float Gamma = 2.2;",
    "const vec3 BackgroundColor = vec3(1.0);",
    "const vec3 CurveColor = vec3(0.0);",
    
    "float lambda, ca, sa, lscl;",
    "float aaScale;",
    "float Angle = 60.0;",
    "vec2 csa;",
    
    "float d2hline(vec2 p) {",
    "  float t = max(-1.0, min(1.0, p.x));",
    "  p.x -= t;",
    "  return length(p);",
    "}",
    
    "float DE(vec2 p) {",
    "  float d = 1.0;",
    "  float r = dot(p,p);",
    "  for (int i=0; i<MaxIter; i++) {",
    "    p.x = abs(p.x);",
    "    p.x -= 1.0 - lambda;",
    "    float t = 2.0 * min(0.0, dot(p, csa));",
    "    p -= csa * t;",
    "    p.x -= lambda;",
    "    p *= lscl;",
    "    d *= lscl;",
    "    p.x += 1.0;",
    "    r = dot(p,p);",
    "  }",
    "  return d2hline(p) / d; // length(p)-1.0;",
    "}",
    
    "float coverageFunction(float t) {",
    // this function returns the area of the part of the unit disc that is at the right of the vertical line x=t.
    // the exact coverage function is:
    // t = clamp(t, -1.0, 1.0); return (acos(t) - t*sqrt(1.0 - t*t)) / PI;
    // this is a good approximation
    "  return 1.0 - smoothstep(-1.0, 1.0, t);",
    // a better approximiation
    // t = clamp(t, -1.0, 1.0); return (t*t*t*t-5.0)*t*1.0/8.0+0.5; // but there is no virtual difference
    "}",
    
    "float coverageLine(float d, float lineWidth, float pixsize) {",
    "  d = d * 1.0 / pixsize;",
    "  float v1 = (d-0.5*lineWidth)/DRadius;",
    "  float v2 = (d+0.5*lineWidth)/DRadius;",
    "  return coverageFunction(v1) - coverageFunction(v2);",
    "}",
    
    "vec3 color(vec2 pos) {",
    "  float pixsize = dFdx(pos.x);",
    "  float v = coverageLine(abs(DE(pos)), Width, pixsize);",
    "  return pow(mix(pow(BackgroundColor, vec3(Gamma)), pow(CurveColor, vec3(Gamma)), v), vec3(1.0 / Gamma));",
    "}",
    
  ].join("\n"),
  
  kochCurveFrag: [
    "Angle = 90.0 * 0.5 * (1.0 + sin(time + 0.1 * PI));",
    "float ang = A2B * Angle;",
    "ca = cos(ang);",
    "sa = sin(ang);",
    "csa = vec2(ca, -sa);",
    "lambda = 0.5 / (ca*ca);",
    "lscl = 2.0 / lambda;",
    
    "const float scaleFactor = 1.4;",
    "vec2 uv = scaleFactor * (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;",
    "uv.y += 0.5;",
    "pout.color = color(uv);",
  ].join("\n"),
  
  
  //// FRAME CHUNK
  // https://www.shadertoy.com/view/MdX3zr
  
  flameUniforms: {
    intensity: { value: 1.0 },
    flameWidth: { value: 1.0 },
    flameScale: { value: 1.0 },
  },
  
  flameFragPars: [
    "uniform float intensity;",
    "uniform float flameWidth;",
    "uniform float flameScale;",
    
    "float flameNoise(vec3 p) {",
    "  vec3 i = floor(p);",
    "  vec4 a = dot(i, vec3(1.0, 57.0, 21.0)) + vec4(0.0, 57.0, 21.0, 78.0);",
    "  vec3 f = cos((p-i)*acos(-1.0)) * (-0.5) + 0.5;",
    "  a = mix(sin(cos(a)*a), sin(cos(1.0+a)*(1.0+a)), f.x);",
    "  a.xy = mix(a.xz, a.yw, f.y);",
    "  return mix(a.x, a.y, f.z);",
    "}",
    
    "float sphere(vec3 p, vec4 spr) {",
    "  return length(spr.xyz-p) - spr.w;",
    "}",
    
    "float flame(vec3 p) {",
    "  float d = sphere(p * vec3(1.0, 0.5, 1.0), vec4(0.0, -1.0, 0.0, 1.0));",
    "  return d + (flameNoise(p + vec3(0.0, time*2.0, 0.0)) + flameNoise(p*3.0)*0.5)*0.25*p.y;",
    "}",
    
    "float scene(vec3 p) {",
    "  return min(100.0 - length(p), abs(flame(p)));",
    "}",
    
    "vec4 raymarch(vec3 org, vec3 dir) {",
    "  float d = 0.0, glow = 0.0, eps = 0.02;",
    "  vec3 p = org;",
    "  bool glowed = false;",
    "  for (int i=0; i<64; i++) {",
    "    d = scene(p) + eps;",
    "    p += d * dir;",
    "    if (d > eps) {",
    "      if (flame(p) < 0.0) {",
    "        glowed = true;",
    "      } else if (glowed) {",
    "        glow = float(i)/64.0;",
    "      }",
    "    }",
    "  }",
    "  return vec4(p, glow);",
    "}",
  ].join("\n"),
  
  flameFrag: [
    "vec2 v = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
    "v.x *= resolution.x / resolution.y;",
    
    "vec3 org = vec3(0.0, -2.0, 4.0);",
    "vec3 dir = normalize(vec3(v.x*1.6 / flameWidth, -v.y, -1.5 * flameScale));",
    
    "vec4 p = raymarch(org, dir);",
    "float glow = p.w;",
    
    // "vec4 col = mix(vec4(1.0, 0.5, 0.1, 1.0), vec4(0.1, 0.5, 1.0, 1.0), p.y*0.02 + 0.4);",
    // "col = mix(vec4(0.0), col, pow(glow*2.0, 4.0));",
    "vec4 col = mix(vec4(0.0), vec4(1.0), pow(glow*2.0*intensity, 4.0));",
    "pout.color = col.xyz;",
    "pout.opacity = col.w;",
  ].join("\n"),
  
  
  //// CELL CHUNK
  // http://glslsandbox.com/e#37373.0
  
  cellUniforms: {
    intensity: { value: 1.0 },
    powerExponent: { value: 1.0 },
    cellSize: { value: 1.0 },
  },
  
  cellFragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",
    "uniform float cellSize;",
    
    "float lengthSqr(vec2 p) { return dot(p,p); }",
    
    "float cellNoise(vec2 p) {",
    "  return fract(sin(fract(sin(p.x) * 43.13311) + p.y) * 31.0011);",
    "}",
    
    "float worley(vec2 p) {",
    "  float d = 1e30;",
    "  for (int xo=-1; xo <= 1; ++xo) {",
    "    for (int yo=-1; yo <= 1; ++yo) {",
    "      vec2 tp = floor(p) + vec2(xo, yo);",
    "      d = min(d, lengthSqr(p - tp - vec2(cellNoise(tp))));",
    "    }",
    "  }",
    "  return 5.0 * exp(-4.0 * abs(2.0*d - 1.0));",
    "}",
    
    "float fworley(vec2 p) {",
    "  return sqrt(sqrt(sqrt(",
    "    1.0 * // light",
    // "    worley(p*5.0 + 0.3 + time * 0.525) * ",
    "    sqrt(worley(p * 50.0 / cellSize + 0.3 + time * -0.15)) * ",
    // "    sqrt(sqrt(worley(p * -10.0 + 9.3))) )));",
    "    1.0 )));",
    "}",
  ].join("\n"),
  
  cellFrag: [
    "float t = fworley(pin.uv * resolution.xy / 1500.0) * intensity;",
    "t = pow(t, powerExponent);",
    // "t *= exp(-lengthSqr(abs(0.7 * pin.uv - 1.0)));",
    // "pout.color = t * vec3(0.1, 1.5*t, 1.2*t + pow(t, 0.5-t));"
    "pout.color = vec3(t);"
  ].join("\n"),
  
  
  //// SMOKE CHUNK
  // http://glslsandbox.com/e#37011.6
  
  smokeUniforms: {
    smokeVolume: { value: 3.0 },
    smokeBeta: { value: 4.0 },
    smokeDelta: { value: 0.05 },
  },
  
  smokeFragPars: [
    "uniform float smokeVolume;",
    "uniform float smokeBeta;",
    "uniform float smokeDelta;",
    
    "float hash(float n) { return fract(sin(n) * 783.5453123); }",
    
    "float smokeNoise(in vec3 x) {",
    "  vec3 p = floor(x);",
    "  vec3 f = fract(x);",
    "  f = f*f*(3.0-2.0*f);",
    "  float n = p.x + p.y * 157.0 + 113.0 * p.z;",
    "  return mix(mix(mix(hash(n+  0.0), hash(n+  1.0), f.x),",
    "                 mix(hash(n+157.0), hash(n+158.0), f.x), f.y),",
    "             mix(mix(hash(n+113.0), hash(n+114.0), f.x),",
    "                 mix(hash(n+270.0), hash(n+271.0), f.x), f.y), f.z);",
    "}",
    
    "float fbm(vec3 p) {",
    "  float f;",
    "  f = 0.50000 * smokeNoise(p); p = p*2.02;",
    "  f += 0.2500 * smokeNoise(p); p = p*2.03;",
    "  f += 0.1250 * smokeNoise(p); p = p*2.01;",
    "  f += 0.0625 * smokeNoise(p);",
    "  return f;",
    "}",
    
    "float sdEllipsoid(in vec3 p, in vec3 r) {",
    "  return (length(p/r) - 1.0) * min(min(r.x, r.y), r.z);",
    "}",
    
    "float map(in vec3 p, float f, vec3 r) {",
    "  float den = sdEllipsoid(p, r);",
    "  den = smoothstep(-0.1, 0.25, den);",
    "  den = -den - (sin(0.0) + 1.0) * 0.3;",
    "  return clamp(den + f, 0.0, 1.0);",
    "}",
    
    // "vec3 light(vec3 ro, vec3 rd) {",
    // "  vec4 rnd = vec4(0.1, 0.2, 0.3, 0.4);",
    // "  float arclight = 0.0;",
    // "  vec3 pos = ro + rd;",
    // "  for (int i=0; i<3; ++i) {",
    // "    rnd = fract(sin(rnd * 1.111111) * 298729.258972);",
    // "    float ts = rnd.z * 4.0 * 1.61803398875 + 1.0;",
    // "    float arcfl = floor(time / ts + rnd.y) * ts;",
    // "    float arcfr = fract(time / ts + rnd.y) * ts;",
    // "    float arcseed = floor(time * 1.0 + rnd.y);",
    // "    float arcdur = rnd.x * 0.2 + 0.05;",
    // "    float arcint = smoothstep(0.1 + arcdur, arcdur, arcfr);",
    // "    arclight += exp(-0.5) * fract(sin(arcseed) * 198721.6231) * arcint;",
    // "  }",
    // "  vec3 arccol = vec3(0.9, 0.7, 0.7);",
    // "  vec3 lighting = arclight * arccol * 0.5;",
    // "  return lighting;",
    // "}",
    
    "vec3 raymarch(in vec3 ro, in vec3 rd) {",
    "  vec4 sum = vec4(0.0);",
    "  float t = 0.0;",
    "  for (int i=0; i<100; ++i) {",
    "    if (sum.a > 0.99) break;",
    "    vec3 pos = ro + t*rd;",
    "    float f = fbm(smokeBeta * pos + vec3(0.0, 0.0, 0.25) * time);",
    "    float d = map(pos, f, vec3(1.0, 1.0, 0.5));",
    // "    vec4 col = vec4(mix(vec3(0.07, 0.1, 0.2), vec3(1.5), d), 1.0);",
    "    vec4 col = vec4(mix(vec3(0.0), vec3(1.5), d), 1.0);",
    "    col *= d*smokeVolume;",
    "    sum += col * (1.0 - sum.a);",
    "    t += smokeDelta;",
    "  }",
    // "  vec3 lighting = light(ro, rd);",
    // "  vec3 rain_cloud = mix(vec3(0.0), lighting, sum.a);",
    // "  rain_cloud += sum.rgb;",
    // "  vec3 sky_color = mix(rain_cloud, vec3(0.5, 0.5, 0.3), 1.0 - sum.a);",
    // "  vec3 sky_color = mix(rain_cloud, vec3(0.0), 1.0 - sum.a);",
    // "  return clamp(sky_color, 0.0, 1.0);",
    "  return clamp(mix(sum.rgb, vec3(0.0), 1.0 - sum.a), 0.0, 1.0);",
    "}",
  ].join("\n"),
  
  smokeFrag: [
    "float rot = -1.0 * time * 0.2;",
    "vec3 ro = vec3(0.0, -0.0, -1.0);", // 4.0 * normalize(vec3(cos(rot), 0.0, sin(rot)))
    "vec3 ta = vec3(0.0);",
    
    // build ray
    "vec3 ww = normalize(ta - ro);",
    "vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));",
    "vec3 vv = normalize(cross(ww, uu));",
    "vec3 rd = normalize(pin.position.x*uu + pin.position.y*vv + 0.8*ww);",
    
    // vec3 rd = normalize(vec3(pin.position, 2.0));
    // circle
    "float circle_radius = 1.0;",
    "float border = 0.015;",
    "vec4 bkg_color = vec4(0.0);",
    "vec4 circle_color = vec4(1.0);",
    "float dist = sqrt(dot(pin.position, pin.position));",
    "if ((dist > (circle_radius + border)) || (dist < (circle_radius - border))) {",
    "  circle_color = bkg_color;",
    "}",
    
    // raymarch
    "pout.color = raymarch(ro, rd);",
  ].join("\n"),
  
  
  //// WATER CIRCULAR WAVE
  
  waterCircularWaveFrag: [
    "const float period = 0.2;",
    "const float amp = 0.05;",
    "const float lambda = 0.5;",
    "float r = sqrt(pow2(pin.position.x) + pow2(pin.position.y));",
    "float phase = 2.0 * PI * (time/period - r/lambda);",
    "if (phase >= 0.0 && phase < 2.0*PI) {",
    "  pout.color = vec3((amp * sin(phase)) / sqrt(r));",
    "} else {",
    "  pout.color = vec3(0.0);",
    "}",
  ].join("\n"),
  
  
  //// WATER PLANE WAVE
  
  waterPlaneWaveFrag: [
    "const float period = 0.2;",
    "const float amp = 0.05;",
    "const float lambda = 0.5;",
    "float r = sqrt(pow2(pin.position.x) + pow2(pin.position.y));",
    "float phase = 2.0 * PI * (time/period - pin.position.x/lambda - pin.position.y/lambda);",
    "if (phase >= 0.0 && phase < 2.0*PI) {",
    "  pout.color = vec3((amp * sin(phase)));",
    "} else {",
    "  pout.color = vec3(0.0);",
    "}",
  ].join("\n"),
  
  
  //// LIGHTNING CHUNK
  // http://glslsandbox.com/e#36774.0
  
  lightningUniforms: {
    intensity: { value: 1.0 },
    lightningFreq: { value: 1.0 },
    lightningWidth: { value: 7.0 },
  },
  
  lightningFragPars: [
    "uniform float intensity;",
    "uniform float lightningFreq;",
    "uniform float lightningWidth;",
    
    "float hash(vec2 p) {",
    "  return fract(sin(dot(vec3(p.xy,1.0), vec3(37.1, 61.7, 12.4))) * 3758.5453123);",
    "}",
    
    "float lightingNoise(in vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  f *= f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), f.x),",
    "             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x),",
    "             f.y);",
    "}",
    
    "float fbm(vec2 p) {",
    "  float v = 0.0;",
    "  v += lightingNoise(p*1.0) * 0.5;",
    "  v += lightingNoise(p*2.0) * 0.25;",
    "  v += lightingNoise(p*4.0) * 0.125;",
    "  return v;",
    "}",

  ].join("\n"),
  
  lightningFrag: [
    
    "vec2 uv = pin.uv * 2.0111 - 1.5;",
    
    "vec3 finalColor = vec3(0.0);",
    "for (int i=0; i<3; ++i) {",
    "  float amp = 80.0 + float(i) * 5.0;",
    "  float period = 0.4;",
    "  float thickness = mix(0.9, 1.0, lightingNoise(uv*10.0));",
    "  float t = abs(lightningWidth / (sin(uv.x + fbm(uv * lightningFreq + 4.0*time*period)) * amp) * thickness);",
    // "  float show = fract(abs(sin(time))) >= 0.0 ? 1.0 : 0.0;",
    // "  finalColor += t * vec3(0.2, 0.2, 1.0);",
    "  finalColor += t * vec3(0.1) * intensity;",
    "}",
    
    "pout.color = finalColor;",
  ].join("\n"),
  
  
  //// FLARE
  // https://www.shadertoy.com/view/4scXWB
  
  flareUniforms: {
    intensity: { value: 1.0 },
    powerExponent: { value: 1.0 },
  },
  
  flareFragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  flareFrag: [
    // rotation hexagon
    "vec2 A = sin(vec2(0.0, 1.57) + time);",
    "vec2 U = abs(pin.position * mat2(A, -A.y, A.x)) * mat2(2.0, 0.0, 1.0, 1.7);",
    "float t = intensity * 0.5 / max(U.x, U.y);", // glowing-spiky approx of step(max, 0.2)
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  // https://www.shadertoy.com/view/Xs33R2
  
  flare2Uniforms: {
    "intensity": { value: 1.0 },
    "powerExponent": { value: 1.0 },
  },
  
  flare2FragPars: [
    "uniform float intensity;", 
    "uniform float powerExponent;",
  ].join("\n"),
  
  flare2Frag: [
    // Particle star constants
    "const float part_int_div = 40000.;",                            // Divisor of the particle intensity. Tweak this value to make the particles more or less bright
    "const float part_int_factor_min = 0.1;",                        // Minimum initial intensity of a particle
    "const float part_int_factor_max = 100.2;",                        // Maximum initial intensity of a particle
    "const float mp_int = 12.0;",
    "const float ppow = 2.3;",

    "const vec2 part_starhv_dfac = vec2(9., 0.32);",                 // x-y transformation vector of the distance to get the horizontal and vertical star branches
    "const float part_starhv_ifac = 0.25;",                          // Intensity factor of the horizontal and vertical star branches
    "const vec2 part_stardiag_dfac = vec2(13., 0.61);",              // x-y transformation vector of the distance to get the diagonal star branches
    "const float part_stardiag_ifac = 0.19;",                        // Intensity factor of the diagonal star branches
    "const float dist_factor = 3.0;",

    "vec2 p = vec2(0.5);",
    "float dist = distance(pin.uv, p);",
    "vec2 uvp = pin.uv - p;",
    
    // rotate
    "vec2 A = sin(vec2(0.0, 1.57) + time);",
    "uvp = uvp * mat2(A, -A.y, A.x);",
    
    "float distv = distance(uvp * part_starhv_dfac + p, p);",
    "float disth = distance(uvp * part_starhv_dfac.yx + p, p);",
    "vec2 uvd = 0.7071 * vec2(dot(uvp, vec2(1.0, 1.0)), dot(uvp, vec2(1.0, -1.0)));",
    "float distd1 = distance(uvd * part_stardiag_dfac + p, p);",
    "float distd2 = distance(uvd * part_stardiag_dfac.yx + p, p);",
    "float pint1 = 1.0 / (dist * dist_factor + 0.015);",
    "pint1 += part_starhv_ifac / (disth * dist_factor + 0.01);",
    "pint1 += part_starhv_ifac / (distv * dist_factor + 0.01);",
    "pint1 += part_stardiag_ifac / (distd1 * dist_factor + 0.01);",
    "pint1 += part_stardiag_ifac / (distd2 * dist_factor + 0.01);",
    // "if (part_int_factor_max * pint1 > 6.0) {",
      "float pint = part_int_factor_max * (pow(pint1, ppow) / part_int_div) * mp_int * intensity;",
      "pint = pow(pint, powerExponent);",
      "pout.color = vec3(pint);",
    // "} else { pout.color = vec3(0.0); }"
  ].join("\n"),
  
  
  // https://www.shadertoy.com/view/4sX3Rs#
  flare3Uniforms: {
    "intensity": { value: 1.0 },
    "powerExponent":  { value: 1.0 },
  },
  
  flare3FragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",

    "float flareNoise(float x) {",
    // "  return iqnoise(vec2(x,0.0), 0.0, 0.0);",
    "  return noise(vec2(x*16.0,0.0));",
      // "float map = min(resolution.x, resolution.y);",
      // "vec2 t = mod(vec2(x,0.0), map);",
      // "return snoise(t, t / map, vec2(map));",
    "}",
    
    "float flareNoise(vec2 x) {",
    "  return iqnoise(x*512.0, 0.0, 0.0);",
    // "  return noise(x*0.1);",
    "}",
    
    "vec3 cc(vec3 color, float factor, float factor2) {",
    "  float w = color.x + color.y + color.z;",
    "  return mix(color, vec3(w)*factor, w*factor2);",
    "}",
  ].join("\n"),
  
  flare3Frag: [

    "vec2 pos = vec2(0.5);",
    "vec2 uv = pin.uv - 0.5;",
    "vec2 uvd = uv * length(uv);",
    "vec2 p = vec2(0.0) - uv;",
    "float ang = atan(p.x, p.y);",
    "float dist = length(p); dist = pow(dist, 0.1);",
    "float f0 = intensity / (length(uv-p)*16.0+1.0);",
    "f0 = f0+f0*(sin(flareNoise(time + (pos.x+pos.y)*2.2 + ang*4.0+5.954)*16.0)*0.1+dist*0.1+0.8);",
    
    // "float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;",
	  // "float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;",
	  // "float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;",
	  // "float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;",
    // 
	  // "vec2 uvx = mix(uv,uvd,-0.5);",
	  // "float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;",
	  // "float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;",
	  // "float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;",
    // 
	  // "uvx = mix(uv,uvd,-.4);",
    // "float f5 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;",
	  // "float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;",
	  // "float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;",
    // 
	  // "uvx = mix(uv,uvd,-0.5);",
	  // "float f6 = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;",
	  // "float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;",
	  // "float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;",
	
	  "vec3 c = vec3(.0);",
	  // "c.r+=f2+f4+f5+f6; c.g+=f22+f42+f52+f62; c.b+=f23+f43+f53+f63;",
	  // "c = c*1.3 - vec3(length(uvd)*.05);",
    "c+=vec3(f0);",
    
    "c *= vec3(1.4, 1.2, 1.0);",
    "c -= flareNoise(pin.uv) * 0.015;",
    "c = cc(c, 0.5, 0.1);",
    
    "float t = c.x;",
    "t = pow(t, powerExponent);",
    
    "pout.color = vec3(t);",
    // "pout.color = vec3(f0);",
    // "pout.color = vec3(iqnoise(pin.uv*64.0, 0.0, 0.0));",
  ].join("\n"),
  
  
  //// MAGIC CIRCLE
  // http://glslsandbox.com/e#36354.1
  
  magicCircleUniforms: {
  },
  
  magicCircleFragPars: [
    "vec2 rotate(vec2 p, float rad) {",
    "  mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));",
    "  return m * p;",
    "}",
    
    "vec2 translate(vec2 p, vec2 diff) {",
    "  return p - diff;",
    "}",
    
    "vec2 scale(vec2 p, float r) {",
    "  return p * r;",
    "}",
    
    "float circle(float pre, vec2 p, float r1, float r2, float power) {",
    "  float l = length(p);",
    "  if (r1 < l && l < r2) pre = 0.0;",
    "  float d = min(abs(l-r1), abs(l-r2));",
    "  float res = power / d;",
    "  return clamp(pre + res, 0.0, 1.0);",
    "}",
    
    // https://www.shadertoy.com/view/4dfXDn
    // "float triangle(float pre, vec2 p, float width, float height, float power) {",
    // "  vec2 n = normalize(vec2(height, width/2.0));",
    // "  float d = max(abs(p).x * n.x + p.y * n.y - (height * n.y), -p.y);",
    // "  float res = power / d;",
    // "  return clamp(pre + res, 0.0, 1.0);",
    // "}",
    
    "float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {",
    "  p = abs(p);",
    "  if ((half1.x < p.x || half1.y < p.y) && (p.x < half2.x && p.y < half2.y)) {",
    "    pre = max(0.01, pre);",
    "  }",
    "  float dx1 = (p.y < half1.y) ? abs(half1.x - p.x) : length(p - half1);",
    "  float dx2 = (p.y < half2.y) ? abs(half1.x - p.x) : length(p - half2);",
    "  float dy1 = (p.x < half1.x) ? abs(half1.y - p.y) : length(p - half1);",
    "  float dy2 = (p.x < half2.x) ? abs(half1.y - p.y) : length(p - half2);",
    "  float d = min(min(dx1, dx2), min(dy1, dy2));",
    "  float res = power / d;",
    "  return clamp(pre + res, 0.0, 1.0);",
    "}",
    
    "float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {",
    "  float angle = 2.0 * PI / float(num);",
    "  float d = 1e10;",
    "  for (int i=0; i<360; i++) {",
    "    if (i >= num) break;",
    "    float _d = (r1 < p.y && p.y < r2) ? abs(p.x) : min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));",
    "    d = min(d, _d);",
    "    p = rotate(p, angle);",
    "  }",
    "  float res = power / d;",
    "  return clamp(pre + res, 0.0, 1.0);",
    "}",
    
    "vec3 scene(vec2 p) {",
    "  float dest = 0.0;",
    "  p = scale(p, sin(PI*time/1.0) * 0.02+1.1);",
    
    // frame
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, time * PI / 6.0);",
    "  dest = circle(dest, q, 0.85, 0.9, 0.006);",
    "  dest = radiation(dest, q, 0.87, 0.88, 36, 0.0008);",
    " }",
    
    // outer rectangles
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, time * PI / 6.0);",
    "  const int n = 6;",
    "  float angle = PI / float(n);",
    "  q = rotate(q, floor(atan(q.x, q.y) / angle + 0.5) * angle);",
    "  for (int i=0; i<n; i++) {",
    "    dest = rectangle(dest, q, vec2(0.85/sqrt(2.0)), vec2(0.85/sqrt(2.0)), 0.0015);",
    "    q = rotate(q, angle);",
    "  }",
    " }",
    
    // circles on frame
    // " {",
    // "  vec2 q = p;",
    // "  q = rotate(q, time * PI / 6.0);",
    // "  const int n = 12;",
    // "  q = rotate(q, 2.0 * PI / float(n) / 2.0);",
    // "  float angle = 2.0 * PI / float(n);",
    // "  for (int i=0; i<n; i++) {",
    // "    dest = circle(dest, q-vec2(0.0, 0.875), 0.001, 0.05, 0.004);",
    // "    dest = circle(dest, q-vec2(0.0, 0.875), 0.001, 0.001, 0.008);",
    // "    q = rotate(q, angle);",
    // "  }",
    // " }",
  
    // inner circles
    " {",
    "   vec2 q = p;",
    "   dest = circle(dest, q, 0.5, 0.55, 0.002);",
    " }",
    
    // inner rectangles
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, -time * PI / 6.0);",
    "  const int n = 3;",
    "  float angle = PI / float(n);",
    "  q = rotate(q, floor(atan(q.x, q.y) / angle + 0.5) * angle);",
    "  for (int i=0; i<n; i++) {",
    "    dest = rectangle(dest, q, vec2(0.36, 0.36), vec2(0.36, 0.36), 0.0015);",
    "    q = rotate(q, angle);",
    "  }",
    " }",
    
    // circles on inner circle
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, -time * PI / 6.0);",
    "  const int n = 12;",
    "  q = rotate(q, 2.0 * PI / float(n) / 2.0);",
    "  float angle = 2.0 * PI / float(n);",
    "  for (int i=0; i<n; i++) {",
    "    dest = circle(dest, q-vec2(0.0, 0.53), 0.001, 0.035, 0.004);",
    "    dest = circle(dest, q-vec2(0.0, 0.53), 0.001, 0.001, 0.001);",
    "    q = rotate(q, angle);",
    "  }",
    " }",
    
    // dots
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, time * PI / 6.0);",
    "  dest = radiation(dest, q, 0.25, 0.3, 12, 0.005);",
    " }",

    // triangles
    // " {",
    // "  vec2 q = p;",
    // "  q = rotate(q, -time * PI / 6.0);",
    // "  dest = triangle(dest, q, 0.2, 0.2, 0.005);",
    // "  q = rotate(q, PI);",
    // "  dest = triangle(dest, q, 0.2, 0.2, 0.005);",
    // " }",
    
    // rectangle
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, -time * PI / 6.0);",
    "  const int n = 3;",
    "  float angle = PI / float(n);",
    "  q = rotate(q, floor(atan(q.x, q.y) / angle + 0.5) * angle);",
    "  for (int i=0; i<n; i++) {",
    "    dest = rectangle(dest, q, vec2(0.15, 0.15), vec2(0.15, 0.15), 0.0015);",
    "    q = rotate(q, angle);",
    "  }",
    " }",
    
    // dots
    " {",
    "  vec2 q = p;",
    "  q = rotate(q, time * PI / 6.0);",
    "  dest = radiation(dest, q, 0.1, 0.1, 12, 0.005);",
    " }",
    
    // rings
    // " {",
    // "  vec2 q = p;",
    // "  q = scale(q, sin(PI * time / 1.0) * 0.04 + 1.1);",
    // "  q = rotate(q, -time * PI / 6.0);",
    // "  for (float i=0.0; i<6.0; i++) {",
    // "    float r = 0.13 - i*0.01;",
    // "    q = translate(q, vec2(0.1, 0.0));",
    // "    dest = circle(dest, q, r, r, 0.002);",
    // "    q = translate(q, -vec2(0.1, 0.0));",
    // "    q = rotate(q, -time * PI / 12.0);",
    // "  }",
    // "  dest = circle(dest, q, 0.04, 0.04, 0.004);",
    // " }",
    
    // "  return pow(dest, 2.5) * vec3(1.0, 0.95, 0.8);",
    "  return vec3(pow(dest, 2.5));",
    "}",
    
  ].join("\n"),
  
  magicCircleFrag: [
    "pout.color = scene(pin.position);",
  ].join("\n"),
  
  
  //// CROSS CHUNK
  // https://www.shadertoy.com/view/ls3GRS
  
  crossUniforms: {
    "intensity": { value: 1.0 },
    "powerExponent": { value: 1.0 },
  },
  
  crossFragPars: [
    "uniform float intensity;",
    "uniform float powerExponent;",
  ].join("\n"),
  
  crossFrag: [
    "float minBright = 0.01;",
    "float maxBright = 0.04;",
    "float magnitude = (minBright + abs(sin(time) * (maxBright - minBright)));",
    
    "vec2 dist = abs(pin.position);",
    "float longDist = max(dist.x, dist.y);",
    "dist += longDist / 40.0 * (1.0 - intensity) * 10.0;",
    "vec2 uv = magnitude / dist;",
    
    "float t = (uv.x + uv.y) / 2.0;",
    "t = pow(t, powerExponent);",
    "pout.color = vec3(t);",
  ].join("\n"),
  
  
  
  //// EXPLOSION
  // https://www.shadertoy.com/view/Xd3GWn
  
  explosionUniforms: {
    explosionCameraTilt: { value: 0.0 },
    explosionCameraPan: { value: 0.0 },
    explosionRadius: { value: 1.75 },
    explosionDownScale: { value: 1.25 },
    explosionGrain: { value: 2.0 },
    explosionSpeed: { value: 0.3 },
    explosionBallness: { value: 2.0 },
    explosionGrowth: { value: 2.2 },
    explosionFade: { value: 1.6 },
    // explosionThinoutSmooth: { value: 0.7 },
    explosionDensity: { value: 1.35 },
    explosionContrast: { value: 1.0 },
    explosionRollingInitDamp: { value: 0.3 },
    explosionRollingSpeed: { value: 2.0 },
    explosionDelayRange: { value: 0.25 },
    explosionBallSpread: { value: 1.0 },
  },
  
  explosionFragPars: [
    "uniform float explosionCameraTilt;",
    "uniform float explosionCameraPan;",
    "uniform float explosionRadius;",
    "uniform float explosionDownScale;",
    "uniform float explosionGrain;",
    "uniform float explosionSpeed;",
    "uniform float explosionBallness;",
    "uniform float explosionGrowth;",
    "uniform float explosionFade;",
    // "uniform float explosionThinoutSmooth;",
    "uniform float explosionDensity;",
    "uniform float explosionContrast;",
    "uniform float explosionRollingInitDamp;",
    "uniform float explosionRollingSpeed;",
    "uniform float explosionDelayRange;",
    "uniform float explosionBallSpread;",

    // "#define NOISE_LUT",

    // In calcDens(), description mentions a bug which appeared with the old coloring.
    // "#define OLD_COLORING",
    
    // if not defined, mouse y will move camera
    // if defined, mouse y will override animation time stamp
    // "#define ALTERNATE_MOUSE",
    
    // for (slight) speed improvement, use low quality fbm and noise and compensate with some settings adjustments
    // if not defined, high quality
    // if 1, medium quality. acceptable.
    // if 2, low quality. not acceptable anymore.
    // Notice, 1 and 2 have approximately the same speed when putting also the compensation adjustments. But compared to high quality, they are indeed faster.
    // "#define LOW_Q 1",
    
    // some approximation to show the inner and outer bounds of the volumes. the y center plane is removed (transparent)
    // to give a better look and feel on the inside.
    // "#define SHOW_BOUNDS",
        
    "#define CAM_ROTATION_SPEED 11.7",
    "#define CAM_TILT .15",				// put 0. if you do not want to animate camera vertically
    "#define CAM_DIST 3.8",

    "#define MAX_MULT_EXPLOSIONS 5",

    // the bounding sphere of the explosion. this is less general but means that
    // ray cast is only performed for nearby pixels, and raycast can begin from the sphere
    // (instead of walking out from the camera)
    // "float expRadius = 1.75;",
    "float explosion_seed = 0.0;",			// keep this constant for a whole explosion, but when differing from explosion to the next one, you get non-identical looking ones
    // "float downscale = 1.25;",				// how much smaller (than expRadius) one explosion ball should be. bigger value = smaller. 1.0 = no scale down.
    "const int steps = 64;",				// iterations when marching through cloud noise. default = 64. 40 might still suffice. When putting higher, explosion becomes too dense, so make colBottom and colTop more transparent.
    // "float grain = 2.0;",					// increase for more detailed explosions, but then you should also increase iterations (and decrease step, which is done automatically)
    // "float speed = 0.3;",					// total animation speed (time stretch). nice = 0.5, default = 0.4
    // "float ballness = 2.0;",				// lower values makes explosion look more like a cloud. higher values more like a ball.
    // "float growth = 2.2;",					// initial growth to explosion ball. lower values makes explosion grow faster
    // "float fade = 1.6;",					// greater values make fade go faster but later. Thus greater values leave more smoke at the end.
    "float thinout_smooth = 0.7;",			// smoothed thinning out of the outer bounding sphere. 1.0 = no smoothening, 0.0 = heavy thinning, nice = 0.65 to 0.75
    // "float density = 1.35;",				// higher values make sharper difference between dark and bright colors. low values make more blurry, less color spread and more transparent. default = 1.25 or 1.35
    "vec2 brightness = vec2(3.0, 2.2);",	// x = constant offset, y = time-dependent factor
    "vec2 brightrad = vec2(1.3, 1.0);",	// adds some variation to the radius of the brightness falloff. x = constant offset, y = density-dependent factor
    "vec4 colBottom = vec4(1.2,0.94,0.42,0.7);",
    "vec4 colTop = vec4(0.15,0.15,0.15,0.1);",
    "float color_low = 0.25;",				// the lower the value, the more black spots appear in the explosion. the higher, the more even the explosion looks like.
    // "float contrast = 1.0;",				// final color contrast. higher values make ligher contrast. default = 1.0
    // "float rolling_init_damp = 0.3;",		// rolling animation initial damping. 0.0 = no damping. nice = 0.2, default = 0.15
    // "float rolling_speed = 2.0;",			// rolling animation speed (static over time). default = 1.0
    "const int mult_explosions = MAX_MULT_EXPLOSIONS;",	// how many explosion balls to draw
    "float variation_seed = 0.0;",			// influences position variation of the different explosion balls
    "float delay_seed = 0.0;",				// influences the start delay variation of the different explosion balls
    // "float delay_range = 0.25;",			// describes the maximum delay for explosion balls to start up. Notice, this delay is relative to one explosion ball duration, so actually before speed is applied.
    // "float ball_spread = 1.0;",			// how much to spread ball starting positions from the up vector. 0.0 = all on up vector, 1.0 = any direction between up and down vector.

    /* for up-moving explosion similar to explosion mushroom, put
    	downscale = 1.75;
    	grain = 2.7;
    	rolling_init_damp = 0.2;
    	ball_spread = 0.4;
    */

    /* for mobile device, for faster rendering but with less quality, put
    	LOW_Q 1
    	turn off FOG
    	MAX_MULT_EXPLOSIONS 3
    	steps = 25;
    */

    // Now come some fun effects which have nothing to do with the explosion effect.
    // You can switch them all off completely by commenting WITH_FUN.
    // "#define WITH_FUN",
    // 	// The fog is just for fun and has nothing to do with the explosion.
    	"#define FOG",
    // 	// Same with the stars. Just for fun.
    	"#define STARS",
        	"#define STARDISTANCE 250.2",
        	"#define STARBRIGHTNESS 0.3",
        	"#define STARDENCITY 0.05",
    	// Night scenery settings, again just for fun.
    	"#define DAY_NIGHT_CYCLE_TIME 20.",
    	"#define NIGHT_COLORING vec3(.92,.95,1.)",
    	"#define CORRIDOR_LIGHT vec3(1.,1.,.9)",
    	"#define ENLIGHTEN_PASSAGE .75",
    	// explosion enlightening the floor (faked)
    	"#define FLOOR_LIGHT_STRENGTH 1.",

    "struct Ball",
    "{",
    "  vec3 offset;",
    "  vec3 dir;",
    "  float delay;",
    "};",

    "Ball balls[MAX_MULT_EXPLOSIONS];",

    // "float tmax = 1.0 + delay_range;",
    "float getTime() {",
    "  float tmax = 1.0 + explosionDelayRange;",
    "#if defined (ALTERNATE_MOUSE) && !defined (SHADERTOY_APP)",
    "  if( iMouse.z > 0.0 ) return mouse.y/resolution.y*tmax;",
    "#endif",
    "  return fract(time * explosionSpeed / tmax) * tmax;",
    "}",

    "float hash( float n ) {",
    "  return fract(cos(n)*41415.92653);",	//https://www.shadertoy.com/view/4sXGRM
        //return fract(sin(n)*753.5453123);	//https://www.shadertoy.com/view/4sfGzS
    "}",

    "vec2 hash2( float n ) {",
        //return fract(cos(n)*vec2(10003.579, 37049.7));	//https://www.shadertoy.com/view/XtsSWs
        "return fract(sin(vec2(n,n+1.0))*vec2(13.5453123,31.1459123));",
    "}",

    "vec3 hash3( float n ) {",
    "    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(13.5453123,31.1459123,37.3490423));",
    "}",

    "float hash13(vec3 p3) {",
    "  p3 = fract(p3 * vec3(.1031,.11369,.13787));",
    "  p3 += dot(p3, p3.yzx + 19.19);",
    "  return fract((p3.x + p3.y) * p3.z);",
    "}",

    "#ifdef NOISE_LUT",
    //iq's LUT 3D noise
    "float noise( in vec3 x ) {",
    "  vec3 f = fract(x);",
    "  vec3 p = x - f;", // this avoids the floor() but doesnt affect performance for me.
    "#ifndef LOW_Q",		// in low quality setting, for speed, we try to live without that. we compensate with growth and fade.
    "  f = f*f*(3.0-2.0*f);",
    "#endif",
    "  vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;",
    "  vec2 rg = texture2D( iChannel0, (uv+ 0.5)/256.0, -100.0 ).yx;",
    "  return mix( rg.x, rg.y, f.z );",
    "}",
    "#else",

    "float noise( in vec3 x ) {",
    "  vec3 f = fract(x);",
    "  vec3 p = x - f;", // this avoids the floor() but doesnt affect performance for me.
    "#ifndef LOW_Q",		// in low quality setting, for speed, we try to live without that. we compensate with growth and fade.
    "  f = f*f*(3.0-2.0*f);",
    "#endif",
    	
    "  float n = p.x + p.y*157.0 + 113.0*p.z;",
    "  return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),",
    "                 mix( hash(n+157.0), hash(n+158.0),f.x),f.y),",
    "             mix(mix( hash(n+113.0), hash(n+114.0),f.x),",
    "                 mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);",
    "}",
    "#endif",

    "float fbm( vec3 p, vec3 dir ) {",
    "  float f;",
    "#ifndef LOW_Q",
    "  vec3 q = p - dir; f  = 0.50000*noise( q );",
    "  q = q*2.02 - dir; f += 0.25000*noise( q );",
    "  q = q*2.03 - dir; f += 0.12500*noise( q );",
    "  q = q*2.01 - dir; f += 0.06250*noise( q );",
    "  q = q*2.02 - dir; f += 0.03125*noise( q );",
    "#elif LOW_Q == 1",
        // in low quality setting, for speed, we try to live with a lower-quality fbm. we compensate with higher grain.
    "  vec3 q = p - dir; f  = 0.50000*noise( q );",
    "  q = q*2.02 - dir; f += 0.25000*noise( q );",
    "  q = q*2.03 - dir; f += 0.12500*noise( q );",
    "  q = q*2.04 - dir; f += 0.08250*noise( q );",
    "#elif LOW_Q == 2",
    "  vec3 q = p - dir; f  = 0.50000*noise( q );",
    "  q = q*2.14 - dir; f += 0.29000*noise( q );",
    "  q = q*2.25 - dir; f += 0.16500*noise( q );",
    "#endif",
    "  return f;",
    "}",

    "float tri(in float x) {",
    "  return abs(fract(x)-.5);",
    "}",
    
    "vec3 tri3(in vec3 p) {",
    "  return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));",
    "}",

    "float triNoise3d(in vec3 p, in float spd, float ti) {",
    "  float z=1.1;",
    "  float rz = 0.;",
    "  vec3 bp = p*1.5;",
    "  for (float i=0.; i<=3.; i++ ) {",
    "    vec3 dg = tri3(bp);",
    "    p += (dg+spd);",
    "    bp *= 1.9;",
    "    z *= 1.5;",
    "    p *= 1.3;",

    "    rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;",
    "    bp += 0.14;",
    "  }",
    "  return rz;",
    "}",

    "float fogmap(in vec3 p, in float d, float ti) {",
    "  p.x *= .4;",
    "  p.x += ti*1.5;",
    "  p.z += sin(p.x*.5);",
    "  p.z *= .4;",
    "  return max(triNoise3d(p*.3/(d+20.),0.2, ti)-.4, 0.)*(smoothstep(0.,25.,p.y));",
        //return triNoise3d(p*1.2/(d+20.),0.2, ti)*(1.25-smoothstep(0.,25.,p.y));
    "}",
    // Thanks to nimitz for the fast fog/clouds idea...
    // https://www.shadertoy.com/view/4ts3z2
    "vec3 clouds(in vec3 col, in vec3 ro, in vec3 rd, in float mt, float ti, in vec3 cloudcolor) {",
    "  float d = 1.5;",	//.5
    "  for(int i=0; i<7; i++) {",
    "    if (d>mt) break;",
    "    vec3  pos = ro + rd*d;",
    "    float rz = fogmap(pos, d, ti);",
  	//float grd =  clamp((rz - fogmap(pos+.8-float(i)*0.1,d, ti))*3., 0.1, 1. );
    //vec3 cloudcolor = (vec3(.1,0.8,.5)*.5 + .5*vec3(.5, .8, 1.)*(1.7-grd))*0.55;
    //vec3 cloudcolor = (2.*vec3(.4,0.4,.4) + .5*vec3(.5)*(1.7-grd))*0.55;
    //vec3 cloudcolor = 2.*(vec3(.4,0.4,.4));
    "    col = mix(col,cloudcolor,clamp(rz*smoothstep(d-0.4,2.+d*1.75,mt),0.,1.) );",
    //col = mix(col,cloudcolor,clamp(rz*smoothstep(d,d*1.86,mt),0.,1.) );
    "    d *= 1.5+0.3;",
    "  }",
    "  return col;",
    "}",

    // Thanks to bjarkeck for the fast star field implementation...
    // https://www.shadertoy.com/view/lsc3z4
    "float stars(vec3 ray) {",
    "  vec3 p = ray * STARDISTANCE;",
    "  float brigtness = smoothstep(1.0 - STARDENCITY, 1.0, hash13(floor(p)));",
    "  return smoothstep(STARBRIGHTNESS, 0., length(fract(p) - 0.5)) * brigtness;",
    "}",

    // assign colour to the media
    "vec4 computeColour( float density, float radius, float bright ) {",
    	// colour based on density alone. gives impression of occlusion within
    	// the media
    	//vec4 result = vec4( mix( vec3(1.0,0.9,0.8), vec3(.7,0.3,0.2), density ), density );
    	//vec4 result = vec4( mix( vec3(1.0,0.9,0.8), vec3(0.4,0.15,0.1), density ), density );
    "  vec4 result = vec4( vec3(mix( 1.0, color_low, density )), density );",
        //vec4 result = vec4( mix( 1.1*vec3(1.0,0.9,0.8), 0.9*vec3(0.4,0.15,0.1), density ), density );
        //vec4 result = vec4(1.,1.,1.,density);

    	// colour added for explosion
        //result *= mix( colBottom * bright, colTop * bright, min( (radius+0.5)*0.588, 1.0 ) );
    "  result *= mix( colBottom, colTop, min( (radius+0.5)*0.588, 1.0 ) ) * bright;",
        //result *= mix( colBottom, colTop, radius ) * bright;
    	//result.rgb *= mix( colBottom * bright, colTop, smoothstep( 0., 1., (radius-0.5)*0.6+0.5 ) );
    	//result *= mix( colBottom * bright, colTop, clamp( radius * 1.7-.2, 0.0, 1.0 ) );
        //result.a*=density*1.5;
    	//result.a *= mix( 1.0, 0.0, min( (radius / expRadius + 0.2)*0.5, 1.0 ) );
        //result.a *= mix( 1.0, 0.2, min( (radius+0.5)/1.7, 1.0 ) );
    	//result.a *= mix( 0.0, 1.0, 1.0-radius*0.25 );
    	//if(radius<1.0-mouseY) result.a=0.0;
    	// make central hole
    	//result.a *= clamp((radius/expRadius-0.5*mouseIn)*15.0, 0.0, 1.0);
    	//result.xyz *= mix( 3.1*vec3(1.0,0.5,0.05), vec3(0.48,0.53,0.5), min( radius*.76, 1.0 ) );
    	
        //result = mix( colBottom * bright * vec4(1.0,0.9,0.8,1.0), colTop*vec4(0.4,0.15,0.1,1.0), min( (radius+0.5)/1.7, 1.0 ) );
        //result.a *= density;
        
    "  return result;",
    "}",

    // maps 3d position to density
    "float densityFn( in vec3 p, in float r, float t, in vec3 dir, float seed ) {",
      //const float pi = 3.1415926;
    "  float den = explosionBallness + (explosionGrowth+explosionBallness)*log(t)*r;",
    "  den -= (2.5+explosionBallness)*pow(t,explosionFade)/r;",
        //den = -1.7 - p.y;
    	//den *= 1.+smoothstep(0.75,1.,r);
        
        //if ( den <= -4. || den > -1. ) return -1.;
        //if ( den <= -2.8 ) return -1.;
    "  if ( den <= -3. ) return -1.;",
        //if ( den > -1. ) return -1.;
        
    "#ifdef SHOW_BOUNDS",
    "  p = 0.5 * normalize(p);",
    "  return abs(p.y);",
        //return 0.8;
    "#endif",
        
    	// offset noise based on seed
    	// plus a time based offset for the rolling effect (together with the space inversion below)
        //float s = seed-(rolling_speed/(t+rolling_init_damp));
    "  float s = seed-(explosionRollingSpeed/(sin(min(t*3.,1.57))+explosionRollingInitDamp));",
    	//if( iMouse.z > 0.0 ) t += iMouse.y * 0.02;
        //vec3 dir = vec3(0.,1.,0.);
    	//vec3 dir = -0.5*(p - expCenter);
        //vec3 dir = normalize( vec3( noise(p.xyz), noise(p.yxz), noise(p.zyx) ) );
    "  dir *= s;",

        // invert space
    "  p = -explosionGrain*p/(dot(p,p)*explosionDownScale);",

        // participating media
    "  float f = fbm( p, dir );",
        //f=clamp(f,.1,.7);
    	
    	// add in noise with scale factor
    "  den += 4.0*f;",
        //den -= r*r;
    	
    	//den *= density;	// we do that outside
    	//den *= 1.25;
        //den *= .8;

  	"  return den;",
    "}",

    // rad = radius of complete mult explosion (range 0 to 1)
    // r = radius of the explosion ball that contributes the highest density
    // rawDens = non-clamped density at the current maching location on the current ray
    // foffset = factor for offset how much the offsetting should be applied. best to pass a time-based value.
    "void calcDens( in vec3 pos, out float rad, out float r, out float rawDens, in float t, in float foffset, out vec4 col, in float bright ) {",
    "  float radiusFromExpCenter = length(pos);",
    "  rad = radiusFromExpCenter / explosionRadius;",

    "  r = 0.0;",
    "  rawDens = 0.0;",
    "  col = vec4(0.0);",

    "  for ( int k = 0; k < mult_explosions; ++k )",
    "  {",
    "    float t0 = t - balls[k].delay;",
    "    if ( t0 < 0.0 || t0 > 1.0 ) continue;",

    "    vec3 p = pos - balls[k].offset * foffset;",
    "    float radiusFromExpCenter0 = length(p);",

    "    float r0 = explosionDownScale * radiusFromExpCenter0 / explosionRadius;",
    "    if( r0 > 1.0 ) continue;",
		// BUG: Skipping for r0 > 1.0 gives some artefacts on later smoke where the inside of sphere
        // is more transparent than the outside (for the parts where other expl balls contribute density in).
        // I can't figure yet what the problem is. Inside the sphere near border, densities should be
        // practically 0.0 which also does not contribute (almost) anything to sum in contributeDens.
        // So what's the problem then?
        // Notice, the same bug happens with skipping for t0 > 1.0, just there slight jumps can be seen near
        // end of animation for certain angle views.
        // Reason for the bug: Below, we pass r0 as r. If a density is not skipped but becomes in final color
        // actually transparent, r0 is still passed as r. Outside the r0, the r gains a value from another
        // explosion ball and thus gains also its rawDens0. Inside our r0, the other's ball's density gets
        // skipped, which is producing the jump.
		// Fix would be to intermengle all densities altogether without
        // skipping any. But how? Especially how to intermengle all the r0's?
		// Actually the problem comes from color calculation which makes the final color near transparent the
		// higher the density value.
		// So maybe the fix would be to put the transparency information into the density somehow before
		// selecting one radius. Actually we could add up all the densities, but the one which was the
		// highest could be that one who's r0 we will use as r. Maybe.
        // FIX: The bug is only with OLD_COLORING. New coloring should not have this bug anymore.
        
    "    float rawDens0 = densityFn( p, r0, t0, balls[k].dir, explosion_seed + 33.7*float(k) ) * explosionDensity;",

"#ifndef SHOW_BOUNDS",
    	// thin out the volume at the far extends of the bounding sphere to avoid
    	// clipping with the bounding sphere
    "    rawDens0 *= 1.-smoothstep(thinout_smooth,1.,r0);",
"#endif",

"#ifndef OLD_COLORING",
    "    float dens = clamp( rawDens0, 0.0, 1.0 );",

        //vec4 col0 = computeColour(dens, r0*(.9+.5*dens)/1.75, bright);	// also adds some variation to the radius
        //vec4 col0 = computeColour(dens, r0*(1.4+rawDens0), bright);		// also adds some variation to the radius
    "    vec4 col0 = computeColour(dens, r0*(brightrad.x+brightrad.y*rawDens0), bright);",	// also adds some variation to the radius

"#ifndef SHOW_BOUNDS",
        // uniform scale density
        //col0.a *= 0.8;
        //col0.a *= col0.a + .4;
    "    col0.a *= (col0.a + .4) * (1. - r0*r0);",

        // colour by alpha
    "    col0.rgb *= col0.a;",
"#else",
    "    col0.a *= 5.;",
"#endif",

    "    col += col0;",

  	"    rawDens = max(rawDens, rawDens0);",
        //rawDens+=max(rawDens0,0.);

        /*if ( rawDens0 > rawDens )
        {
            rawDens = rawDens0;
            r = r0;
            col = col0;
        }*/
"#else",
    "    if ( rawDens0 > rawDens ) {",
    "      rawDens = rawDens0;",
    "      r = r0;",
    "    }",
"#endif",
    "  }",

"#ifdef SHOW_BOUNDS",
    "  col /= float(mult_explosions);",
"#endif",
        
    	//rawDens *= density;
    "}",

    "#ifdef OLD_COLORING",
    // rad = radius of complete mult explosion (range 0 to 1)
    // r = radius of the explosion ball that contributes the highest density
    // rawDens = non-clamped density at the current maching location on the current ray
    "void contributeDens( in float rad, in float r, in float rawDens, in float bright, out vec4 col, inout vec4 sum ) {",
      //float dens = clamp( rawDens, 0.0, 1.0 );
    "  float dens = min( rawDens, 1.0 );",	// we expect already rawDens to be positive

    //col = computeColour(dens, r*(.9+.5*dens)/1.75, bright);	// also adds some variation to the radius
    //col = computeColour(dens, r*(1.4+rawDens), bright);	// also adds some variation to the radius
    "  col = computeColour(dens, r*(brightrad.x+brightrad.y*rawDens), bright);",	// also adds some variation to the radius

    "#ifndef SHOW_BOUNDS",
    // uniform scale density
    //col.a *= 0.8;
    //col.a *= col.a + .4;
    "  col.a *= (col.a + .4) * (1. - r*r);",

    // colour by alpha
    "  col.rgb *= col.a;",

    // alpha blend in contribution
    "  sum = sum + col*(1.0 - sum.a);",
    "  sum.a+=0.15*col.a;",
    "#else",
    "  col.a *= 5.;",
   	"  sum = max(sum, col);",
    "#endif",
    "}",
    "#endif",

    "#ifndef OLD_COLORING",
    "void contributeColor( in vec4 col, inout vec4 sum ) {",
    "#ifndef SHOW_BOUNDS",
    // alpha blend in contribution
    "  sum = sum + col*(1.0 - sum.a);",
    "  sum.a+=0.15*col.a;",
    "#else",
   	"  sum = max(sum, col);",
    "#endif",
    "}",
    "#endif",

    "vec4 raymarch( in vec3 rayo, in vec3 rayd, in vec2 expInter, in float t, out float d ) {",
    "  vec4 sum = vec4( 0.0 );",
    
    "  float step = 1.5 / float(steps);",
     
    // start iterating on the ray at the intersection point with the near half of the bounding sphere
  	//vec3 pos = rayo + rayd * (expInter.x + step*texture2D( iChannel2, gl_FragCoord.xy/iChannelResolution[0].x ).x);		// dither start pos to break up aliasing
  	//vec3 pos = rayo + rayd * (expInter.x + 1.0*step*fract(0.5*(gl_FragCoord.x+gl_FragCoord.y)));	// regular dither
  	"  vec3 pos = rayo + rayd * (expInter.x);",	// no dither

    "  float march_pos = expInter.x;",
    "  d = 4000.0;",
    
    // t goes from 0 to 1 + mult delay. that is 0 to 1 is for one explosion ball. the delay for time distribution of the multiple explosion balls.
    // t_norm is 0 to 1 for the whole animation (incl mult delay).
    "  float tmax = 1.0 + explosionDelayRange;",
    "  float t_norm = t / tmax;",
    "  float smooth_t = sin(t_norm*2.1);",	//sin(t*2.);

  	//float bright = 6.1;
  	"  float t1 = 1.0 - t_norm;",	// we use t_norm instead of t so that final color is reached at end of whole animation and not already at end of first explosion ball.
      //float bright = 3.1 + 18.0 * t1*t1;
  	//float bright = 3.1 + 1.4 * t1*t1;
  	//float bright = 3.1 + 4.4 * t1*t1;
  	"  float bright = brightness.x + brightness.y * t1*t1;",
  	//float bright = smoothstep(0.0, 30.1, 1.0);
  	//float bright = smoothstep(20.0, 3.1, 1.0);
    //float bright = 10.;

    "  for( int i=0; i<steps; i++ ) {",
    "    if ( sum.a >= 0.98 ) { d = march_pos; break; }",
    "    if ( march_pos >= expInter.y ) break;",
    
    "    float rad, r, rawDens;",
    "    vec4 col;",
    "    calcDens( pos, rad, r, rawDens, t, smooth_t, col, bright );",

    "    if ( rawDens <= 0.0 ) {",
    "      float s = step * 2.0;",
    "      pos += rayd * s;",
    "      march_pos += s;",
    "      continue;",
    "    }",
            
    "#ifdef OLD_COLORING",
    "    contributeDens( rad, r, rawDens, bright, col, sum );",
    "#else",
    "    contributeColor( col, sum );",
    "#endif",
      
		// take larger steps through low densities.
		// something like using the density function as a SDF.
		"    float stepMult = 1.0 + (1.-clamp(rawDens+col.a,0.,1.));",
		// step along ray
		"    pos += rayd * step * stepMult;",
    "    march_pos += step * stepMult;",

		//pos += rayd * step;
	  "  }",

    "#ifdef SHOW_BOUNDS",
    "  if ( sum.a < 0.1 ) {",
    "    sum = vec4(0.,0.,.5,0.1);",
    "  }",
    "#endif",
    	
    "  return clamp( sum, 0.0, 1.0 );",
    "}",

    // iq's sphere intersection, but here fixed for a sphere at (0,0,0)
    "vec2 iSphere(in vec3 ro, in vec3 rd, in float rad) {",
    	//sphere at origin has equation |xyz| = r
    	//sp |xyz|^2 = r^2.
    	//Since |xyz| = ro + t*rd (where t is the parameter to move along the ray),
    	//we have ro^2 + 2*ro*rd*t + t^2 - r2. This is a quadratic equation, so:
    	//vec3 oc = ro - sph.xyz; //distance ray origin - sphere center
    	
  	"  float b = dot(ro, rd);",					//=dot(oc, rd);
  	"  float c = dot(ro, ro) - rad * rad;",		//=dot(oc, oc) - sph.w * sph.w; //sph.w is radius
  	"  float h = b*b - c;", // delta
  	"  if(h < 0.0) { ",
  	"    return vec2(-1.0);",
    "  }",
      //h = sqrt(h);
    "  h *= 0.5;",		// just some rough approximation to prevent sqrt.
    "  return vec2(-b-h, -b+h);",
    "}",

    "vec3 computePixelRay( in vec2 p, out vec3 cameraPos ) {",
        // camera orbits around explosion
    "  float camRadius = CAM_DIST;",
    	// use mouse x coord
    "  float a = time*CAM_ROTATION_SPEED;",
    "  float b = CAM_TILT * sin(a * .014);",
    
    "  a = explosionCameraPan;",
    "  b = explosionCameraTilt - 0.5;",
    
    "  float phi = b * 3.14;",
    "  float camRadiusProjectedDown = camRadius * cos(phi);",
  	"  float theta = a * PI2;",
    "  float xoff = camRadiusProjectedDown * cos(theta);",
    "  float zoff = camRadiusProjectedDown * sin(theta);",
    "  float yoff = camRadius * sin(phi);",
    "  cameraPos = vec3(xoff,yoff,zoff);",
         
    // camera target
    "  vec3 target = vec3(0.);",
         
    // camera frame
    "  vec3 fo = normalize(target-cameraPos);",
    "  vec3 ri = normalize(vec3(fo.z, 0., -fo.x ));",
    "  vec3 up = normalize(cross(fo,ri));",
         
    // multiplier to emulate a fov control
    "  float fov = .5;",
    	
    // ray direction
    "  vec3 rayDir = normalize(fo + fov*p.x*ri + fov*p.y*up);",
    	
  	"  return rayDir;",
    "}",

    "void setup() {",
    // first expl ball always centered looking up
    "  balls[0] = Ball(",
    "    vec3(0.),",
    "    vec3(0.,.7,0.),",		// not normalized so that expl ball 0 rolls somewhat slower
    "    0.0",
    "  );",

    "  float pseed = variation_seed;",
    "  float tseed = delay_seed;",
    "  float maxdelay = 0.0;",
    "  for ( int k = 1; k < mult_explosions; ++k ) {",
    "    float pseed = variation_seed + 3. * float(k-1);",
    "    float tseed = delay_seed + 3. * float(k-1);",
    "    vec2 phi = hash2(pseed) * vec2(2.*PI, PI*explosionBallSpread);",
    "    vec2 tilted = vec2( sin(phi.y), cos(phi.y) );",
    "    vec3 rotated = vec3( tilted.x * cos(phi.x), tilted.y, tilted.x * sin(phi.x) );",
    "    balls[k].offset = 0.7 * rotated;", //hash3(pseed) - 0.5;
    "    balls[k].dir = normalize( balls[k].offset );",
    "    balls[k].delay = explosionDelayRange * hash(tseed);",
    "    pseed += 3.;",
    "    tseed += 3.;",
    "    maxdelay = max(maxdelay, balls[k].delay);",
    "  }",
    
    "  if ( maxdelay > 0.0 ) {",
    // Now stretch the ball explosion delays to the maximum allowed range.
    // So that the last ball starts with a delay of exactly delay_range and thus we do not waste any final time with just empty space.
   	"    for ( int k = 0; k < mult_explosions; ++k ) {",
    "      balls[k].delay *= explosionDelayRange / maxdelay;",
    "    }",
    "  }",
    "}",
    
  ].join("\n"),
  
  explosionFrag: [
    
    // "downscale = 1.75;",
    // "grain = 2.7;",
    // "rolling_init_damp = 0.2;",
    // "ball_spread = 0.4;",
    
    "#ifdef LOW_Q",
    "  grain *= 1.0 + 0.1 * float(LOW_Q);",
    "  growth *= 1.0 - 0.1 * float(LOW_Q);",
    "  ballness *= 0.85;",
    "#endif",

    "  float t = getTime();",

    // some global initialization.
    "  setup();",

	  // get aspect corrected normalized pixel coordinate
    // "  vec2 q = fragCoord.xy / resolution.xy;",
    // "  vec2 p = -1.0 + 2.0*q;",
    // "  p.x *= resolution.x / resolution.y;",
        
    "  vec3 rayDir, cameraPos;",
    "  rayDir = computePixelRay( pin.position, cameraPos );",
    	
    "  vec4 col = vec4(0.);",
    "  float d = 4000.0;",
        
    // does pixel ray intersect with exp bounding sphere?
    "  vec2 boundingSphereInter = iSphere( cameraPos, rayDir, explosionRadius );",
    "  if ( boundingSphereInter.x > 0. ) {",
    		// yes, cast ray
    "    col = raymarch( cameraPos, rayDir, boundingSphereInter, t, d );",
    "  }",
    	
    // smoothstep final color to add contrast
    //col.xyz = col.xyz*col.xyz*(3.0-2.0*col.xyz);
  	//col.xyz = col.xyz*col.xyz*(2.0-col.xyz);	// darker contrast
    "  col.xyz = col.xyz*col.xyz*(1.0+explosionContrast*(1.0-col.xyz));",

  	// gamma
  	//col.xyz = pow( col.xyz, vec3(1.25) );
    //col.a = pow( col.a, 1.5 );

    // from https://www.shadertoy.com/view/XdSXDc
    //col.rgb = clamp(pow(col.rgb, vec3(0.416667))*1.055 - 0.055,0.,1.); //cheap sRGB approx
      
    // "vec3 cloudcolor = vec3(.8,.8,.8);",
        
    //  "#ifdef WITH_FUN",
    //     // day-night cycling
    //     "float dnt = fract(iGlobalTime / DAY_NIGHT_CYCLE_TIME);",
    //     "float day = 1.-smoothstep(.3, .5, dnt);",
    //     "float night = smoothstep(.8, 1., dnt);",
    //     "day += night;",
    //     "night = 1.-day;",
    // 
    //     // night setting
    //     "float gray = back.r+back.g+back.b;",
    //     "vec3 corridorlight = night < .9 ? vec3(0.) :",
    //         "smoothstep( 1., 0., gray ) * (CORRIDOR_LIGHT);",	// this is so cute looking
    //     //vec3 nightcolor = pow(back.b, 5. * clamp(rayDir.y+.7, 1. - (ENLIGHTEN_PASSAGE), 1.)) * (NIGHT_COLORING);
    //     "vec3 nightcolor = pow(back.b, 4.) * (NIGHT_COLORING);",
    //     "nightcolor *= smoothstep( -1., 1., -(gray-1.7) ) + .1;",
    //     
    //  "#ifdef STARS",
    //     "if ( gray > 2.999 )",	// luck, practically just the sky in the cubemap is pure white
    //     	"nightcolor += stars( rayDir );",
    //  "#endif",
    // 
    //     // faking some light on the floor from the explosion
    //     "vec3 floorlight = (smoothstep( .3, .99, -rayDir.y ) * (FLOOR_LIGHT_STRENGTH) * smoothstep(.6, .0, t)) * colBottom.rgb;",
    // 
    //     "cloudcolor *= smoothstep( -.5, 1., day );",
    //     
    //     "back.rgb = back.rgb * day + nightcolor * night + corridorlight + floorlight;",
    //  "#endif",
    // 
    // "#ifdef WITH_FUN",
    // "#ifdef FOG",
    //     "back.rgb = clouds(back.rgb,cameraPos+vec3(0.,40.,0.), rayDir, /*d*/ 4000.0, iGlobalTime*3., cloudcolor);",
    // "#endif",
    // "#endif",
        
    // "fragColor.xyz = mix( back.xyz, col.xyz, col.a );",
    "  pout.color = vec3(rgb2gray(mix( vec3(0.0), col.xyz, col.a )));",
    //  "fragColor.xyz = rayDir;",
    //  "fragColor.xyz = cameraPos;",

    //fragColor.rgb = clouds(fragColor.rgb,cameraPos, rayDir, d, iGlobalTime*3., cloudcolor);

    // vignette
    // "fragColor.rgb *= pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.1);",
  ].join("\n"),
  
  
  //// CORONA
  // https://www.shadertoy.com/view/XdV3DW by vamoss
  
  coronaUniforms: {
    intensity: { value: 1.0 },
    coronaRadius: { value: 0.3 },
    coronaSize: { value: 1.0 },
  },
  
  coronaFragPars: [
    "uniform float intensity;",
    "uniform float coronaRadius;",
    "uniform float coronaSize;",
    
    "float burnNoise(vec3 uv, float res) {",
    "	const vec3 s = vec3(1e0, 1e2, 1e3);",
    "	uv *= res;",
    "	vec3 uv0 = floor(mod(uv, res))*s;",
    "	vec3 uv1 = floor(mod(uv+1., res))*s;",
    "	vec3 f = fract(uv); ",
    "	f = f*f*(3.0-2.0*f);",
    "	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,",
    "	              uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);",
    "	vec4 r = fract(sin(v*1e-1)*1e3);",
    "	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);",
    "	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);",
    "	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);",
    "	return mix(r0, r1, f.z)*2.-1.;",
    "}",
    
    "vec3 burn(vec2 p, float size) {",
    "  float c1 = size * 4.0 - 3.0 * length(2.5 * p);",
    "  vec3 coord = vec3(atan(p.x, p.y) / PI2 + 0.5, length(p) * 0.4, 0.5);",
    "  for (int i=0; i<=3; i++) {",
    "    float power = exp2(float(i));",
    "    c1 += 0.2 * (1.5 / power) * burnNoise(coord + vec3(0.0, -time*0.05, -time*0.01), power*16.0);",
    "  }",
    "  c1 *= intensity;",
    "  return vec3(c1);",
    "}",
    
    
  ].join("\n"),
  
  coronaFrag: [
    
    "if (length(pin.position) < coronaRadius) {",
    "  pout.color = vec3(0.0);",
    "} else {",
    "  pout.color = burn(pin.position, coronaSize);",
    "}",

  ].join("\n"),
  
  
  //// FIRE CHUNK
  // https://www.shadertoy.com/view/XsXSWS by xbe
  
  fireUniforms: {
    intensity: { value: 1.0 },
    fireStrength: { value: 1.0 },
    firePower: { value: 1.0 },
    fireRange: { value: 1.0 },
    fireWidth: { value: 1.0 },
    fireColor: { value: 1.0 },
  },
  
  fireFragPars: [
    "uniform float intensity;",
    "uniform float fireStrength;",
    "uniform float firePower;",
    "uniform float fireRange;",
    "uniform float fireWidth;",
    "uniform float fireColor;",
    
    // procedural noise from IQ
    "vec2 hash( vec2 p ) {",
    "	p = vec2( dot(p,vec2(127.1,311.7)),",
    "			 dot(p,vec2(269.5,183.3)) );",
    "	return -1.0 + 2.0*fract(sin(p)*43758.5453123);",
    "}",

    "float flameNoise( in vec2 p ) {",
    "	const float K1 = 0.366025404; // (sqrt(3)-1)/2;",
    "	const float K2 = 0.211324865; // (3-sqrt(3))/6;",
    "	vec2 i = floor( p + (p.x+p.y)*K1 );",
    "	vec2 a = p - i + (i.x+i.y)*K2;",
    "	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);",
    "	vec2 b = a - o + K2;",
    "	vec2 c = a - 1.0 + 2.0*K2;",
    "	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );",
    "	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));",
    "	return dot( n, vec3(70.0) );",
    "}",

    "float fbm(vec2 uv) {",
    "	float f;",
    "	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );",
    "	f  = 0.5000*flameNoise( uv ); uv = m*uv;",
    "	f += 0.2500*flameNoise( uv ); uv = m*uv;",
    "	f += 0.1250*flameNoise( uv ); uv = m*uv;",
    "	f += 0.0625*flameNoise( uv ); uv = m*uv;",
    "	f = 0.5 + 0.5*f;",
    "	return f;",
    "}",
    
  ].join("\n"),
  
  fireFrag: [

    "vec2 q = pin.uv;",
    "q.y *= 2.0 - 1.0 * firePower;",
    "float T3 = max(3.0, 1.25 * fireStrength) * time;",
    "q.x = mod(q.x, 1.0) - 0.5;",
    "q.y -= 0.25;",
    "float n = fbm(fireStrength * q - vec2(0, T3));",
    "float c = 2.0 * intensity - 16.0 * pow(max(0.0, length(q * vec2(3.0 - fireWidth*3.0 + q.y*1.5, 0.75)) - n * max(0.0, q.y + 0.25)), 1.2);",
    "float c1 = n * c * (1.5 - pow((2.50 / fireRange)*pin.uv.y, 4.0));",
    "c1 = clamp(c1, 0.0, 1.0);",
    "vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1);",
    
    "float a = c * (1.0 - pow(pin.uv.y, 3.0));",
    "vec3 color = mix(vec3(0.0), col, a);",
    "float gray = rgb2gray(color);",
    "pout.color = mix(vec3(gray), color, fireColor);",

  ].join("\n"),
  
  
  //// SILEXARS
  
  silexarsFrag: [
    "vec3 c;",
    "float l, z = sin(time) * 1.0 + 17.0;",
    "for (int i=0; i<3; i++) {",
    "  vec2 uv = pin.uv;",
    "  vec2 p = uv - 0.5;",
    "  z += 0.07;",
    "  l = length(p);",
    "  uv += p / l * (sin(z) + 1.0) * abs(sin(l*9.0-z*2.0));",
    "  c[i] = 0.01 / length(abs(mod(uv, 1.0)-0.5));",
    "}",
    "pout.color = c/l;",
  ].join("\n"),
  
  
  //// TEST CHUNK
  
  testFragPars: [
    
  ].join("\n"),
  
  testFrag: [
    
    // "if (pin.position.x < 0.0) color.x = 1.0;",
    // "if (pin.position.y < 0.0) color.y = 1.0;",
    // "pout.color = color;",
    
    // "vec2 t = pin.coord + vec2(time * 10.0);",
    // "float n = noise(t);",
    // "pout.color = vec3(n);",
  ].join("\n")
};

PixSetShaderParameter = function(uniforms, key, value) {
  
  if (key in uniforms) {
    if (uniforms[key].value instanceof THREE.Color) {
      if (value instanceof THREE.Color) {
        uniforms[key].value.copy(value);  
      }
      else {
        uniforms[key].value.copy(new THREE.Color(value));
      }
    }
    else if (uniforms[key].value instanceof THREE.Color ||
        uniforms[key].value instanceof THREE.Vector2 ||
        uniforms[key].value instanceof THREE.Vector3 ||
        uniforms[key].value instanceof THREE.Vector4 ||
        uniforms[key].value instanceof THREE.Matrix3 ||
        uniforms[key].value instanceof THREE.Matrix4) {
      uniforms[key].value.copy(value);
    }
    else if (uniforms[key].value instanceof THREE.CubeTexture ||
             uniforms[key].value instanceof THREE.Texture) {
      uniforms[key].value = value;
    }
    else if (uniforms[key].value instanceof Array) {
      for (var i=0; i<value.length; ++i) {
        uniforms[key].value[i] = value[i];
      }
    }
    else {
      uniforms[key].value = value;
    }
  }
};

PixSetShaderArrayParameter = function(uniforms, arrayKey, index, key, value) {
  
  if (arrayKey in uniforms) {
    if (key in uniforms[arrayKey].value[index]) {
      if (uniforms[arrayKey].value[index][key] instanceof THREE.Color ||
          uniforms[arrayKey].value[index][key] instanceof THREE.Vector2 ||
          uniforms[arrayKey].value[index][key] instanceof THREE.Vector3 ||
          uniforms[arrayKey].value[index][key] instanceof THREE.Vector4 ||
          uniforms[arrayKey].value[index][key] instanceof THREE.Matrix3 ||
          uniforms[arrayKey].value[index][key] instanceof THREE.Matrix4) {
        uniforms[arrayKey].value[index][key].copy(value);
      }
      else if (uniforms[arrayKey].value[index][key] instanceof THREE.CubeTexture ||
               uniforms[arrayKey].value[index][key] instanceof THREE.Texture) {
        uniforms[arrayKey].value[index][key] = value;
      }
      else if (uniforms[arrayKey].value[index][key] instanceof Array) {
        for (var i=0; i<value.length; ++i) {
          uniforms[arrayKey].value[index][key][i] = value[i];
        }
      }
      else {
        uniforms[arrayKey].value[index][key] = value;
      }
    }
  }
};

PixGetDefaultShaderParameters = function() {
  return {
    time: 0.0
  };
};

PixGenerateSpriteStudioShaderParametersGUI = function(folders, effectController, callback) {
  
  var gui = new dat.GUI();
  
  // if (folders.indexOf('Color') >= 0) {
  //   h = gui.addFolder("Color");
  //   h.addColor(effectController, "baseColor");
  //   h.add(effectController, "opacity", 0.0, 1.0).onChange(callback);
  // }
  
  return gui;
}

PixSpriteStudioShader = function() {
  
  this.enables = {};
  
  this.enable = function(key, value) {
    this.enables[key] = value === undefined ? 1 : value;
  }
  
  this.clear = function() {
    this.enables = {};
  }
  
  this.checkKey = function(key) {
    for (i in this.enables) {
      if (i === key) {
        return true;
      }
    }
    
    return false;
  }
  
  
  // +AAA : OR
  // -BBB : NOT
  this.check = function(keys) {
    if (keys === null || keys.length === 0) {
      return true;
    }
  
    var check = 0;
    for (i in keys) {
      if (keys[i][0] === '-') {
        if (this.checkKey(keys[i].substr(1))) {
          return false;
        }
      }
      else if (keys[i][0] === '+') {
        if (check === 0) {
          check = 1;
        }
        if (this.checkKey(keys[i].substr(1))) {
          check = 2;
        }
      }
      else {
        if (this.checkKey(keys[i]) === false) {
          return false;
        }
      }
    }
    
    if (check > 0 && check < 2) {
      return false;
    }
    
    return true;
  }
  
  this.generateDefines = function() {
    return {
      "NOISE_OCTAVE": 8,
      "NOISE_PERSISTENCE": 0.5
    };
  }
  
  this.addUniform = function(uniforms, keys, chunk) {
    if (this.check(keys)) {
      uniforms.push(PixSpriteStudioShaderChunks[chunk]);
    }
  }
  
  this.generateUniforms = function() {
    var uniforms = [];
    
    uniforms.push({
      "resolution": { value: new THREE.Vector2() },
      "mouse": { value: new THREE.Vector2() },
      "time": { value: 0.0 },
      "cameraPos": { value: new THREE.Vector3() },
      "cameraDir": { value: new THREE.Vector3() },
      "tDiffuse": { value: null }
    });
    
    //// UNIFORMS
    
    this.addUniform(uniforms, ["WOOD"], "woodUniforms");
    this.addUniform(uniforms, ["CIRCLE"], "circleUniforms");
    this.addUniform(uniforms, ["SOLAR"], "solarUniforms");
    this.addUniform(uniforms, ["SPARK"], "sparkUniforms");
    this.addUniform(uniforms, ["RING"], "ringUniforms");
    this.addUniform(uniforms, ["GRADATION"], "gradationUniforms");
    this.addUniform(uniforms, ["GRADATIONLINE"], "gradationLineUniforms");
    this.addUniform(uniforms, ["FLASH"], "flashUniforms");
    this.addUniform(uniforms, ["CONE"], "coneUniforms");
    this.addUniform(uniforms, ["FLOWER"], "flowerUniforms");
    this.addUniform(uniforms, ["FLOWER+FUN"], "flowerFunUniforms");
    this.addUniform(uniforms, ["WAVERING"], "waveRingUniforms");
    this.addUniform(uniforms, ["SEEMLESSNOISE"], "seemlessNoiseUniforms");
    this.addUniform(uniforms, ["+HEIGHT2NORMAL","+HEIGHT2NORMALSOBEL"], "height2NormalUniforms");
    this.addUniform(uniforms, ["COLORBALANCE"], "colorBalanceUniforms");
    this.addUniform(uniforms, ["SMOKE"], "smokeUniforms");
    this.addUniform(uniforms, ["CELL"], "cellUniforms");
    this.addUniform(uniforms, ["FLAME"], "flameUniforms");
    this.addUniform(uniforms, ["FIRE"], "fireUniforms");
    this.addUniform(uniforms, ["LIGHTNING"], "lightningUniforms");
    this.addUniform(uniforms, ["FLARE"], "flareUniforms");
    this.addUniform(uniforms, ["FLARE2"], "flare2Uniforms");
    this.addUniform(uniforms, ["FLARE3"], "flare3Uniforms");
    this.addUniform(uniforms, ["MAGICCIRCLE"], "magicCircleUniforms");
    this.addUniform(uniforms, ["CROSS"], "crossUniforms");
    this.addUniform(uniforms, ["EXPLOSION"], "explosionUniforms");
    this.addUniform(uniforms, ["CORONA"], "coronaUniforms");
    
    return THREE.UniformsUtils.clone(THREE.UniformsUtils.merge(uniforms));
  }
  
  this.addCode = function(codes, keys, chunk) {
    if (this.check(keys)) {
      codes.push("//[ " + chunk + " ]{{");
      codes.push(PixSpriteStudioShaderChunks[chunk]);
      codes.push("//}} " + chunk);
      codes.push("");
    }
  }
  
  this.generateVertexShader = function() {
    
    var codes = [];
    
    this.addCode(codes, [], "common");
    codes.push("attribute vec3 position;");
    codes.push("void main() {");
    codes.push("  gl_Position = vec4(position, 1.0);");
    codes.push("}");

    return codes.join("\n");
  }
  
  this.generateFragmentShader = function() {
    
    var codes = [];
    this.addCode(codes, [], "common");
    this.addCode(codes, [], "fragPars");
    this.addCode(codes, ["WOOD"], "woodFragPars");
    this.addCode(codes, ["CIRCLE"], "circleFragPars");
    this.addCode(codes, ["SOLAR"], "solarFragPars");
    this.addCode(codes, ["SPARK"], "sparkFragPars");
    this.addCode(codes, ["RING"], "ringFragPars");
    this.addCode(codes, ["GRADATION"], "gradationFragPars");
    this.addCode(codes, ["GRADATIONLINE"], "gradationLineFragPars");
    this.addCode(codes, ["FLASH"], "flashFragPars");
    this.addCode(codes, ["CONE"], "coneFragPars");
    this.addCode(codes, ["FLOWER"], "flowerFragPars");
    this.addCode(codes, ["FLOWER+FUN"], "flowerFunFragPars");
    this.addCode(codes, ["WAVERING"], "waveRingFragPars");
    this.addCode(codes, ["SEEMLESSNOISE"], "seemlessNoiseFragPars");
    this.addCode(codes, ["+HEIGHT2NORMAL","+HEIGHT2NORMALSOBEL"], "height2NormalFragPars");
    this.addCode(codes, ["COLORBALANCE"], "colorBalanceFragPars");
    this.addCode(codes, ["POLARCONVERSION"], "polarConversionFragPars");
    this.addCode(codes, ["SMOKE"], "smokeFragPars");
    this.addCode(codes, ["FLAME"], "flameFragPars");
    this.addCode(codes, ["FIRE"], "fireFragPars");
    this.addCode(codes, ["CELL"], "cellFragPars");
    this.addCode(codes, ["LIGHTNING"], "lightningFragPars");
    this.addCode(codes, ["FLARE"], "flareFragPars");
    this.addCode(codes, ["FLARE2"], "flare2FragPars");
    this.addCode(codes, ["FLARE3"], "flare3FragPars");
    this.addCode(codes, ["MAGICCIRCLE"], "magicCircleFragPars");
    this.addCode(codes, ["CROSS"], "crossFragPars");
    this.addCode(codes, ["EXPLOSION"], "explosionFragPars");
    this.addCode(codes, ["CORONA"], "coronaFragPars");
    this.addCode(codes, ["TEST"], "testFragPars");
    
    codes.push("");
    codes.push("void main() {");
    
      this.addCode(codes, [], "frag");
      
      //// FRAGMENT
      
      // this.addCode(codes, [], "");
      this.addCode(codes, ["WOOD"], "woodFrag");
      this.addCode(codes, ["CIRCLE"], "circleFrag");
      this.addCode(codes, ["SOLAR"], "solarFrag");
      this.addCode(codes, ["SPARK"], "sparkFrag");
      this.addCode(codes, ["RING"], "ringFrag");
      this.addCode(codes, ["GRADATION"], "gradationFrag");
      this.addCode(codes, ["GRADATIONLINE"], "gradationLineFrag");
      this.addCode(codes, ["FLASH"], "flashFrag");
      this.addCode(codes, ["CONE"], "coneFrag");
      this.addCode(codes, ["FLOWER"], "flowerFrag");
      this.addCode(codes, ["FLOWER+FUN"], "flowerFunFrag");
      this.addCode(codes, ["WAVERING"], "waveRingFrag");
      this.addCode(codes, ["NOISE"], "noiseFrag");
      this.addCode(codes, ["MANDELBLOT"], "mandelblotFrag");
      this.addCode(codes, ["JULIA"], "juliaFrag");
      this.addCode(codes, ["SEEMLESSNOISE"], "seemlessNoiseFrag");
      this.addCode(codes, ["HEIGHT2NORMAL"], "height2NormalFrag");
      this.addCode(codes, ["HEIGHT2NORMALSOBEL"], "height2NormalSobelFrag");
      this.addCode(codes, ["POLARCONVERSION"], "polarConversionFrag");
      this.addCode(codes, ["COLORBALANCE"], "colorBalanceFrag");
      this.addCode(codes, ["SMOKE"], "smokeFrag");
      this.addCode(codes, ["FLAME"], "flameFrag");
      this.addCode(codes, ["FIRE"], "fireFrag");
      this.addCode(codes, ["CELL"], "cellFrag");
      this.addCode(codes, ["LIGHTNING"], "lightningFrag");
      this.addCode(codes, ["FLARE"], "flareFrag");
      this.addCode(codes, ["FLARE2"], "flare2Frag");
      this.addCode(codes, ["FLARE3"], "flare3Frag");
      this.addCode(codes, ["MAGICCIRCLE"], "magicCircleFrag");
      this.addCode(codes, ["CROSS"], "crossFrag");
      this.addCode(codes, ["EXPLOSION"], "explosionFrag");
      this.addCode(codes, ["CORONA"], "coronaFrag");
      this.addCode(codes, ["COPY"], "copyFrag");
      this.addCode(codes, ["TEST"], "testFrag");
      
      this.addCode(codes, ["TOON"], "toonFrag");
      
      this.addCode(codes, [], "fragEnd");
      
    codes.push("}");
    return codes.join("\n");
  }
  
  this.createMaterial = function(uniforms) {
    return new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.generateVertexShader(),
      fragmentShader: this.generateFragmentShader()
    });
  }
  
  this.createMaterial = function(uniforms, options) {
    return new THREE.RawShaderMaterial(Object.assign({
      uniforms: uniforms,
      vertexShader: this.generateVertexShader(),
      fragmentShader: this.generateFragmentShader()
    }, options));
  }
};

PixSpriteStudioShader.prototype.constructor = PixSpriteStudioShader;
