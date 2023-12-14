import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const NUM_LIGHTS = 10;
const app = {
	camera: undefined,
	controsl: undefined,
	scene: undefined,
	postScene: undefined,
	renderer: undefined,
	canvas: undefined,
	deferred: {},
	stats: undefined,
	clock: new THREE.Clock(),
	lights: [],
	textures: {},
	objects: {},
	post: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,
	ready: false,
	time: 0.0,

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

		//! RENDER TARGET

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 13, 0 );
		this.controls.update();
		// this.controls.addEventListener('change', render);

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
		this.shader.enable( 'AREALIGHT', NUM_LIGHTS );
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

		// this.postScene = new THREE.Scene();
		// this.postScene.add(new THREE.AxisHelper(20));

		for ( let i = 0; i < NUM_LIGHTS; ++i ) {
			let light = {};

			light.point = new PIXY.AreaLight();
			light.point.position.x = Math.random() * 50.0 - 25.0;
			light.point.position.y = 10.0 + Math.random() * 10.0;
			light.point.position.z = Math.random() * 50.0 - 25.0;
			light.point.color.setRGB( Math.random(), Math.random(), Math.random() );
			light.position = new THREE.Vector3().copy( light.point.position );
			light.time = 0.0;

			geometry = new THREE.SphereGeometry( 1, 8, 8 );
			light.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: light.point.color } ) );
			light.mesh.scale.multiplyScalar( 0.1 );
			this.scene.add( light.mesh );

			this.lights.push( light );

			this.shader.uniforms.areaLights.value.push( light.point );
		}

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initGui() {
		// shader.uniforms.pointLights.value[0].distance = 50.0;
		// shader.uniforms.pointLights.value[0].decay = 2.0;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		this.parameters.cutoffDistance = this.shader.uniforms.areaLights.value[ 0 ].distance;
		this.parameters.decay = this.shader.uniforms.areaLights.value[ 0 ].decay;
		this.parameters.radius = this.shader.uniforms.areaLights.value[ 0 ].radius;

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

		const pos = new THREE.Vector3();
		for ( let i = 0; i < NUM_LIGHTS; ++i ) {
			const light = this.lights[ i ];
			pos.copy( light.position );
			pos.x += Math.sin( this.time + light.time ) * 5.0;
			pos.y += Math.sin( this.time + light.time * 2.0 ) * 10.0;
			pos.z += Math.cos( this.time + light.time ) * 5.0;
			light.point.position.copy( pos );
			light.point.distance = this.parameters.cutoffDistance;
			light.point.decay = this.parameters.decay;
			light.point.radius = this.parameters.radius;
			this.shader.setLightParameter( i, light.point, this.camera );
			light.mesh.position.copy( pos );
		}

		this.renderer.render( this.scene, this.camera );
	},
};

app.init();
app.animate();

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
