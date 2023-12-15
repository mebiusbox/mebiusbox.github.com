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
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	shader: undefined,
	ditherShader: undefined,
	gui: undefined,
	parameters: undefined,
	ready: false,

	init() {
		this.initGraphics();
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
		// this.scene.add(lights.ambient);

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

		this.ditherShader = new PIXY.Shader();
		this.ditherShader.enable( 'NOLIT' );
		this.ditherShader.enable( 'DITHER' );
		this.ditherShader.build();
		this.ditherShader.uniforms.opacity.value = 0.5;
		// console.log(this.ditherShader.uniforms);
		// console.log(this.ditherShader._generateVertexShader());
		// console.log(this.ditherShader._generateFragmentShader());

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		// varshader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/brick_diffuse.jpg');
		// varshader.uniforms.tNormal.value = textureLoader.load('assets/textures/brick_bump.jpg');
		this.shader.uniforms.tDiffuse.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_col.png' );
		this.shader.uniforms.tNormal.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_nrm.png' );
		this.shader.uniforms.tSpecular.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_spec.png' );
		this.shader.uniforms.tAO.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_ao.png' );

		//! ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( tex ) => {
			this.scene.background = tex;
			this.ready = true;
		} );

		//! MODELS

		const sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		sphereGeometry.computeTangents();
		const sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.scene.add( sphere );

		const planeGeometry = new THREE.PlaneGeometry( 10, 10 );
		const plane = new THREE.Mesh( planeGeometry, this.ditherShader.material );
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

		this.parameters.ditherOpacity = this.ditherShader.uniforms.opacity.value;
		const h = this.gui.addFolder( 'Dither' );
		h.add( this.parameters, 'ditherOpacity', 0.0, 1.0, 0.001 ).onChange( ( value ) => {
			this.ditherShader.uniforms.opacity.value = value;
		} );
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
		PIXY.ShaderUtils.UpdateShaderParameters( this.ditherShader, this.parameters, this.camera );

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
