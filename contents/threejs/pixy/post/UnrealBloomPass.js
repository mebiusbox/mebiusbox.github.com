PixUnrealBloomPass = function(resolution, strength, radius, threshold) {
  
  PixScreenPass.call(this);
  
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
  
  if (PixLuminosityHighPassShader === undefined) {
    console.error("PixUnrealBloomPass relies on PixLuminosityHighPassShader");
  }
  
  var shader = PixLuminosityHighPassShader;
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
  
  if (THREE.CopyShader === undefined) {
    console.error("PixUnrealBloomPass relies on THREE.CopyShader");
  }
  
  var copyShader = THREE.CopyShader;
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

PixUnrealBloomPass.prototype = Object.assign(Object.create(PixScreenPass.prototype), {
  
  constructor: PixUnrealBloomPass,
  
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
      this.separableBlurMaterials[i].uniforms.direction.value = PixUnrealBloomPass.BlurDirectionX;
      renderer.render(this.scene, this.camera, this.rtHori[i], true);
      
      this.separableBlurMaterials[i].uniforms.tDiffuse.value = this.rtHori[i].texture;
      this.separableBlurMaterials[i].uniforms.direction.value = PixUnrealBloomPass.BlurDirectionY;
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

PixUnrealBloomPass.BlurDirectionX = new THREE.Vector2(1.0, 0.0);
PixUnrealBloomPass.BlurDirectionY = new THREE.Vector2(0.0, 1.0);
