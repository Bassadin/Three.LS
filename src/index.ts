import * as THREE from 'three'
import { Clock, Renderer, Scene, Vector3 } from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { BaseTurtle } from './Turtles/BaseTurtle'
import { Turtle2D } from './Turtles/Turtle2D'
import { Turtle3D } from './Turtles/Turtle3D'
import { Rule } from './Rule'
import { LSystem } from './LSystem'
import { Utils } from './Utils'
import { LindenmayerFormular } from './LindenmayerFormular'
import Stats from 'stats-js'

// #region Performance Stats
let stats: Stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.removeProperty('left')
stats.dom.style.setProperty('right', '0')
document.body.appendChild(stats.dom)
// #endregion Performance Stats

let camera: THREE.PerspectiveCamera
let scene: Scene
let renderer: Renderer
let line: THREE.Line
let controls: TrackballControls
let clock: Clock = new THREE.Clock()

const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate')

const lindenmayerFormular: LindenmayerFormular = LindenmayerFormular.getInstance()

let newTurtle: Turtle3D = lindenmayerFormular.generateLSystemImage()

if (scene !== undefined) {
    repaint(newTurtle)
} else {
    init(newTurtle)
    animate()
}


btnGenerate.addEventListener('click', () => {
    let newTurtle: Turtle3D = lindenmayerFormular.generateLSystemImage();

    if (scene !== undefined) {
        repaint(newTurtle)
    } else {
        init(newTurtle)
        animate()
    }
})

function init(turtle: Turtle3D) {
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        10000
    )

    controls = new TrackballControls(camera, renderer.domElement)
    camera.position.set(0, 0, 15)
    controls.update()

    scene = new THREE.Scene()

    turtle.render(scene)

    renderer.render(scene, camera)

    window.addEventListener('resize', onWindowResize, false)
}

function repaint(turtle: Turtle3D) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i]
        scene.remove(obj)
    }
    turtle.render(scene)
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)

    //Performance Stats
    stats.update()
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}
