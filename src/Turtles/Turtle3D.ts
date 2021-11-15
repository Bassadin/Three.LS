import {
    Vector3,
    Quaternion,
    BufferGeometry,
    Float32BufferAttribute,
    MeshBasicMaterial,
    Mesh,
    BoxGeometry,
    Material,
    Color,
} from 'three';
import { BaseTurtle } from './BaseTurtle';

export class Turtle3D extends BaseTurtle {
    public branchingIds: Set<number> = new Set();

    addGeometryToScene(scene: THREE.Scene): void {
        console.time('Geometry creation');

        const leafCenterPositions: Vector3[] = [];

        // const material: Material = new MeshBasicMaterial();
        const boxScale = 0.2;
        const geometry: BoxGeometry = new BoxGeometry(boxScale, boxScale, boxScale);

        let meshToAddTo: Mesh = null;

        for (let i = 0; i < this.instructionString.length; i++) {
            // const tries: number[] = [];
            // const bufferGeometry: BufferGeometry = new BufferGeometry();
            //  const colorsArray: number[] = [];

            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone();

                    // this.colorIndex++;

                    this.newColors = [
                        0.45 +
                            i * ((0.4 - 0.45) / this.instructionString.length) +
                            (Math.random() * (0.1 - 0.05) + 0.05),
                        0.29 +
                            i * ((0.72 - 0.29) / this.instructionString.length) +
                            (Math.random() * (0.2 - 0.05) + 0.05),
                        0.13 +
                            i * ((0.2 - 0.13) / this.instructionString.length) +
                            (Math.random() * (0.1 - 0.05) + 0.05),
                    ];

                    const material: Material = new MeshBasicMaterial({ color: new Color(...this.newColors) });

                    this.move();
                    const currentPositionAfterMove = this.currentPosition.clone();

                    const centerPositionBetweenMovePoints: Vector3 = currentPositionAfterMove
                        .clone()
                        .lerp(currentPositionBeforeMove.clone(), 2);

                    leafCenterPositions.push(
                        currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2),
                    );

                    const boxMesh = new Mesh(geometry, material);

                    boxMesh.lookAt(currentPositionAfterMove);
                    if (meshToAddTo) {
                        boxMesh.position.copy(boxMesh.worldToLocal(centerPositionBetweenMovePoints));
                        meshToAddTo.attach(boxMesh);
                    } else {
                        scene.add(boxMesh);
                    }
                    meshToAddTo = boxMesh;

                    break;
                case 'G': //Move in current direction
                    this.move();
                    break;
                case '[':
                    this.saveState();
                    this.meshToAddToSaveStateArray.push(meshToAddTo);
                    this.branchingIds.add(meshToAddTo.id);
                    break;
                case ']':
                    this.loadState();
                    meshToAddTo = this.meshToAddToSaveStateArray.pop();
                    break;
                case '+':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), this.rotationStepSize),
                    );
                    break;
                case '-':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), this.rotationStepSize),
                    );
                    break;
                case '&':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.rotationStepSize),
                    );
                    break;
                case '∧': //Achtung, ∧ (mathematisches UND) und nicht ^ :D
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(0, -1, 0), this.rotationStepSize),
                    );
                    break;
                case '\\':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), this.rotationStepSize),
                    );
                    break;
                case '/':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), this.rotationStepSize),
                    );
                    break;
                case '|':
                    this.currentRotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI));
                    break;
                default:
                    console.log('Unknown axiom character: ' + this.instructionString.charAt(i));
                    break;
            }
        }

        let globalCenterPoint: Vector3 = new Vector3();
        leafCenterPositions.forEach((eachVector3: Vector3) => {
            globalCenterPoint.add(eachVector3);
        });
        globalCenterPoint = globalCenterPoint.divideScalar(leafCenterPositions.length);

        // mesh.applyMatrix4(new Matrix4().makeTranslation(globalCenterPoint.x, globalCenterPoint.y, globalCenterPoint.z));

        console.timeEnd('Geometry creation');
        scene.add(createPlane());
    }

    move(): void {
        const absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength);

        this.currentPosition.add(absoluteMovement);
    }
}
function createPlane(): THREE.Mesh {
    const bufferGeometry: THREE.BufferGeometry = new BufferGeometry();
    const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];
    const vertices: any[] = [];
    const tris: number[] = [];
    vertices[0] = [-5, -5, 2.5];
    vertices[1] = [5, -5, 2.5];
    vertices[2] = [5, -5, -2.5];
    vertices[3] = [-5, -5, -2.5];
    tris.push(...[...vertices[0], ...vertices[1], ...vertices[2], ...vertices[0], ...vertices[2], ...vertices[3]]);
    const colorsArray: number[] = [...newColors, ...newColors, ...newColors, ...newColors, ...newColors, ...newColors];
    bufferGeometry.setAttribute('position', new Float32BufferAttribute(tris, 3));

    bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

    const material = new MeshBasicMaterial({
        vertexColors: true,
    });

    const mesh = new Mesh(bufferGeometry, material);
    return mesh;
}
