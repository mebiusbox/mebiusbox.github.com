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
	textures: {},
	shader: undefined,
	orenNayerShader: undefined,
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
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct, 0.5 );
		this.scene.add( this.lights.directHelper );

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("NOLIT");
		this.shader.enable( 'DIRECTLIGHT', 1 );
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("SPOTLIGHT", 1);
		// this.shader.enable("PHONG");
		this.shader.enable( 'STANDARD' );
		// this.shader.enable("ORENNAYER");
		this.shader.enable( 'ROUGHNESSMAP' );
		// this.shader.enable("METALNESSMAP");
		this.shader.enable( 'REFLECTION' );
		// this.shader.enable("FRESNEL");
		// this.shader.enable("VELVET");
		// this.shader.enable("AMBIENT");
		// this.shader.enable("HEMISPHERE");
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		// this.shader.enable("RIMLIGHT");
		this.shader.enable( 'COLORMAP' );
		// this.shader.enable("NORMALMAP");
		this.shader.enable( 'BUMPMAP' );
		// this.shader.enable("SPECULARMAP");
		// this.shader.enable("AOMAP");
		// this.shader.enable("PROJECTIONMAP");
		// this.shader.enable("DISTORTION");
		// this.shader.enable("UVSCROLL");
		// this.shader.enable("UVPROJECTION");
		// this.shader.enable("GLASS");
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		this.orenNayarShader = new PIXY.Shader();
		this.orenNayarShader.enable( 'DIRECTLIGHT', 1 );
		this.orenNayarShader.enable( 'STANDARD' );
		this.orenNayarShader.enable( 'ORENNAYAR' );
		this.orenNayarShader.enable( 'ROUGHNESSMAP' );
		this.orenNayarShader.enable( 'REFLECTION' );
		this.orenNayarShader.enable( 'COLORMAP' );
		this.orenNayarShader.enable( 'BUMPMAP' );
		this.orenNayarShader.build();

		//! TEXTURES

		const loadTexture = ( loader, path ) => {
			return loader.load( path, ( texture ) => {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
			} );
		};

		const textureLoader = new THREE.TextureLoader();
		this.textures.color = loadTexture( textureLoader, 'assets/textures/brick_diffuse.jpg' );
		this.textures.normal = loadTexture( textureLoader, 'assets/textures/brick_bump.jpg' );
		this.textures.roughness = loadTexture( textureLoader, 'assets/textures/brick_roughness.jpg' );
		this.textures.white = loadTexture( textureLoader, 'assets/textures/white.png' );
		this.textures.black = loadTexture( textureLoader, 'assets/textures/black.png' );
		this.shader.uniforms.tDiffuse.value = this.textures.color;
		this.shader.uniforms.tNormal.value = this.textures.normal;
		this.shader.uniforms.tRoughness.value = this.textures.roughness;

		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_col.png');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_nrm.png');
		// this.shader.uniforms.tSpecular.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_spec.png');
		// this.shader.uniforms.tAO.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_ao.png');

		//! ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( texture ) => {
			texture.generateMipmaps = true;
			texture.needsUpdate = true;
			this.scene.background = texture;
		} );

		//! MODELS

		let sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		sphereGeometry.computeTangents();
		let sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		sphere.position.x = -2.5;
		this.scene.add( sphere );

		sphere = new THREE.Mesh( sphereGeometry, this.orenNayarShader.material );
		sphere.position.x = 2.5;
		this.scene.add( sphere );

		let geo = new THREE.PlaneGeometry( 4, 4 );
		geo.computeTangents();
		let plane = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );
		plane.position.x = 2.5;
		this.scene.add( plane );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		this.shader.uniforms.diffuseColor.value.setHex( 0xff0000 );
		this.shader.uniforms.directLights.value[ 0 ].direction.set( -1, 1, 1 ).normalize();
		this.shader.uniforms.bumpiness.value = 0.01;
		this.shader.uniforms.roughness.value = 0.0;
		this.shader.uniforms.metalness.value = 0.5;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		this.gui.folders[ 0 ].controllers[ 2 ].__max = 2.0;

		const h = this.gui.addFolder( 'Texture' );
		this.parameters.color = true;
		this.parameters.normal = true;
		this.parameters.roughness = true;
		h.add( this.parameters, 'color' ).onChange( ( value ) => {
			this.shader.uniforms.tDiffuse.value = value ? this.textures.color : this.textures.white;
		} );
		h.add( this.parameters, 'normal' ).onChange( ( value ) => {
			this.shader.uniforms.tNormal.value = value ? this.textures.normal : this.textures.black;
		} );
		h.add( this.parameters, 'roughness' ).onChange( ( value ) => {
			this.shader.uniforms.tRoughness.value = value ? this.textures.roughness : this.textures.white;
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

		this.lights.direct.position.copy( this.shader.uniforms.directLights.value[ 0 ].direction ).normalize();
		this.lights.direct.position.transformDirection( this.camera.matrixWorld );
		this.lights.direct.position.multiplyScalar( 5.0 );
		this.lights.direct.target.position.copy( this.lights.direct.position ).multiplyScalar( 0.9 );
		this.lights.direct.target.updateMatrixWorld();
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		for ( let i in this.orenNayarShader.uniforms ) {
			this.orenNayarShader.uniforms[ i ].value = this.shader.uniforms[ i ].value;
		}

		this.renderer.render( this.scene, this.camera );
	},
};

app.init();
app.animate();

//! EVENTS

//! EVENT HANDLERS

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}

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
