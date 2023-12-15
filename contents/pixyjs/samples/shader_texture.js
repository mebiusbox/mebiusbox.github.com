import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

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
		// this.renderer.gammaInput = false;
		// this.renderer.gammaOutput = false;
		// this.renderer.autoClear = false;
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
		// this.scene.add(lights.ambient);

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
		// this.lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
		// this.scene.add(this.lights.spotHelper);

		//! MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("NOLIT");
		this.shader.enable( 'DIRECTLIGHT', 1 );
		// this.shader.enable("POINTLIGHT", 1);
		// this.shader.enable("SPOTLIGHT", 1);
		this.shader.enable( 'PHONG' );
		this.shader.enable( 'REFLECTION' );
		this.shader.enable( 'FRESNEL' );
		// this.shader.enable("VELVET");
		// this.shader.enable("AMBIENT");
		// this.shader.enable("HEMISPHERE");
		// this.shader.enable("INNERGLOW");
		// this.shader.enable("INNERGLOWSUBTRACT");
		// this.shader.enable("RIMLIGHT");
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'NORMALMAP' );
		// this.shader.enable("BUMPMAP");
		this.shader.enable( 'SPECULARMAP' );
		this.shader.enable( 'AOMAP' );
		// this.shader.enable("PROJECTIONMAP");
		// this.shader.enable("DISTORTION");
		// this.shader.enable("UVSCROLL");
		// this.shader.enable("GLASS");
		// this.shader.setDebugCode([
		// 	// 'gl_FragColor.xyz = material.diffuseColor.rgb;'
		// 	// 'gl_FragColor.xyz = reflectedLight.directDiffuse;'
		// 	// 'gl_FragColor.xyz = vec3(obscure);'
		// 	// 'gl_FragColor.xyz = directLight.color;'
		// 	'float NoL = max(dot(directLight.direction, geometry.normal), 0.0);',
		// 	// 'gl_FragColor.xyz = vec3(NoL);'
		// 	'gl_FragColor.xyz = geometry.normal;'
		// ]);
		// this.shader.enable( "DEBUGCODE" );
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		//! TEXTURES

		const textureLoader = new THREE.TextureLoader();
		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/brick_diffuse.jpg');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/brick_bump.jpg');
		this.shader.uniforms.tDiffuse.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_col.png' );
		this.shader.uniforms.tNormal.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_nrm.png' );
		this.shader.uniforms.tSpecular.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_spec.png' );
		this.shader.uniforms.tAO.value = textureLoader.load( 'assets/textures/SlateTiles/SlateTiles_ao.png' );

		//! ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( tex ) => {
			this.scene.background = tex;
			this.ready = true;
		} );

		//! MODELS

		let geo = new TeapotGeometry( 2.0, 15, true, true, true, false, true );
		geo.computeTangents();
		const teapot = new THREE.Mesh( geo, this.shader.material );

		teapot.position.x = 7;
		this.scene.add( teapot );

		geo = new THREE.BoxGeometry( 4, 4, 4 );
		geo.computeTangents();
		const box = new THREE.Mesh( geo, this.shader.material );
		box.position.x = -7;
		this.scene.add( box );

		geo = new THREE.SphereGeometry( 2, 64, 64 );
		geo.computeTangents();
		const sphere = new THREE.Mesh( geo, this.shader.material );
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
		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrixWorld();

		this.lights.direct.position.copy( this.shader.uniforms.directLights.value[ 0 ].direction );
		this.lights.direct.position.transformDirection( this.camera.matrixWorld );
		this.lights.direct.position.multiplyScalar( 5.0 );
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		// this.lights.direct.position.copy(shader.uniforms.pointLights.value[0].position);
		// this.lights.direct.color.copy(shader.uniforms.pointLights.value[0].color);

		// this.lights.spot.position.copy(shader.uniforms.spotLights.value[0].position);
		// this.lights.spot.color.copy(shader.uniforms.spotLights.value[0].color);
		// this.lights.spot.distance = shader.uniforms.spotLights.value[0].distance;
		// this.lights.spot.angle = Math.acos(shader.uniforms.spotLights.value[0].coneCos);
		// this.lights.spot.penumbra = Math.acos(shader.uniforms.spotLights.value[0].penumbraCos);
		// this.lights.spot.decay = shader.uniforms.spotLights.value[0].decay;
		// this.lights.spotHelper.update();

		// this.lights.direct.position.set(effectController.lx, effectController.ly, effectController.lz).multiplyScalar(5.0);
		// this.lights.direct.color.setHex(effectController.lightColor);
		// this.lights.direct.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), lights.direct.position.clone().normalize());
		// this.lights.ambient.color.setHex(0xffffff).multiplyScalar(effectController.ka);
		// this.shader.setLightParameter(0, lights.direct);
		// this.shader.setLightParameter(0, lights.ambient);
		// this.shader.setDirectionalLightParameter(0, lightDir, lightColor);
		// this.shader.setPointLightParameter(0, lightPos, lightColor, effectController.cutoffDistance, effectController.decayExponent);
		// this.shader.setSpotLightParameter(0, lightPos, lightDir, lightColor, effectController.cutoffDistance, effectController.decthis.ayExponent, effectController.spotConeCos, effectController.spotPenumbraCos);
		// this.shader.setParameters(shaderParameters);
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
