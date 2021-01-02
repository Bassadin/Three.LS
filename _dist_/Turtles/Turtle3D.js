import {
  Vector3,
  Quaternion,
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments
} from "../../web_modules/three.js";
import {BaseTurtle} from "./BaseTurtle.js";
export class Turtle3D extends BaseTurtle {
  render(scene) {
    console.time("Geometry creation");
    const material = new LineBasicMaterial({vertexColors: true});
    let lineVertices = [];
    const bufferGeometry = new BufferGeometry();
    const colorsArray = [];
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          const currentPositionBeforeMove = this.currentPosition.clone();
          let newColors = [
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5
          ];
          lineVertices.push(currentPositionBeforeMove.x, currentPositionBeforeMove.y, currentPositionBeforeMove.z);
          colorsArray.push(...newColors);
          this.move();
          const currentPositionAfterMove = this.currentPosition.clone();
          lineVertices.push(currentPositionAfterMove.x, currentPositionAfterMove.y, currentPositionAfterMove.z);
          colorsArray.push(...newColors);
          break;
        case "G":
          this.move();
          break;
        case "[":
          this.saveState();
          break;
        case "]":
          this.loadState();
          break;
        case "+":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), this.rotationStepSize));
          break;
        case "-":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), this.rotationStepSize));
          break;
        case "&":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.rotationStepSize));
          break;
        case "\u2227":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, -1, 0), this.rotationStepSize));
          break;
        case "\\":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), this.rotationStepSize));
          break;
        case "/":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), this.rotationStepSize));
          break;
        case "|":
          this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI));
          break;
        default:
          console.log("Unknown axiom character: " + this.instructionString.charAt(i));
          break;
      }
    }
    bufferGeometry.setAttribute("position", new Float32BufferAttribute(lineVertices, 3));
    bufferGeometry.setAttribute("color", new Float32BufferAttribute(colorsArray, 3));
    const line = new LineSegments(bufferGeometry, material);
    scene.add(line);
    console.timeEnd("Geometry creation");
  }
  move() {
    let absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength);
    this.currentPosition.add(absoluteMovement);
  }
}
