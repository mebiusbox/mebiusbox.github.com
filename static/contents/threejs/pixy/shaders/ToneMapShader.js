PixToneMapShader = {
  uniforms: {
    "exposure": { value: 3.0 },
    "whitePoint": { value: 5.0 },
    "tDiffuse": { value: null },
  },
  
  vertexShader: [
    "varying vec2 vUv;",
    
    "void main() {",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "vUv = uv;",
    "}"
  ].join("\n"),
  
  fragmentShader: [
    "uniform float exposure;",
    "uniform float whitePoint;",
    "uniform sampler2D tDiffuse;",
    "",
    // // exposure only
    // "vec3 LinearToneMapping(vec3 color) {",
    // "  return exposure * color;",
    // "}",
    // "",
    // // source: https://www.cs.utah.edu/~reinhard/cdrom/
    // "vec3 ReinhardToneMapping(vec3 color) {",
    // "  color *= exposure;",
    // "  return saturate(color / (vec3(1.0) + color));",
    // "}",
    // "",
    // // source: http://filmicgames.com/archives/75
    // "#define Uncharted2Helper(x) max(((x * 0.15 * x + 0.10 * 0.50) + 0.20 * 0.02)",
    // "vec3 Uncharted2ToneMapping(vec3 color) {",
    // // John Hable's filmic operator from Uncharted 2 video game
    // "  color *= exposure;",
    // "  return saturate(Uncharted2Helper(color) / Uncharted2Helper(vec3(whitePoint)));",
    // "}",
    // "",
    // // source: http://filmicgames.com/archives/75
    // "vec3 OptimizedCineonToneMapping(vec3 color) {",
    // // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson
    // "  color *= exposure;",
    // "  color = max(vec3(0.0), color - 0.004);",
    // "  return pow((color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06), vec3(2.2));",
    // "}",
    
    "#define PixUncharted2Helper(x) max(((x * (0.15 * x + 0.10 * 0.50) + 0.20 * 0.02) / (x * (0.15 * x + 0.50) + 0.20 * 0.30)) - 0.02 / 0.30, vec3(0.0))",
    "vec3 PixUncharted2ToneMapping(vec3 color) {",
    // John Hable's filmic operator from Uncharted 2 video game
    "  color *= exposure;",
    "  return saturate(PixUncharted2Helper(color) / PixUncharted2Helper(vec3(whitePoint)));",
    "}",
    
    "varying vec2 vUv;",
    
    "void main() {",

      "vec4 colorRGBA = texture2D(tDiffuse, vUv);",
      "gl_FragColor = vec4(PixUncharted2ToneMapping(colorRGBA.rgb), 1.0);",
      
    "}"
  ].join("\n")
};