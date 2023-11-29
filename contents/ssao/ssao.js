function generateSampleKernel(kernelSize) {
    var kernel = [];
    for (var i=0; i<kernelSize; i++) {
        var sample = new THREE.Vector3();
        sample.x = (Math.random()*2)-1;
        sample.y = (Math.random()*2)-1;
        sample.z = Math.random();
        sample.normalize();

        var scale = i / kernelSize;
        scale = THREE.Math.lerp(0.1, 1, scale * scale);
        sample.multiplyScalar(scale);

        kernel.push(sample);
    }
    return kernel;
}

function generateRandomKernelRotations() {
    var width = 4, height = 4;

    if (SimplexNoise === undefined) {
        console.error('ssao.js: THREE.SimplexNoise is not defined.');
    }

    var simplex = new SimplexNoise();
    var size = width * height;
    var data = new Float32Array(size*4);
    for (var i=0; i<size; i++) {
        var stride = i*4;
        var x = (Math.random()*2)-1;
        var y = (Math.random()*2)-1;
        var z = 0;

        var noise = simplex.noise3d(x,y,z);
        data[stride] = noise;
        data[stride+1] = noise;
        data[stride+2] = noise;
        data[stride+3] = 1;
    }

    var noiseTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.needsUpdate = true;
    return noiseTexture;
}
