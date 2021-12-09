import {BoxGeometry, Color, DoubleSide, Mesh, Quaternion, ShaderMaterial, Vector3} from "../web_modules/three.js";
import * as FragmentData from "./shaders/testShader/fragment.js";
import * as VertexData from "./shaders/testShader/vertex.js";
export default class Turtle {
  constructor(instructionString, stepLength, rotationStepSize, scale = 0.2) {
    this.currentRotation = new Quaternion();
    this.rotationSaveStateArray = [];
    this.meshToAddToSaveStateArray = [];
    this.currentPosition = new Vector3(0, -5, 0);
    this.positionSaveStateArray = [];
    this.newColors = [0.7, 0.3, 0.1];
    this.branchingIds = new Set();
    this.instructionString = instructionString;
    this.stepLength = stepLength;
    this.rotationStepSize = rotationStepSize;
    this.scale = scale;
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
  generateMeshObject() {
    console.time("Geometry creation");
    const leafCenterPositions = [];
    const geometry = new BoxGeometry(this.scale, this.scale, this.scale);
    let meshToAddTo = null;
    const generatedMesh = new Mesh();
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          const currentPositionBeforeMove = this.currentPosition.clone();
          this.newColors = [
            0.45 + i * ((0.4 - 0.45) / this.instructionString.length) + (Math.random() * (0.1 - 0.05) + 0.05),
            0.29 + i * ((0.72 - 0.29) / this.instructionString.length) + (Math.random() * (0.2 - 0.05) + 0.05),
            0.13 + i * ((0.2 - 0.13) / this.instructionString.length) + (Math.random() * (0.1 - 0.05) + 0.05)
          ];
          const material = new ShaderMaterial({
            uniforms: {
              thickness: {value: 1},
              color: {value: new Color(...this.newColors)},
              time: {value: 0}
            },
            vertexShader: VertexData.data,
            fragmentShader: FragmentData.data,
            side: DoubleSide,
            alphaToCoverage: true
          });
          this.move();
          const currentPositionAfterMove = this.currentPosition.clone();
          const centerPositionBetweenMovePoints = currentPositionAfterMove.clone().lerp(currentPositionBeforeMove.clone(), 2);
          leafCenterPositions.push(currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2));
          const boxMesh = new Mesh(geometry, material);
          if (meshToAddTo) {
            boxMesh.position.copy(boxMesh.worldToLocal(centerPositionBetweenMovePoints));
            meshToAddTo.attach(boxMesh);
          } else {
            generatedMesh.add(boxMesh);
          }
          meshToAddTo = boxMesh;
          break;
        case "G":
          this.move();
          break;
        case "[":
          this.saveState();
          this.meshToAddToSaveStateArray.push(meshToAddTo);
          this.branchingIds.add(meshToAddTo.id);
          break;
        case "]":
          this.loadState();
          meshToAddTo = this.meshToAddToSaveStateArray.pop();
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
    let globalCenterPoint = new Vector3();
    leafCenterPositions.forEach((eachVector3) => {
      globalCenterPoint.add(eachVector3);
    });
    globalCenterPoint = globalCenterPoint.divideScalar(leafCenterPositions.length);
    console.timeEnd("Geometry creation");
    return generatedMesh;
  }
  move() {
    const absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength);
    this.currentPosition.add(absoluteMovement);
  }
}
//# sourceMappingURL=Turtle.js.map
