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

// Count all Rules
let countAllRules = 1;

// Get Btns
const btnAdd: HTMLInputElement = document.querySelector('#btnAddRule')
const btnRemove: HTMLInputElement = document.querySelector('#btnRemoveRule')
const btnUpload: HTMLInputElement = document.querySelector('#btnUpload')
const btnDownload: HTMLInputElement = document.querySelector('#btnDownload')
const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate')
btnRemove.disabled = true;

//Necessary Elements
const rulesWrapper: HTMLDivElement = document.querySelector('#rulesWrapper')

// Eventlisteners for Btns
btnAdd.addEventListener('click', () => {
    rulesWrapper.insertAdjacentHTML('beforeend', ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' + (countAllRules + 1) + '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' + (countAllRules + 1) + '</label> <input class="interface__input-field axioms" type="text" id="axiom' + (countAllRules + 1) + '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' + (countAllRules + 1) + '</label> <input class="interface__input-field rules" type="text" id="rule' + (countAllRules + 1) + '"> </div> </div>')
    countAllRules++
    if(btnRemove.disabled == true)
        btnRemove.disabled = false;
})

btnRemove.addEventListener('click', () => {
    const allRulesLength = rulesWrapper.children.length

    if(allRulesLength > 1) {
        document.querySelector('#count' + countAllRules).remove()
        countAllRules--
    }

    if(countAllRules <= 1)
        btnRemove.disabled = true;
})

btnUpload.addEventListener('click', () => {
    // add upload stuff here
})

btnDownload.addEventListener('click', () => {
    // add download stuff here
})

btnGenerate.addEventListener('click', () => {
    const axioms: string[] = new Array()
    const rules: string[] = new Array()

    document.querySelectorAll('.axioms').forEach(element => {
        axioms.push((<HTMLInputElement> element).value)
    })

    document.querySelectorAll('.rules').forEach(element => {
        rules.push((<HTMLInputElement> element).value)
    })

    const sentence: string = (<HTMLInputElement> document.querySelector('#sentence')).value
    const iterations: number = parseInt((<HTMLInputElement> document.querySelector('#countIterations')).value)
    const degrees: number = parseInt((<HTMLInputElement> document.querySelector('#degrees')).value)
    const steplength: number = parseInt((<HTMLInputElement> document.querySelector('#steplength')).value)/10
    
    for (let i = 0; i < axioms.length; i++) {
        ruleset.push(new Rule(axioms[i], rules[i]))
    }

    let lsys: LSystem = new LSystem(sentence, ruleset);

    for (let i: number = 0; i < iterations; i++) {
        lsys.generate()
        console.log(lsys.getSentence())
    }

    let turtle: Turtle3D = new Turtle3D(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees))

    init(turtle)
    animate()
})



// Square
// ruleset.push(new Rule('F', 'F[F]-F+F[--F]+F-F'))
// let lsys: LSystem = new LSystem('F-F-F-F', ruleset)
// for (let i: number = 0; i < generations; i++) {
//     lsys.generate()
//     console.log(lsys.getSentence())
// }
// let turtle: Turtle2D = new Turtle2D(lsys.getSentence(), 0.5, Math.PI / 2)

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
// let turtle: Turtle2D = new Turtle2D(
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
// let turtle: Turtle2D = new Turtle2D(lsys.getSentence(), 0.5, Utils.degreesToRadians(90))

function init(turtle: Turtle2D) {
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
