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
      this.addNewRuleField();
    });
  }
  addNewRuleField() {
    this.rulesWrapper.insertAdjacentHTML("beforeend", ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' + (this.countAllRules + 1) + '"> <div class="interface__input-inner-wrapper"> <label>A' + (this.countAllRules + 1) + '</label> <input class="interface__input-field axioms" type="text" id="axiom' + (this.countAllRules + 1) + '" maxlength="1" placeholder="F" required> </div> <div class="interface__input-inner-wrapper"> <label>R' + (this.countAllRules + 1) + '</label> <input class="interface__input-field rules" type="text" id="rule' + (this.countAllRules + 1) + '" placeholder="FF+[+F-F-F]-[-F+F+F]" required> </div> </div>');
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
      let baseAxiom = document.getElementById("sentence").value;
      let ruleString = [];
      let axiomString = [];
      for (let j = 1; j <= this.countAllRules; j++) {
        let value = j.toString();
        ruleString[j - 1] = document.getElementById("rule" + value).value;
        axiomString[j - 1] = document.getElementById("axiom" + value).value;
      }
      let iterationsCount = document.getElementById("countIterations").value;
      let turningAngle = document.getElementById("degrees").value;
      let stepLength = document.getElementById("steplength").value;
      let newObject = {
        baseAxiom,
        replaceFrom: axiomString,
        replaceTo: ruleString,
        iterationsCount,
        turningAngle,
        stepLength
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
        let moreRulesExist = true;
        for (let j = 1; moreRulesExist == true; j++) {
          let value = j.toString();
          if (obj.replaceTo[j - 1] == null) {
            moreRulesExist = false;
            this.removeRuleField();
          } else {
            document.getElementById("rule" + value).value = obj.replaceTo[j - 1];
            document.getElementById("axiom" + value).value = obj.replaceFrom[j - 1];
            this.addNewRuleField();
          }
        }
        document.getElementById("countIterations").value = obj.iterationsCount;
        document.getElementById("degrees").value = obj.turningAngle;
        document.getElementById("steplength").value = obj.stepLength;
        document.getElementById("sentence").value = obj.baseAxiom;
      };
      let staticRuleCounter = this.countAllRules;
      for (let i = 1; i <= staticRuleCounter; i++) {
        this.removeRuleField();
      }
      if (!this.fileUpload.files[0])
        alert("Please select a file");
      else
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
