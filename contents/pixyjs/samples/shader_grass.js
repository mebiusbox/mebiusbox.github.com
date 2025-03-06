import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';

if ( WebGL.isWebGL2Available() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const SHADOWBUFSIZE = 1024;

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	stats: undefined,
	clock: new THREE.Clock(),
	lights: {},
	textures: {},
	shadow: {},
	objects: {},
	shader: undefined,
	groundShader: undefined,
	gui: undefined,
	parameters: undefined,
	time: 0.0,
	ready: false,

	init() {
		this.initGraphics();
		this.initScene();
		this.initShadow();
		this.initGui();
	},

	initGraphics() {
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		//! RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setClearColor( 0xaaaaaa );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.autoClear = false;
		container.appendChild( this.renderer.domElement );

		//! STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );
	},

	initScene() {
		this.scene = new THREE.Scene();

		//! CAMERA

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000000 );
		this.camera.position.set( 0, 3, -5 );

		//! CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		this.controls.addEventListener( 'change', this.render );

		//! LIGHTS

		// this.lights.ambient = new THREE.AmbientLight(0x333333);
		// this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.0 );
		this.scene.add( this.lights.direct );
		this.lights.directHelper = new THREE.DirectionalLightHelper( this.lights.direct, 0.5 );
		this.scene.add( this.lights.directHelper );

		//! MATERIALS

		this.shader = new PIXY.Shader();
		this.shader.enable( 'DIRECTLIGHT', 1 );
		this.shader.enable( 'AMBIENT' );
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'COLORMAPALPHA' );
		this.shader.enable( 'DISCARD' );
		this.shader.enable( 'GRASS' );
		this.shader.enable( 'RECEIVESHADOW' );
		this.shader.build( { transparent: true, blending: THREE.NormalBlending, side: THREE.DoubleSide } );
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		this.groundShader = new PIXY.Shader();
		this.groundShader.enable( 'DIRECTLIGHT', 1 );
		this.groundShader.enable( 'AMBIENT' );
		this.groundShader.enable( 'COLORMAP' );
		this.groundShader.enable( 'UVSCALE' );
		this.groundShader.enable( 'RECEIVESHADOW' );
		this.groundShader.build( { side: THREE.DoubleSide } );
		// console.log(this.groundShader.uniforms);
		// console.log(this.groundShader._generateVertexShader());
		// console.log(this.groundShader._generateFragmentShader());

		//! TEXTURES

		const loadTexture = ( loader, path ) => {
			return loader.load( path, ( texture ) => {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
			} );
		};

		const textureLoader = new THREE.TextureLoader();
		const tgaLoader = new TGALoader();
		this.textures.grass = loadTexture( tgaLoader, 'assets/textures/grass.tga' );
		this.textures.ground = loadTexture( textureLoader, 'assets/textures/terrain/grasslight-big.jpg' );
		this.textures.ground.repeat.set( 25, 25 );
		this.textures.ground.anisotropy = 16;

		this.shader.uniforms.tDiffuse.value = this.textures.grass;
		this.groundShader.uniforms.tDiffuse.value = this.textures.ground;
		this.groundShader.uniforms.uvScale.value = 5.0;
		// const textureLoader = new THREE.TextureLoader();
		// this.textures.color = loadTexture(textureLoader, 'assets/textures/brick_diffuse.jpg');
		// this.textures.normal = loadTexture(textureLoader, 'assets/textures/brick_bump.jpg');
		// this.textures.roughness = loadTexture(textureLoader, 'assets/textures/brick_roughness.jpg');
		// this.textures.white = loadTexture(textureLoader, 'assets/textures/white.png');
		// this.textures.black = loadTexture(textureLoader, 'assets/textures/black.png');
		// this.shader.uniforms.tDiffuse.value = this.textures.color;
		// this.shader.uniforms.tNormal.value = this.textures.normal;
		// this.shader.uniforms.tRoughness.value = this.textures.roughness;

		// this.shader.uniforms.tDiffuse.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_col.png');
		// this.shader.uniforms.tNormal.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_nrm.png');
		// this.shader.uniforms.tSpecular.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_spec.png');
		// this.shader.uniforms.tAO.value = textureLoader.load('assets/textures/SlateTiles/SlateTiles_ao.png');

		//! ENVIRONMENT MAP

		// const path = 'assets/textures/cube/skybox/';
		// const urls = [
		//   path + 'px.jpg', path + 'nx.jpg',
		//   path + 'py.jpg', path + 'ny.jpg',
		//   path + 'pz.jpg', path + 'nz.jpg'
		// ];

		// this.shader.uniforms.tEnvMap.value = new THREE.CubeTextureLoader().load( urls, ( texture ) => {
		//   texture.generateMipmaps = true;
		//   texture.needsUpdate = true;
		//   this.scene.background = texture;
		// } );

		//! MODELS

		const instances = 500;
		const instanceGeometry = new THREE.InstancedBufferGeometry();
		instanceGeometry.copy( new THREE.PlaneGeometry( 1, 1, 8, 8 ) );
		instanceGeometry.instanceCount = instances;

		const offsets = new THREE.InstancedBufferAttribute( new Float32Array( instances * 3 ), 3, true );
		for ( let i = 0, ul = offsets.count; i < ul; i++ ) {
			const xyz = new THREE.Vector3( Math.random() - 0.5, 0.0, Math.random() - 0.5 );
			xyz.multiplyScalar( 5.0 );
			offsets.setXYZ( i, xyz.x, xyz.y, xyz.z );
		}

		instanceGeometry.setAttribute( 'offsets', offsets );

		const colors = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, true );
		for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
			colors.setXYZW( i, Math.random(), Math.random(), Math.random(), Math.random() );
		}

		instanceGeometry.setAttribute( 'color', colors );
		this.objects.instanceMesh = new THREE.Mesh( instanceGeometry, this.shader.material );
		this.objects.instanceMesh.rotation.y = Math.PI;
		this.scene.add( this.objects.instanceMesh );

		const groundGeometry = new THREE.PlaneGeometry( 8, 8 );
		this.objects.ground = new THREE.Mesh( groundGeometry, this.groundShader.material );
		this.objects.ground.position.y = -0.45;
		this.objects.ground.rotation.x = -Math.PI / 2;
		this.objects.ground.castShadow = false;
		this.objects.ground.receiveShadow = true;
		this.scene.add( this.objects.ground );

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));
	},

	initShadow() {
		this.shadow.rtDepth = new THREE.WebGLRenderTarget( SHADOWBUFSIZE, SHADOWBUFSIZE );
		this.shadow.shader = new PIXY.Shader();
		this.shadow.shader.enable( 'CASTSHADOW' );
		this.shadow.shader.build();
		// console.log(this.shadow.shader.uniforms);
		// console.log(this.shadow.shader._generateVertexShader());
		// console.log(this.shadow.shader._generateFragmentShader());
		this.shadow.instanceShader = new PIXY.Shader();
		this.shadow.instanceShader.enable( 'CASTSHADOW' );
		this.shadow.instanceShader.enable( 'GRASS' );
		this.shadow.instanceShader.enable( 'COLORMAP' );
		this.shadow.instanceShader.build();
		// console.log(this.shadow.instanceShader.uniforms);

		this.shadow.camera = new THREE.PerspectiveCamera( 45.0, 1.0, 1.0, 30.0 );
		this.shadow.camera.position.set( 10, 5, 10 );
		this.shadow.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		this.shadow.camera.updateMatrix();
		this.shadow.camera.updateMatrixWorld();
		this.shadow.camera.matrixWorldInverse.copy( this.shadow.camera.matrixWorld ).invert();
		this.shadow.camera.updateProjectionMatrix();
		// this.shadow.cameraHelper = new THREE.CameraHelper(this.shadow.camera);
		// this.scene.add(this.shadow.cameraHelper);

		// this.shadow.viewShader = new PIXY.Shader();
		// this.shadow.viewShader.enable("NOLIT");
		// this.shadow.viewShader.enable("DEPTHSHADOW");
		// this.shadow.viewShader.build();
		// // console.log("shadow.viewShader");
		// // console.log(this.shadow.viewShader.uniforms);
		// // console.log(this.shadow.viewShader._generateVertexShader());
		// // console.log(this.shadow.viewShader._generateFragmentShader());
		// this.shadow.view = new PIXY.ScreenSprite(this.shadow.viewShader.material, null);
		// this.shadow.view.position.set(10, 250);
		// this.shadow.view.size.set(250,250);
		// this.shadow.view.update();
	},

	initGui() {
		// this.shader.uniforms.diffuseColor.value.setHex(0xff0000);
		this.shader.uniforms.directLights.value[ 0 ].direction.set( 0, 0.5, -1 ).normalize();
		this.shader.uniforms.shadowDensity.value = 0.2;
		this.shader.uniforms.grassWindPower.value = 0.35;
		// this.shader.uniforms.bumpiness.value = 0.01;
		// this.shader.uniforms.roughness.value = 0.0;
		// this.shader.uniforms.metalness.value = 0.5;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;

		// const h = this.gui.addFolder("Texture");
		// this.parameters.color = true;
		// this.parameters.normal = true;
		// this.parameters.roughness = true;
		// h.add(this.parameters, "color").onChange(function(value) {
		//   shader.uniforms.tDiffuse.value = value ? textures.color : textures.white;
		// });
		// h.add(this.parameters, "normal").onChange(function(value) {
		//   shader.uniforms.tNormal.value = value ? textures.normal : textures.black;
		// });
		// h.add(this.parameters, "roughness").onChange(function(value) {
		//   shader.uniforms.tRoughness.value = value ? textures.roughness : textures.white;
		// });
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

		this.lights.direct.position.copy( this.shader.uniforms.directLights.value[ 0 ].direction ).normalize();
		this.lights.direct.position.transformDirection( this.camera.matrixWorld );
		this.lights.direct.position.multiplyScalar( 20.0 );
		this.lights.direct.target.position.copy( this.lights.direct.position ).multiplyScalar( 0.9 );
		this.lights.direct.target.updateMatrixWorld();
		this.lights.direct.color.copy( this.shader.uniforms.directLights.value[ 0 ].color );
		this.lights.directHelper.update();

		this.renderer.setClearColor( 0xaaaaaa );
		this.renderer.clear();
		// this.renderer.setClearColor(0xffffff);
		// this.renderer.clearTarget(shadow.rtDepth, true, true, false);

		this.shadow.camera.position.copy( this.lights.direct.position );
		this.shadow.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		this.shadow.camera.updateMatrixWorld();
		this.shadow.camera.updateProjectionMatrix();
		this.shadow.camera.matrixWorldInverse.copy( this.shadow.camera.matrixWorld ).invert();

		const matrix = new THREE.Matrix4();
		matrix.identity();
		matrix.multiply( this.shadow.camera.projectionMatrix );
		matrix.multiply( this.shadow.camera.matrixWorldInverse );
		this.shader.uniforms.lightViewProjectionMatrix.value = matrix;
		this.shadow.instanceShader.uniforms.tDiffuse.value = this.textures.grass;

		const offsetX = 0.5 + 0.5 / SHADOWBUFSIZE;
		const offsetY = 0.5 + 0.5 / SHADOWBUFSIZE;
		const scaleBiasMatrix = new THREE.Matrix4();
		scaleBiasMatrix.set( 0.5, 0.0, 0.0, offsetX, 0.0, 0.5, 0.0, offsetY, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 );
		this.shadow.matrix = new THREE.Matrix4();
		this.shadow.matrix.identity();
		this.shadow.matrix.multiply( scaleBiasMatrix );
		this.shadow.matrix.multiply( this.shadow.camera.projectionMatrix );
		this.shadow.matrix.multiply( this.shadow.camera.matrixWorldInverse );

		this.shader.uniforms.grassTime.value = this.time;
		this.shader.uniforms.shadowMatrix.value = this.shadow.matrix;
		this.shader.uniforms.tShadow.value = this.shadow.rtDepth.texture;
		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		const copyParameter = ( shader, key, value ) => {
			if ( key in shader.uniforms ) {
				shader.uniforms[ key ].value = value;
			}
		};

		for ( let i in this.shader.uniforms ) {
			if ( i === 'tDiffuse' ) continue;
			copyParameter( this.groundShader, i, this.shader.uniforms[ i ].value );
			copyParameter( this.shadow.shader, i, this.shader.uniforms[ i ].value );
			copyParameter( this.shadow.instanceShader, i, this.shader.uniforms[ i ].value );
		}

		//! SHADOW DEPTH PASS

		// this.shadow.cameraHelper.visible = false;
		this.objects.instanceMesh.material = this.shadow.instanceShader.material;
		this.objects.ground.material = this.shadow.shader.material;
		this.renderer.setRenderTarget( this.shadow.rtDepth );
		this.renderer.setClearColor( 0xffffff );
		this.renderer.clear( true, true, false );
		this.renderer.render( this.scene, this.shadow.camera );
		this.renderer.setRenderTarget( null );

		//! SCENE PASS

		// shadow.cameraHelper.visible = true;
		this.objects.instanceMesh.material = this.shader.material;
		this.objects.ground.material = this.groundShader.material;
		this.renderer.render( this.scene, this.camera );

		// this.shadow.cameraHelper.visible = false;
		// this.objects.instanceMesh.material = this.shadow.instanceShader.material;
		// this.objects.ground.material = this.shadow.shader.material;
		// this.renderer.render(this.scene, this.shadow.camera);

		//! SHADOW DEPTH VIEW

		// this.shadow.viewShader.uniforms.tShadow.value = this.shadow.rtDepth.texture;
		// this.shadow.view.render(renderer);
	},
};

app.init();
app.animate();

//! EVENTS

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

//! EVENT HANDLERS

function onWindowResize() {
	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();
}
