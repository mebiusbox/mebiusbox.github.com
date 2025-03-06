import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

if ( WebGL.isWebGL2Available() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	stats: undefined,
	lights: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,

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
		this.controls.addEventListener( 'change', this.render.bind( this ) );

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct );
		this.scene.add( this.lights.directHelper );

		// this.lights.spot = new THREE.SpotLight(0xffffff, 1.0);
		// this.lights.spot.angle = Math.PI / 4;
		// this.lights.spot.penumbra = 0.05;
		// this.lights.spot.decay = 2;
		// this.lights.spot.distance = 5;
		// this.scene.add(this.lights.spot);
		// this.lights.spotHelper = new THREE.SpotLightHelper(this.lights.spot);
		// this.scene.add(this.lights.spotHelper);

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("NOLIT");
		this.shader.enable( 'DIRECTLIGHT', 1 );
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("SPOTLIGHT", 1);
		this.shader.enable( 'PHONG' );
		// this.shader.enable("REFLECTION");
		// this.shader.enable("FRESNEL");
		// this.shader.enable("VELVET");
		this.shader.enable( 'AMBIENT' );
		this.shader.enable( 'HEMISPHERE' );
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		// this.shader.enable("RIMLIGHT");
		// this.shader.enable("COLORMAP");
		// this.shader.enable("NORMALMAP");
		// this.shader.enable("PROJECTIONMAP");
		// this.shader.enable("DISTORTION");
		// this.shader.enable("UVSCROLL");
		// this.shader.enable("GLASS");
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexthis.shader());
		// console.log(this.shader._generateFragmentthis.shader());

		//! MODELS

		const teapotGeometry = new TeapotGeometry( 2.0, 15, true, true, true, false, true );
		const teapot = new THREE.Mesh( teapotGeometry, this.shader.material );
		teapot.position.x = 7;
		this.scene.add( teapot );

		const boxGeometry = new THREE.BoxGeometry( 4, 4, 4 );
		const box = new THREE.Mesh( boxGeometry, this.shader.material );
		box.position.x = -7;
		this.scene.add( box );

		const sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		const sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.scene.add( sphere );

		this.scene.add( new THREE.AxesHelper( 10 ) );
		this.scene.add( new THREE.GridHelper( 20, 20 ) );
	},

	initGui() {
		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
	},

	animate() {
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		this.stats.update();

		this.camera.updateMatrixWorld();

		this.lights.direct.position.copy( this.shader.uniforms.directLights.value[ 0 ].direction );
		this.lights.direct.position.transformDirection( this.camera.matrixWorld );
		this.lights.direct.position.multiplyScalar( 5.0 );
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		// lights.direct.position.copy(shader.uniforms.pointLights.value[0].position);
		// lights.direct.color.copy(shader.uniforms.pointLights.value[0].color);

		// lights.spot.position.copy(shader.uniforms.spotLights.value[0].position);
		// lights.spot.color.copy(shader.uniforms.spotLights.value[0].color);
		// lights.spot.distance = shader.uniforms.spotLights.value[0].distance;
		// lights.spot.angle = Math.acos(shader.uniforms.spotLights.value[0].coneCos);
		// lights.spot.penumbra = Math.acos(shader.uniforms.spotLights.value[0].penumbraCos);
		// lights.spot.decay = shader.uniforms.spotLights.value[0].decay;
		// lights.spotHelper.update();

		// lights.direct.position.set(effectController.lx, effectController.ly, effectController.lz).multiplyScalar(5.0);
		// lights.direct.color.setHex(effectController.lightColor);
		// lights.direct.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), lights.direct.position.clone().normalize());
		// lights.ambient.color.setHex(0xffffff).multiplyScalar(effectController.ka);
		// shader.setLightParameter(0, lights.direct);
		// shader.setLightParameter(0, lights.ambient);
		// shader.setDirectionalLightParameter(0, lightDir, lightColor);
		// shader.setPointLightParameter(0, lightPos, lightColor, effectController.cutoffDistance, effectController.decayExponent);
		// shader.setSpotLightParameter(0, lightPos, lightDir, lightColor, effectController.cutoffDistance, effectController.decayExponent, effectController.spotConeCos, effectController.spotPenumbraCos);
		// shader.setParameters(shaderParameters);
		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );
		this.renderer.render( this.scene, this.camera );
	},
};

app.init();
app.animate();

window.addEventListener(
	'resize',
	() => {
		app.renderer.setSize( window.innerWidth, window.innerHeight );

		app.camera.aspect = window.innerWidth / window.innerHeight;
		app.camera.updateProjectionMatrix();

		app.render();
	},
	false,
);
