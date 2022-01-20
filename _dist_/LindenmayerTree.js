import {Euler, Object3D, Vector3} from "../web_modules/three.js";
import Utils from "./Utils.js";
export default class LindenmayerTree extends Object3D {
  constructor(treeMesh, finalScale, branchUUIDs = new Set()) {
    super();
    this.mesh = treeMesh;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.add(treeMesh);
    this.finalScale = finalScale;
    this.mesh.scale.set(0, 0, 0);
    this.scaleSpeed = this.finalScale * Utils.RandomRange(0.2, 0.7);
    this.branchUUIDs = branchUUIDs;
    this.animationPeriodOffsets = new Vector3(Utils.RandomRange(-Math.PI, Math.PI), Utils.RandomRange(-Math.PI, Math.PI), Utils.RandomRange(-Math.PI, Math.PI));
    this.animationPeriodMultiplicators = new Vector3(Utils.RandomRange(0.8, 1.2), Utils.RandomRange(0.4, 0.7), Utils.RandomRange(0.5, 1));
  }
  render(deltaTime, sceneClock) {
    if (this.mesh.scale.x < this.finalScale) {
      this.mesh.scale.addScalar(this.scaleSpeed * deltaTime);
    } else {
      this.mesh.scale.set(this.finalScale, this.finalScale, this.finalScale);
    }
    const elapsedSceneTime = sceneClock.getElapsedTime();
    this.branchUUIDs.forEach((element) => {
      const obj = this.mesh.getObjectByProperty("uuid", element);
      if (obj) {
        obj.rotation.copy(this.getEulerRotationForElapsedTime(elapsedSceneTime));
      } else {
        console.log(`object with uuid ${element} not found`);
      }
    });
  }
  getEulerRotationForElapsedTime(elapsedTime) {
    return new Euler(Math.sin(elapsedTime * this.animationPeriodMultiplicators.x + this.animationPeriodOffsets.x) * 0.02 - 0.01, Math.sin(elapsedTime * this.animationPeriodMultiplicators.y + this.animationPeriodOffsets.y) * 0.12 - 0.06, Math.sin(elapsedTime * this.animationPeriodMultiplicators.z + this.animationPeriodOffsets.z) * 0.02 - 0.01, "XYZ");
  }
}
//# sourceMappingURL=LindenmayerTree.js.map
