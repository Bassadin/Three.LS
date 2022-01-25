import Turtle from "./Turtle.js";
import {Rule} from "./Rule.js";
import {LSystem} from "./LSystem.js";
import Utils from "./Utils.js";
import {OBJExporter} from "../web_modules/three/examples/jsm/exporters/OBJExporter.js";
import {scene, generateAndRepaintLindenmayerMesh} from "./indexNormal.js";
export class LindenmayerFormular {
  constructor() {
    this.btnAdd = document.querySelector("#btnAddRule");
    this.btnRemove = document.querySelector("#btnRemoveRule");
    this.btnUpload = document.querySelector("#btnUpload");
    this.btnDownload = document.querySelector("#btnDownload");
    this.rulesWrapper = document.querySelector("#rulesWrapper");
    this.objDownloadButton = document.querySelector("#btnDownloadOBJ");
    this.fileUpload = document.querySelector("#jsonUpload");
    this.makeSmallButton = document.querySelector("#makesmall");
    this.countAllRules = 1;
    this.addListenerToAddButton();
    this.addListenerToRemoveButton();
    this.addListenerToDownloadButton();
    this.addListenerToUploadButton();
    this.addListenerToOBJDownloadButton();
    this.makeSmall();
  }
  static getInstance() {
    if (LindenmayerFormular.instance == void 0)
      LindenmayerFormular.instance = new LindenmayerFormular();
    return LindenmayerFormular.instance;
  }
  generateLSystemImage() {
    const axioms = [];
    const rules = [];
    const colorOne = [];
    const colorTwo = [];
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
    colorOne.push(parseFloat(document.querySelector("#color-one-r").value));
    colorOne.push(parseFloat(document.querySelector("#color-one-g").value));
    colorOne.push(parseFloat(document.querySelector("#color-one-b").value));
    colorTwo.push(parseFloat(document.querySelector("#color-two-r").value));
    colorTwo.push(parseFloat(document.querySelector("#color-two-g").value));
    colorTwo.push(parseFloat(document.querySelector("#color-two-b").value));
    const ruleset = [];
    for (let i = 0; i < axioms.length; i++) {
      ruleset.push(new Rule(axioms[i], rules[i]));
    }
    const lsys = new LSystem(sentence, ruleset);
    console.time("L System generation");
    for (let i = 0; i < iterations; i++)
      lsys.generate();
    console.timeEnd("L System generation");
    const turtle = new Turtle(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees), colorOne, colorTwo);
    return turtle;
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
      const baseAxiom = document.getElementById("sentence").value;
      const ruleString = [];
      const axiomString = [];
      const colorOne = [];
      const colorTwo = [];
      for (let j = 1; j <= this.countAllRules; j++) {
        const value = j.toString();
        ruleString[j - 1] = document.getElementById("rule" + value).value;
        axiomString[j - 1] = document.getElementById("axiom" + value).value;
      }
      const iterationsCount = document.getElementById("countIterations").value;
      const turningAngle = document.getElementById("degrees").value;
      const stepLength = document.getElementById("steplength").value;
      colorOne[0] = document.getElementById("color-one-r").value;
      colorOne[1] = document.getElementById("color-one-g").value;
      colorOne[2] = document.getElementById("color-one-b").value;
      colorTwo[0] = document.getElementById("color-two-r").value;
      colorTwo[1] = document.getElementById("color-two-g").value;
      colorTwo[2] = document.getElementById("color-two-b").value;
      const newObject = {
        baseAxiom,
        replaceFrom: axiomString,
        replaceTo: ruleString,
        iterationsCount,
        turningAngle,
        stepLength,
        colorOne,
        colorTwo
      };
      const json_string = JSON.stringify(newObject, void 0, 2);
      const link = document.createElement("a");
      link.download = "data.json";
      const blob = new Blob([json_string], {type: "text/plain"});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }
  addListenerToUploadButton() {
    this.btnUpload.addEventListener("click", () => {
      const reader = new FileReader();
      reader.onload = (_event) => {
        const obj = JSON.parse(reader.result.toString());
        let moreRulesExist = true;
        for (let j = 1; moreRulesExist == true; j++) {
          const value = j.toString();
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
        document.getElementById("color-one-r").value = obj.colorOne[0];
        document.getElementById("color-one-g").value = obj.colorOne[1];
        document.getElementById("color-one-b").value = obj.colorOne[2];
        document.getElementById("color-two-r").value = obj.colorTwo[0];
        document.getElementById("color-two-g").value = obj.colorTwo[1];
        document.getElementById("color-two-b").value = obj.colorTwo[2];
        generateAndRepaintLindenmayerMesh();
      };
      const staticRuleCounter = this.countAllRules;
      for (let i = 1; i <= staticRuleCounter; i++) {
        this.removeRuleField();
      }
      if (!this.fileUpload.files[0])
        alert("Bitte Datei ausw\xE4hlen");
      else
        reader.readAsText(this.fileUpload.files[0]);
    });
  }
  addListenerToOBJDownloadButton() {
    this.objDownloadButton.addEventListener("click", () => {
      const exporter = new OBJExporter();
      const result = exporter.parse(scene);
      const link = document.createElement("a");
      link.download = "l_system.obj";
      const blob = new Blob([result], {type: "text/plain"});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }
  makeSmall() {
    this.makeSmallButton.addEventListener("click", () => {
      console.log("makesmall");
      document.querySelector(".interface__wrapper").classList.toggle("shrink");
    });
  }
}
//# sourceMappingURL=LindenmayerFormular.js.map
