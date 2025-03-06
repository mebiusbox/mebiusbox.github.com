import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';


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
	time: 0.0,
	ready: false,
	ocean: undefined,
	mirror: undefined,
	lensFlare: undefined,

	init() {
		this.initGraphics();
		this.initScene();
		this.initGui();
	},

	initGraphics() {
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		//! RENDERER

		this.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
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

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000000 );
		this.camera.position.set( 580, 208, 1100 );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 500, 0 );
		this.controls.addEventListener( 'change', this.render );

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct);
		// this.scene.add(this.lights.directHelper);

		//! MATERIALS

		this.shader = new PIXY.Shader();
		this.shader.enable( 'SKY' );
		this.shader.enable( 'CLOUDS' );
		this.shader.build( { side: THREE.BackSide } );
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		this.shader.uniforms.tClouds.value = textureLoader.load( 'assets/textures/pic0209.png' );
		this.shader.uniforms.tClouds.value.wrapS = THREE.RepeatWrapping;
		this.shader.uniforms.tClouds.value.wrapT = THREE.RepeatWrapping;
		this.shader.uniforms.tCloudsPerturb.value = textureLoader.load( 'assets/textures/pic0210.png' );
		this.shader.uniforms.tCloudsPerturb.value.wrapS = THREE.RepeatWrapping;
		this.shader.uniforms.tCloudsPerturb.value.wrapT = THREE.RepeatWrapping;

		//! ENVIRONMENT MAP

		const cubeMap = new THREE.CubeTexture( [] );
		cubeMap.format = THREE.RGBFormat;

		const loader = new THREE.ImageLoader();
		loader.load( 'assets/textures/skyboxsun25degtest.png', ( image ) => {
			const getSide = function ( x, y ) {
				const size = 1024;
				const canvas = document.createElement( 'canvas' );
				canvas.width = size;
				canvas.height = size;
				const context = canvas.getContext( '2d' );
				context.drawImage( image, -x * size, -y * size );
				return canvas;
			};

			cubeMap.images[ 0 ] = getSide( 2, 1 );
			cubeMap.images[ 1 ] = getSide( 0, 1 );
			cubeMap.images[ 2 ] = getSide( 1, 0 );
			cubeMap.images[ 3 ] = getSide( 1, 2 );
			cubeMap.images[ 4 ] = getSide( 1, 1 );
			cubeMap.images[ 5 ] = getSide( 3, 1 );
			cubeMap.needsUpdate = true;
			this.ready = true;
		} );

		//! MODELS

		const sphereGeometry = new THREE.SphereGeometry( 450000, 32, 15 );
		// sphereGeometry.computeTangents();
		const sphere = new THREE.Mesh( sphereGeometry, this.shader.material );
		this.scene.add( sphere );

		const waterNormals = new THREE.TextureLoader().load( 'assets/textures/waternormals.jpg' );
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		this.ocean = new PIXY.Ocean( this.renderer, this.camera, this.scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 1.0,
			sunDirection: this.lights.direct.position.clone().normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0,
			reflectionScale: 1.0,
			envMap: cubeMap,
		} );

		this.mirror = new THREE.Mesh( new THREE.PlaneGeometry( 2000 * 500, 2000 * 500 ), this.ocean.material );
		this.mirror.add( this.ocean );
		this.mirror.rotation.x = -Math.PI * 0.5;
		this.scene.add( this.mirror );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

		/// LENSFLARE

		const textureFlare0 = textureLoader.load( 'assets/textures/lensflare/lensflare0.png' );
		const textureFlare2 = textureLoader.load( 'assets/textures/lensflare/lensflare2.png' );
		const textureFlare3 = textureLoader.load( 'assets/textures/lensflare/lensflare3.png' );

		const flareColor = new THREE.Color( 0xffffff );
		flareColor.setHSL( 0.55, 0.9, 0.5 + 0.5 );
		this.lensFlare = new Lensflare();
		this.lensFlare.addElement( new LensflareElement( textureFlare0, 700, 0.0, flareColor ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare2, 512, 0.0 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare2, 512, 0.0 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare2, 512, 0.0 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare3, 60, 0.1 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare3, 70, 0.2 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare3, 120, 0.3 ) );
		this.lensFlare.addElement( new LensflareElement( textureFlare3, 70, 0.4 ) );
		this.scene.add( this.lensFlare );
	},

	initGui() {
		this.shader.uniforms.cloudsScale.value = 0.3;
		this.shader.uniforms.cloudsBrightness.value = 0.5;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		this.parameters.cloudsSpeed = 1.0;
		this.gui.add( this.parameters, 'cloudsSpeed', 0.0, 1.0 );

		this.parameters.pause = false;
		this.gui.add( this.parameters, 'pause' );
	},

	animate() {
		if ( !this.parameters.pause ) {
			this.time += this.clock.getDelta();
		}

		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
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

		const actualtime = this.time * 0.7;
		const seconds = ( actualtime * 60 * 60 ) % ( 3600 * 24 );
		const hours = Math.floor( seconds / 3600 );
		const minute = Math.floor( ( seconds - hours * 3600 ) / 60 );
		const second = Math.floor( seconds - hours * 3600 - minute * 60 );
		const date = new Date( 2016, 11, 17, hours, minute, second );
		const latitude = 34;
		const longitude = 134;
		const solarZenith = PIXY.Solar.calcSolarZenith( date, latitude, longitude, false );
		// const hourAngle = PIXY.Solar.calcHourAngle( date, longitude );
		const solarAzimuth = PIXY.Solar.calcSolarAzimuth( date, latitude, longitude );
		const solarAltitude = PIXY.Solar.calcSolarAltitude( date, latitude, longitude );

		PIXY.clearTextOut( 'inspector' );
		PIXY.textOut( 'inspector', hours.toString() + ':' + ( '0' + minute.toString() ).substr( -2 ) );
		PIXY.textOut( 'inspector', 'Latitude: ' + latitude.toString() );
		PIXY.textOut( 'inspector', 'Longitude: ' + longitude.toString() );
		PIXY.textOut( 'inspector', 'Azimuth: ' + solarAzimuth.toString() );
		PIXY.textOut( 'inspector', 'Altitude: ' + solarAltitude.toString() );
		PIXY.textOut( 'inspector', 'Zenith: ' + solarZenith.toString() );

		const rotZ = new THREE.Matrix4();
		rotZ.makeRotationZ( PIXY.radians( solarAltitude ) );
		const rotY = new THREE.Matrix4();
		rotY.makeRotationY( -Math.PI * 0.5 - PIXY.radians( solarAzimuth ) );
		const mat = new THREE.Matrix4();
		mat.identity();
		mat.multiply( rotY );
		mat.multiply( rotZ );
		const vec = new THREE.Vector3( 1, 0, 0 );
		vec.applyMatrix4( mat );
		const distance = 400000;
		vec.multiplyScalar( distance );
		const x = vec.x;
		const y = vec.y;
		const z = vec.z;
		// const phi = PIXY.radians( solarAzimuth ) + Math.PI * 0.5;
		const sunPos = new THREE.Vector3( x, y, z );
		const sunDir = new THREE.Vector3().copy( sunPos ).normalize();
		const tau = PIXY.Solar.calcSolarAttenuation( PIXY.radians( solarZenith ), this.parameters.skyTurbidity );

		const lightColor = new THREE.Color();
		lightColor.set( tau[ 0 ], tau[ 1 ], tau[ 2 ] );

		this.shader.uniforms.skySunPosition.value.set( x, y, z );
		this.shader.uniforms.cloudsTranslation.value = this.time * 0.005 * this.parameters.cloudsSpeed;

		this.lensFlare.visible = false;
		this.ocean.material.uniforms.sunDirection.value.copy( sunDir );
		this.ocean.material.uniforms.sunColor.value.copy( lightColor );
		this.ocean.material.uniforms.time.value = this.time;
		this.ocean.render();

		if ( solarAltitude < -10.0 ) {
			// x = 0; y = -1; z = 0;
		}

		if ( solarAltitude < 0 ) {
			this.lensFlare.visible = false;
		} else {
			this.lensFlare.position.set( x, y, z );
			this.lensFlare.visible = true;
		}

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
