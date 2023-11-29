//// COMPOSER

PixComposer = function(renderer) {
  
  this.renderer = renderer;
  this.passes = [];
  // this.copyPass = new PixShaderPass(THREE.CopyShader);
};

Object.assign(PixComposer.prototype, {
  
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
  
  // insertPass: function(pass, index) {
  //   this.passes.splice(index, 0, pass);
  // },
  
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

PixPass = function() {
  
  // if set to true, the pass is processes by the composer
  this.enabled = true;
  
  // if set to true, the pass indicates to swap read and write buffer after rendering
  this.needsSwap = true;
  
  // if set to true, the pass clears its buffer before rendering
  this.clear = false;
  
  // if set to true, the result of the pass is rendering to screen
  this.renderToScreen = false;
};

Object.assign(PixPass.prototype, {
  
  setSize: function(width, height) {
  },
  
  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    console.error("PixPass: .render() must be implemented in derived pass.");
  }
});


//// RENDER PASS

PixRenderPass = function(scene, camera, overrideMaterial, clearColor, clearAlpha) {
  
  PixPass.call(this);
  
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

PixRenderPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  
  constructor: PixRenderPass,
  
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


//// CLEAR PASS

PixClearPass = function(clearColor, clearAlpha) {
  
  PixPass.call(this);
  
  this.needsSwap = false;
  this.clearColor = (clearColor !== undefined) ? clearColor : 0x000000;
  this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;
  // this.clearDepth;
  // this.colorMask;
};

PixClearPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  
  constructor: PixClearPass,
  
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

PixMaskPass = function(scene, camera) {
  
  PixPass.call(this);
  
  this.scene = scene;
  this.camera = camera;
  this.clear = true;
  this.needsSwap = false;
  this.inverse = false;
};

PixMaskPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  
  constructor: PixMaskPass,
  
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

PixClearMaskPass = function() {
  
  PixClearMaskPass.call(this);
  
  this.needsSwap = false;
};

PixClearMaskPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    renderer.state.buffers.stencil.setTest(false);
  }
});


//// SHADER PASS

PixShaderPass = function(shader, textureID) {
  
  PixPass.call(this);
  
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

PixShaderPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  
  constructor: PixShaderPass,
  
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

PixScreenPass = function() {
  
  PixPass.call(this);
  
  this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this.scene = new THREE.Scene();
  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), null);
  this.scene.add(this.quad);
};

PixScreenPass.prototype = Object.assign(Object.create(PixPass.prototype), {
  
  constructor: PixScreenPass,
  
  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
  }
});