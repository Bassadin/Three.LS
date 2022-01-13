import * as THREE from 'three';
import { Clock, Mesh, Scene, XRFrame, XRHitTestSource } from 'three';
import Turtle from './Turtle';
// import PerformanceStats from './PerformanceStats';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import Utils from './Utils';
import { LSystem } from './LSystem';
import { Rule } from './Rule';
import LindenmayerTree from './LindenmayerTree';
import { LindenmayerFormularAR } from './LindenmayerFormularAR';
// import { GUI } from 'dat.gui';



import './styles/ar.scss';

const lindenmayerSettingsForm: LindenmayerFormularAR = LindenmayerFormularAR.getInstance();


let hitTestSource: XRHitTestSource = null;
let hitTestSourceRequested = false;

const sceneClock: Clock = new Clock();

export const scene: Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20,
);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const treeObjects: LindenmayerTree[] = [];

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

    document.body.appendChild(ARButton.createButton(renderer, { 
        requiredFeatures: ['hit-test'], 
        optionalFeatures: [ 'dom-overlay', 'dom-overlay-for-handheld-ar' ],
	    domOverlay: { root: document.body } 
    }));

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    //  setupGui();


    function onSelect() {

        const turtle: Turtle = lindenmayerSettingsForm.generateLSystemImage();

        // const turtle: Turtle = new Turtle(
        //     lsys.getSentence(),
        //     1,
        //     Utils.DegreesToRadians(30),
        //     [0.1,0.1,0.1],
        //     [0.2,0.2,0.2],
        //     Utils.RandomRange(0.8, 1.2),
        //     true,
        // );

        // const turtle: Turtle = choosePreset();

        const turtleMesh = turtle.generateMeshObject();
        // turtleMesh.position.set(0, 0, -0.8).applyMatrix4(controller.matrixWorld);
        turtleMesh.position.setFromMatrixPosition(reticle.matrix);

        turtleMesh.rotateY(Utils.RandomRange(0.0, Math.PI * 2));
        const newTreeObject = new LindenmayerTree(turtleMesh, Utils.RandomRange(0.02, 0.035));
        treeObjects.push(newTreeObject);
        scene.add(newTreeObject);
    }

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    window.addEventListener('resize', onWindowResize, false);

    renderer.setAnimationLoop(render);
}

function render(timestamp: number, frame: XRFrame) {
    const deltaTime: number = sceneClock.getDelta();
    // Tree Rotation
    treeObjects.forEach((eachTreeObject) => {
        eachTreeObject.render(deltaTime);
    });

    //XR Stuff
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

    // PerformanceStats.instance?.update(); // Only update stats if present
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}




// function setupGui() {
// var settings = {
//     preset: 0,
// }
// var gui = new GUI();


// const folder = gui.addFolder('Three.LS')

// folder.add(settings, 'preset', { 1: 0, 2: 1 } );

// }

// function choosePreset(): Turtle {
//         var axiom: string;
//         var rule: string;
//         var iterations: number;
//         var colorOne: number[] = [];
//         var colorTwo: number[] = [];

//         switch () {
//             case 0:
//                 axiom = "F";
//                 rule = "F&F+[+F/-F-F]-[-F+F+F]";
//                 iterations = 3
//                 colorOne = [0.1, 0.9, 0.1];
//                 colorTwo = [0.9, 0.9, 0.9];
//                 break;
//             case 1:
//                 axiom = "F";
//                 rule = "F&F+[+F/-F-F]-[-F+F+F]";
//                 iterations = 3
//                 colorOne = [0.9, 0.1, 0.1];
//                 colorTwo = [0.1, 0.1, 0.9];
//                 break;
//         }
    
//         // Turtle data
//         const ruleset: Rule[] = [];
//         ruleset.push(new Rule(axiom, rule));
//         const lsys: LSystem = new LSystem('F', ruleset);
//         for (let i = 0; i < iterations; i++) lsys.generate();


//         const turtle: Turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(30), colorOne, colorTwo, Utils.RandomRange(0.8, 1.2), true);

//         return turtle;
// }



//Start main loop
main();
