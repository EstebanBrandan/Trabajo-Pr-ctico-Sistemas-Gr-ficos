import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function crearPuente(){
    const puente = new THREE.Group()
    const estructura = crearEstructura()
    const vigas = crearVigas();
    puente.add(estructura);
    estructura.add(vigas);
    estructura.position.set(0,0,-6)
    vigas.position.set(40,5,1);
	vigas.rotateY(Math.PI/-2)
    return puente;
}

function crearEstructura(){
    const texture = new THREE.TextureLoader().load('./maps/Bricks085_1K-JPG_Color.jpg')
    const arco = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15,-25,0),
        new THREE.Vector3(-14,-11,0),
        new THREE.Vector3(0,-5,0),
        new THREE.Vector3(14,-11,0),
        new THREE.Vector3(15,-25,0),
    ])
    const points = arco.getPoints(50);

    const formaCompleta = [];
    points.forEach((point) => formaCompleta.push(point));
    formaCompleta.push(new THREE.Vector3(40,-25,0))
    formaCompleta.push(new THREE.Vector3(40,0,0))
    formaCompleta.push(new THREE.Vector3(-40,0,0))
    formaCompleta.push(new THREE.Vector3(-40,-25,0))
    formaCompleta.push(new THREE.Vector3(-25,-25,0))

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.05, 0.05 );
    const material = new THREE.MeshPhongMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
		wireframe: false,
		shininess: 50,
		flatShading: false,
    });

    const puntos2D = []
    for(let i=0;i<formaCompleta.length-1;i++){
        puntos2D.push(new THREE.Vector2(formaCompleta[i].x,formaCompleta[i].y))
    }
    
    const tapas = new THREE.Shape(puntos2D);
    
    const extrudeSettings = { 
        depth: 12, 
        bevelEnabled: false, 
        bevelSegments: 2, 
        steps: 2, 
        bevelSize: 1, 
        bevelThickness: 1 
    };

    const geometry = new THREE.ExtrudeGeometry( tapas, extrudeSettings );
	const forma = new THREE.Mesh(geometry, material);
    return forma
}

function crearVigas(){
    const vigaGeo = new THREE.BoxGeometry(0.4,10,0.4);
    const vigas = [];
    for(let i=0; i<=8;i++){
        for(let j=0; j<3; j++){
            let x;
            let y;
            let z=i*10;
            let rotar = false;
            let angle = Math.PI/2;
            switch(j){
                case 0:
                    x=0;
                    y=0;
                    break;
                case 1:
                    x=10;
                    y=0;
                    rotar=true;
                    angle=Math.PI;
                    break;
                case 2:
                    x=5;
                    y=5;
                    rotar=true;
                    break;
                
            }
            let copy = vigaGeo.clone();
            if(i!=8){
                let copyDiagonal = vigaGeo.clone()
                copyDiagonal.scale(1,1.4,1)
                copyDiagonal.rotateX(Math.PI/4);
                if(rotar){
                    copyDiagonal.rotateZ(angle);
                }
                copyDiagonal.translate(x,y,z+5)
                vigas.push(copyDiagonal);
            }
            if(rotar){
                copy.rotateZ(angle);
            }
            copy.translate(x,y,z);
            vigas.push(copy);
        }
    }
    for(let i=0; i<4; i++){
        let copy = vigaGeo.clone();
        copy.translate(0,5,5)
        copy.scale(1,8,1);
        copy.rotateX(Math.PI/2);
        switch(i){
            case 1:
                copy.translate(0,10,0);
                break;
            case 2:
                copy.translate(10,10,0);
                break;
            case 3:
                copy.translate(10,0,0);
                break;
        }
        vigas.push(copy);
    }
    const estructura = mergeGeometries(vigas);
    const texture = new THREE.TextureLoader().load('/maps/Seamless metal v1.13.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 25 );
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });
    const estructHierro = new THREE.Mesh(estructura,material);
    return estructHierro;
}