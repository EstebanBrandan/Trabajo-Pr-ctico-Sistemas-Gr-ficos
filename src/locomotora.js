import * as THREE from 'three';

export class crearLocomotora{
    locomotora;

    rotacionDelPiston=0;

    barraIzq;
    barraDer;
    ruedaIzq1;
    ruedaIzq2;
    ruedaIzq3;
    ruedaDer1;
    ruedaDer2;
    ruedaDer3;

    spotLight;
    lampara;

    constructor(){
        this.locomotora = new THREE.Mesh();
        this.lampara = new THREE.Mesh();
    
        const trompa = this.crearCilindro(1,5,20,20);
        const frente = this.crearCilindro(1.25,0.5,20,20);
        const chimenea = this.crearCilindro(0.25,2,10,5);
        const piso = this.crearCaja(2.5,0.2,7);
        const paredLateralIzq = this.crearCaja(0.2,2,2);
        const paredLateralDer = paredLateralIzq.clone();
        const paredFrontal = this.crearCaja(2.5,2,0.2);
        const tren = this.crearTren();
        const cabina = this.crearCabina();
        frente.add(chimenea);
        trompa.add(frente);
    	piso.add(trompa);
        this.locomotora.add(piso);
        this.locomotora.add(paredLateralIzq);
        this.locomotora.add(paredLateralDer);
        this.locomotora.add(paredFrontal);
        this.locomotora.add(tren);
        this.locomotora.add(cabina);

        frente.position.set(0,0,2.5);
        chimenea.position.set(0,1.25,0);
        chimenea.rotation.x = Math.PI/2;
        trompa.position.set(0,1,1);
        paredLateralIzq.position.set(1.15,1,-2.5);
        paredLateralDer.position.set(-1.15,1,-2.5);
        paredFrontal.position.set(0,1,-1.5)
        tren.position.set(0,-0.25,0)
        cabina.position.set(0,0.5,-4)
        cabina.scale.set(0.75,1,1)

        this.spotLight = new THREE.SpotLight(0xFFFFFF, 5000, 35, Math.PI/8, 0.5);
        this.lampara.add(this.spotLight)
	    this.lampara.add(this.spotLight.target);
	    frente.add(this.lampara);
	    this.spotLight.target.position.set(0,-3,10)
    }
    
    obtenerTren(){
        return this.locomotora;
    }

    apagarLuz(){
        this.lampara.remove(this.spotLight);
    }

    encenderLuz(){
        this.lampara.add(this.spotLight)
    }


    crearCilindro(radius,height,angleSegment,heightSegments){
        const geo = new THREE.CylinderGeometry( radius, radius, height, angleSegment, heightSegments);
        geo.rotateX(Math.PI/2); 
	    const defaultMaterial = new THREE.MeshPhongMaterial({
		    color: 0xD20103,
    		side: THREE.DoubleSide,
	    	wireframe: false,
		    shininess: 100,
    		flatShading: false,
	    });
    	const material = defaultMaterial;
	    const cilindro = new THREE.Mesh(geo,material);

        return cilindro;
    }

    crearCaja(width,height,depth){
        const geo = new THREE.BoxGeometry(width,height,depth);
        const defaultMaterial = new THREE.MeshPhongMaterial({
	    	color: 0xD20103,
		    side: THREE.DoubleSide,
    		wireframe: false,
	    	shininess: 100,
		    flatShading: false,
    	});
	    const material = defaultMaterial;
        const box = new THREE.Mesh(geo,material);

        return box;
    }

    crearTren(){
        const tren = new THREE.Mesh();

        const geo = new THREE.BoxGeometry(1.5,0.5,6);
        const defaultMaterial = new THREE.MeshPhongMaterial({
	    	color: 0x716F6F,
		    side: THREE.DoubleSide,
    		wireframe: false,
	    	shininess: 100,
		    flatShading: false,
    	});
        const material = defaultMaterial;
        const eje = new THREE.Mesh(geo,material);
    
        const pistonIzq = this.crearPiston(0);
        const pistonDer = this.crearPiston(1);

        const ruedasIzq = new THREE.Mesh();
        this.ruedaIzq1 = this.crearRueda();
        this.ruedaIzq2 = this.ruedaIzq1.clone();
        this.ruedaIzq3 = this.ruedaIzq1.clone();
        this.ruedaDer1 = this.ruedaIzq1.clone();
        this.ruedaDer2 = this.ruedaIzq1.clone();
        this.ruedaDer3 = this.ruedaIzq1.clone();

        ruedasIzq.add(this.ruedaIzq1);
        ruedasIzq.add(this.ruedaIzq2);
        ruedasIzq.add(this.ruedaIzq3);

        this.ruedaIzq1.position.set(0,0,1.5);
        this.ruedaIzq3.position.set(0,0,-1.5);
        const ruedasDer = new THREE.Mesh();
        ruedasDer.add(this.ruedaDer1);
        ruedasDer.add(this.ruedaDer2);
        ruedasDer.add(this.ruedaDer3);
        this.ruedaDer1.position.set(0,0,1.5);
        this.ruedaDer3.position.set(0,0,-1.5);
        
        eje.add(ruedasIzq);
        eje.add(ruedasDer);
        eje.add(pistonIzq);
        eje.add(pistonDer);

        ruedasIzq.position.set(0.8,-0.4,-0.5);
        ruedasDer.position.set(-0.8,-0.4,-0.5);
        pistonIzq.position.set(0.9,-0.4,2.5)
        pistonDer.position.set(-0.9,-0.4,2.5)

        tren.add(eje);

        return tren;
    }

