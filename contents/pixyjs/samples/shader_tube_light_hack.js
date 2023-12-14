import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const NUM_LIGHTS = 2;
const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	stats: undefined,
	clock: new THREE.Clock(),
	lights: [],
	textures: {},
	objects: {},
	post: {},
	deferred: {},
	shader: undefined,
	orenNayerShader: undefined,
	gui: undefined,
	parameters: undefined,
	time: 0.0,
	ready: false,

	init() {
		this.initGraphics();
		this.initScene();
		this.initGui();
	},

	initGraphics() {
		//! RENDERER

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

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 13, 0 );
		this.controls.update();
		// this.controls.addEventListener('change', this.render);

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		// this.lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// this.scene.add(this.lights.direct);
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct, 0.5);
		// this.scene.add(this.lights.directHelper);

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("DIRECTLIGHT", 1);
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("AREALIGHT", NUM_LIGHTS);
		this.shader.enable( 'TUBELIGHT', NUM_LIGHTS );
		this.shader.enable( 'STANDARD' );
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'BUMPMAP' );
		this.shader.enable( 'ROUGHNESSMAP' );
		this.shader.enable( 'REFLECTION' );
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		const loadTexture = function ( loader, path ) {
			return loader.load( path, function ( texture ) {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
			} );
		};

		const textureLoader = new THREE.TextureLoader();
		this.textures.diffuse = loadTexture( textureLoader, 'assets/textures/brick_diffuse.jpg' );
		this.textures.normal = loadTexture( textureLoader, 'assets/textures/brick_bump.jpg' );
		this.textures.roughness = loadTexture( textureLoader, 'assets/textures/brick_roughness.jpg' );

		//! ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.textures.envMap = new THREE.CubeTextureLoader().load( urls, ( texture ) => {
			texture.generateMipmaps = true;
			texture.needsUpdate = true;
		} );

		this.shader.uniforms.tDiffuse.value = this.textures.diffuse;
		this.shader.uniforms.tNormal.value = this.textures.normal;
		this.shader.uniforms.tRoughness.value = this.textures.roughness;
		this.shader.uniforms.bumpiness.value = 0.01;
		this.shader.uniforms.tEnvMap.value = this.textures.envMap;

		//! MODELS

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

		// this.postScene = new THREE.Scene();
		// this.postScene.add(new THREE.AxisHelper(20));

		for ( let i = 0; i < NUM_LIGHTS; ++i ) {
			let light = {};

			light.tube = new PIXY.TubeLight();
			light.tube.start.x = Math.random() * 50.0 - 25.0;
			light.tube.start.y = 10.0 + Math.random() * 10.0;
			light.tube.start.z = Math.random() * 50.0 - 25.0;
			light.tube.end.x = Math.random() * 50.0 - 25.0;
			light.tube.end.y = 10.0 + Math.random() * 10.0;
			light.tube.end.z = Math.random() * 50.0 - 25.0;
			light.tube.color.setRGB( Math.random(), Math.random(), Math.random() );
			light.start = new THREE.Vector3().copy( light.tube.start );
			light.end = new THREE.Vector3().copy( light.tube.end );
			light.time = Math.random() * Math.PI;

			geometry = new THREE.BufferGeometry();
			const vertices = new Float32Array( [
				0.0, 0.0, 0.0,	// v0
				0.0, 0.0, 1.0		// v1
			] );
			geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			geometry.setDrawRange( 0, 2 );
			light.mesh = new THREE.Line(
				geometry,
				new THREE.LineBasicMaterial( { color: light.tube.color, linewidth: 3, opacity: 1 } )
			);
			this.scene.add( light.mesh );

			this.lights.push( light );

			this.shader.uniforms.tubeLights.value.push( light.tube );
		}

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		// this.parameters.cutoffDistance = this.shader.uniforms.areaLights.value[0].distance;
		// this.parameters.decay = this.shader.uniforms.areaLights.value[0].decay;
		// this.parameters.radius = this.shader.uniforms.areaLights.value[0].radius;

		this.parameters.cutoffDistance = this.shader.uniforms.tubeLights.value[ 0 ].distance;
		this.parameters.decay = this.shader.uniforms.tubeLights.value[ 0 ].decay;
		this.parameters.radius = this.shader.uniforms.tubeLights.value[ 0 ].radius;

		const h = this.gui.addFolder( 'AreaLight' );
		h.add( this.parameters, 'cutoffDistance', 0.0, 100.0 );
		h.add( this.parameters, 'decay', 0.0, 10.0 );
		h.add( this.parameters, 'radius', 0.0, 10.0 );
	},

	animate() {
		this.time += this.clock.getDelta();
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		const start = new THREE.Vector3();
		const end = new THREE.Vector3();
		for ( let i = 0; i < NUM_LIGHTS; ++i ) {
			const light = this.lights[ i ];

			start.copy( light.start );
			start.x += Math.sin( this.time + light.time ) * 10.0;
			start.y += Math.sin( this.time + light.time * 2.0 ) * 10.0;
			start.z += Math.cos( this.time + light.time ) * 10.0;
			light.tube.start.copy( start );

			end.copy( light.end );
			end.x += Math.sin( this.time + light.time ) * 10.0;
			end.y += Math.sin( this.time + light.time * 2.0 ) * 10.0;
			end.z += Math.cos( this.time + light.time ) * 10.0;
			light.tube.end.copy( end );

			light.tube.distance = this.parameters.cutoffDistance;
			light.tube.decay = this.parameters.decay;
			light.tube.radius = this.parameters.radius;
			this.shader.setLightParameter( i, light.tube, this.camera );

			const positionAttribute = light.mesh.geometry.getAttribute( 'position' );
			positionAttribute.setXYZ( 0, start.x, start.y, start.z );
			positionAttribute.setXYZ( 1, end.x, end.y, end.z );
			positionAttribute.needsUpdate = true;
		}

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
