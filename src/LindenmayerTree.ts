import { Euler, Mesh, Object3D, Scene, Clock } from 'three';
import Utils from './Utils';

export default class LindenmayerTree extends Object3D {
    private mesh: Mesh;
    private finalScale: number;
    private scaleSpeed: number;
    private branchUUIDs: Set<string>;

    constructor(treeMesh: Mesh, finalScale: number, branchUUIDs: Set<string> = new Set<string>()) {
        super();
        this.mesh = treeMesh;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(treeMesh);
        this.finalScale = finalScale;

        this.mesh.scale.set(0, 0, 0);

        this.scaleSpeed = this.finalScale * Utils.RandomRange(0.2, 0.7);

        this.branchUUIDs = branchUUIDs;
    }

    public render(deltaTime: number, sceneReference: Scene, sceneClock: Clock): void {
        if (this.mesh.scale.x < this.finalScale) {
            this.mesh.scale.addScalar(this.scaleSpeed * deltaTime);
        } else {
            this.mesh.scale.set(this.finalScale, this.finalScale, this.finalScale);
        }

        this.branchUUIDs.forEach((element) => {
            const obj: THREE.Object3D = sceneReference.getObjectByProperty('uuid', element);
            if (obj) {
                obj.rotation.copy(
                    new Euler(
                        Math.sin(sceneClock.getElapsedTime() * 2) * 0.002 - 0.001,
                        Math.sin(sceneClock.getElapsedTime() * 1) * 0.02 - 0.01,
                        Math.cos(sceneClock.getElapsedTime() * 1.3) * 0.003 - 0.0015,
                        'XYZ',
                    ),
                );
            }
        });
    }
}
