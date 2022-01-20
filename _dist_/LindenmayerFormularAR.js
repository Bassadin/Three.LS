import Turtle from "./Turtle.js";
import {Rule} from "./Rule.js";
import {LSystem} from "./LSystem.js";
import Utils from "./Utils.js";
export class LindenmayerFormularAR {
  constructor() {
    this.presetNumber = 0;
    this.btnOne = document.querySelector("#btnOne");
    this.btnTwo = document.querySelector("#btnTwo");
    this.btnThree = document.querySelector("#btnThree");
    this.btnFour = document.querySelector("#btnFour");
    this.addListenerToBtn();
  }
  static getInstance() {
    if (LindenmayerFormularAR.instance == void 0)
      LindenmayerFormularAR.instance = new LindenmayerFormularAR();
    return LindenmayerFormularAR.instance;
  }
  addListenerToBtn() {
    this.btnOne.addEventListener("click", (e) => {
      e.stopPropagation();
      this.presetNumber = 0;
      document.getElementById("actPreset").innerHTML = this.presetNumber.toString();
    });
    this.btnTwo.addEventListener("click", (e) => {
      e.stopPropagation();
      this.presetNumber = 1;
      document.getElementById("actPreset").innerHTML = this.presetNumber.toString();
    });
    this.btnThree.addEventListener("click", (e) => {
      e.stopPropagation();
      this.presetNumber = 2;
      document.getElementById("actPreset").innerHTML = this.presetNumber.toString();
    });
    this.btnFour.addEventListener("click", (e) => {
      e.stopPropagation();
      this.presetNumber = 3;
      document.getElementById("actPreset").innerHTML = this.presetNumber.toString();
    });
  }
  generateLSystemImage() {
    let axiom;
    let rule;
    let iterations;
    let degree;
    let colorOne = [];
    let colorTwo = [];
    if (this.presetNumber === 0) {
      axiom = "F";
      rule = "F&F+[+F/-F-F]-[-F+F+F]";
      iterations = 3;
      degree = 50;
      colorOne = [0.45, 0.29, 0.13];
      colorTwo = [0.4, 0.72, 0.02];
    } else if (this.presetNumber === 1) {
      axiom = "F";
      rule = "FF+[+F-\u2227\u2227\u2227F-F]-[-F+&&F+F]";
      iterations = 3;
      degree = 25;
      colorOne = [0.1, 0, 0.4];
      colorTwo = [0, 0, 0.9];
    } else if (this.presetNumber === 2) {
      axiom = "F";
      rule = "F[+F/F]\u2227";
      iterations = 7;
      degree = 25;
      colorOne = [0.9, 0, 0];
      colorTwo = [0.45, 0.29, 0.13];
    } else if (this.presetNumber === 3) {
      axiom = "F";
      rule = "FF+[+F-/F-F]-[-F+&&F+F]";
      iterations = 3;
      degree = 25;
      colorOne = [0.9, 0, 0];
      colorTwo = [0, 0.9, 0.9];
    }
    const ruleset = [];
    ruleset.push(new Rule(axiom, rule));
    const lsys = new LSystem("F", ruleset);
    for (let i = 0; i < iterations; i++)
      lsys.generate();
    const turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(degree), colorOne, colorTwo, Utils.RandomRange(0.8, 1.2), true);
    return turtle;
  }
}
//# sourceMappingURL=LindenmayerFormularAR.js.map
