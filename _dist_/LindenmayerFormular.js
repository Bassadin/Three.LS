import {Turtle3D} from "./Turtles/Turtle3D.js";
import {Rule} from "./Rule.js";
import {LSystem} from "./LSystem.js";
import {Utils} from "./Utils.js";
import {OBJExporter} from "../web_modules/three/examples/jsm/exporters/OBJExporter.js";
import {scene} from "./index.js";
export class LindenmayerFormular {
  constructor() {
    this.btnAdd = document.querySelector("#btnAddRule");
    this.btnRemove = document.querySelector("#btnRemoveRule");
    this.btnUpload = document.querySelector("#btnUpload");
    this.btnDownload = document.querySelector("#btnDownload");
    this.rulesWrapper = document.querySelector("#rulesWrapper");
    this.objDownloadButton = document.querySelector("#btnDownloadOBJ");
    this.fileUpload = document.querySelector("#jsonUpload");
    this.countAllRules = 1;
    this.addListenerToAddButton();
    this.addListenerToRemoveButton();
    this.addListenerToDownloadButton();
    this.addListenerToUploadButton();
    this.addListenerToOBJDownloadButton();
  }
  static getInstance() {
    if (LindenmayerFormular.instance == void 0)
      LindenmayerFormular.instance = new LindenmayerFormular();
    return LindenmayerFormular.instance;
  }
  addListenerToAddButton() {
    this.btnAdd.addEventListener("click", () => {
      this.rulesWrapper.insertAdjacentHTML("beforeend", ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' + (this.countAllRules + 1) + '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' + (this.countAllRules + 1) + '</label> <input class="interface__input-field axioms" type="text" id="axiom' + (this.countAllRules + 1) + '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' + (this.countAllRules + 1) + '</label> <input class="interface__input-field rules" type="text" id="rule' + (this.countAllRules + 1) + '"> </div> </div>');
      this.countAllRules++;
      if (this.btnRemove.disabled == true)
        this.btnRemove.disabled = false;
    });
  }
  addNewRuleField() {
    this.rulesWrapper.insertAdjacentHTML("beforeend", ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' + (this.countAllRules + 1) + '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' + (this.countAllRules + 1) + '</label> <input class="interface__input-field axioms" type="text" id="axiom' + (this.countAllRules + 1) + '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' + (this.countAllRules + 1) + '</label> <input class="interface__input-field rules" type="text" id="rule' + (this.countAllRules + 1) + '"> </div> </div>');
    this.countAllRules++;
    if (this.btnRemove.disabled == true)
      this.btnRemove.disabled = false;
  }
  addListenerToRemoveButton() {
    this.btnRemove.addEventListener("click", () => {
      this.removeRuleField();
    });
  }
  removeRuleField() {
    const allRulesLength = this.rulesWrapper.children.length;
    if (allRulesLength > 1) {
      document.querySelector("#count" + this.countAllRules).remove();
      this.countAllRules--;
    }
    if (this.countAllRules <= 1)
      this.btnRemove.disabled = true;
  }
  addListenerToDownloadButton() {
    this.btnDownload.addEventListener("click", () => {
      let Satz = document.getElementById("sentence").value;
      let Axiom1 = document.getElementById("axiom1").value;
      let Rule1 = document.getElementById("rule1").value;
      let IterationsCount = document.getElementById("countIterations").value;
      let Drehwinkel = document.getElementById("degrees").value;
      let Schrittl\u00E4nge = document.getElementById("steplength").value;
      let newObject = {
        Satz,
        Axiom1,
        Rule1,
        IterationsCount,
        Drehwinkel,
        Schrittl\u00E4nge: IterationsCount
      };
      let json_string = JSON.stringify(newObject, void 0, 2);
      let link = document.createElement("a");
      link.download = "data.json";
      let blob = new Blob([json_string], {type: "text/plain"});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }
  addListenerToUploadButton() {
    this.btnUpload.addEventListener("click", () => {
      let reader = new FileReader();
      reader.onload = (event) => {
        let obj = JSON.parse(reader.result.toString());
        document.getElementById("axiom1").value = obj.Axiom1;
        document.getElementById("rule1").value = obj.Rule1;
        document.getElementById("countIterations").value = obj.IterationsCount;
        document.getElementById("degrees").value = obj.Drehwinkel;
        document.getElementById("steplength").value = obj.Schrittl\u00E4nge;
        document.getElementById("sentence").value = obj.Satz;
      };
      reader.readAsText(this.fileUpload.files[0]);
    });
  }
  generateLSystemImage() {
    const axioms = new Array();
    const rules = new Array();
    document.querySelectorAll(".axioms").forEach((element) => {
      axioms.push(element.value.toUpperCase());
    });
    document.querySelectorAll(".rules").forEach((element) => {
      rules.push(element.value.toUpperCase());
    });
    const sentence = document.querySelector("#sentence").value.toUpperCase();
    const iterations = parseInt(document.querySelector("#countIterations").value);
    const degrees = parseInt(document.querySelector("#degrees").value);
    const steplength = parseInt(document.querySelector("#steplength").value) / 10;
    let ruleset = [];
    for (let i = 0; i < axioms.length; i++) {
      ruleset.push(new Rule(axioms[i], rules[i]));
    }
    let lsys = new LSystem(sentence, ruleset);
    console.time("L System generation");
    for (let i = 0; i < iterations; i++)
      lsys.generate();
    console.timeEnd("L System generation");
    let turtle = new Turtle3D(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees));
    return turtle;
  }
  addListenerToOBJDownloadButton() {
    this.objDownloadButton.addEventListener("click", () => {
      const exporter = new OBJExporter();
      const result = exporter.parse(scene);
      let link = document.createElement("a");
      link.download = "l_system.obj";
      let blob = new Blob([result], {type: "text/plain"});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }
}
