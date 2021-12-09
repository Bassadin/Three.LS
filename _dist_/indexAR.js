import * as THREE from "../web_modules/three.js";
import Turtle from "./Turtle.js";
import PerformanceStats from "./PerformanceStats.js";
import {ARButton} from "../web_modules/three/examples/jsm/webxr/ARButton.js";
import Utils from "./Utils.js";
import {LSystem} from "./LSystem.js";
import {Rule} from "./Rule.js";
let hitTestSource = null;
let hitTestSourceRequested = false;
export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
const reticle = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial());
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);
function main() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ["hit-test"]}));
  const light = new THREE.HemisphereLight(16777215, 12303359, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
  const ruleset = [];
  ruleset.push(new Rule("F", "F&F+[+F/-F-F]-[-F+F+F]"));
  const lsys = new LSystem("F", ruleset);
  for (let i = 0; i < 3; i++)
    lsys.generate();
  function onSelect() {
    const turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(30), Utils.RandomRange(0.8, 1.2), true);
    const turtleMesh = turtle.generateMeshObject();
    turtleMesh.position.setFromMatrixPosition(reticle.matrix);
    const randomizedScale = Utils.RandomRange(0.02, 0.035);
    turtleMesh.scale.set(randomizedScale, randomizedScale, randomizedScale);
    turtleMesh.rotateY(Utils.RandomRange(0, Math.PI * 2));
    scene.add(turtleMesh);
  }
  const controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);
  window.addEventListener("resize", onWindowResize, false);
  renderer.setAnimationLoop(render);
}
function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function(referenceSpace2) {
        session.requestHitTestSource({space: referenceSpace2}).then(function(source) {
          hitTestSource = source;
        });
      });
      session.addEventListener("end", function() {
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
  PerformanceStats.instance?.update();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
main();
//# sourceMappingURL=indexAR.js.map
