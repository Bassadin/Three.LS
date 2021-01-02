import * as THREE from "../web_modules/three.js";
import {OrbitControls} from "../web_modules/three/examples/jsm/controls/OrbitControls.js";
import {Turtle3D} from "./Turtles/Turtle3D.js";
import {Rule} from "./Rule.js";
import {LSystem} from "./LSystem.js";
import {Utils} from "./Utils.js";
import Stats from "../web_modules/stats-js.js";
let stats = new Stats();
stats.showPanel(0);
stats.dom.style.removeProperty("left");
stats.dom.style.setProperty("right", "0");
document.body.appendChild(stats.dom);
let camera;
let scene;
let renderer;
let line;
let controls;
let clock = new THREE.Clock();
let generations = 3;
let countAllRules = 1;
const btnAdd = document.querySelector("#btnAddRule");
const btnRemove = document.querySelector("#btnRemoveRule");
const btnUpload = document.querySelector("#btnUpload");
const btnDownload = document.querySelector("#btnDownload");
const btnGenerate = document.querySelector("#btnGenerate");
btnRemove.disabled = true;
const rulesWrapper = document.querySelector("#rulesWrapper");
btnAdd.addEventListener("click", () => {
  rulesWrapper.insertAdjacentHTML("beforeend", ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' + (countAllRules + 1) + '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' + (countAllRules + 1) + '</label> <input class="interface__input-field axioms" type="text" id="axiom' + (countAllRules + 1) + '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' + (countAllRules + 1) + '</label> <input class="interface__input-field rules" type="text" id="rule' + (countAllRules + 1) + '"> </div> </div>');
  countAllRules++;
  if (btnRemove.disabled == true)
    btnRemove.disabled = false;
});
btnRemove.addEventListener("click", () => {
  const allRulesLength = rulesWrapper.children.length;
  if (allRulesLength > 1) {
    document.querySelector("#count" + countAllRules).remove();
    countAllRules--;
  }
  if (countAllRules <= 1)
    btnRemove.disabled = true;
});
btnUpload.addEventListener("click", () => {
});
btnDownload.addEventListener("click", () => {
});
btnGenerate.addEventListener("click", generateLSystemImage);
function generateLSystemImage() {
  const axioms = new Array();
  const rules = new Array();
  document.querySelectorAll(".axioms").forEach((element) => {
    axioms.push(element.value);
  });
  document.querySelectorAll(".rules").forEach((element) => {
    rules.push(element.value);
  });
  const sentence = document.querySelector("#sentence").value;
  const iterations = parseInt(document.querySelector("#countIterations").value);
  const degrees = parseInt(document.querySelector("#degrees").value);
  const steplength = parseInt(document.querySelector("#steplength").value) / 10;
  let ruleset = [];
  for (let i = 0; i < axioms.length; i++) {
    ruleset.push(new Rule(axioms[i], rules[i]));
  }
  let lsys = new LSystem(sentence, ruleset);
  console.time("L System generation");
  for (let i = 0; i < iterations; i++) {
    lsys.generate();
  }
  console.timeEnd("L System generation");
  let turtle = new Turtle3D(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees));
  if (scene !== void 0) {
    repaint(turtle);
  } else {
    init(turtle);
    animate();
  }
}
function init(turtle) {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e4);
  controls = new OrbitControls(camera, renderer.domElement);
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
generateLSystemImage();
