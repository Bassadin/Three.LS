import * as THREE from "../web_modules/three.js";
import {TrackballControls} from "../web_modules/three/examples/jsm/controls/TrackballControls.js";
import {LindenmayerFormular} from "./LindenmayerFormular.js";
import Stats from "../web_modules/stats-js.js";
let stats = new Stats();
stats.showPanel(0);
stats.dom.style.removeProperty("left");
stats.dom.style.setProperty("right", "0");
document.body.appendChild(stats.dom);
export let scene;
let camera;
let renderer;
let controls;
const lindenmayerFormular = LindenmayerFormular.getInstance();
let newTurtle = lindenmayerFormular.generateLSystemImage();
if (scene !== void 0) {
  repaint(newTurtle);
} else {
  init(newTurtle);
  animate();
}
const btnGenerate = document.querySelector("#btnGenerate");
btnGenerate.addEventListener("click", (e) => {
  e.preventDefault();
  let newTurtle2 = lindenmayerFormular.generateLSystemImage();
  if (scene !== void 0) {
    repaint(newTurtle2);
  } else {
    init(newTurtle2);
    animate();
  }
});
function init(turtle) {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e4);
  controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 2;
  camera.position.set(0, 0, 15);
  controls.update();
  scene = new THREE.Scene();
  turtle.addGeometryToScene(scene);
  renderer.render(scene, camera);
  window.addEventListener("resize", onWindowResize, false);
}
function repaint(turtle) {
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
  stats.update();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
