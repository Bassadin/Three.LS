import * as THREE from 'three'
import { Camera, Clock, Mesh, MeshNormalMaterial, Renderer, Scene } from 'three'

let camera: Camera
let scene: Scene
let geometry: THREE.BoxGeometry
let material: MeshNormalMaterial
let renderer: Renderer
let mesh: Mesh

let clock: Clock = new THREE.Clock()

init()
animate()

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.z = 1

    scene = new THREE.Scene()

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    material = new THREE.MeshNormalMaterial()

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
}

function animate() {
    requestAnimationFrame(animate)
    let delta: number = clock.getDelta()

    mesh.rotation.y += 1 * delta
    mesh.rotation.x += 0.8 * delta

    mesh.position.y = 0.35 * Math.sin(1.3 * clock.getElapsedTime())
    mesh.position.x = 0.5 * Math.cos(1.3 * clock.getElapsedTime())

    renderer.render(scene, camera)
}
