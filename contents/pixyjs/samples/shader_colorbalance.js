import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	canvas: undefined,
	stats: undefined,
	clock: new THREE.Clock(),
	// lights: [],
	textures: {},
	post: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,
	ready: false,
	time: 0.0,

	init() {
		this.initGraphics();
		this.initScene();
		this.initPost();
		this.initGui();
	},

	initGraphics() {
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0x999999 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.canvas = this.renderer.domElement;
		container.appendChild( this.canvas );

		//! STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );
	},

	initScene() {
		this.scene = new THREE.Scene();

		//! CAMERA

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
		this.camera.position.set( 0.0, 34.74, 61.33 );
		this.scene.add( this.camera );

		//! RENDER TARGET

		//! CONTROLS

		// this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		// this.controls.target.set( 0, 13, 0 );
		// this.controls.update();
		// this.controls.addEventListener('change', render);

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		// this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		// this.scene.add( this.lights.direct );
		// this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct, 0.5 );
		// this.scene.add( this.lights.directHelper );

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("DIRECTLIGHT", 1);
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("STANDARD");
		this.shader.enable( 'COLORMAP' );
		// this.shader.enable("BUMPMAP");
		// this.shader.enable("ROUGHNESSMAP");
		// this.shader.enable("REFLECTION");
		this.shader.enable( 'NOLIT' );
		// this.shader.enable("EMISSIVE");
		// this.shader.enable("EMISSIVEMAP");
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		const loadTexture = ( loader, path ) => {
			return loader.load( path, ( texture ) => {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
			} );
		};

		const textureLoader = new THREE.TextureLoader();
		// textures.emissive = loadTexture(textureLoader,
		//   'assets/textures/star2.png');
		this.textures.diffuse = loadTexture( textureLoader, 'assets/textures/brick_diffuse.jpg' );
		// textures.normal = loadTexture(textureLoader, 'assets/textures/brick_bump.jpg');
		// textures.roughness = loadTexture(textureLoader, 'assets/textures/brick_roughness.jpg');


		//! ENVIRONMENT MAP

		// var path = 'assets/textures/cube/skybox/';
		// var urls = [
		//   path + 'px.jpg', path + 'nx.jpg',
		//   path + 'py.jpg', path + 'ny.jpg',
		//   path + 'pz.jpg', path + 'nz.jpg'
		// ];

		// this.textures.envMap = new THREE.CubeTextureLoader().load( urls, ( texture ) => {
		//   texture.generateMipmaps = true;
		//   texture.needsUpdate = true;
		// } );

		this.shader.uniforms.tDiffuse.value = this.textures.diffuse;
		// shader.uniforms.tNormal.value = textures.normal;
		// shader.uniforms.tRoughness.value = textures.roughness;
		// shader.uniforms.bumpiness.value = 0.01;
		// shader.uniforms.tEnvMap.value = textures.envMap;
		// shader.uniforms.tEmissive.value = textures.emissive;

		//! MODELS

		let geometry = new THREE.PlaneGeometry( 50, 50 );
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
		mesh = new THREE.Mesh( geometry, this.shader.material );
		mesh.position.y = 15;
		this.scene.add( mesh );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

		this.ready = true;
	},

	initGui() {
		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
		this.parameters.cColorBalanceShadowsR = 0.0001;
		this.parameters.cColorBalanceShadowsG = 0.0001;
		this.parameters.cColorBalanceShadowsB = 0.0001;
		this.parameters.cColorBalanceMidtonesR = 0.0001;
		this.parameters.cColorBalanceMidtonesG = 0.0001;
		this.parameters.cColorBalanceMidtonesB = 0.0001;
		this.parameters.cColorBalanceHighlightsR = 0.0001;
		this.parameters.cColorBalanceHighlightsG = 0.0001;
		this.parameters.cColorBalanceHighlightsB = 0.0001;
		this.parameters.cColorBalancePreserveLuminosity = false;

		const h = this.gui.addFolder( 'ColorBalance' );
		h.add( this.parameters, 'cColorBalanceShadowsR', -1.0, 1.0, 0.025 ).name( 'Shadows-R' );
		h.add( this.parameters, 'cColorBalanceShadowsG', -1.0, 1.0, 0.025 ).name( 'Shadows-G' );
		h.add( this.parameters, 'cColorBalanceShadowsB', -1.0, 1.0, 0.025 ).name( 'Shadows-B' );
		h.add( this.parameters, 'cColorBalanceMidtonesR', -1.0, 1.0, 0.025 ).name( 'Midtones-R' );
		h.add( this.parameters, 'cColorBalanceMidtonesG', -1.0, 1.0, 0.025 ).name( 'Midtones-G' );
		h.add( this.parameters, 'cColorBalanceMidtonesB', -1.0, 1.0, 0.025 ).name( 'Midtones-B' );
		h.add( this.parameters, 'cColorBalanceHighlightsR', -1.0, 1.0, 0.025 ).name( 'Highlights-R' );
		h.add( this.parameters, 'cColorBalanceHighlightsG', -1.0, 1.0, 0.025 ).name( 'Highlights-G' );
		h.add( this.parameters, 'cColorBalanceHighlightsB', -1.0, 1.0, 0.025 ).name( 'Highlights-B' );
	},

	initPost() {
		var parsF = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false,
			type: THREE.FloatType,
		};

		this.post.rtScene = new THREE.WebGLRenderTarget( this.canvas.width, this.canvas.height, parsF );
		this.post.colorBalancePass = new PIXY.ShaderPass( PIXY.ShaderLib.colorBalance );
		this.post.composer = new PIXY.Composer( this.renderer );
		this.post.composer.addPass( new PIXY.RenderPass( this.scene, this.camera ), null, this.post.rtScene );
		this.post.composer.addPass( this.post.colorBalancePass, this.post.rtScene, null );
	},

	animate() {
		this.time += this.clock.getDelta();
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		// this.lights.direct.position.copy(shader.uniforms.directLights.value[0].direction);
		// this.lights.direct.position.transformDirection(camera.matrixWorld);
		// this.lights.direct.position.multiplyScalar(5.0);
		// this.lights.direct.color.copy(shader.uniforms.directLights.value[0].color);
		// this.lights.directHelper.update();

		this.camera.updateMatrix();
		this.camera.updateMatrixWorld();
		this.camera.updateProjectionMatrix();
		this.camera.matrixWorldInverse.copy( this.camera.matrixWorld ).invert();

		const viewProjectionInverse = new THREE.Matrix4();
		viewProjectionInverse.copy( this.camera.projectionMatrix );
		viewProjectionInverse.multiply( this.camera.matrixWorldInverse );
		// this.post.ssaoPass.uniforms.projectionInverse.value.getInverse(viewProjectionInverse);
		// this.post.ssaoPass.uniforms.projectionInverse.value.getInverse(camera.projectionMatrix);

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		// this.renderer.setClearColor( 0x0 );
		// this.renderer.setClearAlpha( 0 );
		// this.renderer.render(this.scene, this.camera);
		// this.renderer.render(this.scene, this.camera, this.post.rtScene);


		//! COLOR BLANACE

		PIXY.FxgenShaderUtils.SetShaderParameter(
			this.post.colorBalancePass.uniforms,
			'cColorBalanceColor',
			new THREE.Vector3(
				this.parameters.cColorBalanceMidtonesR,
				this.parameters.cColorBalanceMidtonesG,
				this.parameters.cColorBalanceMidtonesB,
			),
		);

		this.post.composer.render();
	},
};

app.init();
app.animate();

//! EVENTS

window.addEventListener( 'resize', onWindowResize, false );

THREE.DefaultLoadingManager.onProgress = ( item, loaded, total ) => {
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

//! EVENT HANDLERS

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}
