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
	reliefShader: undefined,
	currentShader: undefined,
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

		// this.lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// this.scene.add(this.lights.direct);
		// this.lights.directHelper = new THREE.DirectionalLightHelper(this.lights.direct);
		// this.scene.add(this.lights.directHelper);

		//! MATERIALS

		this.shader = new PIXY.Shader();
		this.shader.enable( 'NOLIT' );
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'PARALLAXOCCLUSIONMAP' );
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		this.reliefShader = new PIXY.Shader();
		this.reliefShader.enable( 'NOLIT' );
		this.reliefShader.enable( 'COLORMAP' );
		this.reliefShader.enable( 'RELIEFMAP' );
		this.reliefShader.build();

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		this.shader.uniforms.tDiffuse.value = textureLoader.load( 'assets/textures/ue4/T_CobbleStone_Pebble_D.png' );
		this.shader.uniforms.tDiffuse.value.wrapS = this.shader.uniforms.tDiffuse.value.wrapT = THREE.RepeatWrapping;
		this.shader.uniforms.tDiffuse.value.minFilter = this.shader.uniforms.tDiffuse.value.magFilter = THREE.LinearFilter;

		this.shader.uniforms.tHeightMap.value = textureLoader.load( 'assets/textures/ue4/T_CobbleStone_Pebble_H.png' );
		this.shader.uniforms.tHeightMap.value.wrapS = this.shader.uniforms.tHeightMap.value.wrapT = THREE.RepeatWrapping;
		this.shader.uniforms.tHeightMap.value.minFilter = this.shader.uniforms.tHeightMap.value.magFilter =
			THREE.LinearFilter;

		this.reliefShader.uniforms.tDiffuse.value = this.shader.uniforms.tDiffuse.value;
		this.reliefShader.uniforms.tHeightMap.value = this.shader.uniforms.tHeightMap.value;

		//! MODELS
		const slice = 10;
		const planeGeometry = new THREE.PlaneGeometry( 5, 5, slice, slice );
		const num = slice + 1;
		const tangents = new Float32Array( num * num * 4 );
		let tidx = 0;
		for ( let i = 0; i < num; i++ ) {
			for ( let j = 0; j < num; j++ ) {
				tangents[ tidx++ ] = 1;
				tangents[ tidx++ ] = 0;
				tangents[ tidx++ ] = 0;
				tangents[ tidx++ ] = 1;
			}
		}

		planeGeometry.setAttribute( 'tangent', new THREE.BufferAttribute( tangents, 4 ) );
		const plane = new THREE.Mesh( planeGeometry, this.shader.material );
		// plane.rotation.x = -Math.PI * 0.4;
		this.scene.add( plane );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

		this.ready = true;
	},

	initGui() {
		this.shader.uniforms.diffuseColor.value.setHex( 0xffffff );
		this.shader.uniforms.parallaxScale.value = 0.1;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
		this.parameters.reliefMap = false;
		this.gui
			.add( this.parameters, 'reliefMap' )
			.name( 'Use Relief Mapping' )
			.onChange( ( value ) => {
				this.currentShader = value ? this.reliefShader : this.shader;
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

		// this.lights.direct.position.copy(this.shader.uniforms.directLights.value[0].direction);
		// this.lights.direct.position.transformDirection(this.camera.matrixWorld);
		// this.lights.direct.position.multiplyScalar(5.0);
		// this.lights.direct.color.copy(this.shader.uniforms.directLights.value[0].color);
		// this.lights.directHelper.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );
		if ( this.parameters.reliefMap ) {
			this.reliefShader.uniforms.parallaxScale.value = this.shader.uniforms.parallaxScale.value;
			this.scene.overrideMaterial = this.reliefShader.material;
			this.renderer.render( this.scene, this.camera );
			this.scene.overrideMaterial = null;
		} else {
			this.renderer.render( this.scene, this.camera );
		}
	},
};

app.init();
app.animate();

//! EVENTS

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}
