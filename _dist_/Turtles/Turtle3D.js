import {Vector3, Quaternion, BufferGeometry, Float32BufferAttribute, MeshBasicMaterial, Mesh} from "../../web_modules/three.js";
import {BaseTurtle} from "./BaseTurtle.js";
export class Turtle3D extends BaseTurtle {
  addGeometryToScene(scene) {
    console.time("Geometry creation");
    const tris = [];
    const bufferGeometry = new BufferGeometry();
    const colorsArray = [];
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          const currentPositionBeforeMove = this.currentPosition.clone();
          const vertices = new Array(8);
          const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];
          this.move();
          const currentPositionAfterMove = this.currentPosition.clone();
          const track = new Vector3(currentPositionAfterMove.x - currentPositionBeforeMove.x, currentPositionAfterMove.y - currentPositionBeforeMove.y, currentPositionAfterMove.z - currentPositionBeforeMove.z);
          const trackLength = track.length() + (Math.random() * 0.08 - 0.04);
          vertices[0] = [
            currentPositionBeforeMove.x - trackLength / 2,
            currentPositionBeforeMove.y,
            currentPositionBeforeMove.z + trackLength / 2
          ];
          vertices[1] = [
            currentPositionBeforeMove.x + trackLength / 2,
            currentPositionBeforeMove.y,
            currentPositionBeforeMove.z + trackLength / 2
          ];
          vertices[2] = [
            currentPositionBeforeMove.x + trackLength / 2,
            currentPositionBeforeMove.y,
            currentPositionBeforeMove.z - trackLength / 2
          ];
          vertices[3] = [
            currentPositionBeforeMove.x - trackLength / 2,
            currentPositionBeforeMove.y,
            currentPositionBeforeMove.z - trackLength / 2
          ];
          vertices[4] = [
            currentPositionAfterMove.x - trackLength / 2,
            currentPositionAfterMove.y,
            currentPositionAfterMove.z + trackLength / 2
          ];
          vertices[5] = [
            currentPositionAfterMove.x + trackLength / 2,
            currentPositionAfterMove.y,
            currentPositionAfterMove.z + trackLength / 2
          ];
          vertices[6] = [
            currentPositionAfterMove.x + trackLength / 2,
            currentPositionAfterMove.y,
            currentPositionAfterMove.z - trackLength / 2
          ];
          vertices[7] = [
            currentPositionAfterMove.x - trackLength / 2,
            currentPositionAfterMove.y,
            currentPositionAfterMove.z - trackLength / 2
          ];
          tris.push(...[
            ...vertices[0],
            ...vertices[1],
            ...vertices[5],
            ...vertices[0],
            ...vertices[5],
            ...vertices[4],
            ...vertices[1],
            ...vertices[2],
            ...vertices[6],
            ...vertices[1],
            ...vertices[6],
            ...vertices[5],
            ...vertices[3],
            ...vertices[0],
            ...vertices[4],
            ...vertices[3],
            ...vertices[4],
            ...vertices[7],
            ...vertices[2],
            ...vertices[3],
            ...vertices[7],
            ...vertices[2],
            ...vertices[7],
            ...vertices[6],
            ...vertices[3],
            ...vertices[1],
            ...vertices[0],
            ...vertices[3],
            ...vertices[2],
            ...vertices[1],
            ...vertices[4],
            ...vertices[5],
            ...vertices[7],
            ...vertices[5],
            ...vertices[6],
            ...vertices[7]
          ]);
          for (let i2 = 0; i2 < vertices.length * 12; i2++) {
            colorsArray.push(...newColors);
          }
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
    bufferGeometry.setAttribute("position", new Float32BufferAttribute(tris, 3));
    bufferGeometry.setAttribute("color", new Float32BufferAttribute(colorsArray, 3));
    const material = new MeshBasicMaterial({
      vertexColors: true
    });
    const mesh = new Mesh(bufferGeometry, material);
    scene.add(mesh);
    console.timeEnd("Geometry creation");
  }
  move() {
    const absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength);
    this.currentPosition.add(absoluteMovement);
  }
}
//# sourceMappingURL=Turtle3D.js.map
