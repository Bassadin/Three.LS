import * as THREE from 'three';
import { Renderer, Scene } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { Turtle3D } from './Turtles/Turtle3D';
import { LindenmayerFormular } from './LindenmayerFormular';
import PerformanceStats from './PerformanceStats';

export let scene: Scene;
let camera: THREE.PerspectiveCamera;
let renderer: Renderer;
let controls: TrackballControls;


const lindenmayerSettingsForm: LindenmayerFormular = LindenmayerFormular.getInstance();

const newTurtle: Turtle3D = lindenmayerSettingsForm.generateLSystemImage();

if (scene !== undefined) {
    repaint(newTurtle);
} else {
    initTestingScene(newTurtle);
    animate();
}

function hookUpGenerateButtonEventListener() {
    const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate');
    btnGenerate.addEventListener('click', (e) => {
        e.preventDefault();
        const newTurtle: Turtle3D = lindenmayerSettingsForm.generateLSystemImage();

        if (scene !== undefined) {
            repaint(newTurtle);
        } else {
            initTestingScene(newTurtle);
            animate();
        }
    });
}

function initTestingScene(turtle: Turtle3D) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2;
    camera.position.set(0, 0, 15);
    controls.update();

    scene = new THREE.Scene();

    turtle.addGeometryToScene(scene);

    renderer.render(scene, camera);

    window.addEventListener('resize', onWindowResize, false);

    hookUpGenerateButtonEventListener();
}

function repaint(turtle: Turtle3D) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        scene.remove(obj);
    }
    turtle.addGeometryToScene(scene);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    renderer.render(scene, camera);

    //Performance Stats
    PerformanceStats.instance.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
