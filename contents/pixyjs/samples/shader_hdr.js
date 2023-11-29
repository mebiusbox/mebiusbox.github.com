import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WebGL.getWebGLErrorMessage() );

}

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	post: {},
	canvas: undefined,
	deferred: {},
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	textures: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,
	time: 0.0,
	ready: false,

	init() {

		this.initGraphics();
		this.initScene();
		this.initPost();
		this.initGui();

	},

	initGraphics() {

		// RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setClearColor( 0x999999 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		// if (!renderer.extensions.get( "OES_texture_float")) {
		//   alert('No OES_texture_float support for float textures.' );
		//   return;
		// }
		//
		// if (!renderer.extensions.get('WEBGL_draw_buffers')) {
		//   alert('not support WEBGL_draw_buffers.');
		//   return;
		// }
		//
		// if (!renderer.extensions.get('EXT_shader_texture_lod')) {
		//   alert('not support EXT_shader_texture_lod.');
		//   return;
		// }

		// this.renderer.gammaInput = false;
		// this.renderer.gammaOutput = false;

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.canvas = this.renderer.domElement;
		container.appendChild( this.canvas );

		// STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );

	},

	initScene() {

		// scene itself
		this.scene = new THREE.Scene();

		// MARK: CAMERA

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
		this.camera.position.set( 0.0, 34.74, 61.33 );
		this.scene.add( this.camera );

		// MARK: RENDER TARGET

		// MARK: CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 13, 0 );
		this.controls.update();
		// this.controls.addEventListener('change', this.render);

		// MARK: LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct, 0.5 );
		this.scene.add( this.lights.directHelper );

		// MARK: MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("DIRECTLIGHT", 1);
		// // this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("STANDARD");
		// this.shader.enable("COLORMAP");
		// this.shader.enable("BUMPMAP");
		// this.shader.enable("ROUGHNESSMAP");
		// this.shader.enable("REFLECTION");
		this.shader.enable( 'NOLIT' );
		this.shader.enable( 'EMISSIVE' );
		this.shader.enable( 'EMISSIVEMAP' );
		this.shader.build( { transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide } );
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		// MARK: TEXTURES

		const loadTexture = function ( loader, path ) {

			return loader.load( path, function ( texture ) {

				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;

			} );

		};

		const textureLoader = new THREE.TextureLoader();
		// this.textures.emissive = loadTexture(textureLoader, 'assets/textures/star2.png');
		this.textures.emissive = loadTexture( textureLoader, 'assets/textures/star2.png' );
		// this.textures.diffuse = loadTexture(textureLoader, 'assets/textures/brick_diffuse.jpg');
		// this.textures.normal = loadTexture(textureLoader, 'assets/textures/brick_bump.jpg');
		// this.textures.roughness = loadTexture(textureLoader, 'assets/textures/brick_roughness.jpg');
		//
		// // MARK: ENVIRONMENT MAP
		//
		// const path = 'assets/textures/cube/skybox/';
		// const urls = [
		//   path + 'px.jpg', path + 'nx.jpg',
		//   path + 'py.jpg', path + 'ny.jpg',
		//   path + 'pz.jpg', path + 'nz.jpg'
		// ];
		//
		// textures.envMap =new THREE.CubeTextureLoader().load(urls, function(texture) {
		//   texture.generateMipmaps = true;
		//   texture.needsUpdate = true;
		//   // scene.background = texture;
		// });
		//
		// this.shader.uniforms.tDiffuse.value = this.textures.diffuse;
		// this.shader.uniforms.tNormal.value = this.textures.normal;
		// this.shader.uniforms.tRoughness.value = this.textures.roughness;
		// this.shader.uniforms.bumpiness.value = 0.01;
		// this.shader.uniforms.tEnvMap.value = this.textures.envMap;
		this.shader.uniforms.tEmissive.value = this.textures.emissive;

		// MARK: MODELS

		let geometry = new THREE.PlaneGeometry( 50, 50 );
		geometry.computeTangents();
		let mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.rotation.x = -Math.PI * 0.5;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.y = 25.0;
		mesh.position.z = -25.0;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.y = 25.0;
		mesh.position.z = 25.0;
		mesh.rotation.y = Math.PI;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.x = -25.0;
		mesh.position.y = 25.0;
		mesh.rotation.y = Math.PI * 0.5;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.x = 25.0;
		mesh.position.y = 25.0;
		mesh.rotation.y = -Math.PI * 0.5;
		this.scene.add( mesh );

		geometry = new THREE.SphereGeometry( 8, 32, 32 );
		geometry.computeTangents();
		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.y = 15;
		this.scene.add( mesh );

		// this.post.scene = new THREE.Scene();
		// this.post.scene.add(new THREE.AxisHelper(20));

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

		this.ready = true;

	},

	initGui() {

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
		this.parameters.bloom = true;
		this.parameters.bloomStrength = 1.5;
		this.parameters.bloomRadius = 0.4;
		this.parameters.bloomThreshold = 0.85;
		this.parameters.toneMapping = true;
		this.parameters.exposure = 3.0;
		this.parameters.whitePoint = 5.0;
		this.gui.add( this.parameters, 'bloom' );
		this.gui.add( this.parameters, 'bloomRadius', 0.0, 2.0 );
		this.gui.add( this.parameters, 'bloomStrength', 0.0, 5.0 );
		this.gui.add( this.parameters, 'bloomThreshold', 0.0, 1.0 );
		this.gui.add( this.parameters, 'toneMapping' );
		this.gui.add( this.parameters, 'exposure', 0.0, 10.0 );
		this.gui.add( this.parameters, 'whitePoint', 0.0, 10.0 );

	},

	initPost() {

		// this.post.depthTexture = new THREE.DepthTexture();
		// this.post.depthTexture.minFilter = THREE.NearestFilter;
		// this.post.depthTexture.magFilter = THREE.NearestFilter;
		// this.post.depthTexture.type = THREE.UnsignedShortType;

		// const pars = {
		// 	minFilter: THREE.LinearFilter,
		// 	magFilter: THREE.LinearFilter,
		// 	format: THREE.RGBFormat,
		// 	generateMipmaps: false,
		// 	stencilBuffer: false,
		// 	// depthTexture: post.depthTexture
		// };

		const parsF = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false,
			type: THREE.FloatType,
		};

		this.post.rtScene = new THREE.WebGLRenderTarget( this.canvas.width, this.canvas.height, parsF );
		this.post.bloomPass = new PIXY.UnrealBloomPass(
			new THREE.Vector2( this.canvas.width, this.canvas.height ),
			1.5,
			0.4,
			0.85,
			true
		);
		this.post.toneMapPass = new PIXY.ShaderPass( PIXY.ShaderLib.toneMap );
		this.post.copyPass = new PIXY.CopyPass();
		this.post.viewPass = new PIXY.ShaderPass( PIXY.ShaderLib.view, 'dummy' );
		this.post.viewPass.uniforms.tDiffuse.value = this.post.depthTexture;
		this.post.viewPass.uniforms.type.value = PIXY.ViewDepth;
		this.post.viewPass.uniforms.cameraNear.value = this.camera.near;
		this.post.viewPass.uniforms.cameraFar.value = this.camera.far;
		this.post.viewPass.enabled = false;
		this.post.composer = new PIXY.Composer( this.renderer );
		this.post.composer.addPass( new PIXY.RenderPass( this.scene, this.camera ), null, this.post.rtScene );
		this.post.composer.addPass( this.post.bloomPass, this.post.rtScene, this.post.rtScene );
		this.post.composer.addPass( this.post.toneMapPass, this.post.rtScene, null );
		// this.post.composer.addPass(new PIXY.RenderPass(this.scene, this.camera), null, null);
		// this.post.composer.addPass(this.post.copyPass, this.post.rtScene, null);

		// this.post.composer.addPass(this.post.viewPass, this.post.rtScene, null);
		// this.post.composer.addPass(new PIXY.CopyPass(), this.post.rtBlur1, null, false, false);

		// this.post.copyPass = new PIXY.CopyPass();
		// this.post.copyPass.uniforms.tDiffuse.value = this.post.rtScene.texture;
		// this.post.bloomPass = new PIXY.UnrealBloomPass(new THREE.Vector2(this.canvas.width, this.canvas.height), 1.5, 0.4, 0.85);
		// this.post.toneMapPass = new PIXY.ShaderPass(PIXY.ShaderLib.toneMap);
		// this.post.toneMapPass.uniforms.tDiffuse.value = this.post.rtScene.texture;
		// this.post.composer = new PIXY.Composer(this.renderer);
		// this.post.composer.addPass(this.post.bloomPass, this.post.rtScene, this.post.rtScene);
		// this.post.composer.addPass(this.post.toneMapPass, this.post.rtScene, null);
		// this.post.composer.addPass(this.post.copyPass, this.post.rtScene, null);

	},

	animate() {

		this.time += this.clock.getDelta();
		requestAnimationFrame( this.animate.bind( this ) );
		this.render();

	},

	render() {

		if ( !this.ready ) return;

		this.stats.update();

		// this.lights.direct.position.copy(this.shader.uniforms.directLights.value[0].direction);
		// this.lights.direct.position.transformDirection(this.camera.matrixWorld);
		// this.lights.direct.position.multiplyScalar(5.0);
		// this.lights.direct.color.copy(this.shader.uniforms.directLights.value[0].color);
		// this.lights.directHelper.update();

		this.camera.updateMatrix();
		this.camera.updateMatrixWorld();
		this.camera.updateProjectionMatrix();
		this.camera.matrixWorldInverse.copy( this.camera.matrixWorld ).invert();

		const viewProjectionInverse = new THREE.Matrix4();
		viewProjectionInverse.copy( this.camera.projectionMatrix );
		viewProjectionInverse.multiply( this.camera.matrixWorldInverse );
		// this.post.ssaoPass.uniforms.projectionInverse.value.copy(viewProjectionInverse).invert();
		// this.post.ssaoPass.uniforms.projectionInverse.value.copy(camera.projectionMatrix).invert();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		this.renderer.setClearColor( 0x0 );
		this.renderer.setClearAlpha( 0 );
		// this.renderer.render(this.scene, this.camera, this.post.rtScene);

		// this.post.ssaoPass.uniforms.cameraNear.value = this.camera.near;
		// this.post.ssaoPass.uniforms.cameraFar.value = this.camera.far;
		// this.post.composer.render();

		/// LIGHT PASS

		// this.renderer.autoClear = false;
		// this.renderer.render(this.deferred.scene, this.deferred.camera);
		// this.renderer.render(this.deferred.scene, this.deferred.camera, this.post.rtScene);

		// BLOOM + TONE MAPPING

		this.post.bloomPass.enabled = this.parameters.bloom;
		this.post.bloomPass.strength = this.parameters.bloomStrength;
		this.post.bloomPass.radius = this.parameters.bloomRadius;
		this.post.bloomPass.threshold = this.parameters.bloomThreshold;
		this.post.toneMapPass.enabled = this.parameters.toneMapping;
		this.post.toneMapPass.uniforms.exposure.value = this.parameters.exposure;
		this.post.toneMapPass.uniforms.whitePoint.value = this.parameters.whitePoint;
		// this.post.copyPass.enabled = !this.parameters.toneMapping;
		this.post.composer.render();

		/// POST PASS

		// this.renderer.autoClear = false;
		// this.renderer.clearDepth();
		// this.renderer.render(this.post.scene, this.camera);

		/// DEBUG VIEW PASS

		// this.renderer.clearDepth();
		// for (var i=0; i<deferred.views.length; ++i) {
		//   this.deferred.viewShader.uniforms.tDiffuse.value = this.deferred.views[i].texture;
		//   this.deferred.viewShader.uniforms.type.value = this.deferred.views[i].type;
		//   this.deferred.viewShader.uniforms.cameraNear.value = this.camera.near;
		//   this.deferred.viewShader.uniforms.cameraFar.value = this.camera.far;
		//   this.deferred.views[i].sprite.render(this.renderer);
		// }
		//
		// this.renderer.autoClear = true;

	},
};

app.init();
app.animate();

// EVENTS

window.addEventListener( 'resize', onWindowResize, false );

THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {

	let bar = 250;
	bar = Math.floor( ( bar * loaded ) / total );
	document.getElementById( 'bar' ).style.width = bar + 'px';

	console.log( item, loaded, total );

	if ( loaded == total ) {

		app.ready = true;
		document.getElementById( 'message' ).style.display = 'none';
		document.getElementById( 'progressbar' ).style.display = 'none';
		document.getElementById( 'progress' ).style.display = 'none';
		console.log( 'ready' );

	}

};

// EVENT HANDLERS

function onWindowResize() {

	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();

}
