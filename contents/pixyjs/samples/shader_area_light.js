import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if ( WebGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WebGL.getWebGLErrorMessage() );

}

const NUM_LIGHTS = 1;
const app = {
	camera: undefined,
	controls: undefined,
	scene: undefined,
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
	delta: 0.004 * 4.0,

	init() {

		this.initGraphics();
		this.initScene();
		this.initGui();

	},

	initGraphics() {

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0x999999 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		// if (!renderer.extensions.get( "OES_texture_float")) {
		//   alert('No OES_texture_float support for float textures.' );
		//   return;
		// }
		//
		// if (!renderer.extensions.get('WEBGL_draw_buffers')) {
		//   alert('not support WEBGL_draw_buffers.');
		//   return;
		// }
		//
		// if (!renderer.extensions.get('EXT_shader_texture_lod')) {
		//   alert('not support EXT_shader_texture_lod.');
		//   return;
		// }

		// renderer.gammaInput = false;
		// renderer.gammaOutput = false;

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.canvas = this.renderer.domElement;
		container.appendChild( this.canvas );

		// STATS

		this.stats = new Stats();
		container.appendChild( this.stats.dom );

	},

	initScene() {

		// scene itself
		this.scene = new THREE.Scene();

		// MARK: CAMERA

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
		this.camera.position.set( 0.0, 34.74, 61.33 );
		this.scene.add( this.camera );

		// MARK: RENDER TARGET

		// MARK: CONTROLS

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 13, 0 );
		this.controls.update();
		// this.controls.addEventListener('change', render);

		// MARK: LIGHTS

		// lights.ambient = new THREE.AmbientLight(0x333333);
		// scene.add(lights.ambient);

		// lights.direct = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		// scene.add(lights.direct);
		// lights.directHelper = new THREE.DirectionalLightHelper(lights.direct, 0.5);
		// scene.add(lights.directHelper);

		// MARK: MATERIALS

		this.shader = new PIXY.Shader();
		// this.shader.enable("DIRECTLIGHT", 1);
		// this.shader.enable("POINTLIGHT", 1);
		this.shader.enable( 'RECTLIGHT', NUM_LIGHTS );
		this.shader.enable( 'STANDARD' );
		this.shader.enable( 'COLORMAP' );
		this.shader.enable( 'BUMPMAP' );
		this.shader.enable( 'ROUGHNESSMAP' );
		this.shader.enable( 'REFLECTION' );
		this.shader.build();
		// console.log(this.shader.uniforms);
		// console.log(this.shader._generateVertexShader());
		// console.log(this.shader._generateFragmentShader());

		// MARK: TEXTURES

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
		this.textures.white = loadTexture( textureLoader, 'assets/textures/white.png' );

		// MARK: ENVIRONMENT MAP

		const path = 'assets/textures/cube/skybox/';
		const urls = [ path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg' ];

		this.textures.envMap = new THREE.CubeTextureLoader().load( urls, function ( texture ) {

			texture.generateMipmaps = true;
			texture.needsUpdate = true;
			// scene.background = texture;

		} );

		this.shader.uniforms.tDiffuse.value = this.textures.diffuse;
		this.shader.uniforms.tNormal.value = this.textures.normal;
		this.shader.uniforms.tRoughness.value = this.textures.roughness;
		this.shader.uniforms.bumpiness.value = 0.01;
		this.shader.uniforms.tEnvMap.value = this.textures.envMap;

		// MARK: MODELS

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

		// postScene = new THREE.Scene();
		// postScene.add(new THREE.AxisHelper(20));

		this.lights.rect = new PIXY.RectLight();
		this.shader.uniforms.rectLights.value.push( new PIXY.RectLight() );
		this.shader.uniforms.rectLights.value[ 0 ].positions.push( new THREE.Vector3() );
		this.shader.uniforms.rectLights.value[ 0 ].positions.push( new THREE.Vector3() );
		this.shader.uniforms.rectLights.value[ 0 ].positions.push( new THREE.Vector3() );
		this.shader.uniforms.rectLights.value[ 0 ].positions.push( new THREE.Vector3() );

		geometry = new THREE.PlaneGeometry( 1, 1 );
		let material = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			transparent: true,
			opacity: 0.7,
			side: THREE.FrontSide,
		} );
		this.lights.rectMesh = new THREE.Mesh( geometry, material );
		this.lights.rectMesh.position.set( 0, 25, -25 );
		this.lights.rectMesh.rotation.set( 0, 0, 0 );
		this.lights.rectMesh.scale.set( 1, 1, 1 );
		this.scene.add( this.lights.rectMesh );

		// wireframe hack
		this.lights.rectMesh.add( new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { wireframe: true } ) ) );

		let attribute = this.lights.rectMesh.geometry.getAttribute( 'position' );

		for ( let i in [ 0, 1, 3, 2 ] ) {

			// swap 2 & 3; must be in clockwise order; they are not
			const position = new THREE.Vector3();
			position.fromBufferAttribute( attribute, i );
			this.lights.rect.positions.push( position );

		}

		this.lights.rect.matrix = this.lights.rectMesh.matrixWorld;
		this.lights.rect.width = 20.0;
		this.lights.rect.height = 15.0;
		this.lights.rect.distance = 5;
		this.lights.rect.decay = 2;
		this.lights.rect.intensity = 2;

		const w = Math.sqrt( 3 );
		geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array( [ 0, 2, 0, -w, -1, 0, w, -1, 0 ] );
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		const indices = [ 0, 1, 2 ];
		geometry.setIndex( indices );
		this.lights.triMesh = new THREE.Mesh( geometry, material );
		this.lights.triMesh.position.set( 0, 25, -25 );
		this.lights.triMesh.rotation.set( 0, 0, 0 );
		this.lights.triMesh.scale.set( 1, 1, 1 );
		this.scene.add( this.lights.triMesh );

		// wireframe hack
		this.lights.triMesh.add( new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { wireframe: true } ) ) );
		this.lights.triMesh.visible = false;

		this.lights.triangle = new PIXY.RectLight();
		this.lights.triangle.matrix = this.lights.triMesh.matrixWorld;
		this.lights.triangle.distance = 5;
		this.lights.triangle.decay = 2;
		this.lights.triangle.intensity = 2;
		attribute = this.lights.triMesh.geometry.getAttribute( 'position' );
		for ( let i in [ 0, 2, 1 ] ) {

			const position = new THREE.Vector3();
			position.fromBufferAttribute( attribute, i );
			this.lights.triangle.positions.push( position );

		}

		// this.scene.add(new THREE.AxisHelper(10));
		// this.scene.add(new THREE.GridHelper(20,20));

	},

	initGui() {

		const context = this;

		// parameters = {
		//   metalness: 0.5,
		//   cutoffDistance: 25.0,
		//   decay: 2.0,
		//   numLights: 50,
		//   bumpiness: 0.3,
		//   reflectionStrength: 1.0,
		//   aoStrength: 1.0,
		//   aoPower: 1.0,
		//   bloom: true,
		//   bloomStrength: 1.5,
		//   bloomRadius: 0.4,
		//   bloomThreshold: 0.85,
		//   toneMapping: true,
		//   exposure: 3.0,
		//   whitePoint: 5.0,
		//   debug: false
		// };
		//
		// var gui = new dat.GUI();
		// gui.add(parameters, "metalness", 0.0, 1.0);
		// gui.add(parameters, "cutoffDistance", 1.0, 50.0);
		// gui.add(parameters, "decay", 1.0, 10.0);
		// gui.add(parameters, "numLights", 1, 200);
		// gui.add(parameters, "bumpiness", 0.0, 1.0);
		// gui.add(parameters, "reflectionStrength", 0.0, 2.0);
		// gui.add(parameters, "bloom");
		// gui.add(parameters, "bloomRadius", 0.0, 2.0);
		// gui.add(parameters, "bloomStrength", 0.0, 5.0);
		// gui.add(parameters, "bloomThreshold", 0.0, 1.0);
		// gui.add(parameters, "toneMapping");
		// gui.add(parameters, "exposure", 0.0, 10.0);
		// gui.add(parameters, "whitePoint", 0.0, 10.0);
		// gui.add(parameters, "debug");

		this.shader.uniforms.metalness.value = 0.5;
		// this.shader.uniforms.roughness.value = 0.0;
		this.shader.uniforms.bumpiness.value = 0.3;
		this.shader.uniforms.reflectionStrength.value = 0.05;
		// this.shader.uniforms.pointLights.value[0].distance = 50.0;
		// this.shader.uniforms.pointLights.value[0].decay = 2.0;

		const results = PIXY.ShaderUtils.GenerateShaderParametersGUI( this.shader );
		this.gui = results.gui;
		this.parameters = results.parameters;
		this.parameters.shape = 'Rectangle';
		this.parameters.color = this.shader.uniforms.rectLights.value[ 0 ].color.getHex();
		this.parameters.size = 10.0;
		this.parameters.rotation = 0.0;
		this.parameters.pause = false;
		this.parameters.roughnessMap = true;

		let h = this.gui.addFolder( 'AreaLight' );
		h.add( this.parameters, 'shape', [ 'Rectangle', 'Triangle' ] ).onChange( function ( value ) {

			if ( value === 'Triangle' ) {

				context.lights.rectMesh.visible = false;
				context.lights.triMesh.visible = true;

			} else {

				context.lights.rectMesh.visible = true;
				context.lights.triMesh.visible = false;

			}

		} );
		h.add( this.lights.rect, 'intensity', 0.0, 10.0 );
		h.addColor( this.parameters, 'color' );
		h.add( this.lights.rect, 'width', 1.0, 50.0 ).name( 'width(Rect)' );
		h.add( this.lights.rect, 'height', 1.0, 50.0 ).name( 'height(Rect)' );
		h.add( this.parameters, 'size', 1.0, 20.0 ).name( 'size(Triangle)' );
		h.add( this.lights.rect, 'distance', 1.0, 100.0 );
		h.add( this.lights.rect, 'decay', 1.0, 10.0 );
		h.add( this.parameters, 'rotation', 0.0, 360.0 );
		h.add( this.parameters, 'pause' );

		h = this.gui.addFolder( 'Texture' );
		h.add( this.parameters, 'roughnessMap' );

	},

	animate() {

		// time += clock.getDelta();

		if ( !this.parameters.pause ) {

			this.time += this.delta;
			if ( this.time > 4.4 || this.time < 0 ) this.delta = -this.delta;

		}

		requestAnimationFrame( this.animate.bind( this ) );
		this.render();

	},

	render() {

		if ( !this.ready ) return;

		this.stats.update();

		PIXY.ShaderUtils.UpdateShaderParameters( this.shader, this.parameters, this.camera );

		if ( this.parameters.shape === 'Triangle' ) {

			this.lights.triMesh.position.set( 0, 25 + 25 * Math.sin( this.time ), Math.min( -22 * Math.cos( this.time ), 0 ) );
			this.lights.triMesh.rotation.set(
				Math.min( this.time, Math.PI / 2 ),
				0,
				THREE.MathUtils.degToRad( this.parameters.rotation ),
			);
			this.lights.triMesh.scale.set( this.parameters.size, this.parameters.size, 1 );
			this.lights.triMesh.updateMatrixWorld();

			this.lights.triangle.intenstiy = this.lights.rect.intenstiy;
			this.lights.triangle.color.setHex( this.parameters.color );
			this.lights.triangle.distance = this.lights.rect.distance;
			this.lights.triangle.decay = this.lights.rect.decay;
			this.shader.setLightParameter( 0, this.lights.triangle, this.camera );

		} else {

			this.lights.rectMesh.position.set( 0, 25 + 25 * Math.sin( this.time ), Math.min( -22 * Math.cos( this.time ), 0 ) );
			this.lights.rectMesh.rotation.set(
				Math.min( this.time, Math.PI / 2 ),
				0,
				THREE.MathUtils.degToRad( this.parameters.rotation ),
			);
			this.lights.rectMesh.scale.set( this.lights.rect.width * 2, this.lights.rect.height * 2, 1 );
			this.lights.rectMesh.updateMatrixWorld();

			this.lights.rect.color.setHex( this.parameters.color );
			this.shader.setLightParameter( 0, this.lights.rect, this.camera );

		}

		if ( this.parameters.roughnessMap ) {

			this.shader.uniforms.tRoughness.value = this.textures.roughness;

		} else {

			this.shader.uniforms.tRoughness.value = this.textures.white;

		}

		this.renderer.setClearColor( 0x0 );
		this.renderer.setClearAlpha( 0 );
		this.renderer.render( this.scene, this.camera );

		/// LIGHT PASS

		// renderer.autoClear = false;
		// renderer.render(deferred.scene, deferred.camera);
		// renderer.render(deferred.scene, deferred.camera, post.rtScene);

		/// BLOOM + TONE MAPPING

		// post.bloomPass.enabled = parameters.bloom;
		// post.bloomPass.strength = parameters.bloomStrength;
		// post.bloomPass.radius = parameters.bloomRadius;
		// post.bloomPass.threshold = parameters.bloomThreshold;
		// post.toneMapPass.enabled = parameters.toneMapping;
		// post.toneMapPass.uniforms.exposure.value = parameters.exposure;
		// post.toneMapPass.uniforms.whitePoint.value = parameters.whitePoint;
		// post.copyPass.enabled = !parameters.toneMapping;
		// post.composer.render();

		/// POST PASS

		// renderer.autoClear = false;
		// renderer.clearDepth();
		// renderer.render(postScene, camera);

		/// DEBUG VIEW PASS

		// renderer.clearDepth();
		// for (var i=0; i<deferred.views.length; ++i) {
		//   deferred.viewShader.uniforms.tDiffuse.value = deferred.views[i].texture;
		//   deferred.viewShader.uniforms.type.value = deferred.views[i].type;
		//   deferred.viewShader.uniforms.cameraNear.value = camera.near;
		//   deferred.viewShader.uniforms.cameraFar.value = camera.far;
		//   deferred.views[i].sprite.render(renderer);
		// }
		//
		// renderer.autoClear = true;

	},
};

app.init();
app.animate();

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

// EVENT HANDLERS

function onWindowResize() {

	app.renderer.setSize( window.innerWidth, window.innerHeight );

	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();

	app.render();

}
