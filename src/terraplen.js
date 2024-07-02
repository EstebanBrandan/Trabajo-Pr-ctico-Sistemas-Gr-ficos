import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

export function crearTerraplen(){
    const matrizDeNivel = new THREE.Matrix4();

    const [formaDelTerraplen, formaDibujo] = dibujarForma();
    const recorrido = dibujarRecorrido();
    const [rielIzq,rielDer,rielIzqDibujo,rielDerDibujo] = dibujarRiel();

    const listaDeFormas = [];
    const listaDeRielesIzq = []
    const listaDeRielesDer = []
    const listaDeMatrices = [];
    const listaDeMatricesRielesIzq = [];
    const listaDeMatricesRielesDer = [];

    const normal = new THREE.Vector3(0,1,0);
    for(let i=0; i<150; i++){
        //obtengo la matriz de nivel
        const tangent = recorrido.getTangent(i/150);
        const binormal = calcularBinormal(normal,tangent);
        matrizDeNivel.makeBasis(binormal,normal,tangent);
        matrizDeNivel.premultiply(new THREE.Matrix4().makeTranslation(recorrido.getPoint(i/150)))
        
        const copy = formaDelTerraplen.clone();
        const copyRielIzq = rielIzq.clone();
        const copyRielDer = rielDer.clone();
        copy.matrixAutoUpdate = false;
        copyRielIzq.matrixAutoUpdate = false;
        copyRielDer.matrixAutoUpdate = false;
        copy.matrix.copy(matrizDeNivel);
        copyRielIzq.matrix.copy(matrizDeNivel);
        copyRielDer.matrix.copy(matrizDeNivel);
        const copyCurve = formaDibujo.clone();
        copyCurve.matrixAutoUpdate = false;
        const copyFormaI = rielIzqDibujo.clone();
        copyFormaI.matrixAutoUpdate = false;
        const copyFormaD = rielDerDibujo.clone();
        copyFormaD.matrixAutoUpdate = false;
        listaDeMatrices.push(copy.matrix);
        listaDeMatricesRielesIzq.push(copyRielIzq.matrix);
        listaDeMatricesRielesDer.push(copyRielDer.matrix)
        listaDeFormas.push(copyCurve);
        listaDeRielesIzq.push(copyFormaI)
        listaDeRielesDer.push(copyFormaD);
    }

    const geometry = dibujarSuperficie(listaDeFormas,listaDeMatrices);
    
    const texture = new THREE.TextureLoader().load('./maps/durmientes.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 80 );
    const defaultMaterial = new THREE.MeshPhongMaterial({
        map: texture,
		side: THREE.DoubleSide,
		wireframe: false,
		shininess: 100,
		flatShading: false,
	});
    const material = defaultMaterial;
    const terraplen = new THREE.Mesh(geometry,material);

    const geoRielI = dibujarSuperficie(listaDeRielesIzq,listaDeMatricesRielesIzq);
    const geoRielD = dibujarSuperficie(listaDeRielesDer,listaDeMatricesRielesDer);
   
    const materialRiel = new THREE.MeshPhongMaterial({
		color: 0x716F6F,
		side: THREE.DoubleSide,
		wireframe: false,
		shininess: 100,
		flatShading: false,
	});
    const rielI = new THREE.Mesh(geoRielI,materialRiel);
    const rielD = new THREE.Mesh(geoRielD,materialRiel);
    const rieles = new THREE.Mesh()
    rieles.add(rielD);
    rieles.add(rielI);
    terraplen.add(rieles)
    return [terraplen,recorrido];
}

function dibujarForma(){
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3,-1,0),new THREE.Vector3(-2,-0.25,0),//new THREE.Vector3(-1.5,-0.5,0),
        new THREE.Vector3(-1.5,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(1.5,0,0),
        new THREE.Vector3(2,-0.25,0),new THREE.Vector3(3,-1,0)//,new THREE.Vector3(-1.5,-0.5,0),
    ])
    const points = curve.getPoints(20);
	const geometry = new THREE.BufferGeometry().setFromPoints(points);

	const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

	// Create the final object to add to the scene
	const formaDelTerraplen = new THREE.Line(geometry, material);
    return [formaDelTerraplen,curve];
}

