import { Mesh, Object3D, Vector3 } from 'three';
import Utils from './Utils';

export default class LindenmayerTree extends Object3D {
    private mesh: Mesh;
    private finalScale: number;
    private scaleSpeed: Vector3;

    constructor(treeMesh: Mesh, finalScale: number) {
        super();
        this.mesh = treeMesh;
        this.add(treeMesh);
        this.finalScale = finalScale;

        this.mesh.scale.set(0, 0, 0);

        const uniformScaleSpeed = Utils.RandomRange(0.0001, 0.0004);
        this.scaleSpeed = new Vector3(uniformScaleSpeed, uniformScaleSpeed, uniformScaleSpeed);
    }

    public render(): void {
        if (this.mesh.scale.x < this.finalScale) {
            this.mesh.scale.add(this.scaleSpeed);
        }
    }
}
