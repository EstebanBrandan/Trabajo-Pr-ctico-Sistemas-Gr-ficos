import * as THREE from 'three';

export function crearTunel(){

    const curvaTunel = dibujarForma();


    const long = 40;

    const texture = new THREE.TextureLoader().load("./maps/WoodFloor041_2K-JPG_Color.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.1, 0.1 );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.rotation = Math.PI/2

    const defaultMaterial = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
		wireframe: false,
		shininess: 50,
		flatShading: false,
	});
    const puntos =curvaTunel.getPoints(10);
    const puntos2D = []
    for(let i=0;i<11;i++){
        puntos2D.push(new THREE.Vector2(puntos[i].x,puntos[i].y))
    }
    const tapas = new THREE.Shape(puntos2D)

    const extrudeSettings = { 
        depth: long, 
        bevelEnabled: false, 
        bevelSegments: 2, 
        steps: 2, 
        bevelSize: 1, 
        bevelThickness: 1 
    };

    const geometry = new THREE.ExtrudeGeometry( tapas, extrudeSettings );

    const material = defaultMaterial;
    
    const tunelFinal = new THREE.Mesh(geometry,material);

    return tunelFinal;
}

function dibujarForma(){
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5,0,0),new THREE.Vector3(-5,5,0),new THREE.Vector3(0,7.5,0),
        new THREE.Vector3(5,5,0),new THREE.Vector3(5,0,0),new THREE.Vector3(5.625,0,0),
        new THREE.Vector3(5.625,5.625,0),new THREE.Vector3(0,8.4375,0),new THREE.Vector3(-5.625,5.625,0),
        new THREE.Vector3(-5.625,0,0),new THREE.Vector3(-5,0,0)
    ]);

    return curve
}