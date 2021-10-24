import {Quaternion, Vector3} from "../../web_modules/three.js";
export class BaseTurtle {
  constructor(instructionString, stepLength, rotationStepSize) {
    this.currentRotation = new Quaternion();
    this.rotationSaveStateArray = [];
    this.currentPosition = new Vector3(0, -5, 0);
    this.positionSaveStateArray = [];
    this.instructionString = instructionString;
    this.stepLength = stepLength;
    this.rotationStepSize = rotationStepSize;
  }
  saveState() {
    this.positionSaveStateArray.push(this.currentPosition.clone());
    this.rotationSaveStateArray.push(this.currentRotation.clone());
  }
  loadState() {
    if (this.positionSaveStateArray.length == 0) {
      throw new Error("Cannot load state before it has been written at least once");
    }
    this.currentPosition = this.positionSaveStateArray.pop();
    this.currentRotation = this.rotationSaveStateArray.pop();
  }
}
//# sourceMappingURL=BaseTurtle.js.map
