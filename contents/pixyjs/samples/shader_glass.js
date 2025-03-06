import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGL2Available() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	post: {},
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	shader: undefined,
	glassShader: undefined,
	gui: undefined,
	parameters: undefined,
	ready: false,

	init() {
		this.initGraphics();
		this.initPost();
		this.initScene();
		this.initGui();
	},

	initGraphics() {
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		//! RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0xaaaaaa );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( this.renderer.domElement );

		//! STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );
	},

	initScene() {
		this.scene = new THREE.Scene();

		//! CAMERA

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 8000 );
		this.camera.position.set( 0, 0, 10 );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		this.controls.addEventListener( 'change', this.render );

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct );
		this.scene.add( this.lights.directHelper );

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("NOLIT");
		this.shader.enable( 'DIRECTLIGHT', 1 );
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("SPOTLIGHT", 1);
		this.shader.enable( 'PHONG' );
		this.shader.enable( 'REFLECTION' );
		this.shader.enable( 'FRESNEL' );
		// this.shader.enable("VELVET");
		this.shader.enable( 'AMBIENT' );
		// this.shader.enable("HEMISPHERE");
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		this.shader.enable( 'RIMLIGHT' );
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'NORMALMAP' );
		// this.shader.enable("BUMPMAP");
		this.shader.enable( 'SPECULARMAP' );
		this.shader.enable( 'AOMAP' );
		// this.shader.enable("LIGHTMAP");
		// this.shader.enable("PROJECTIONMAP");
		// this.shader.enable("DISTORTION");
		// this.shader.enable("UVSCROLL");
		// this.shader.enable("GLASS");
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		this.glassShader = new PIXY.Shader();
		this.glassShader.enable( 'NOLIT' );
		this.glassShader.enable( 'COLORMAP' );
		this.glassShader.enable( 'DISTORTION' );
		this.glassShader.enable( 'GLASS' );
		this.glassShader.build();
		// console.log(this.glassShader.uniforms);
		// console.log(this.glassShader._generateVertexShader());
		// console.log(this.glassShader._generateFragmentShader());

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/brick_diffuse.jpg');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/brick_bump.jpg');
		this.shader.uniforms.tDiffuse.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_col.png' );
		this.shader.uniforms.tNormal.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_nrm.png' );
		this.shader.uniforms.tSpecular.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_spec.png' );
		this.shader.uniforms.tAO.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_ao.png' );

		this.glassShader.uniforms.tDistortion.value = textureLoader.load( 'assets/textures/waternormals.jpg' );
		this.glassShader.uniforms.tDistortion.warpS = THREE.RepeatWrapping;
		this.glassShader.uniforms.tDistortion.warpT = THREE.RepeatWrapping;

		//! ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( tex ) => {
			this.scene.background = tex;
			this.ready = true;
		} );

		//! MODELS

		let sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		sphereGeometry.computeTangents();
		let sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.post.scene.add( sphere );

		sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		sphereGeometry.computeTangents();
		sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.scene.add( sphere );

		let planeGeometry = new THREE.PlaneGeometry( 10, 10 );
		let plane = new THREE.Mesh( planeGeometry, this.glassShader.material );
		plane.position.z = 2.0;
		this.scene.add( plane );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		this.shader.uniforms.diffuseColor.value.setHex( 0xff0000 );

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		const h = this.gui.addFolder( 'Glass' );
		this.parameters.glassStrength = this.glassShader.uniforms.glassStrength.value;
		this.parameters.glassCurvature = this.glassShader.uniforms.glassCurvature.value;
		h.add( this.parameters, 'glassStrength', 0.0, 1.0, 0.01 ).onChange( ( value ) => {
			this.glassShader.uniforms.glassStrength.value = value;
		} );
		h.add( this.parameters, 'glassCurvature', 0.0, 2.0, 0.01 ).onChange( ( value ) => {
			this.glassShader.uniforms.glassCurvature.value = value;
		} );
	},

	initPost() {
		this.post.scene = new THREE.Scene();
		this.post.rtColor = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
	},

	animate() {
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrixWorld();

		this.lights.direct.position.copy( this.shader.uniforms.directLights.value[ 0 ].direction );
		this.lights.direct.position.transformDirection( this.camera.matrixWorld );
		this.lights.direct.position.multiplyScalar( 5.0 );
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );
		PIXY.ShaderUtils.UpdateShaderParameters( this.glassShader, this.parameters, this.camera );

		this.post.scene.background = this.shader.uniforms.tEnvMap.value;
		this.renderer.setRenderTarget( this.post.rtColor );
		this.renderer.render( this.post.scene, this.camera );

		this.glassShader.uniforms.tBackBuffer.value = this.post.rtColor.texture;
		this.renderer.setRenderTarget( null );
		this.renderer.render( this.scene, this.camera );
	},
};

app.init();
app.animate();

//! EVENTS

window.addEventListener( 'resize', onWindowResize, false );

//! EVENT HANDLERS

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}
