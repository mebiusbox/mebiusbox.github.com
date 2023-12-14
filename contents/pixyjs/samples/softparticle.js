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
	effectScene: undefined,
	renderTarget: undefined,
	particles: undefined,
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	textures: {},
	shader: undefined,
	gui: undefined,
	parameters: undefined,
	time: 0.0,
	ready: false,

	init() {
		this.initGraphics();
		this.initScene();
	},

	initGraphics() {
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		//! RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0x999999 );
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

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
		this.camera.up.set( 0, 0, 1 );
		this.camera.position.set( 18.35, -69.41, 7.25 );
		this.scene.add( this.camera );

		//! RENDER TARGET

		this.renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			generateMipmaps: false,
			stencilBuffer: false,
			depthBuffer: true,
			depthTexture: new THREE.DepthTexture()
		} );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		// this.controls.addEventListener('change', this.render.bind(this));

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(lights.ambient);

		// this.lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// this.scene.add(this.lights.direct);
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct, 0.5);
		// this.scene.add(this.lights.directHelper);

		//! MATERIALS

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		const snowFlakeTexture = textureLoader.load( 'assets/textures/sprites/snowflake2.png' );

		//! ENVIRONMENT MAP

		//! MODELS

		this.particles = new PIXY.GPUParticle( 10000, function ( index, pars ) {
			pars.position.set( ( Math.random() - 0.5 ) * 100.0, ( Math.random() - 0.5 ) * 100.0, 40.0 );
			pars.velocity.set( Math.random() * -10, Math.random() * -10, -10.0 + Math.random() );
			pars.acceleration.set( 0, 0, 0 );
			pars.spinStart = 0;
			pars.spinSpeed = 5.0;
			pars.startSize = 1.0 + Math.random() * 0.5;
			pars.endSize = 0.0;
			pars.startTime = 2.0 + Math.random() * 10.0;
			pars.lifeTime = 5.0;
		} );

		this.particles.material.uniforms.tDiffuse.value = snowFlakeTexture;
		this.particles.material.uniforms.tDepth.value = this.renderTarget.depthTexture;
		// this.particles.material.uniforms.particleSize.value = 0.75;
		// console.log(particles);

		this.effectScene = new THREE.Scene();
		this.effectScene.add( this.particles );

		const geo = new THREE.PlaneGeometry( 100, 100 );
		const mesh = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0x808080 } ) );
		this.scene.add( mesh );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	animate() {
		this.time += this.clock.getDelta();
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrixWorld();

		this.particles.material.uniforms.time.value = this.time;
		this.particles.material.uniforms.screenWidth.value = window.innerWidth;
		this.particles.material.uniforms.viewSize.value.set( window.innerWidth, window.innerHeight );
		this.particles.material.uniforms.cameraNearFar.value.set( this.camera.near, this.camera.far );

		this.renderer.autoClear = false;
		this.renderer.setRenderTarget( this.renderTarget );
		this.renderer.clear();
		this.renderer.render( this.scene, this.camera );
		this.renderer.setRenderTarget( null );
		this.renderer.clear();
		this.renderer.render( this.scene, this.camera );
		this.renderer.render( this.effectScene, this.camera );
		this.renderer.autoClear = true;
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