    crearPiston(lado){
        const geo = new THREE.CylinderGeometry(0.35,0.35,1.5,20,1);
        geo.rotateX(Math.PI/2); 
        const defaultMaterial = new THREE.MeshPhongMaterial({
		    color: 0x240202,
    		side: THREE.DoubleSide,
	    	wireframe: false,
		    shininess: 100,
    		flatShading: false,
	    });
        const material = defaultMaterial;
        const piston = new THREE.Mesh(geo,material);

        const geo2 = new THREE.BoxGeometry(0.1,0.2,4.5)
        const defaultMaterial2 = new THREE.MeshPhongMaterial({
		    color: 0x716F6F,
    		side: THREE.DoubleSide,
	    	wireframe: false,
		    shininess: 100,
    		flatShading: false,
	    });
        const material2 = defaultMaterial2;
        const barra = new THREE.Mesh(geo2,material2);
        barra.position.set(0,0,-2.5)

        if (lado == 0){
            this.barraIzq=barra;
            piston.add(this.barraIzq);
        }else{
            this.barraDer=barra;
            piston.add(this.barraDer);
        }

        return piston;
    }

    crearRueda(){
        const geo = new THREE.CylinderGeometry(0.5,0.5,0.1,20,1);
        const texture = new THREE.TextureLoader().load('/maps/rueda2.jpg')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1,1)

        const defaultMaterial = new THREE.MeshPhongMaterial({
		    map: texture,
	    });
        const material2 = new THREE.MeshPhongMaterial({
            color: 0x131313,
    		side: THREE.DoubleSide,
	    	wireframe: false,
		    shininess: 100,
    		flatShading: false,
        })
        const material = [material2,defaultMaterial,defaultMaterial];
        const rueda = new THREE.Mesh(geo,material);

        rueda.rotateZ(Math.PI/2);

        return rueda;
    }

    crearCabina(){
        let long = 3

        const barraFrontL = this.crearCaja(0.2,1.5,0.2);
        const barraFrontR = barraFrontL.clone();
        const barraTrasL = barraFrontL.clone();
        const barraTrasR = barraFrontL.clone()

        const curve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2.5,2.5,0),new THREE.Vector3(0,3.5,0),new THREE.Vector3(2.5,2.5,0),
        ]);
        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.5,2.2,0),new THREE.Vector3(0,3.2,0),new THREE.Vector3(-2.5,2.2,0),
        ]);
        const points1 = curve1.getPoints(15);
        const points2 = curve2.getPoints(15);

        const puntos2d = [];

        points1.forEach((point)=>puntos2d.push(new THREE.Vector2(point.x,point.y)))
        points2.forEach((point)=>puntos2d.push(new THREE.Vector2(point.x,point.y)))

        const tapas = new THREE.Shape(puntos2d);

        const defaultMaterial = new THREE.MeshPhongMaterial({
	    	color: 0xFFFF00,
		    side: THREE.DoubleSide,
    		wireframe: false,
	    	shininess: 100,
		    flatShading: false,
    	});
        const material = defaultMaterial;

        const extrudeSettings = { 
            depth: long, 
            bevelEnabled: false, 
            bevelSegments: 2, 
            steps: 2, 
            bevelSize: 1, 
            bevelThickness: 1 
        };

        const geometry = new THREE.ExtrudeGeometry( tapas, extrudeSettings );

        let techo = new THREE.Mesh(geometry, material);
        techo.add(barraFrontL);
        techo.add(barraFrontR);
        techo.add(barraTrasL);
        techo.add(barraTrasR);
        barraFrontL.position.set(1.55,2,2.5);
        barraFrontR.position.set(-1.55,2,2.5);
        barraTrasL.position.set(1.55,2,0.6)
        barraTrasR.position.set(-1.55,2,0.6)
        return techo;
    }

    animarRuedas(){
        let rotacion = -Math.PI/20
        this.rotacionDelPiston += rotacion;
        this.barraIzq.position.set(0,0.25*Math.sin(this.rotacionDelPiston),-2.25 + 0.25*Math.cos(this.rotacionDelPiston))
        this.barraDer.position.set(0,0.25*Math.sin(this.rotacionDelPiston),-2.25 + 0.25*Math.cos(this.rotacionDelPiston))
        this.ruedaDer1.rotateY(rotacion)
        this.ruedaDer2.rotateY(rotacion)
        this.ruedaDer3.rotateY(rotacion)
        this.ruedaIzq1.rotateY(rotacion)
        this.ruedaIzq2.rotateY(rotacion)
        this.ruedaIzq3.rotateY(rotacion)
    }
}