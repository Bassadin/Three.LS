import * as THREE from 'three';
import { Mesh, Scene, XRFrame, XRHitTestSource } from 'three';
import Turtle from './Turtle';
import PerformanceStats from './PerformanceStats';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import Utils from './Utils';
import { LSystem } from './LSystem';
import { Rule } from './Rule';

let hitTestSource: XRHitTestSource = null;
let hitTestSourceRequested = false;

export const scene: Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20,
);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Add AR target reticle
const reticle: Mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial(),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

function main() {
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
        const turtle: Turtle = new Turtle(
            lsys.getSentence(),
            1,
            Utils.DegreesToRadians(30),
            [0.1,0.1,0.1],
            [0.2,0.2,0.2],
            Utils.RandomRange(0.8, 1.2),
            true,
        );
        const turtleMesh = turtle.generateMeshObject();
        // turtleMesh.position.set(0, 0, -0.8).applyMatrix4(controller.matrixWorld);
        turtleMesh.position.setFromMatrixPosition(reticle.matrix);

        const randomizedScale = Utils.RandomRange(0.02, 0.035);

        turtleMesh.scale.set(randomizedScale, randomizedScale, randomizedScale);
        turtleMesh.rotateY(Utils.RandomRange(0.0, Math.PI * 2));
        scene.add(turtleMesh);
    }

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    window.addEventListener('resize', onWindowResize, false);

    renderer.setAnimationLoop(render);
}

function render(timestamp: number, frame: XRFrame) {
    if (frame) {
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

//Start main loop
main();
