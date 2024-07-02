import * as THREE from 'three';
import { crearLocomotora } from './locomotora';
import { crearTerraplen } from './terraplen';
import { crearTunel } from './tunel';
import { crearPuente } from './puente';
import { crearAgua } from './agua';
import { crearArboleda } from './arboles';
import { crearFarol } from './farol';

export class SceneManager {
	recorrido;
	locomotora;
	locomotoraObjeto;
	luzAmbiente;
	luzAmbienteDia;
	luzAmbienteNoche;
	luzSolar;

	camaraFrontal;
	camaraTrasera;
	camaraTunel;
	camaraPuente;

	agua;
	faroles = [];

	ready = false;

	constructor(scene) {
		this.scene = scene;
		this.luzSolar = new THREE.DirectionalLight(0xFFFFFF, 1);
		this.luzSolar.position.set(1, 1, 1);
		scene.add(this.luzSolar);

		this.luzAmbienteDia = new THREE.AmbientLight(0x666666);
		this.luzAmbienteNoche = new THREE.HemisphereLight(0x0000ff);
		this.luzAmbiente = this.luzAmbienteDia;
		scene.add(this.luzAmbiente);

		const axes = new THREE.AxesHelper(3);
		scene.add(axes);
		this.prepararEscenario();
		this.ready = true;
	}

	prepararEscenario() {
		this.agua = crearAgua();
		this.scene.add(this.agua);
		this.agua.position.set(0,-15,0);

		let zona1 = {
			xMin:60,
			xMax:100,
			zMin:-70,
			zMax:-50
		}

		let zona2 = {
			xMin:-10,
			xMax:60,
			zMin:70,
			zMax:90
		}

		let zona3 = {
			xMin:-90,
			xMax:-110,
			zMin:-40,
			zMax:40
		}

		const arboles1 = crearArboleda(zona1.xMin,zona1.xMax,zona1.zMin,zona1.zMax,5+Math.round(Math.random()*15))
		const arboles2 = crearArboleda(zona2.xMin,zona2.xMax,zona2.zMin,zona2.zMax,5+Math.round(Math.random()*15))
		const arboles3 = crearArboleda(zona3.xMin,zona3.xMax,zona3.zMin,zona3.zMax,5+Math.round(Math.random()*15))
		this.scene.add(arboles1)
		this.scene.add(arboles2)
		this.scene.add(arboles3)

		
		
		this.locomotoraObjeto = new crearLocomotora();
		this.locomotora = this.locomotoraObjeto.obtenerTren()

		const tunel = crearTunel();

		const puente = crearPuente();

		const [terraplen,recorrido] = crearTerraplen();
		this.recorrido = recorrido;
		this.scene.add(this.locomotora);
		this.scene.add(puente);
		puente.position.set(-30,0,-50);
		this.scene.add(terraplen);
		terraplen.position.set(0,1,0)
		this.scene.add(tunel);
		tunel.position.set(80,0,0);
		
		this.camaraTunel = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		tunel.add(this.camaraTunel);
		this.camaraTunel.position.set(0,2,60);
		
		this.camaraPuente = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		puente.add(this.camaraPuente);
		this.camaraPuente.position.set(50,5,0)
		this.camaraPuente.rotateY(Math.PI/2);
		
		this.camaraFrontal = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.camaraFrontal.position.set(0,2.5,-2.5);
		this.camaraFrontal.lookAt(0,2,-0.5);
		this.camaraTrasera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.camaraTrasera.position.set(0,2.5,-2.5);
		this.camaraTrasera.lookAt(0,2,-4.5);
		this.locomotora.add(this.camaraFrontal);
		this.locomotora.add(this.camaraTrasera);

		let posicionFaroles = recorrido.getPoints(9);
		for(let i = 0; i<10; i++){
			let farol1 = new crearFarol();
			let farol2 = new crearFarol();
			let farolFisico1 = farol1.obtenerFarol();
			let farolFisico2 = farol2.obtenerFarol();
			farolFisico1.position.set(posicionFaroles[i].x+4,posicionFaroles[i].y,posicionFaroles[i].z+4);
			farolFisico2.position.set(posicionFaroles[i].x-4,posicionFaroles[i].y,posicionFaroles[i].z-4);
			this.faroles.push(farol1);
			this.faroles.push(farol2);
			this.scene.add(farolFisico1);
			this.scene.add(farolFisico2);
		}
	}

	onResize(aspect) {
		this.camaraFrontal.aspect = aspect;
		this.camaraFrontal.updateProjectionMatrix();
		this.camaraTrasera.aspect = aspect;
		this.camaraTrasera.updateProjectionMatrix();
		this.camaraTunel.aspect = aspect;
		this.camaraTunel.updateProjectionMatrix();
		this.camaraPuente.aspect = aspect;
		this.camaraPuente.updateProjectionMatrix();
	}
	
	animate(params) {
		if(!this.ready) return;

		if(params.esDeNoche){
			this.scene.remove(this.luzSolar);
			this.luzAmbiente = this.luzAmbienteNoche;
			this.locomotoraObjeto.encenderLuz();
			for (let i=0; i<this.faroles.length; i++){
				this.faroles[i].encenderLuz();
			}
		}else{
			if(!this.scene.children.includes(this.luzSolar)) 
				this.scene.add(this.luzSolar);
			this.luzAmbiente = this.luzAmbienteDia;
			this.locomotoraObjeto.apagarLuz();
			for (let i=0; i<this.faroles.length; i++){
				this.faroles[i].apagarLuz();
			}
		}

		if(Math.abs(params.nivelDelAgua) >= 0.75){
			params.maxNivel *=-1;
		}
		params.nivelDelAgua +=params.maxNivel*0.0125;
		this.agua.position.y += params.maxNivel*0.0125;

		if(params.posicionSobreRecorrido>0.98){
			params.posicionSobreRecorrido = 0;
		}
		if(!params.trenDetenido){
			params.posicionSobreRecorrido += 0.00025
			this.locomotoraObjeto.animarRuedas();
		}
		
		this.posicionarLocomotora(params.posicionSobreRecorrido);
	}
	
	posicionarLocomotora(posicion){
		let pos = this.recorrido.getPointAt(Math.min(0.98, posicion));
		pos.y += 2.375;
		this.locomotora.position.set(pos.x, pos.y, pos.z);
		let target = this.recorrido.getPointAt((posicion + 0.01) % 1);
		target.y += 10;
		let tangente = this.recorrido.getTangent(posicion + 0.01)
		let yAxis = new THREE.Vector3(0, 1, 0);

		let normal = new THREE.Vector3();
		normal.crossVectors(yAxis, tangente).normalize();
		let target2 = new THREE.Vector3();
		target2.addVectors(pos, normal);
		this.locomotora.lookAt(target2);
		this.locomotora.rotateY(3*Math.PI/2);
	}
}
