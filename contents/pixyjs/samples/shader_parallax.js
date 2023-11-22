import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';

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
	shader2: undefined,
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

		// RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0xaaaaaa );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		// this.renderer.gammaInput = false;
		// this.renderer.gammaOutput = false;
		// this.renderer.autoClear = false;
		container.appendChild( this.renderer.domElement );

		// STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );

	},

	initScene() {

		// scene itself
		this.scene = new THREE.Scene();

		// MARK: CAMERA

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 8000 );
		this.camera.position.set( 0, 0, 10 );

		// MARK: CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		this.controls.addEventListener( 'change', this.render );

		// MARK: LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		// this.lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// this.scene.add(this.lights.direct);
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct);
		// this.scene.add(this.lights.directHelper);

		// MARK: MATERIALS

		this.shader = new PIXY.Shader();
		this.shader.enable( 'NOLIT' );
		// this.shader.enable("DIRECTLIGHT", 1);
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("SPOTLIGHT", 1);
		// this.shader.enable("PHONG");
		// this.shader.enable("REFLECTION");
		// this.shader.enable("FRESNEL");
		// this.shader.enable("VELVET");
		// this.shader.enable("AMBIENT");
		// this.shader.enable("HEMISPHERE");
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		// this.shader.enable("RIMLIGHT");
		this.shader.enable( 'COLORMAP' );
		// this.shader.enable("COLORMAP2");
		// this.shader.enable("NORMALMAP");
		// this.shader.enable("BUMPMAP");
		this.shader.enable( 'BUMPOFFSET' );
		// this.shader.enable("SPECULARMAP");
		// this.shader.enable("AOMAP");
		// this.shader.enable("PROJECTIONMAP");
		this.shader.enable( 'DISTORTION' );
		this.shader.enable( 'UVSCROLL2' );
		// this.shader.enable("UVPROJECTION");
		// this.shader.enable("GLASS");
		this.shader.build();
		// console.log(this.shader.uniforms);
		//console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		this.shader2 = new PIXY.Shader();
		this.shader2.enable( 'NOLIT' );
		this.shader2.enable( 'COLORMAP' );
		this.shader2.enable( 'COLORMAPALPHA' );
		this.shader2.enable( 'DISTORTION' );
		this.shader2.enable( 'UVSCROLL' );
		this.shader2.build( { transparent: true, blending: THREE.NormalBlending } );
		this.shader2.uniforms.diffuseColor.value.setHex( 0xcccccc );
		this.shader2.uniforms.distortionStrength.value = 0.1;
		this.shader2.uniforms.uvScrollSpeedU.value = 0.05;
		this.shader2.uniforms.uvScrollSpeedV.value = 0.05;
		// console.log(this.shader2.uniforms);
		//console.log(this.shader2._generateVertexShader());
		// console.log(this.shader2._generateFragmentShader());

		// MARK: TEXTURES

		const loadTexture = function ( loader, path ) {

			return loader.load( path, function ( texture ) {

				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;

			} );

		};

		const textureLoader = new THREE.TextureLoader();
		const tgaLoader = new TGALoader();
		this.shader.uniforms.tDiffuse.value = loadTexture( tgaLoader, 'assets/textures/ue4/T_CobbleStone_Pebble_D.TGA' );
		// this.shader.uniforms.tDiffuse.value = loadTexture(textureLoader, 'assets/textures/brick_diffuse.jpg');
		this.shader.uniforms.tDistortion.value = loadTexture( textureLoader, 'assets/textures/waternormals.jpg' );
		this.shader2.uniforms.tDiffuse.value = loadTexture( tgaLoader, 'assets/textures/caustics.tga' );
		this.shader2.uniforms.tDistortion.value = loadTexture( textureLoader, 'assets/textures/waternormals.jpg' );
		// this.shader.uniforms.tDiffuse2.value = loadTexture(tgaLoader, 'assets/textures/caustics.tga');
		// this.shader.uniforms.tDistortion.value = loadTexture(textureLoader, 'assets/textures/waternormals.jpg');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/brick_bump.jpg');
		// this.shader.uniforms.tNormal.value.wrapS = THREE.RepeatWrapping;
		// this.shader.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;
		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_col.png');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_nrm.png');
		// this.shader.uniforms.tSpecular.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_spec.png');
		// this.shader.uniforms.tAO.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_ao.png');

		// MARK: ENVIRONMENT MAP

		// const path = 'assets/textures/cube/skybox/';
		// const urls = [
		//   path + 'px.jpg', path + 'nx.jpg',
		//   path + 'py.jpg', path + 'ny.jpg',
		//   path + 'pz.jpg', path + 'nz.jpg'
		// ];
		//
		// this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load(urls, function(tex) {
		//   scene.background = tex;
		//   ready = true;
		//   // render();
		// });

		// MARK: MODELS

		// const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
		// sphereGeometry.computeTangents();
		// const sphere = new THREE.Mesh(sphereGeometry, shader.material);
		// this.scene.add(sphere);

		// var planeGeometry = new TsHREE.PlaneGeometry(2, 2, 10, 10);
		let slice = 10;
		let planeGeometry = new THREE.PlaneGeometry( 5, 5, slice, slice );
		let num = slice + 1;
		let tangents = new Float32Array( num * num * 4 );
		let tidx = 0;
		for ( let i = 0; i < num; i++ ) {

			for ( let j = 0; j < num; j++ ) {

				tangents[ tidx++ ] = 1;
				tangents[ tidx++ ] = 0;
				tangents[ tidx++ ] = 0;
				tangents[ tidx++ ] = 1;

			}

		}

		// planeGeometry.computeTangents();
		planeGeometry.setAttribute( 'tangent', new THREE.BufferAttribute( tangents, 4 ) );
		let plane = new THREE.Mesh( planeGeometry, this.shader.material );
		this.scene.add( plane );
		plane = new THREE.Mesh( planeGeometry, this.shader2.material );
		this.scene.add( plane );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

		this.ready = true;

	},

	initGui() {

		this.shader.uniforms.diffuseColor.value.setHex( 0xffffff );
		// this.shader.uniforms.bumpiness.value = 0.01;
		// this.shader.uniforms.reflectionStrength.value = 0.5;
		this.shader.uniforms.parallaxHeight.value = 0.0;
		this.shader.uniforms.parallaxScale.value = 0.0;
		this.shader.uniforms.uvScrollSpeedU.value = 0.05;
		this.shader.uniforms.uvScrollSpeedV.value = 0.05;
		this.shader.uniforms.distortionStrength.value = 0.05;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

	},

	animate() {

		const dt = this.clock.getDelta();
		this.shader.uniforms.uvScrollTime.value += dt;
		this.shader2.uniforms.uvScrollTime.value += dt;
		requestAnimationFrame( this.animate.bind( this ) );
		this.render();

	},

	render() {

		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrixWorld();

		// this.lights.direct.position.copy(this.shader.uniforms.directLights.value[0].direction);
		// this.lights.direct.position.transformDirection(this.camera.matrixWorld);
		// this.lights.direct.position.multiplyScalar(5.0);
		// this.lights.direct.color.copy(this.shader.uniforms.directLights.value[0].color);
		// this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );
		this.renderer.render( this.scene, this.camera );

	},
};

app.init();
app.animate();

// EVENTS

window.addEventListener( 'resize', onWindowResize, false );

// EVENT HANDLERS

function onWindowResize() {

	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();

}
