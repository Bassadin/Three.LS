import * as THREE from 'three'
import { Clock, Renderer, Scene, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: THREE.PerspectiveCamera
let scene: Scene
let renderer: Renderer
let line: THREE.Line
let controls: OrbitControls

let clock: Clock = new THREE.Clock()

let current: String = 'ABBB'
let count: number = 0
let generationIterations: number = 3

function makeTree() {
    let next: String[] = []

    for (let index = 0; index < current.length; index++) {
        let c: String = current[index]

        if (c === 'A') next.push('ABA')
        else if (c === 'B') next.push('BBB')
    }

    current = next.join('')
    count++
    console.log('Generation ' + count + ': ' + current)
}

console.log('Generation ' + count + ': ' + current)

for (let index = 0; index < generationIterations; index++) {
    makeTree()
}

init()
animate()

function init() {
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        10000
    )

    controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 0, 10)
    controls.update()

    scene = new THREE.Scene()

    //create a blue LineBasicMaterial
    const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 100,
        linecap: 'round',
        linejoin: 'round',
    })

    const points: Vector3[] = []

    let startPoint: Vector3 = new Vector3(0, -4, 0)

    points.push(startPoint)

    let lastY: number = startPoint.y
    let lastX: number = startPoint.x

    for (let index = 0; index < current.length; index++) {
        lastY += 8 / current.length
        if (current[index] === 'A') {
            lastX += 8 / current.length
        } else if (current[index] === 'B') {
            lastX -= 7 / current.length
        }
        points.push(new THREE.Vector3(lastX, lastY, 0))
    }

    console.log('Points', points)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    line = new THREE.Line(geometry, material)

    scene.add(line)
    renderer.render(scene, camera)

    window.addEventListener('resize', onWindowResize, false)
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}
