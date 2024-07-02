import * as THREE from 'three'

export class crearFarol{
    farol;
    luz;
    constructor(){
        this.luz = new THREE.PointLight(0xffffff,250,20)
        this.luz.position.set(0,3.2,0);
        this.farol = new THREE.Mesh()
        const posteGeo = new THREE.CylinderGeometry(0.2,0.2,3,20,1);
        const lamparaGeo = new THREE.SphereGeometry(0.3,20,20);
        const materialPoste = new THREE.MeshPhongMaterial({
            color: 0x000000,
        })
        const materialLampara = new THREE.MeshPhongMaterial({
            emissive: 0xffffff,
        })
        const poste = new THREE.Mesh(posteGeo,materialPoste);
        const lampara = new THREE.Mesh(lamparaGeo,materialLampara);
        this.farol.add(poste);
        this.farol.add(lampara);
        lampara.position.set(0,3.2,0);
        poste.position.set(0,1.5,0);
    }

    obtenerFarol(){
        return this.farol;
    }

    encenderLuz(){
        this.farol.add(this.luz)
    }

    apagarLuz(){
        this.farol.remove(this.luz);
    }
    
}