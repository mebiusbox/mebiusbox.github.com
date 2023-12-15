import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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

	loadModel() {
		// const onProgress = function ( xhr ) {

		// 	if ( xhr.lengthComputable ) {

		// 		var percentComplete = ( xhr.loaded / xhr.total ) * 100;
		// 		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

		// 	}

		// };

		// const onError = function ( xhr ) {};

		// const mtlLoader = new THREE.MTLLoader();
		// mtlLoader.setPath('assets/obj/shaderball/');
		// mtlLoader.load('shaderball.mtl', function(materials) {
		//   materials.preload();

		// const materials = [ this.shader.material ];
		const objLoader = new OBJLoader();
		// objLoader.setMaterials(materials);
		objLoader.setPath( 'assets/models/shaderball/' );
		objLoader.load( 'shaderBall.obj', ( object ) => {
			object.traverse( ( child ) => {
				if ( child instanceof THREE.Mesh ) {
					// child.geometry.translate(0, 0, 0);
					child.material = this.shader.material;
				}
			} );

			// object.rotation.x = Math.PI * 0.5;
			object.scale.multiplyScalar( 0.01 );
			this.scene.add( object );

			this.render();
		} );
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
		// this.camera.position.set(0, 0, 8);
		this.camera.position.set( -3.23, 3.85, 5.71 );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		// this.controls.target.set(0,0,0);
		this.controls.target.set( 0, 0.82, 0 );
		this.controls.update();
		// this.controls.addEventListener('change', this.render);

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct);
		// this.scene.add(this.lights.directHelper);

		// this.lights.spot = new THREE.SpotLight(0xffffff, 1.0);
		// this.lights.spot.angle = Math.PI / 4;
		// this.lights.spot.penumbra = 0.05;
		// this.lights.spot.decay = 2;
		// this.lights.spot.distance = 5;
		// this.scene.add(this.lights.spot);
		// this.lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
		// this.scene.add(this.lights.spotHelper);

		//! MATERIALS

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
		this.shader.enable( 'INNERGLOW' );
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
		// this.shader.enable("GLASS");
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		// const textureLocder = new THREE.TextureLoader();
		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/brick_diffuse.jpg');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/brick_bump.jpg');
		// this.shader.uniforms.tDistortion.value = textureLoader.load('assets/textures/nrm001.jpg');
		// this.shader.uniforms.tDistortion.value.wrapS = THREE.RepeatWrapping;
		// this.shader.uniforms.tDistortion.value.wrapT = THREE.RepeatWrapping;
		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_col.png');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_nrm.png');
		// this.shader.uniforms.tSpecular.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_spec.png');
		// this.shader.uniforms.tAO.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_ao.png');

		//! ENVIRONMENT MAP

		//! MODELS

		this.loadModel();

		this.ready = true;
	},

	initGui() {
		// this.shader.uniforms.directLights.value[0].direction.set(-1,1,1);
		this.shader.uniforms.diffuseColor.value.setHex( 0x000 );
		// this.shader.uniforms.shininess.value = 200;
		// this.shader.uniforms.distortionStrength.value = 0.1;
		// this.shader.uniforms.uvScrollSpeedU.value = 0.1;
		// this.shader.uniforms.uvScrollSpeedV.value = 0.02;
		// this.shader.uniforms.fresnelReflectionScale.value = 0.05;
		// this.shader.uniforms.surfaceColor.value.setHex(0x808080);
		// this.shader.uniforms.fuzzySpecColor.value.setHex(0xcccccc);
		// this.shader.uniforms.subColor.value.setHex(0x2020ff);
		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
	},

	animate() {
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrixWorld();
		// console.log(this.camera.position, this.camera.rotation, this.controls.target);

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

//! EVENTS

window.addEventListener( 'resize', onWindowResize, false );

//! EVENT HANDLERS

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}
