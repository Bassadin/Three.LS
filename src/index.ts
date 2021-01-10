import * as THREE from 'three'
import { Renderer, Scene } from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { Turtle3D } from './Turtles/Turtle3D'
import { LindenmayerFormular } from './LindenmayerFormular'
import Stats from 'stats-js'

var loading: boolean = false
//Eventlistener für Knöpfe
let btn = document.getElementById('btnDownload')

//Funktion für import
document.getElementById('file').addEventListener('change', (event: any) => {
    var reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(event.target.files[0])
})

function onReaderLoad(event: any) {
    let obj: any
    console.log(event.target.result)
    obj = JSON.parse(event.target.result)(
        //Set Values
        document.getElementById('sentence') as HTMLInputElement
    ).value = obj.Satz(
        document.getElementById('axiom1') as HTMLInputElement
    ).value = obj.Axiom1(
        document.getElementById('rule1') as HTMLInputElement
    ).value = obj.Rule1(
        //To be added
        document.getElementById('countIterations') as HTMLInputElement
    ).value = obj.IterationsCount(
        //
        document.getElementById('degrees') as HTMLInputElement
    ).value = obj.Drehwinkel(
        document.getElementById('steplength') as HTMLInputElement
    ).value = obj.Schrittlänge
    loading = false
}
//Ende Importfunktion

//function loadData(){
//loading = true;
//onChange;
//}

//Saver hier
btn.addEventListener('click', () => {
    let Satz = (document.getElementById('sentence') as HTMLInputElement).value
    let Axiom1 = (document.getElementById('axiom1') as HTMLInputElement).value
    let Rule1 = (document.getElementById('rule1') as HTMLInputElement).value
    //To be added
    let IterationsCount = (document.getElementById(
        'countIterations'
    ) as HTMLInputElement).value
    //
    let Drehwinkel = (document.getElementById('degrees') as HTMLInputElement)
        .value
    let Schrittlänge = (document.getElementById(
        'steplength'
    ) as HTMLInputElement).value

    var newObject = {
        Satz: Satz,
        Axiom1: Axiom1,
        Rule1: Rule1,
        IterationsCount: IterationsCount,
        Drehwinkel: Drehwinkel,
        Schrittlänge: IterationsCount,
    }
    //      }
    var json_string = JSON.stringify(newObject, undefined, 2)
    var link = document.createElement('a')
    link.download = 'data.json'
    var blob = new Blob([json_string], { type: 'text/plain' })
    link.href = window.URL.createObjectURL(blob)
    link.click()
})

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
let controls: TrackballControls

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
    let newTurtle: Turtle3D = lindenmayerFormular.generateLSystemImage()

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
