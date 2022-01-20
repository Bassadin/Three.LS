import { Mesh, Object3D } from 'three';
import Utils from './Utils';

export default class LindenmayerTree extends Object3D {
    private mesh: Mesh;
    private finalScale: number;
    private scaleSpeed: number;

    constructor(treeMesh: Mesh, finalScale: number) {
        super();
        this.mesh = treeMesh;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(treeMesh);
        this.finalScale = finalScale;

        this.mesh.scale.set(0, 0, 0);

        this.scaleSpeed = this.finalScale * Utils.RandomRange(0.2, 0.7);
    }

    public render(deltaTime: number): void {
        if (this.mesh.scale.x < this.finalScale) {
            this.mesh.scale.addScalar(this.scaleSpeed * deltaTime);
        } else {
            this.mesh.scale.set(this.finalScale, this.finalScale, this.finalScale);
        }
    }
}
