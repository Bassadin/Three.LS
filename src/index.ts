import * as THREE from 'three';
import { Clock, Mesh, Scene, XRHitTestSource } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import Turtle from './Turtle';
import { LindenmayerFormular } from './LindenmayerFormular';
import PerformanceStats from './PerformanceStats';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { Utils } from './Utils';
import { LSystem } from './LSystem';
import { Rule } from './Rule';

export let scene: Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: TrackballControls;
const sceneClock: Clock = new Clock();

// Can we handle routes differently somehow? ~bas
const windowLocationHref: string = window.location.href;
const windowFileLocationName: string = windowLocationHref.substring(windowLocationHref.lastIndexOf('/'));

//AR Stuff
let reticle: Mesh;
let hitTestSource: XRHitTestSource = null;
let hitTestSourceRequested = false;
let isARScene = false;

switch (windowFileLocationName) {
    case '/':
        const lindenmayerSettingsForm: LindenmayerFormular = LindenmayerFormular.getInstance();
        const newTurtle: Turtle = lindenmayerSettingsForm.generateLSystemImage();

        if (scene !== undefined) {
            repaint(newTurtle);
        } else {
            initTestingScene(newTurtle);
            animate();
        }
        break;
    case '/ar.html':
        initArTestingScene();
        animate();

        break;
    default:
        console.error('Route not found');
}

function hookUpGenerateButtonEventListener() {
    const btnGenerate: HTMLInputElement = document.querySelector('#btnGenerate');
    btnGenerate.addEventListener('click', (e) => {
        e.preventDefault();
        generateAndRepaintLindenmayerMesh();
    });
}

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

function initTestingScene(turtle: Turtle) {
    isARScene = false;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2;
    camera.position.set(0, 0, 15);
    controls.update();

    scene = new THREE.Scene();

    scene.add(turtle.generateMeshObject());
    scene.add(Utils.createPlane());

    console.log(scene);

    sceneClock.start();

    renderer.render(scene, camera);

    // const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // // directionalLight.target = mesh;
    // directionalLight.position.set(0, -4, 10);
    // scene.add(directionalLight);

    const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    scene.add(light);

    window.addEventListener('resize', onWindowResize, false);

    hookUpGenerateButtonEventListener();
}

function initArTestingScene() {
    isARScene = true;

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Turtle data
    const ruleset: Rule[] = [];
    ruleset.push(new Rule('F', 'F&F+[+F/-F-F]-[-F+F+F]'));
    const lsys: LSystem = new LSystem('F', ruleset);
    for (let i = 0; i < 3; i++) lsys.generate();

    function onSelect() {
        const turtle: Turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(30));
        const turtleMesh = turtle.generateMeshObject();
        // turtleMesh.position.set(0, 0, -0.8).applyMatrix4(controller.matrixWorld);
        turtleMesh.position.setFromMatrixPosition(reticle.matrix);
        turtleMesh.scale.set(1, 1, 1);
        turtleMesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(turtleMesh);
    }

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // Add AR target reticle
    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial(),
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    renderer.render(scene, camera);

    window.addEventListener('resize', onWindowResize, false);
}

function repaint(turtle: Turtle) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        scene.remove(obj);
    }
    scene.add(turtle.generateMeshObject());
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
    if (frame && isARScene) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then(function (referenceSpace) {
                session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                    hitTestSource = source;
                });
            });

            session.addEventListener('end', function () {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];

                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
    }

    renderer.render(scene, camera);

    controls?.update(); // Only update controls if present
    PerformanceStats.instance?.update(); // Only update stats if present

    // branchingIds.forEach((eachId) => {
    //     const obj: THREE.Mesh = scene.getObjectById(eachId) as THREE.Mesh;
    //     if (obj) {
    //         const shaderMaterial: ShaderMaterial = obj.material as ShaderMaterial;
    //         shaderMaterial.uniforms.time.value += 0.01;
    //         obj.rotation.copy(
    //             new Euler(
    //                 Math.sin(sceneClock.getElapsedTime() * 2) * 0.002 - 0.001,
    //                 Math.sin(sceneClock.getElapsedTime() * 1) * 0.02 - 0.01,
    //                 Math.cos(sceneClock.getElapsedTime() * 1.3) * 0.003 - 0.0015,
    //                 'XYZ',
    //             ),
    //         );
    //     }
    // });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
