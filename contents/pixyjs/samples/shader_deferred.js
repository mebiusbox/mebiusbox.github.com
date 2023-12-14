import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WebGL.getWebGLErrorMessage() );
}

const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
	renderer: undefined,
	canvas: undefined,
	deferred: {},
	stats: undefined,
	clock: new THREE.Clock(),
	numMaxLights: 300,
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
		this.initDeferred();
		this.initScene();
		this.initPost();
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
		// controls.addEventListener('change', render);

		//! LIGHTS

		// lights.ambient = new THREE.AmbientLight(0x333333);
		// scene.add(lights.ambient);

		// lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// scene.add(lights.direct);
		// lights.directHelper = new THREE.DirectionalLightHelper(lights.direct, 0.5);
		// scene.add(lights.directHelper);

		//! MATERIALS

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

		this.deferred.geometryShader.uniforms.tDiffuse.value = this.textures.diffuse;
		this.deferred.geometryShader.uniforms.tNormal.value = this.textures.normal;
		this.deferred.geometryShader.uniforms.tRoughness.value = this.textures.roughness;
		this.deferred.geometryShader.uniforms.bumpiness.value = 0.01;
		this.deferred.lightShader.uniforms.tEnvMap.value = this.textures.envMap;

		//! MODELS

		let geometry = new THREE.PlaneGeometry( 50, 50 );
		geometry.computeTangents();
		let mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.rotation.x = -Math.PI * 0.5;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.position.y = 25.0;
		mesh.position.z = -25.0;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.position.y = 25.0;
		mesh.position.z = 25.0;
		mesh.rotation.y = Math.PI;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.position.x = -25.0;
		mesh.position.y = 25.0;
		mesh.rotation.y = Math.PI * 0.5;
		this.scene.add( mesh );

		mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.position.x = 25.0;
		mesh.position.y = 25.0;
		mesh.rotation.y = -Math.PI * 0.5;
		this.scene.add( mesh );

		geometry = new THREE.SphereGeometry( 8, 32, 32 );
		geometry.computeTangents();
		mesh = new THREE.Mesh( geometry, this.deferred.geometryShader.material );
		mesh.position.y = 15;
		this.scene.add( mesh );

		this.post.scene = new THREE.Scene();
		// postScene.add(new THREE.AxisHelper(20));

		const geo = new THREE.SphereGeometry( 1.0, 8, 8 );
		const numLights = 200;
		for ( let i = 0; i < numLights; ++i ) {
			const light = {};
			light.position = new THREE.Vector3();
			light.position.x = Math.random() * 50.0 - 25.0;
			light.position.y = 10.0 + Math.random() * 10.0;
			light.position.z = Math.random() * 50.0 - 25.0;
			light.color = new THREE.Color();
			light.color.setRGB( Math.random(), Math.random(), Math.random() );
			light.time = Math.random() * Math.PI;
			light.mesh = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: light.color.getHex(), wireframe: true } ) );
			light.mesh.position.copy( light.position );
			light.mesh.scale.multiplyScalar( 0.1 );
			this.post.scene.add( light.mesh );
			this.lights.push( light );
		}

		// scene.add(new THREE.AxisHelper(10));
		// scene.add(new THREE.GridHelper(20,20));
	},

	initDeferred() {
		this.deferred.depthTexture = new THREE.DepthTexture();

		const pars = {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			generateMipmaps: false,
			stencilBuffer: false,
			depthTexture: this.deferred.depthTexture,
		};

		// gbuf
		this.deferred.gbuf = new THREE.WebGLMultipleRenderTargets(
			window.innerWidth * window.devicePixelRatio,
			window.innerHeight * window.devicePixelRatio,
			2,
			pars
		);

		this.deferred.gbuf.texture[ 0 ].name = 'normal';
		this.deferred.gbuf.texture[ 1 ].name = 'albedo+roughness';

		this.deferred.geometryShader = new PIXY.Shader();
		this.deferred.geometryShader.enable( 'DEFERRED_GEOMETRY' );
		this.deferred.geometryShader.enable( 'GLSL3' );
		this.deferred.geometryShader.build();
		// console.log(deferred.geometryShader.uniforms);
		// console.log(deferred.geometryShader._generateVertexShader());
		// console.log(deferred.geometryShader._generateFragmentShader());

		this.deferred.lightShader = new PIXY.Shader();
		this.deferred.lightShader.enable( 'DEFERRED_LIGHT' );
		this.deferred.lightShader.enable( 'GLSL3' );
		this.deferred.lightShader.build( { defines: { NUM_POINT_LIGHT: this.numMaxLights } } );
		this.deferred.lightShader.uniforms.gbuf0.value = this.deferred.gbuf.texture[ 0 ];
		this.deferred.lightShader.uniforms.gbuf1.value = this.deferred.gbuf.texture[ 1 ];
		this.deferred.lightShader.uniforms.tDepth.value = this.deferred.depthTexture;
		// console.log(deferred.lightShader.uniforms);
		// console.log(deferred.lightShader._generateVertexShader());
		// console.log(deferred.lightShader._generateFragmentShader());

		for ( let i = 0; i < this.numMaxLights; ++i ) {
			this.deferred.lightShader.uniforms.pointLights.value.push( {
				position: new THREE.Vector3(),
				color: new THREE.Color(),
			} );
		}

		this.deferred.scene = new THREE.Scene();
		this.deferred.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.deferred.scene.add( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), this.deferred.lightShader.material ) );

		this.deferred.viewShader = new PIXY.Shader();
		this.deferred.viewShader.enable( 'VIEW' );
		// this.deferred.viewShader.enable( 'GLSL3' );
		this.deferred.viewShader.build( { depthTest: false, depthWrite: false } );
		// console.log(deferred.viewShader.uniforms);
		// console.log(deferred.viewShader._generateVertexShader());
		// console.log(deferred.viewShader._generateFragmentShader());

		this.deferred.views = [];

		const createView = ( x, y, texture, type ) => {
			const sprite = new PIXY.ScreenSprite( this.deferred.viewShader.material, this.canvas );
			sprite.position.set( x, y );
			sprite.size.set( 100, 100 );
			sprite.update();
			return { sprite: sprite, texture: texture, type: type };
		};

		// this.deferred.views.push(createView(10, 10, this.deferred.gbuf.texture[2], 6));
		this.deferred.views.push( createView( 10, 10, this.deferred.depthTexture, PIXY.ViewDepth ) );
		// this.deferred.views.push(createView(10, 10, this.deferred.gbuf.texture[0], 1));
		this.deferred.views.push( createView( 10, 120, this.deferred.gbuf.texture[ 0 ], PIXY.ViewRGB ) );
		this.deferred.views.push( createView( 10, 230, this.deferred.gbuf.texture[ 1 ], PIXY.ViewAlpha ) );
		this.deferred.views.push( createView( 10, 340, this.deferred.gbuf.texture[ 1 ], PIXY.ViewRGB ) );
		// this.deferred.views.push(createView(10, 450, this.deferred.gbuf.texture[2], 0));
		// this.deferred.views.push(createView(120, 10, this.deferred.lbuf.texture[0], 0));
		// this.deferred.views.push(createView(120, 120, this.deferred.lbuf.texture[1], 0));
	},

	initGui() {
		const parameters = {
			metalness: 0.5,
			cutoffDistance: 25.0,
			decay: 2.0,
			numLights: 50,
			bumpiness: 0.3,
			reflectionStrength: 1.0,
			aoStrength: 1.0,
			aoPower: 1.0,
			bloom: true,
			bloomStrength: 1.5,
			bloomRadius: 0.4,
			bloomThreshold: 0.85,
			toneMapping: true,
			exposure: 3.0,
			whitePoint: 5.0,
			debug: false,
		};

		const gui = new GUI();
		gui.add( parameters, 'metalness', 0.0, 1.0 );
		gui.add( parameters, 'cutoffDistance', 1.0, 50.0 );
		gui.add( parameters, 'decay', 1.0, 10.0 );
		gui.add( parameters, 'numLights', 1, 200 );
		gui.add( parameters, 'bumpiness', 0.0, 1.0 );
		gui.add( parameters, 'reflectionStrength', 0.0, 2.0 );
		gui.add( parameters, 'bloom' );
		gui.add( parameters, 'bloomRadius', 0.0, 2.0 );
		gui.add( parameters, 'bloomStrength', 0.0, 5.0 );
		gui.add( parameters, 'bloomThreshold', 0.0, 1.0 );
		gui.add( parameters, 'toneMapping' );
		gui.add( parameters, 'exposure', 0.0, 10.0 );
		gui.add( parameters, 'whitePoint', 0.0, 10.0 );
		gui.add( parameters, 'debug' );

		this.gui = gui;
		this.parameters = parameters;
	},

	initPost() {
		const parsF = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false,
			type: THREE.FloatType,
		};

		this.post.rtScene = new THREE.WebGLRenderTarget( this.canvas.width, this.canvas.height, parsF );
		this.post.rtBloom = new THREE.WebGLRenderTarget( this.canvas.width, this.canvas.height, parsF );
		this.post.copyPass = new PIXY.CopyPass();
		this.post.copyPass.uniforms.tDiffuse.value = this.post.rtScene.texture;
		this.post.bloomPass = new PIXY.UnrealBloomPass( new THREE.Vector2( this.canvas.width, this.canvas.height ), 1.5, 0.4, 0.85 );
		this.post.toneMapPass = new PIXY.ShaderPass( PIXY.ShaderLib.toneMap );
		this.post.toneMapPass.uniforms.tDiffuse.value = this.post.rtScene.texture;
		this.post.composer = new PIXY.Composer( this.renderer );
		this.post.composer.addPass( this.post.bloomPass, this.post.rtScene, this.post.rtScene );
		this.post.composer.addPass( this.post.toneMapPass, this.post.rtScene, null );
		this.post.composer.addPass( this.post.copyPass, this.post.rtScene, null );
	},

	animate() {
		this.time += this.clock.getDelta();
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		this.camera.updateMatrix(); // update local matrix
		this.camera.updateMatrixWorld(); // update world matrix
		this.camera.updateProjectionMatrix();
		this.camera.matrixWorldInverse.copy( this.camera.matrixWorld ).invert();

		const viewProjection = new THREE.Matrix4();
		viewProjection.identity();
		viewProjection.multiply( this.camera.projectionMatrix );
		viewProjection.multiply( this.camera.matrixWorldInverse );

		const pos = new THREE.Vector3();
		for ( var i = 0; i < this.lights.length; ++i ) {
			pos.copy( this.lights[ i ].position );
			pos.x += Math.sin( this.time + this.lights[ i ].time ) * 5.0;
			pos.y += Math.sin( this.time + this.lights[ i ].time * 2.0 ) * 10.0;
			pos.z += Math.cos( this.time + this.lights[ i ].time ) * 5.0;
			this.deferred.lightShader.uniforms.pointLights.value[ i ].position.copy( pos );
			this.deferred.lightShader.uniforms.pointLights.value[ i ].color.copy( this.lights[ i ].color );

			if ( i < this.parameters.numLights ) {
				this.lights[ i ].mesh.position.copy( pos );
				this.lights[ i ].mesh.visible = true;
			} else {
				this.lights[ i ].mesh.visible = false;
			}
		}

		this.deferred.geometryShader.uniforms.bumpiness.value = this.parameters.bumpiness;
		this.deferred.lightShader.uniforms.numPointLights.value = this.parameters.numLights;
		this.deferred.lightShader.uniforms.cutoffDistance.value = this.parameters.cutoffDistance;
		this.deferred.lightShader.uniforms.decayExponent.value = this.parameters.decay;
		this.deferred.lightShader.uniforms.viewInverse.value.copy( this.camera.matrixWorld );
		this.deferred.lightShader.uniforms.viewProjectionInverse.value.copy( viewProjection ).invert();
		this.deferred.lightShader.uniforms.viewPosition.value.copy( this.camera.position );
		this.deferred.lightShader.uniforms.metalness.value = this.parameters.metalness;
		this.deferred.lightShader.uniforms.reflectionStrength.value = this.parameters.reflectionStrength;

		//! GEOMETRY PASS

		this.renderer.setRenderTarget( this.deferred.gbuf );
		this.renderer.setClearColor( 0x0 );
		this.renderer.setClearAlpha( 0 );
		this.renderer.render( this.scene, this.camera );

		//! LIGHT PASS

		// renderer.autoClear = false;
		// renderer.render(deferred.scene, deferred.camera);
		this.renderer.setRenderTarget( this.post.rtScene );
		this.renderer.render( this.deferred.scene, this.deferred.camera );
		this.renderer.setRenderTarget( null );

		//! BLOOM + TONE MAPPING

		this.post.bloomPass.enabled = this.parameters.bloom;
		this.post.bloomPass.strength = this.parameters.bloomStrength;
		this.post.bloomPass.radius = this.parameters.bloomRadius;
		this.post.bloomPass.threshold = this.parameters.bloomThreshold;
		this.post.toneMapPass.enabled = this.parameters.toneMapping;
		this.post.toneMapPass.uniforms.exposure.value = this.parameters.exposure;
		this.post.toneMapPass.uniforms.whitePoint.value = this.parameters.whitePoint;
		this.post.copyPass.enabled = !this.parameters.toneMapping;
		this.post.composer.render();

		//! POST PASS

		this.renderer.autoClear = false;
		this.renderer.clearDepth();
		this.renderer.render( this.post.scene, this.camera );

		//! DEBUG VIEW PASS

		if ( this.parameters.debug ) {
			this.renderer.clearDepth();
			for ( let i = 0; i < this.deferred.views.length; ++i ) {
				this.deferred.viewShader.uniforms.tDiffuse.value = this.deferred.views[ i ].texture;
				this.deferred.viewShader.uniforms.type.value = this.deferred.views[ i ].type;
				this.deferred.viewShader.uniforms.cameraNear.value = this.camera.near;
				this.deferred.viewShader.uniforms.cameraFar.value = this.camera.far;
				this.deferred.views[ i ].sprite.render( this.renderer );
			}
		}

		this.renderer.autoClear = true;
	}

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
