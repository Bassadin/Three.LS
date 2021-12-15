import * as THREE from "../web_modules/three.js";
import {Clock} from "../web_modules/three.js";
import {TrackballControls} from "../web_modules/three/examples/jsm/controls/TrackballControls.js";
import {LindenmayerFormular} from "./LindenmayerFormular.js";
import PerformanceStats from "./PerformanceStats.js";
import Utils from "./Utils.js";
import "./styles/styles.css.proxy.js";
export let scene;
let camera;
let renderer;
let controls;
const sceneClock = new Clock();
const lindenmayerSettingsForm = LindenmayerFormular.getInstance();
const newTurtle = lindenmayerSettingsForm.generateLSystemImage();
if (scene !== void 0) {
  repaint(newTurtle);
} else {
  initTestingScene(newTurtle);
  animate();
}
function hookUpGenerateButtonEventListener() {
  const btnGenerate = document.querySelector("#btnGenerate");
  btnGenerate.addEventListener("click", (e) => {
    e.preventDefault();
    generateAndRepaintLindenmayerMesh();
  });
}
export function generateAndRepaintLindenmayerMesh() {
  const form = LindenmayerFormular.getInstance();
  const newTurtle2 = form.generateLSystemImage();
  if (scene !== void 0) {
    repaint(newTurtle2);
  } else {
    initTestingScene(newTurtle2);
    animate();
  }
}
function initTestingScene(turtle) {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e4);
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
  const light = new THREE.AmbientLight(16777215, 1);
  scene.add(light);
  window.addEventListener("resize", onWindowResize, false);
  hookUpGenerateButtonEventListener();
}
function repaint(turtle) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    scene.remove(obj);
  }
  scene.add(turtle.generateMeshObject());
}
function animate() {
  renderer.setAnimationLoop(render);
}
function render() {
  renderer.render(scene, camera);
  controls?.update();
  PerformanceStats.instance?.update();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//# sourceMappingURL=indexNormal.js.map
