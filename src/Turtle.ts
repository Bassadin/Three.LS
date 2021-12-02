import * as THREE from 'three';
import { BoxGeometry, Color, DoubleSide, Mesh, Quaternion, ShaderMaterial, Vector3 } from 'three';
import * as FragmentData from './shaders/testShader/fragment';
import * as VertexData from './shaders/testShader/vertex';
import { Utils } from './Utils';

export default class Turtle {
    //
    private instructionString: string;
    private stepLength: number;
    private rotationStepSize: number; //In radians

    //Rotation
    private currentRotation: Quaternion = new Quaternion();
    private rotationSaveStateArray: Quaternion[] = [];

    //MeshToAddTo
    private meshToAddToSaveStateArray: Mesh[] = [];

    //Position
    private currentPosition: Vector3 = new Vector3(0, -5, 0);
    private positionSaveStateArray: Vector3[] = [];

    //Color
    private newColors = [0.7, 0.3, 0.1];
    private colorSaveStateArray: number[] = [];

    constructor(instructionString: string, stepLength: number, rotationStepSize: number) {
        this.instructionString = instructionString;
        this.stepLength = stepLength;
        this.rotationStepSize = rotationStepSize;
    }

    private saveState(): void {
        this.positionSaveStateArray.push(this.currentPosition.clone());
        this.rotationSaveStateArray.push(this.currentRotation.clone());
    }

    private loadState(): void {
        if (this.positionSaveStateArray.length == 0) {
            throw new Error('Cannot load state before it has been written at least once');
        }
        this.currentPosition = this.positionSaveStateArray.pop();
        this.currentRotation = this.rotationSaveStateArray.pop();
    }

    public branchingIds: Set<number> = new Set();

    public generateMeshObject(): Mesh {
        console.time('Geometry creation');

        const leafCenterPositions: Vector3[] = [];

        // const material: Material = new MeshBasicMaterial();
        const boxScale = 0.2;
        const geometry: BoxGeometry = new BoxGeometry(boxScale, boxScale, boxScale);

        let meshToAddTo: Mesh = null;

        const generatedMesh: Mesh = new Mesh();

        for (let i = 0; i < this.instructionString.length; i++) {
            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone();

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

                    const material: ShaderMaterial = new ShaderMaterial({
                        uniforms: {
                            thickness: { value: 1 },
                            color: { value: new Color(...this.newColors) },
                            time: { value: 0 },
                        },
                        vertexShader: VertexData.data,
                        fragmentShader: FragmentData.data,
                        side: DoubleSide,
                        alphaToCoverage: true,
                    });

                    this.move();
                    const currentPositionAfterMove = this.currentPosition.clone();

                    const centerPositionBetweenMovePoints: Vector3 = currentPositionAfterMove
                        .clone()
                        .lerp(currentPositionBeforeMove.clone(), 2);

                    leafCenterPositions.push(
                        currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2),
                    );

                    const boxMesh = new Mesh(geometry, material);
                    // boxMesh.lookAt(currentPositionAfterMove);
                    if (meshToAddTo) {
                        // meshToAddTo.lookAt(currentPositionAfterMove);
                        boxMesh.position.copy(boxMesh.worldToLocal(centerPositionBetweenMovePoints));
                        meshToAddTo.attach(boxMesh);
                    } else {
                        generatedMesh.add(boxMesh);
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

        console.timeEnd('Geometry creation');

        return generatedMesh;
    }

    move(): void {
        const absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength);

        this.currentPosition.add(absoluteMovement);
    }
}
