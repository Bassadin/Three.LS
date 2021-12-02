import * as THREE from "../web_modules/three.js";
import {Clock} from "../web_modules/three.js";
import {TrackballControls} from "../web_modules/three/examples/jsm/controls/TrackballControls.js";
import {LindenmayerFormular} from "./LindenmayerFormular.js";
import PerformanceStats from "./PerformanceStats.js";
import {ARButton} from "../web_modules/three/examples/jsm/webxr/ARButton.js";
import {Utils} from "./Utils.js";
export let scene;
let camera;
let renderer;
let controls;
const sceneClock = new Clock();
let branchingIds = new Set();
const windowLocationHref = window.location.href;
const windowFileLocationName = windowLocationHref.substring(windowLocationHref.lastIndexOf("/"));
switch (windowFileLocationName) {
  case "/":
    const lindenmayerSettingsForm = LindenmayerFormular.getInstance();
    const newTurtle = lindenmayerSettingsForm.generateLSystemImage();
    if (scene !== void 0) {
      repaint(newTurtle);
    } else {
      initTestingScene(newTurtle);
      animate();
    }
    break;
  case "/ar.html":
    initArTestingScene();
    animate();
    break;
  default:
    console.error("Route not found");
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
  const newTurtle = form.generateLSystemImage();
  if (scene !== void 0) {
    repaint(newTurtle);
  } else {
    initTestingScene(newTurtle);
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
function initArTestingScene() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(ARButton.createButton(renderer));
  const light = new THREE.HemisphereLight(16777215, 12303359, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);
  function onSelect() {
    const material = new THREE.MeshPhongMaterial({color: 16777215 * Math.random()});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);
  }
  const controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);
  renderer.render(scene, camera);
  window.addEventListener("resize", onWindowResize, false);
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
//# sourceMappingURL=index.js.map
