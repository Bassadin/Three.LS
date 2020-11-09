import * as THREE from 'three'
import { Camera, Clock, Mesh, MeshNormalMaterial, Renderer, Scene} from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let camera: Camera
let scene: Scene
let renderer: Renderer
let line: THREE.Line
let controls: OrbitControls

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

function randomNumber(min: number, max: number) {  
    return Math.random() * (max - min) + min; 
}

console.log("Generation " + count + ": " + current)

for (let index = 0; index < 3; index++) {
    makeTree();
}

init()
animate()

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 10, 10 );
    controls.update();

    scene = new THREE.Scene();

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    let aTemp = 0;
    let bTemp = 0;

    for (let index = 0; index < current.length; index++) {
        if(current[index] === "A") {
            points.push( new THREE.Vector3( 0, aTemp, 0 ) );
            aTemp = randomNumber(1, 4)
            points.push( new THREE.Vector3( aTemp, 0, randomNumber(1, 7) ) );
        }
        else if(current[index] === "B") {
            bTemp = randomNumber(1, 4)
            points.push( new THREE.Vector3( 0, bTemp, 0 ) );
            points.push( new THREE.Vector3( randomNumber(1, 5), 0, bTemp ) );
        }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    line = new THREE.Line( geometry, material );

    scene.add( line );
    renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame(animate)
    let delta: number = clock.getDelta()

    controls.update();

    renderer.render(scene, camera)

    // mesh.rotation.y += 1 * delta
    // mesh.rotation.x += 0.8 * delta

    // mesh.position.y = 0.35 * Math.sin(1.3 * clock.getElapsedTime())
    // mesh.position.x = 0.5 * Math.cos(1.3 * clock.getElapsedTime())
}
