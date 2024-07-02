import * as THREE from 'three'

const materials = {
    trunk: new THREE.MeshPhongMaterial({ color: 0x996611, name: "trunk" }),

    foliage: new THREE.MeshPhongMaterial({
      color: 0x009900,
      name: "foliage",
    })
}

function createTree(height, diameter) {
    let tree = new THREE.Group();

    let foliageGeometry = new THREE.SphereGeometry(diameter / 2, 32, 16);
    let foliageMaterial = materials["foliage"];
    let foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(0, height, 0);

    let trunkDiameter = Math.max(0.1, diameter * 0.1);

    let trunkGeometry = new THREE.CylinderGeometry(
      trunkDiameter / 2,
      trunkDiameter,
      height,
      32
    );
    trunkGeometry.translate(0, height / 2, 0);
    let trunk = new THREE.Mesh(trunkGeometry, materials["trunk"]);

    tree.add(trunk);
    tree.add(foliage);

    return tree;
}

export function crearArboleda(xMin,xMax,zMin,zMax,cantArboles){
    const arboleda = new THREE.Mesh()
    let x=xMax-xMin
    let z=zMax-zMin
    const posiciones = []
    for(let i=0; i<cantArboles; i++){
        let arbol = createTree(5+Math.random()*5,2+Math.random()*3)
        arbol.position.set(xMin+Math.random()*x,0,zMin+Math.random()*z)
        arboleda.add(arbol)
        //crear arbol con medidas random, ubicacion random sin repetir, 
    }
    return arboleda;
}