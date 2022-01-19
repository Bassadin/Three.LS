import { Euler, Mesh, Object3D, Scene, Clock } from 'three';
import Utils from './Utils';

export default class LindenmayerTree extends Object3D {
    private mesh: Mesh;
    private finalScale: number;
    private scaleSpeed: number;
    private branchUUIDs: Set<string>;
    private randomAnimationPeriodOffsets: number[];

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

        this.randomAnimationPeriodOffsets = [
            Utils.RandomRange(-10, 10),
            Utils.RandomRange(-10, 10),
            Utils.RandomRange(-10, 10),
        ];
    }

    public render(deltaTime: number, sceneClock: Clock): void {
        if (this.mesh.scale.x < this.finalScale) {
            this.mesh.scale.addScalar(this.scaleSpeed * deltaTime);
        } else {
            this.mesh.scale.set(this.finalScale, this.finalScale, this.finalScale);
        }

        const elapsedSceneTime = sceneClock.getElapsedTime();

        this.branchUUIDs.forEach((element) => {
            const obj: THREE.Object3D = this.mesh.getObjectByProperty('uuid', element);
            if (obj) {
                obj.rotation.copy(
                    new Euler(
                        Math.sin(elapsedSceneTime * 2 + this.randomAnimationPeriodOffsets[0]) * 0.02 - 0.01,
                        Math.sin(elapsedSceneTime * 1 + this.randomAnimationPeriodOffsets[1]) * 0.12 - 0.06,
                        Math.cos(elapsedSceneTime * 1.3 + this.randomAnimationPeriodOffsets[2]) * 0.02 - 0.01,
                        'XYZ',
                    ),
                );
            } else {
                console.log(`object with uuid ${element} not found`);
            }
        });
    }
}
