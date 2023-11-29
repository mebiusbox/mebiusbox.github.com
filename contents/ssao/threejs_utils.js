function createMaterial(uniforms, vs, fs, options) {
return new THREE.ShaderMaterial(Object.assign({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs}, options || {}));
// material.extensions.shaderTextureLOD = true;
// material.extensions.derivatives = true;
}

function createCubeMap(name, genMipmap) {
    var path = "textures/skybox/" + name;
    var format = '.jpg';
    var urls = [
        path + "px" + format, path + 'nx' + format,
        path + "py" + format, path + 'ny' + format,
        path + "pz" + format, path + 'nz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load(urls, function(loadedCubeMap) {
    if (genMipmap) {
      loadedCubeMap.generateMipmaps = true;
      loadedCubeMap.needsUpdate = true;
    }
  });
    return textureCube;
}

function createRenderTarget(format) {
    var renderTarget = new THREE.WebGLRenderTarget(app.canvas.width, app.canvas.height);
    renderTarget.texture.format = format;
    renderTarget.texture.minFilter = THREE.NearestFilter;
    renderTarget.texture.magFilter = THREE.NearestFilter;
    renderTarget.texture.generateMipmaps = false;
    renderTarget.stencilBuffer = false;
    // renderTarget.depthBuffer = true;
    // renderTarget.depthTexture = new THREE.DepthTexture();
    // // renderTarget.depthTexture.type = THREE.UnsignedShortType;
    // renderTarget.depthTexture.type = THREE.UnsignedIntType;
    return renderTarget;
}