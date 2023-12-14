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
		this.camera.position.set( 500, 500, 500 );

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
		// this.shader.enable("ROUGHNESSMAP");
		// this.shader.enable("METALNESSMAP");
		// this.shader.enable("REFLECTION");
		// this.shader.enable("FRESNEL");
		// this.shader.enable("VELVET");
		// this.shader.enable("AMBIENT");
		// this.shader.enable("HEMISPHERE");
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		// this.shader.enable("RIMLIGHT");
		// this.shader.enable("COLORMAP");
		// this.shader.enable("NORMALMAP");
		// this.shader.enable("BUMPMAP");
		// this.shader.enable("SPECULARMAP");
		// this.shader.enable("AOMAP");
		// this.shader.enable("PROJECTIONMAP");
		// this.shader.enable("DISTORTION");
		// this.shader.enable("UVSCROLL");
		// this.shader.enable("UVPROJECTION");
		// this.shader.enable("GLASS");
		this.shader.enable( 'OVERLAY' );
		this.shader.enable( 'OVERLAYNORMAL' );
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
		this.shader.uniforms.tOverlay1.value = loadTexture( textureLoader, 'assets/textures/Tiles/gravel_DM.png' );
		this.shader.uniforms.tOverlay2.value = loadTexture( textureLoader, 'assets/textures/Tiles/grass_DM.png' );
		this.shader.uniforms.tOverlay3.value = loadTexture( textureLoader, 'assets/textures/Tiles/cliff_DM.png' );
		this.shader.uniforms.tOverlay4.value = loadTexture( textureLoader, 'assets/textures/Tiles/snow_DM.png' );
		this.shader.uniforms.tOverlay5.value = loadTexture( textureLoader, 'assets/textures/Tiles/grassDark_DM.png' );
		this.shader.uniforms.tOverlayMask.value = loadTexture( textureLoader, 'assets/textures/Mask.png' );
		this.shader.uniforms.overlay1Scale.value = 1.0;
		this.shader.uniforms.overlay2Scale.value = 1.0;
		this.shader.uniforms.overlay3Scale.value = 1.0;
		this.shader.uniforms.overlay4Scale.value = 1.0;
		this.shader.uniforms.overlay5Scale.value = 1.0;
		this.shader.uniforms.tOverlay1Normal.value = loadTexture( textureLoader, 'assets/textures/Tiles/gravel_NM.png' );
		this.shader.uniforms.tOverlay2Normal.value = loadTexture( textureLoader, 'assets/textures/Tiles/grass_NM.png' );
		this.shader.uniforms.tOverlay3Normal.value = loadTexture( textureLoader, 'assets/textures/Tiles/cliff_NM.png' );
		this.shader.uniforms.tOverlay4Normal.value = loadTexture( textureLoader, 'assets/textures/Tiles/Snow_NM.jpg' );
		this.shader.uniforms.tOverlay5Normal.value = loadTexture( textureLoader, 'assets/textures/Tiles/grass_NM.png' );

		//! ENVIRONMENT MAP

		// const path = 'assets/textures/cube/skybox/';
		// const urls = [
		//   path + 'px.jpg', path + 'nx.jpg',
		//   path + 'py.jpg', path + 'ny.jpg',
		//   path + 'pz.jpg', path + 'nz.jpg'
		// ];

		// this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( texture ) => {
		//   texture.generateMipmaps = true;
		//   texture.needsUpdate = true;
		//   this.scene.background = texture;
		// } );

		//! MODELS

		const img = new Image();
		img.onload = () => {
			const heightField = new PIXY.HeightField();
			const geo = heightField.generate( img, 1.0 );
			geo.computeTangents();
			const plane = new THREE.Mesh( geo, this.shader.material );
			this.scene.add( plane );
		};

		img.src = 'assets/textures/HeightMap512.png';

		// const sphereGeometry = new THREE.SphereBufferGeometry(2, 64, 64);
		// sphereGeometry.computeTangents();
		// const sphere = new THREE.Mesh(sphereGeometry, shader.material);
		// this.scene.add(sphere);

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		// this.shader.uniforms.diffuseColor.value.setHex(0xff0000);
		this.shader.uniforms.directLights.value[ 0 ].direction.set( -1, 1, 1 ).normalize();
		// this.shader.uniforms.bumpiness.value = 0.01;
		// this.shader.uniforms.roughness.value = 0.0;
		// this.shader.uniforms.metalness.value = 0.5;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		const h = this.gui.addFolder( 'Overlay' );
		this.parameters.overlay1Scale = this.shader.uniforms.overlay1Scale.value;
		this.parameters.overlay2Scale = this.shader.uniforms.overlay2Scale.value;
		this.parameters.overlay3Scale = this.shader.uniforms.overlay3Scale.value;
		this.parameters.overlay4Scale = this.shader.uniforms.overlay4Scale.value;
		this.parameters.overlay5Scale = this.shader.uniforms.overlay5Scale.value;
		h.add( this.parameters, 'overlay1Scale', 1.0, 10.0 ).onChange( ( value ) => {
			this.shader.uniforms.overlay1Scale.value = value;
		} );
		h.add( this.parameters, 'overlay2Scale', 1.0, 10.0 ).onChange( ( value ) => {
			this.shader.uniforms.overlay2Scale.value = value;
		} );
		h.add( this.parameters, 'overlay3Scale', 1.0, 10.0 ).onChange( ( value ) => {
			this.shader.uniforms.overlay3Scale.value = value;
		} );
		h.add( this.parameters, 'overlay4Scale', 1.0, 10.0 ).onChange( ( value ) => {
			this.shader.uniforms.overlay4Scale.value = value;
		} );
		h.add( this.parameters, 'overlay5Scale', 1.0, 10.0 ).onChange( ( value ) => {
			this.shader.uniforms.overlay5Scale.value = value;
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
		this.lights.direct.position.multiplyScalar( 100.0 );
		this.lights.direct.target.position.copy( this.lights.direct.position ).multiplyScalar( 0.9 );
		this.lights.direct.target.updateMatrixWorld();
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );
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
