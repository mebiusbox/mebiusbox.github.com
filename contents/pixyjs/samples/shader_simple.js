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
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	textures: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,
	ready: false,
	moniter: undefined,

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

		//! Monitor
		this.monitor = document.getElementById( "monitor" );
	},

	initScene() {
		// scene itself
		this.scene = new THREE.Scene();

		//! CAMERA

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 8000 );
		this.camera.position.set( 0, 0, 10 );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		this.controls.addEventListener( 'change', this.render );

		//! LIGHTS

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		// this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct, 0.5 );
		// this.scene.add( this.lights.directHelper );

		//! MATERIALS

		this.shader = new PIXY.Shader();
		this.shader.enable( 'DIRECTLIGHT', 1 );
		this.shader.enable( 'STANDARD' );
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		//! MODELS

		let sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );
		sphereGeometry.computeTangents();
		let sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.scene.add( sphere );

		// let geo = new THREE.PlaneGeometry( 4, 4 );
		// geo.computeTangents();
		// let plane = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );
		// plane.position.x = 2.5;
		// this.scene.add( plane );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		this.shader.uniforms.diffuseColor.value.setHex( 0xff0000 );
		this.shader.uniforms.directLights.value[ 0 ].direction.set( -1, 1, 1 ).normalize();
		this.shader.uniforms.roughness.value = 0.0;
		this.shader.uniforms.metalness.value = 0.5;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		this.gui.folders[ 0 ].controllers[ 2 ].__max = 2.0;
		this.parameters.color = true;
		this.parameters.normal = true;
		this.parameters.roughness = true;
		this.ready = true;
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
		// this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		this.renderer.render( this.scene, this.camera );

		// let infoText = `call: ${this.renderer.info.render.calls}`;
		// infoText += ` triangles: ${this.renderer.info.render.triangles}`;
		// infoText += ` points: ${this.renderer.info.render.points}`;
		// infoText += ` lines: ${this.renderer.info.render.lines}`;
		// infoText += ` frame: ${this.renderer.info.render.frame}`;
		// infoText += `\ngeometries: ${this.renderer.info.memory.geometries}`;
		// infoText += ` textures: ${this.renderer.info.memory.textures}`;
		// this.monitor.innerText = infoText;
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
