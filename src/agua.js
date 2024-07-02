import * as THREE from 'three'

export function crearAgua(){
    const geo = new THREE.PlaneGeometry(250,250,10,10);
    const texture = new THREE.TextureLoader().load('./maps/agua2.jpg')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5,1.5)
    const material = new THREE.MeshPhongMaterial({
        map: texture
    })
    const agua = new THREE.Mesh(geo,material);
    agua.rotateX(Math.PI/-2)
    return agua;
}