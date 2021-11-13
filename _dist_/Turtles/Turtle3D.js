import {
  Vector3,
  Quaternion,
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry
} from "../../web_modules/three.js";
import {BaseTurtle} from "./BaseTurtle.js";
export class Turtle3D extends BaseTurtle {
  addGeometryToScene(scene) {
    console.time("Geometry creation");
    const leafCenterPositions = [];
    const material = new MeshBasicMaterial();
    const geometry = new BoxGeometry(1, 1, 1);
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          const currentPositionBeforeMove = this.currentPosition.clone();
          this.move();
          const currentPositionAfterMove = this.currentPosition.clone();
          const centerPositionBetweenMovePoints = currentPositionAfterMove.clone().lerp(currentPositionBeforeMove.clone(), 2);
          leafCenterPositions.push(currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2));
          const boxMesh = new Mesh(geometry, material);
          const boxScale = 0.2;
          boxMesh.scale.set(boxScale, boxScale, boxScale);
          boxMesh.position.copy(centerPositionBetweenMovePoints);
          boxMesh.lookAt(currentPositionAfterMove);
          scene.add(boxMesh);
          console.count("Number of meshes");
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
    let globalCenterPoint = new Vector3();
    leafCenterPositions.forEach((eachVector3) => {
      globalCenterPoint.add(eachVector3);
    });
    globalCenterPoint = globalCenterPoint.divideScalar(leafCenterPositions.length);
    console.timeEnd("Geometry creation");
    scene.add(createPlane());
  }
  move() {
    const absoluteMovement = new Vector3(0, 1, 0).applyQuaternion(this.currentRotation.clone()).multiplyScalar(this.stepLength);
    this.currentPosition.add(absoluteMovement);
  }
}
function createPlane() {
  const bufferGeometry = new BufferGeometry();
  const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];
  const vertices = [];
  const tris = [];
  vertices[0] = [-5, -5, 2.5];
  vertices[1] = [5, -5, 2.5];
  vertices[2] = [5, -5, -2.5];
  vertices[3] = [-5, -5, -2.5];
  tris.push(...[...vertices[0], ...vertices[1], ...vertices[2], ...vertices[0], ...vertices[2], ...vertices[3]]);
  const colorsArray = [...newColors, ...newColors, ...newColors, ...newColors, ...newColors, ...newColors];
  bufferGeometry.setAttribute("position", new Float32BufferAttribute(tris, 3));
  bufferGeometry.setAttribute("color", new Float32BufferAttribute(colorsArray, 3));
  const material = new MeshBasicMaterial({
    vertexColors: true
  });
  const mesh = new Mesh(bufferGeometry, material);
  return mesh;
}
//# sourceMappingURL=Turtle3D.js.map
