import {Object3D} from "../web_modules/three.js";
import Utils from "./Utils.js";
export default class LindenmayerTree extends Object3D {
  constructor(treeMesh, finalScale) {
    super();
    this.mesh = treeMesh;
    this.add(treeMesh);
    this.finalScale = finalScale;
    this.mesh.scale.set(0, 0, 0);
    this.scaleSpeed = this.finalScale * Utils.RandomRange(0.2, 0.7);
  }
  render(deltaTime) {
    if (this.mesh.scale.x < this.finalScale) {
      this.mesh.scale.addScalar(this.scaleSpeed * deltaTime);
    } else {
      this.mesh.scale.set(this.finalScale, this.finalScale, this.finalScale);
    }
  }
}
//# sourceMappingURL=LindenmayerTree.js.map
