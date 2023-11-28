import * as THREE from 'three';
import { Clock, Scene } from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import Turtle from './Turtle';
import { LindenmayerFormular } from './LindenmayerFormular';
import PerformanceStats from './PerformanceStats';
import Utils from './Utils';

import './styles/styles.scss';

export let scene: Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: TrackballControls;
const sceneClock: Clock = new Clock();

const lindenmayerSettingsForm: LindenmayerFormular = LindenmayerFormular.getInstance();
const newTurtle: Turtle = lindenmayerSettingsForm.generateLSystemImage();

// check if system is undefined and init or repaint scene
if (scene !== undefined) {
    repaint(newTurtle);
} else {
    initTestingScene(newTurtle);
    animate();
}
// add event-listener to generate button
function hookUpGenerateButtonEventListener() {
    const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate');
    btnGenerate.addEventListener('click', (e) => {
        e.preventDefault();
        generateAndRepaintLindenmayerMesh();
    });
}
// repaint or generate scene with tree mesh
export function generateAndRepaintLindenmayerMesh() {
    const form: LindenmayerFormular = LindenmayerFormular.getInstance();
    const newTurtle: Turtle = form.generateLSystemImage();
    if (scene !== undefined) {
        repaint(newTurtle);
    } else {
        initTestingScene(newTurtle);
        animate();
    }
}
// init scene
function initTestingScene(turtle: Turtle) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // far is that high, that we can see the whole tree without zoom out = 10000 instaed of 2000
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2; //set control rotation speed to 2 to have more speed
    camera.position.set(0, 0, 15); // set cam position in z-direction to look at the whole scene
    controls.update();

    scene = new THREE.Scene();

    const generatedMeshObject = turtle.generateMeshObject();
    generatedMeshObject.userData.isLSystemTree = true;

    scene.add(generatedMeshObject);
    scene.add(Utils.createPlane());

    // console.log(scene);

    sceneClock.start();

    renderer.render(scene, camera);

    const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    scene.add(light);

    window.addEventListener('resize', onWindowResize, false);

    hookUpGenerateButtonEventListener();
}
// repaint scene
function repaint(turtle: Turtle) {
    console.log(scene.children);
    scene.children.forEach((eachSceneChild) => {
        console.log(eachSceneChild.userData);
        if (eachSceneChild.userData.isLSystemTree) {
            eachSceneChild.removeFromParent();
        }
    });

    const generatedMeshObject = turtle.generateMeshObject();
    generatedMeshObject.userData.isLSystemTree = true;

    scene.add(generatedMeshObject);
}
// animate
function animate() {
    renderer.setAnimationLoop(render);
}
// renderer render
function render() {
    renderer.render(scene, camera);

    controls?.update(); // Only update controls if present
    PerformanceStats.instance?.update(); // Only update stats if present
}
// resize to fullscreen
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
