import * as THREE from 'three';
import { Clock, Mesh, PlaneGeometry, Scene, ShadowMaterial, XRFrame, XRHitTestSource } from 'three';
import Turtle from './Turtle';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XREstimatedLight } from 'three/examples/jsm/webxr/XREstimatedLight.js';
import Utils from './Utils';
import LindenmayerTree from './LindenmayerTree';
import { LindenmayerFormularAR } from './LindenmayerFormularAR';

import './styles/ar.scss';

const lindenmayerSettingsForm: LindenmayerFormularAR = LindenmayerFormularAR.getInstance();

let hitTestSource: XRHitTestSource = null;
let hitTestSourceRequested = false;

let shadowPlane: Mesh;
let shadowPlaneCreated: boolean;

const sceneClock: Clock = new Clock();

export const scene: Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20,
);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    alpha: true,
    powerPreference: 'high-performance',
});

const treeObjects: LindenmayerTree[] = [];

// Add AR target reticle
const reticle: Mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial(),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;

scene.add(reticle);

// Main loop function
function main() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    document.body.appendChild(
        ARButton.createButton(renderer, {
            requiredFeatures: ['hit-test'],
            optionalFeatures: ['light-estimation', 'dom-overlay', 'dom-overlay-for-handheld-ar'],
            domOverlay: { root: document.body },
        }),
    );

    const defaultLight = new THREE.AmbientLight(0xffffff);
    scene.add(defaultLight);

    // Touch interaction with Screen
    function onSelect() {
        const turtle: Turtle = lindenmayerSettingsForm.generateLSystemImage();

        const turtleMesh = turtle.generateMeshObject();
        const currentTurtleBranchUUIDs = turtle.getBranchUUIDs();
        turtleMesh.position.setFromMatrixPosition(reticle.matrix);

        turtleMesh.rotateY(Utils.RandomRange(0.0, Math.PI * 2));
        const newTreeObject = new LindenmayerTree(turtleMesh, Utils.RandomRange(0.02, 0.035), currentTurtleBranchUUIDs);
        treeObjects.push(newTreeObject);
        scene.add(newTreeObject);
    }

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    //XR Light
    const xrLight = new XREstimatedLight(renderer);
    xrLight.directionalLight.castShadow = true;

    xrLight.addEventListener('estimationstart', () => {
        // Swap the default light out for the estimated one one we start getting some estimated values.
        scene.add(xrLight);
        scene.remove(defaultLight);
    });

    xrLight.addEventListener('estimationend', () => {
        // Swap the lights back when we stop receiving estimated values.
        scene.add(defaultLight);
        scene.remove(xrLight);
    });

    //Shadow plane
    addShadowPlaneToScene();

    window.addEventListener('resize', onWindowResize, false);
    renderer.setAnimationLoop(render);
}

function addShadowPlaneToScene() {
    const geometry = new PlaneGeometry(2000, 2000);
    geometry.rotateX(-Math.PI / 2);

    const material = new ShadowMaterial();
    material.opacity = 0.5;

    shadowPlane = new Mesh(geometry, material);
    shadowPlane.receiveShadow = true;
    shadowPlane.visible = false;
    shadowPlane.matrixAutoUpdate = false;
    scene.add(shadowPlane);
}

function render(timestamp: number, frame: XRFrame) {
    const deltaTime: number = sceneClock.getDelta();
    // Tree Rotation
    treeObjects.forEach((eachTreeObject) => {
        eachTreeObject.render(deltaTime, sceneClock);
    });

    //XR Stuff
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        //check if system hit ground
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
        // reacting of hitting ground
        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];

                reticle.visible = true;
                const pose = hit.getPose(referenceSpace);
                const poseTransformMatrix = pose.transform.matrix;
                reticle.matrix.fromArray(poseTransformMatrix);

                shadowPlane.visible = true;
                if (!shadowPlaneCreated) {
                    shadowPlane.matrix.fromArray(poseTransformMatrix);
                    shadowPlaneCreated = true;
                }

                document.querySelector('.interface__search').classList.remove('active');
                document.querySelector('.interface__buttons').classList.add('active');

                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {
                reticle.visible = false;

                document.querySelector('.interface__search').classList.add('active');
                document.querySelector('.interface__buttons').classList.remove('active');
            }
        }
    }

    renderer.render(scene, camera);
}
// resize to fullscreen
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//Start main loop
main();
