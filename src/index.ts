import * as THREE from 'three'
import { Clock, Renderer, Scene, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Turtle3D } from './Turtles/Turtle3D'
import { Turtle2D } from './Turtles/Turtle2D'
import { Rule } from './Rule'
import { LSystem } from './LSystem'
import { Utils } from './Utils'

let camera: THREE.PerspectiveCamera
let scene: Scene
let renderer: Renderer
let line: THREE.Line
let controls: OrbitControls
let clock: Clock = new THREE.Clock()

//L System stuff
let generations: number = 4
let ruleset: Rule[] = []

// Square
// ruleset.push(new Rule('F', 'F[F]-F+F[--F]+F-F'))
// let lsys: LSystem = new LSystem('F-F-F-F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle = new Turtle(lsys.getSentence(), 0.5, Math.PI / 2)

// Triangle
// ruleset.push(new Rule('F', 'F--F--F--G'))
// ruleset.push(new Rule('G', 'GG'))
// let lsys: LSystem = new LSystem('F--F--F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle3D = new Turtle3D(lsys.getSentence(), 0.5, (2 * Math.PI) / 3)

// Tree
// ruleset.push(new Rule('F', 'FF+[+F-F-F]-[-F+F+F]'))
// let lsys: LSystem = new LSystem('F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle3D = new Turtle3D(
//     lsys.getSentence(),
//     .4,
//     Utils.DegreesToRadians(25)
// )

// // Box (3D Hilbert Curve)
ruleset.push(new Rule('A', 'B-F+CFC+F-D&F∧D-F+&&CFC+F+B//'))
ruleset.push(new Rule('B', 'A&F∧CFB∧F∧D∧∧-F-D∧|F∧B|FC∧F∧A//'))
ruleset.push(new Rule('C', '|D∧|F∧B-F+C∧F∧A&&FA&F∧C+F+B∧F∧D//'))
ruleset.push(new Rule('D', '|CFB-F+B|FA&F∧A&&FB-F+B|FC//'))
let lsys: LSystem = new LSystem('A', ruleset)
for (let i: number = 0; i < generations; i++) {
    lsys.generate()
    console.log(lsys.getSentence())
}
let turtle: Turtle3D = new Turtle3D(
    lsys.getSentence(),
    0.35,
    Utils.DegreesToRadians(90)
)

//3D Test
// let lsys: LSystem = new LSystem('FF/FF/FF', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle3D = new Turtle3D(
//     lsys.getSentence(),
//     0.5,
//     Utils.DegreesToRadians(90)
// )

// Some Plant
// ruleset.push(new Rule('F', 'F[+F]F[-F][F]'))
// let lsys: LSystem = new LSystem('F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle = new Turtle(
//     lsys.getSentence(),
//     0.2,
//     Utils.DegreesToRadians(20)
// )

//Debugging
// ruleset.push(new Rule('F', 'F+[F]--[F]+'))
// let lsys: LSystem = new LSystem('F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle = new Turtle(lsys.getSentence(), 0.5, Utils.degreesToRadians(90))

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
    camera.position.set(0, 0, 15)
    controls.update()

    scene = new THREE.Scene()

    turtle.render(scene)

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
