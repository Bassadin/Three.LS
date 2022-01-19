import {mergeBufferGeometries} from "../web_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import {BoxGeometry, Color, Mesh, MeshLambertMaterial, Quaternion, Vector3} from "../web_modules/three.js";
import Utils from "./Utils.js";
export default class Turtle {
  constructor(instructionString, stepLength, rotationStepSize, boxScale = 1, useRandomization = false) {
    this.currentRotation = new Quaternion();
    this.rotationSaveStateArray = [];
    this.meshToAddToSaveStateArray = [];
    this.currentPosition = new Vector3(0, -5, 0);
    this.positionSaveStateArray = [];
    this.useRandomization = false;
    this.randomizationDeviation = 0.25;
    this.branchingIds = new Set();
    this.instructionString = instructionString;
    this.stepLength = stepLength;
    this.rotationStepSize = rotationStepSize;
    this.boxScale = boxScale;
    this.useRandomization = useRandomization;
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
    const geometry = new BoxGeometry(this.boxScale, this.boxScale, this.boxScale);
    let meshToAddTo = null;
    const generatedMesh = new Mesh();
    generatedMesh.castShadow = true;
    generatedMesh.receiveShadow = true;
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          const currentPositionBeforeMove = this.currentPosition.clone();
          const leafColor = new Color(0.45 + i * ((0.4 - 0.45) / this.instructionString.length) + (Math.random() * (0.1 - 0.05) + 0.05), 0.29 + i * ((0.72 - 0.29) / this.instructionString.length) + (Math.random() * (0.2 - 0.05) + 0.05), 0.13 + i * ((0.2 - 0.13) / this.instructionString.length) + (Math.random() * (0.1 - 0.05) + 0.05));
          const material = new MeshLambertMaterial({color: leafColor});
          this.move();
          const currentPositionAfterMove = this.currentPosition.clone();
          const centerPositionBetweenMovePoints = currentPositionAfterMove.clone().lerp(currentPositionBeforeMove.clone(), 2);
          leafCenterPositions.push(currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2));
          const boxMesh = new Mesh(geometry, material);
          boxMesh.castShadow = true;
          boxMesh.receiveShadow = true;
          if (meshToAddTo) {
            boxMesh.position.copy(boxMesh.worldToLocal(centerPositionBetweenMovePoints));
            meshToAddTo.geometry = mergeBufferGeometries([meshToAddTo.geometry, boxMesh.geometry]);
          }
          meshToAddTo = boxMesh;
          break;
        case "G":
          this.move();
          break;
        case "[":
          this.saveState();
          generatedMesh.add(meshToAddTo);
          this.meshToAddToSaveStateArray.push(meshToAddTo);
          this.branchingIds.add(meshToAddTo.id);
          break;
        case "]":
          this.loadState();
          meshToAddTo = this.meshToAddToSaveStateArray.pop();
          break;
        case "+":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 0, 1));
          break;
        case "-":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 0, -1));
          break;
        case "&":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 1, 0));
          break;
        case "\u2227":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, -1, 0));
          break;
        case "\\":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(1, 0, 0));
          break;
        case "/":
          this.rotateByAxisVectorWithRotationStepSize(new Vector3(-1, 0, 0));
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
    const randomizationFactor = this.useRandomization ? Utils.RandomRange(1 - this.randomizationDeviation, 1 + this.randomizationDeviation) : 1;
    const absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength * randomizationFactor);
    this.currentPosition.add(absoluteMovement);
  }
  rotateByAxisVectorWithRotationStepSize(rotationAxisVector) {
    const randomizationFactor = this.useRandomization ? Utils.RandomRange(1 - this.randomizationDeviation, 1 + this.randomizationDeviation) : 1;
    this.currentRotation.multiply(new Quaternion().setFromAxisAngle(rotationAxisVector, this.rotationStepSize * randomizationFactor));
  }
}
//# sourceMappingURL=Turtle.js.map
