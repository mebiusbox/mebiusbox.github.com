import * as THREE from 'three';
import * as PIXY from 'pixy';
import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

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
	post: {},
	textures: {},
	material: undefined,
	gui: undefined,
	parameters: undefined,
	time: 0.0,
	ready: false,

	init() {
		this.initGraphics();
		this.initScene();
		this.initPost();
		this.initGui();
	},

	initGraphics() {
		//! RENDERER

		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
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

		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.z = 4000;
		this.scene.add( this.camera );

		//! RENDER TARGET

		//! CONTROLS

		//! LIGHTS

		//! MATERIALS

		//! TEXTURES

		const textureLoader = new RGBELoader();
		this.textures.color = textureLoader.load( 'assets/textures/hdr/mealie_road_4k.hdr', ( texture, textureData ) => {
			console.log( textureData.exposure );
			console.log( textureData.gamma );
			this.material = new THREE.ShaderMaterial( {
				uniforms: {
					tDiffuse: { value: texture },
					exposure: { value: textureData.exposure },
					brightMax: { value: textureData.gamma },
					toneMapType: { value: 0.0 },
					// GT ToneMapping
					GT_P: { value: 1.0 },
					GT_a: { value: 1.0 },
					GT_m: { value: 0.22 },
					GT_l: { value: 0.4 },
					GT_c: { value: 1.33 },
					GT_b: { value: 0.0 },
					// Synthesis ToneMapping
					Lwa: { value: 0.0 },
					Ldmax: { value: 80.0 },
					Lscale: { value: 1.0 },
					Lwhite: { value: 1.0 },
				},
				vertexShader: document.getElementById( 'vs-hdr' ).textContent,
				fragmentShader: document.getElementById( 'fs-hdr' ).textContent,
			} );
			const quad = new THREE.Mesh( new THREE.PlaneGeometry( textureData.width, textureData.height ), this.material );
			quad.position.z = -100;
			this.scene.add( quad );
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.NearestFilter;
			this.ready = true;
		} );

		//! ENVIRONMENT MAP

		//! MODELS
	},

	initGui() {
		this.gui = new GUI();
		this.parameters = {};
		this.parameters.bloom = true;
		this.parameters.bloomStrength = 1.5;
		this.parameters.bloomRadius = 0.4;
		this.parameters.bloomThreshold = 0.85;
		this.parameters.toneMapping = true;
		this.parameters.exposure = 3.0;
		this.parameters.whitePoint = 5.0;
		this.gui.add( this.parameters, 'bloom' );
		this.gui.add( this.parameters, 'bloomRadius', 0.0, 2.0 );
		this.gui.add( this.parameters, 'bloomStrength', 0.0, 5.0 );
		this.gui.add( this.parameters, 'bloomThreshold', 0.0, 1.0 );
		this.gui.add( this.parameters, 'toneMapping' );
		this.gui.add( this.parameters, 'exposure', 0.0, 10.0 );
		this.gui.add( this.parameters, 'whitePoint', 0.0, 10.0 );
		//
		this.parameters.toneMapType = 0.0;
		this.gui.add( this.parameters, 'toneMapType', 0.0, 3.0, 1 );
		//
		this.parameters.GT_P = 1.0;
		this.parameters.GT_a = 1.0;
		this.parameters.GT_m = 0.22;
		this.parameters.GT_l = 0.4;
		this.parameters.GT_c = 1.33;
		this.parameters.GT_b = 0.0;
		this.gui.add( this.parameters, 'GT_P', 1.0, 100.0 );
		this.gui.add( this.parameters, 'GT_a', 1.0, 5.0 );
		this.gui.add( this.parameters, 'GT_m', 0.0, 1.0 );
		this.gui.add( this.parameters, 'GT_l', 0.0, 1.0 );
		this.gui.add( this.parameters, 'GT_c', 1.0, 3.0 );
		this.gui.add( this.parameters, 'GT_b', 0.0, 1.0 );

		this.parameters.Ldmax = 80.0;
		this.parameters.Lscale = 1.0;
		this.parameters.Lwhite = 1.0;
		this.gui.add( this.parameters, 'Ldmax', 0.0, 160.0 );
		this.gui.add( this.parameters, 'Lscale', 0.1, 3.0 );
		this.gui.add( this.parameters, 'Lwhite', 0.1, 5.0 );
	},

	initPost() {
		this.post.composer = new PIXY.Composer( this.renderer );
		this.post.composer.addPass( new PIXY.RenderPass( this.scene, this.camera ), null, null );
	},

	animate() {
		this.time += this.clock.getDelta();
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	},

	render() {
		if ( !this.ready ) return;

		this.stats.update();

		// this.lights.direct.position.copy(shader.uniforms.directLights.value[0].direction);
		// this.lights.direct.position.transformDirection(camera.matrixWorld);
		// this.lights.direct.position.multiplyScalar(5.0);
		// this.lights.direct.color.copy(shader.uniforms.directLights.value[0].color);
		// this.lights.directHelper.update();

		this.camera.updateMatrix();
		this.camera.updateMatrixWorld();
		this.camera.updateProjectionMatrix();
		this.camera.matrixWorldInverse.copy( this.camera.matrixWorld ).invert();

		const viewProjectionInverse = new THREE.Matrix4();
		viewProjectionInverse.copy( this.camera.projectionMatrix );
		viewProjectionInverse.multiply( this.camera.matrixWorldInverse );
		// this.post.ssaoPass.uniforms.projectionInverse.value.copy(camera.projectionMatrix).invert();
		// this.post.ssaoPass.uniforms.projectionInverse.value.copy(viewProjectionInverse).invert();

		// PIXY.ShaderUtils.UpdateShaderParameters(this.shader, this.parameters, this.camera);

		this.renderer.setClearColor( 0x0 );
		this.renderer.setClearAlpha( 0 );
		// this.renderer.render(scene, camera, post.rtScene);

		//! TONE MAPPING
		this.material.uniforms.toneMapType.value = this.parameters.toneMapType;
		this.material.uniforms.GT_P.value = this.parameters.GT_P;
		this.material.uniforms.GT_a.value = this.parameters.GT_a;
		this.material.uniforms.GT_m.value = this.parameters.GT_m;
		this.material.uniforms.GT_l.value = this.parameters.GT_l;
		this.material.uniforms.GT_c.value = this.parameters.GT_c;
		this.material.uniforms.GT_b.value = this.parameters.GT_b;
		this.material.uniforms.Lwa.value = this.parameters.Ldmax / 2.0;
		this.material.uniforms.Ldmax.value = this.parameters.Ldmax;
		this.material.uniforms.Lscale.value = this.parameters.Lscale;
		this.material.uniforms.Lwhite.value = this.parameters.Lwhite;
		this.post.composer.render();
	},
};

app.init();
app.animate();

//! EVENTS

window.addEventListener( 'resize', onWindowResize, false );

THREE.DefaultLoadingManager.onProgress = ( item, loaded, total ) => {
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
