import * as THREE from 'three'
import { Clock, Renderer, Scene, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BaseTurtle } from './Turtles/BaseTurtle'
import { Turtle2D } from './Turtles/Turtle2D'
import { Turtle3D } from './Turtles/Turtle3D'
import { Rule } from './Rule'
import { LSystem } from './LSystem'
import { Utils } from './Utils'
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
let controls: OrbitControls
let clock: Clock = new THREE.Clock()

//L System stuff
let generations: number = 3

// Count all Rules
let countAllRules = 1

// Get Btns
const btnAdd: HTMLInputElement = document.querySelector('#btnAddRule')
const btnRemove: HTMLInputElement = document.querySelector('#btnRemoveRule')
const btnUpload: HTMLInputElement = document.querySelector('#btnUpload')
const btnDownload: HTMLInputElement = document.querySelector('#btnDownload')
const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate')
btnRemove.disabled = true

//Necessary Elements
const rulesWrapper: HTMLDivElement = document.querySelector('#rulesWrapper')

// Eventlisteners for Btns
btnAdd.addEventListener('click', () => {
    rulesWrapper.insertAdjacentHTML(
        'beforeend',
        ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' +
            (countAllRules + 1) +
            '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' +
            (countAllRules + 1) +
            '</label> <input class="interface__input-field axioms" type="text" id="axiom' +
            (countAllRules + 1) +
            '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' +
            (countAllRules + 1) +
            '</label> <input class="interface__input-field rules" type="text" id="rule' +
            (countAllRules + 1) +
            '"> </div> </div>'
    )
    countAllRules++
    if (btnRemove.disabled == true) btnRemove.disabled = false
})

btnRemove.addEventListener('click', () => {
    const allRulesLength = rulesWrapper.children.length

    if (allRulesLength > 1) {
        document.querySelector('#count' + countAllRules).remove()
        countAllRules--
    }

    if (countAllRules <= 1) btnRemove.disabled = true
})

btnUpload.addEventListener('click', () => {
    // add upload stuff here
})

btnDownload.addEventListener('click', () => {
    // add download stuff here
})

btnGenerate.addEventListener('click', generateLSystemImage)

function generateLSystemImage(): void {
    const axioms: string[] = new Array()
    const rules: string[] = new Array()

    document.querySelectorAll('.axioms').forEach((element) => {
        axioms.push((<HTMLInputElement>element).value.toUpperCase())
    })

    document.querySelectorAll('.rules').forEach((element) => {
        rules.push((<HTMLInputElement>element).value.toUpperCase())
    })

    const sentence: string = (<HTMLInputElement>(
        document.querySelector('#sentence')
    )).value.toUpperCase();

    const iterations: number = parseInt(
        (<HTMLInputElement>document.querySelector('#countIterations')).value
    )
    const degrees: number = parseInt(
        (<HTMLInputElement>document.querySelector('#degrees')).value
    )
    const steplength: number =
        parseInt(
            (<HTMLInputElement>document.querySelector('#steplength')).value
        ) / 10

    let ruleset: Rule[] = []

    for (let i = 0; i < axioms.length; i++) {
        ruleset.push(new Rule(axioms[i], rules[i]))
    }

    let lsys: LSystem = new LSystem(sentence, ruleset)

    console.time('L System generation')
    for (let i: number = 0; i < iterations; i++) {
        lsys.generate()
        // console.log(lsys.getSentence())
    }
    console.timeEnd('L System generation')

    let turtle: Turtle3D = new Turtle3D(
        lsys.getSentence(),
        steplength,
        Utils.DegreesToRadians(degrees)
    )

    if (scene !== undefined) {
        repaint(turtle)
    } else {
        init(turtle)
        animate()
    }
}

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
// let turtle: Turtle = new Turtle(lsys.getSentence(), 0.5, (2 * Math.PI) / 3)

// Tree
// ruleset.push(new Rule('F', 'FF+[+F-F-F]-[-F+F+F]'))
// let lsys: LSystem = new LSystem('F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle = new Turtle(
//     lsys.getSentence(),
//     0.2,
//     Utils.DegreesToRadians(25)
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

    controls = new OrbitControls(camera, renderer.domElement)
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

generateLSystemImage()
