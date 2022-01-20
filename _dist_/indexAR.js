import * as THREE from "../web_modules/three.js";
import {Clock, Mesh, PlaneGeometry, ShadowMaterial} from "../web_modules/three.js";
import Turtle from "./Turtle.js";
import {ARButton} from "../web_modules/three/examples/jsm/webxr/ARButton.js";
import {XREstimatedLight} from "../web_modules/three/examples/jsm/webxr/XREstimatedLight.js";
import Utils from "./Utils.js";
import {LSystem} from "./LSystem.js";
import {Rule} from "./Rule.js";
import LindenmayerTree from "./LindenmayerTree.js";
import "./styles/ar.css.proxy.js";
let hitTestSource = null;
let hitTestSourceRequested = false;
let shadowPlane;
let shadowPlaneCreated;
const sceneClock = new Clock();
export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  powerPreference: "high-performance"
});
const treeObjects = [];
const reticle = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial());
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);
function main() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ["hit-test"], optionalFeatures: ["light-estimation"]}));
  const defaultLight = new THREE.AmbientLight(16777215);
  scene.add(defaultLight);
  const ruleset = [];
  ruleset.push(new Rule("F", "F&F+[+F/-F-F]-[-F+F+F]"));
  const lsys = new LSystem("F", ruleset);
  for (let i = 0; i < 3; i++)
    lsys.generate();
  function onSelect() {
    const turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(30), Utils.RandomRange(0.8, 1.2), true);
    const turtleMesh = turtle.generateMeshObject();
    turtleMesh.position.setFromMatrixPosition(reticle.matrix);
    turtleMesh.rotateY(Utils.RandomRange(0, Math.PI * 2));
    const newTreeObject = new LindenmayerTree(turtleMesh, Utils.RandomRange(0.02, 0.035));
    treeObjects.push(newTreeObject);
    scene.add(newTreeObject);
  }
  const controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);
  const xrLight = new XREstimatedLight(renderer);
  xrLight.directionalLight.castShadow = true;
  xrLight.addEventListener("estimationstart", () => {
    scene.add(xrLight);
    scene.remove(defaultLight);
  });
  xrLight.addEventListener("estimationend", () => {
    scene.add(defaultLight);
    scene.remove(xrLight);
  });
  addShadowPlaneToScene();
  window.addEventListener("resize", onWindowResize, false);
  renderer.setAnimationLoop(render);
}
function addShadowPlaneToScene() {
  const geometry = new PlaneGeometry(2e3, 2e3);
  geometry.rotateX(-Math.PI / 2);
  const material = new ShadowMaterial();
  material.opacity = 0.5;
  shadowPlane = new Mesh(geometry, material);
  shadowPlane.receiveShadow = true;
  shadowPlane.visible = false;
  shadowPlane.matrixAutoUpdate = false;
  scene.add(shadowPlane);
}
function render(timestamp, frame) {
  const deltaTime = sceneClock.getDelta();
  treeObjects.forEach((eachTreeObject) => {
    eachTreeObject.render(deltaTime);
  });
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
        const pose = hit.getPose(referenceSpace);
        const poseTransformMatrix = pose.transform.matrix;
        reticle.matrix.fromArray(poseTransformMatrix);
        shadowPlane.visible = true;
        if (!shadowPlaneCreated) {
          shadowPlane.matrix.fromArray(poseTransformMatrix);
          shadowPlaneCreated = true;
        }
      } else {
        reticle.visible = false;
      }
    }
  }
  renderer.render(scene, camera);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
main();
//# sourceMappingURL=indexAR.js.map
