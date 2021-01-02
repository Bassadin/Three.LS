import * as THREE from "../web_modules/three.js";
import {Vector3} from "../web_modules/three.js";
import {MeshLine, MeshLineMaterial} from "../web_modules/three.meshline.js";
export class Turtle {
  constructor(instructionString, stepLength, rotationStepSize) {
    this.currentRotation = 0;
    this.rotationSaveStateArray = [];
    this.currentPosition = new Vector3(0, -4, 0);
    this.positionSaveStateArray = [];
    this.instructionString = instructionString;
    this.stepLength = stepLength;
    this.rotationStepSize = rotationStepSize;
  }
  render(scene) {
    const material = new MeshLineMaterial({
      color: 16777215,
      lineWidth: 0.05
    });
    for (let i = 0; i < this.instructionString.length; i++) {
      let currentCharacter = this.instructionString.charAt(i);
      switch (currentCharacter) {
        case "F":
          let points = [];
          points.push(this.currentPosition.clone());
          this.move();
          points.push(this.currentPosition.clone());
          const line = new MeshLine();
          line.setPoints(points);
          const mesh = new THREE.Mesh(line, material);
          scene.add(mesh);
          break;
        case "G":
          this.move();
          break;
        case "+":
          this.currentRotation += this.rotationStepSize;
          break;
        case "-":
          this.currentRotation -= this.rotationStepSize;
          break;
        case "[":
          this.positionSaveStateArray.push(this.currentPosition.clone());
          this.rotationSaveStateArray.push(this.currentRotation);
          break;
        case "]":
          if (this.positionSaveStateArray.length == 0) {
            throw new Error("Cannot load state before it has been written at least once");
          }
          this.currentPosition = this.positionSaveStateArray.pop();
          this.currentRotation = this.rotationSaveStateArray.pop();
          break;
        default:
          break;
      }
    }
  }
  move() {
    let newPosition = this.currentPosition.clone();
    newPosition.x += Math.sin(this.currentRotation) * this.stepLength;
    newPosition.y += Math.cos(this.currentRotation) * this.stepLength;
    this.currentPosition = newPosition;
  }
}
