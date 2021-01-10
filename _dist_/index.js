import * as THREE from "../web_modules/three.js";
import {TrackballControls} from "../web_modules/three/examples/jsm/controls/TrackballControls.js";
import {LindenmayerFormular} from "./LindenmayerFormular.js";
import Stats from "../web_modules/stats-js.js";
var loading = false;
let btn = document.getElementById("btnDownload");
document.getElementById("file").addEventListener("change", (event) => {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
});
function onReaderLoad(event) {
  let obj;
  console.log(event.target.result);
  obj = JSON.parse(event.target.result)(document.getElementById("sentence")).value = obj.Satz(document.getElementById("axiom1")).value = obj.Axiom1(document.getElementById("rule1")).value = obj.Rule1(document.getElementById("countIterations")).value = obj.IterationsCount(document.getElementById("degrees")).value = obj.Drehwinkel(document.getElementById("steplength")).value = obj.Schrittl\u00E4nge;
  loading = false;
}
btn.addEventListener("click", () => {
  let Satz = document.getElementById("sentence").value;
  let Axiom1 = document.getElementById("axiom1").value;
  let Rule1 = document.getElementById("rule1").value;
  let IterationsCount = document.getElementById("countIterations").value;
  let Drehwinkel = document.getElementById("degrees").value;
  let Schrittl\u00E4nge = document.getElementById("steplength").value;
  var newObject = {
    Satz,
    Axiom1,
    Rule1,
    IterationsCount,
    Drehwinkel,
    Schrittl\u00E4nge: IterationsCount
  };
  var json_string = JSON.stringify(newObject, void 0, 2);
  var link = document.createElement("a");
  link.download = "data.json";
  var blob = new Blob([json_string], {type: "text/plain"});
  link.href = window.URL.createObjectURL(blob);
  link.click();
});
let stats = new Stats();
stats.showPanel(0);
stats.dom.style.removeProperty("left");
stats.dom.style.setProperty("right", "0");
document.body.appendChild(stats.dom);
let camera;
let scene;
let renderer;
let controls;
const btnGenerate = document.querySelector("#btnGenerate");
const lindenmayerFormular = LindenmayerFormular.getInstance();
let newTurtle = lindenmayerFormular.generateLSystemImage();
if (scene !== void 0) {
  repaint(newTurtle);
} else {
  init(newTurtle);
  animate();
}
btnGenerate.addEventListener("click", () => {
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
  camera.position.set(0, 0, 15);
  controls.update();
  scene = new THREE.Scene();
  turtle.render(scene);
  renderer.render(scene, camera);
  window.addEventListener("resize", onWindowResize, false);
}
function repaint(turtle) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    scene.remove(obj);
  }
  turtle.render(scene);
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
