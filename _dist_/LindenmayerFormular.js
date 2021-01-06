import {Turtle3D} from "./Turtles/Turtle3D.js";
import {Rule} from "./Rule.js";
import {LSystem} from "./LSystem.js";
import {Utils} from "./Utils.js";
export class LindenmayerFormular {
  constructor() {
    this.btnAdd = document.querySelector("#btnAddRule");
    this.btnRemove = document.querySelector("#btnRemoveRule");
    this.btnUpload = document.querySelector("#btnUpload");
    this.btnDownload = document.querySelector("#btnDownload");
    this.rulesWrapper = document.querySelector("#rulesWrapper");
    this.countAllRules = 1;
    this.addListenerToAddButton();
    this.addListenerToRemoveButton();
    this.addListenerToDownloadButton();
    this.addListenerToUploadButton();
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
  addListenerToRemoveButton() {
    this.btnRemove.addEventListener("click", () => {
      const allRulesLength = this.rulesWrapper.children.length;
      if (allRulesLength > 1) {
        document.querySelector("#count" + this.countAllRules).remove();
        this.countAllRules--;
      }
      if (this.countAllRules <= 1)
        this.btnRemove.disabled = true;
    });
  }
  addListenerToDownloadButton() {
    this.btnDownload.addEventListener("click", () => {
    });
  }
  addListenerToUploadButton() {
    this.btnUpload.addEventListener("click", () => {
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
}