function dibujarRecorrido(){
    let arc = 10*Math.cos(Math.PI/4);
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-80,0,-20),new THREE.Vector3(-80,0,-30),new THREE.Vector3(-80,0,-40),
        new THREE.Vector3(-70-arc,0,-40-arc),
        new THREE.Vector3(-70,0,-50),new THREE.Vector3(-60,0,-50),new THREE.Vector3(-50,0,-50),
        new THREE.Vector3(-40,0,-50),new THREE.Vector3(-30,0,-50),new THREE.Vector3(-20,0,-50),
        new THREE.Vector3(-10,0,-50),new THREE.Vector3(0,0,-50),new THREE.Vector3(10,0,-50),
        new THREE.Vector3(20,0,-45),new THREE.Vector3(30,0,-40),new THREE.Vector3(40,0,-40),
        new THREE.Vector3(50,0,-40),new THREE.Vector3(60,0,-40),new THREE.Vector3(70,0,-40),
        new THREE.Vector3(70+arc,0,-30-arc),
        new THREE.Vector3(80,0,-30),new THREE.Vector3(80,0,-20),new THREE.Vector3(80,0,-10),
        new THREE.Vector3(80,0,0),new THREE.Vector3(80,0,10),new THREE.Vector3(80,0,20),
        new THREE.Vector3(80,0,30),new THREE.Vector3(80,0,40),new THREE.Vector3(80,0,50),
        new THREE.Vector3(70+arc,0,50+arc),
        new THREE.Vector3(70,0,60),new THREE.Vector3(60,0,60),new THREE.Vector3(50,0,60),
        new THREE.Vector3(40,0,60),new THREE.Vector3(30,0,60),
        new THREE.Vector3(20,0,60),new THREE.Vector3(10,0,60),new THREE.Vector3(0,0,55),
        new THREE.Vector3(-10,0,50),new THREE.Vector3(-20,0,50),new THREE.Vector3(-30,0,50),
        new THREE.Vector3(-40,0,50),new THREE.Vector3(-50,0,50),new THREE.Vector3(-60,0,50),
        new THREE.Vector3(-70,0,50),new THREE.Vector3(-70-arc,0,40+arc),new THREE.Vector3(-80,0,40),
        new THREE.Vector3(-80,0,30),new THREE.Vector3(-80,0,20),new THREE.Vector3(-80,0,10),
        new THREE.Vector3(-80,0,0),new THREE.Vector3(-80,0,-10)
    ],true);
    return curve;
}

function dibujarRiel(){
    const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.75,0,0),new THREE.Vector3(-0.75,0.25,0),new THREE.Vector3(-0.9,0.25,0),
        new THREE.Vector3(-0.9,0,0)
    ])
    const curve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.9,0,0),new THREE.Vector3(0.9,0.25,0),new THREE.Vector3(0.75,0.25,0),
        new THREE.Vector3(0.75,0,0)
    ])
    const points1 = curve1.getPoints(3);
    const points2 = curve2.getPoints(3);

    const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

	const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const formaRielIzq = new THREE.Line(geometry1,material);
    const formaRielDer = new THREE.Line(geometry2,material);
    return [formaRielIzq,formaRielDer,curve1,curve2];
}

function calcularBinormal(normal,tangent){
    const binormal = new THREE.Vector3();
    binormal.x=(normal.y*tangent.z)-(normal.z*tangent.y);
    binormal.y=(normal.z*tangent.x)-(normal.x*tangent.z);
    binormal.z=(normal.x*tangent.y)-(normal.y*tangent.x);
    return binormal;
}

function dibujarSuperficie(listaDeFormas,listaDeMatrices){
    let geometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];
    const normals = [];
    const uv = [];
    crearSuperficie({positions,indices,normals,uv},listaDeFormas,listaDeMatrices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);

    return geometry;
}

function crearSuperficie(buffers,listaDeFormas,listaDeMatrices){
    const recorridoStep = listaDeFormas.length;
    const anchoStep = 15;
    let positions = buffers.positions;
    let indices = buffers.indices;
    let normals = buffers.normals;
    let uv = buffers.uv;

    const ortogonal = new THREE.Vector3(0,0,-1);
    for(let i=0; i<=recorridoStep; i++){
        const v = i/recorridoStep;
        let forma;
        let matrizDeNivel;
        if (i==recorridoStep) {
            forma = listaDeFormas[0];
            matrizDeNivel = listaDeMatrices[0];
        }else{
            forma = listaDeFormas[i];
            matrizDeNivel = listaDeMatrices[i];
        }
        for(let j=0; j<=anchoStep; j++){
            const u = j/anchoStep;
            const [xn,yn,zn] = calcularBinormal(forma.getTangent(j/anchoStep),ortogonal).transformDirection(matrizDeNivel);
            const [x,y,z] = forma.getPoint(j/anchoStep).applyMatrix4(matrizDeNivel);
            
            positions.push(x, y, z);
			normals.push(xn,yn,zn);
			uv.push(u, v);
			//We stop before the last row and last column
			if (i < recorridoStep && j < anchoStep) {
				// The indices of the vertices
				const a = i * (anchoStep + 1) + j;
				const b = a + anchoStep + 1;
				const c = a + anchoStep + 2;
				const d = a + 1;

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
        }
    }
}