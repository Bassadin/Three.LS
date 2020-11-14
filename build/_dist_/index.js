import * as THREE from "../web_modules/three.js";
import {OrbitControls as OrbitControls2} from "../web_modules/three/examples/jsm/controls/OrbitControls.js";
import {Turtle as Turtle2} from "./Turtle.js";
import {Rule as Rule2} from "./Rule.js";
import {LSystem as LSystem2} from "./LSystem.js";
import {Utils as Utils2} from "./Utils.js";
let camera;
let scene;
let renderer;
let line;
let controls;
let clock = new THREE.Clock();
let generations = 3;
let ruleset = [];
ruleset.push(new Rule2("F", "FF+[+F-F-F]-[-F+F+F]"));
let lsys = new LSystem2("F", ruleset);
for (let i = 0; i < generations; i++) {
  lsys.generate();
  console.log(lsys.getSentence());
}
let turtle = new Turtle2(lsys.getSentence(), 0.2, Utils2.DegreesToRadians(25));
init();
animate();
function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e4);
  controls = new OrbitControls2(camera, renderer.domElement);
  camera.position.set(0, 0, 15);
  controls.update();
  scene = new THREE.Scene();
  turtle.render(scene);
  renderer.render(scene, camera);
  window.addEventListener("resize", onWindowResize, false);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
