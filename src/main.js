import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import { SceneManager } from './sceneManager.js';
import { crearMapa } from './mapa.js';
import { fragmentShader, vertexShader } from './shaders';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
let scene, camera, primeraPersona, renderer, container, sceneManager, mapa, material, cieloDia, cieloNoche;

let controlsFP;

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();

const textures = {
	tierra: { url: 'tierra.jpg', object: null },
	roca: { url: 'roca.jpg', object: null },
	pasto: { url: 'pasto.jpg', object: null },
	arena: {url: 'arena.png', object: null},
	elevationMap1: { url: 'elevationMap2.png', object: null },
}

const params={
	camaraActual: 'general',
	posicionSobreRecorrido: 0,
	nivelDelAgua: 0,
	maxNivel: 1,
	esDeNoche: false,
	trenDetenido: true
}

function setupThreeJs() {
	container = document.getElementById('container3D');

	renderer = new THREE.WebGLRenderer();
	scene = new THREE.Scene();
	cieloDia = new THREE.TextureLoader().load('maps/cielo.jpg')
	cieloNoche = new THREE.TextureLoader().load('maps/skybox_night2.jpg')
	cieloDia.mapping = THREE.EquirectangularReflectionMapping;
	cieloNoche.mapping = THREE.EquirectangularReflectionMapping;
	cieloDia.colorSpace = THREE.SRGBColorSpace;
	cieloNoche.colorSpace = THREE.SRGBColorSpace;
	if(params.factorNoche<0.5){
		scene.background = cieloDia;
	}else{
		scene.background = cieloNoche;
	}
	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 200, -200);
	camera.lookAt(0, 0, 0);

	primeraPersona = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	primeraPersona.position.set(100,3,-100)

	primeraPersona.lookAt(-250,0,250)

	const controls = new OrbitControls(camera, renderer.domElement);

	controlsFP = new PointerLockControls(primeraPersona, renderer.domElement);

	scene.add(controlsFP.getObject());

	const onKeyDown = function ( event ) {
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;
			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;
			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;
			case 'Space':
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};

	const onKeyUp = function ( event ) {
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;
			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;
			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	const terreno = crearMapa(250,250,50,150,150,textures.elevationMap1.object);
	
	material = new THREE.RawShaderMaterial({
		uniforms: {
			dirtSampler: { type: 't', value: textures.tierra.object },
			rockSampler: { type: 't', value: textures.roca.object },
			grassSampler: { type: 't', value: textures.pasto.object },
			sandSampler: {type: 't', value: textures.arena.object},
			sunDirection: { type: 'v3', value: new THREE.Vector3(1, 1, 1).normalize() },
			snowThresholdLow: { type: 'f', value: 2.6 },
			snowThresholdHigh: { type: 'f', value: 3 },
			sandThresholdLow: {type: 'f', value: -8},
			sandThresholdHigh: {type: 'f', value: -14},
			worldNormalMatrix: { type: 'm4', value: null },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide,
	});

	
	material.needsUpdate = true;

	mapa = new THREE.Mesh(terreno, material);

	material.onBeforeRender = (renderer, scene, camera, geometry, mapa) => {
		let m = mapa.matrixWorld.clone();
		m = m.transpose().invert();
		mapa.material.uniforms.worldNormalMatrix.value = m;
	};

	scene.add(mapa);
	mapa.position.set(0,-25,0);

	window.addEventListener('resize', onResize);
	onResize();
	window.addEventListener('keydown', (event) => {
		if (event.key === 'c') {
			switch (params.camaraActual) {
				case 'general':
					params.camaraActual = 'frontal';
					break;
				case 'frontal':
					params.camaraActual = 'trasera';
					break;
				case 'trasera':
					params.camaraActual = 'tunel';
					break;
				case 'tunel':
					params.camaraActual = 'puente';
					break;
				case 'puente':
					controlsFP.lock();
					params.camaraActual = 'primeraPersona';
					break;
				case 'primeraPersona':
					controlsFP.unlock();
					params.camaraActual = 'general';
					break;
			}
		}
	});
}

function onResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	primeraPersona.aspect = container.offsetWidth / container.offsetHeight;
	primeraPersona.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
	requestAnimationFrame(animate);
	sceneManager.animate(params);
	if(!params.esDeNoche){
		scene.background = cieloDia;
	}else{
		scene.background = cieloNoche;
	}
// primera persona --
	const time = performance.now();

	if ( controlsFP.isLocked === true ) {

		raycaster.ray.origin.copy( controlsFP.getObject().position );
		raycaster.ray.origin.y -= 10;

		const delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 15.0 * delta;
		velocity.z -= velocity.z * 15.0 * delta;

		velocity.y -= 9.8 * 150.0 * delta; // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

		controlsFP.moveRight( - velocity.x * delta );
		controlsFP.moveForward( - velocity.z * delta );

		controlsFP.getObject().position.y += ( velocity.y * delta ); // new behavior

		if ( controlsFP.getObject().position.y < 3 ) {

			velocity.y = 0;
			controlsFP.getObject().position.y = 3;

			canJump = true;

		}

	}

	prevTime = time;
//--
	let cam;
	switch(params.camaraActual){
		case 'general':
			cam = camera;
			break;
		case 'frontal':
			cam = sceneManager.camaraFrontal;
			break;
		case 'trasera':
			cam = sceneManager.camaraTrasera;
			break;
		case 'tunel':
			cam = sceneManager.camaraTunel;
			break;
		case 'puente':
			cam = sceneManager.camaraPuente;
			break;
		case 'primeraPersona':
			cam = primeraPersona;
			break;
	}
	renderer.render(scene, cam);
}

function createMenu() {
	const gui = new dat.GUI({ width: 400 });

	gui.add(params, 'camaraActual', ['general', 'frontal', 'trasera','tunel','puente','primeraPersona']).onChange((value) => {});

	gui.add(params, 'esDeNoche');

	gui.add(params, 'trenDetenido');
}

function loadTextures(callback) {
	const loadingManager = new THREE.LoadingManager();

	loadingManager.onLoad = () => {
		console.log('All textures loaded');
		callback();
	};

	for (const key in textures) {
		const loader = new THREE.TextureLoader(loadingManager);
		const texture = textures[key];
		texture.object = loader.load('maps/' + texture.url, onTextureLoaded.bind(this, key), null, (error) => {
			console.error('Error loading texture', key);
			console.error(error);
		});
	}
}

function onTextureLoaded(key, texture) {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	textures[key].object = texture;
	console.log(`Texture ${key} loaded`);
}

loadTextures(start);

function start() {
	setupThreeJs();
	sceneManager = new SceneManager(scene);
	createMenu();
	animate();
}
