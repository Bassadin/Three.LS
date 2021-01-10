import * as THREE from "../../web_modules/three.js";
import {MeshLine, MeshLineMaterial} from "../../web_modules/three.meshline.js";
import {BaseTurtle} from "./BaseTurtle.js";
export class Turtle2D extends BaseTurtle {
  addGeometryToScene(scene) {
    const material = new MeshLineMaterial({
      color: 16777215,
      lineWidth: 0.05
    });
    const pointsArray = this.pointsArray();
    console.log(pointsArray);
    for (let i = 0; i < pointsArray.length; i++) {
      const geometry = new THREE.Geometry();
      geometry.vertices.push(pointsArray[i][0]);
      geometry.vertices.push(pointsArray[i][1]);
      const line = new MeshLine(geometry);
      const mesh = new THREE.Mesh(line, material);
      scene.add(mesh);
    }
  }
  pointsArray() {
    let points = [];
    for (let i = 0; i < this.instructionString.length; i++) {
      switch (this.instructionString.charAt(i)) {
        case "F":
          let newPoints = [];
          newPoints.push(this.currentPosition.clone());
          this.move();
          newPoints.push(this.currentPosition.clone());
          points.push(newPoints);
          break;
        case "G":
          this.move();
          break;
        case "+":
          this.currentRotation.z -= this.rotationStepSize;
          break;
        case "-":
          this.currentRotation.z += this.rotationStepSize;
          break;
        case "[":
          this.saveState();
          break;
        case "]":
          this.loadState();
          break;
        default:
          break;
      }
    }
    return points;
  }
  move() {
    let newPosition = this.currentPosition.clone();
    newPosition.x += Math.sin(this.currentRotation.z) * this.stepLength;
    newPosition.y += Math.cos(this.currentRotation.z) * this.stepLength;
    this.currentPosition = newPosition;
  }
}
