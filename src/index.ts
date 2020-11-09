import * as THREE from 'three'
import { Camera, Clock, Mesh, MeshNormalMaterial, Renderer, Scene } from 'three'

let camera: Camera
let scene: Scene
let renderer: Renderer
let line: THREE.Line

let clock: Clock = new THREE.Clock()

let current: String = "A"
let count: number = 0

function makeTree() {
    let next: String[] = [];

    for (let index = 0; index < current.length; index++) {
        let c: String = current[index]
        
        if(c === 'A')
            next.push("ABA")
        else if(c === 'B')
            next.push("BBB")
    }

    current = next.join("");
    count++;
    console.log("Generation " + count + ": " + current)
}

console.log("Generation " + count + ": " + current)
window.addEventListener("click", makeTree);

init()
//animate()

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    line = new THREE.Line( geometry, material );

    scene.add( line );
    renderer.render( scene, camera );
}

// function animate() {
//     requestAnimationFrame(animate)
//     let delta: number = clock.getDelta()

//     camera.lookAt(line.position)
//     camera.rotation.y += 1* delta

//     renderer.render(scene, camera)

//     // mesh.rotation.y += 1 * delta
//     // mesh.rotation.x += 0.8 * delta

//     // mesh.position.y = 0.35 * Math.sin(1.3 * clock.getElapsedTime())
//     // mesh.position.x = 0.5 * Math.cos(1.3 * clock.getElapsedTime())
// }
