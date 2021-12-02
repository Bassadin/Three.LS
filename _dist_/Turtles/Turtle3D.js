import {
  Vector3,
  Quaternion,
  Mesh,
  BoxGeometry,
  ShaderMaterial,
  DoubleSide,
  Color
} from "../../web_modules/three.js";
import {BaseTurtle} from "./BaseTurtle.js";
import * as FragmentData from "../shaders/testShader/fragment.js";
import * as VertexData from "../shaders/testShader/vertex.js";
import {Utils} from "../Utils.js";
export class Turtle3D extends BaseTurtle {
  constructor() {
    super(...arguments);
    this.branchingIds = new Set();
  }
  addGeometryToScene(scene) {
    console.time("Geometry creation");
    const leafCenterPositions = [];
    const boxScale = 0.2;
    const geometry = new BoxGeometry(boxScale, boxScale, boxScale);
    let meshToAddTo = null;
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
            scene.add(boxMesh);
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
    scene.add(Utils.createPlane());
  }
  move() {
    const absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength);
    this.currentPosition.add(absoluteMovement);
  }
}
//# sourceMappingURL=Turtle3D.js.map
