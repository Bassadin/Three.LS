import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BoxGeometry, Color, Mesh, MeshLambertMaterial, Quaternion, Vector3 } from 'three';
import Utils from './Utils';
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
    private colorOne: number[];
    private colorTwo: number[];

    private boxScale: number;

    private useRandomization = false;
    private randomizationDeviation = 0.25;

    constructor(
        instructionString: string,
        stepLength: number,
        rotationStepSize: number,
        colorOne: number[],
        colorTwo: number[],
        boxScale = 0.2,
        useRandomization = false,
    ) {
        this.instructionString = instructionString;
        this.stepLength = stepLength;
        this.rotationStepSize = rotationStepSize;
        this.boxScale = boxScale;
        this.useRandomization = useRandomization;
        this.colorOne = colorOne;
        this.colorTwo = colorTwo;
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

    //Indices of the objects that define a point where a savestate was made, e.g. a 'branching point'
    public branchingIds: Set<number> = new Set();

    public generateMeshObject(): Mesh {
        console.time('Geometry creation');

        const leafCenterPositions: Vector3[] = [];

        // const material: Material = new MeshBasicMaterial();
        // const boxScale = 0.2;
        const geometry: BoxGeometry = new BoxGeometry(this.boxScale, this.boxScale, this.boxScale);
        // const mergedGeometry = new THREE.Geometry();
        let meshToAddTo: Mesh = null;

        const generatedMesh: Mesh = new Mesh();
        generatedMesh.castShadow = true;
        generatedMesh.receiveShadow = true;

        for (let i = 0; i < this.instructionString.length; i++) {
            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone();

                    // console.log(this.colorOne, this.colorTwo)

                    const leafColor: Color = new Color(
                        this.colorOne[0] +
                            i * ((this.colorTwo[0] - this.colorOne[0]) / this.instructionString.length) +
                            (Math.random() * (0.1 - 0.05) + 0.05),
                        this.colorOne[1] +
                            i * ((this.colorTwo[1] - this.colorOne[1]) / this.instructionString.length) +
                            (Math.random() * (0.2 - 0.05) + 0.05),
                        this.colorOne[2] +
                            i * ((this.colorTwo[2] - this.colorOne[2]) / this.instructionString.length) +
                            (Math.random() * (0.1 - 0.05) + 0.05),
                    );

                    const material: MeshLambertMaterial = new MeshLambertMaterial({ color: leafColor });

                    this.move();
                    const currentPositionAfterMove = this.currentPosition.clone();

                    const centerPositionBetweenMovePoints: Vector3 = currentPositionAfterMove
                        .clone()
                        .lerp(currentPositionBeforeMove.clone(), 2);

                    leafCenterPositions.push(
                        currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2),
                    );

                    const boxMesh = new Mesh(geometry, material);
                    boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;

                    if (meshToAddTo) {
                        boxMesh.position.copy(boxMesh.worldToLocal(centerPositionBetweenMovePoints));

                        meshToAddTo.geometry = mergeBufferGeometries([meshToAddTo.geometry, boxMesh.geometry]);
                    }

                    meshToAddTo = boxMesh;

                    break;
                case 'G': //Move in current direction
                    this.move();
                    break;
                case '[':
                    this.saveState();
                    generatedMesh.add(meshToAddTo);
                    this.meshToAddToSaveStateArray.push(meshToAddTo);
                    this.branchingIds.add(meshToAddTo.id);
                    break;
                case ']':
                    this.loadState();
                    meshToAddTo = this.meshToAddToSaveStateArray.pop();
                    break;
                case '+':
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 0, 1));
                    break;
                case '-':
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 0, -1));
                    break;
                case '&':
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, 1, 0));
                    break;
                case '∧': //Achtung, ∧ (mathematisches UND) und nicht ^ :D
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(0, -1, 0));
                    break;
                case '\\':
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(1, 0, 0));
                    break;
                case '/':
                    this.rotateByAxisVectorWithRotationStepSize(new Vector3(-1, 0, 0));
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
        // console.log(this.meshToAddToSaveStateArray);
        // console.log(generatedMesh);
        return generatedMesh;
    }

    private move(): void {
        const randomizationFactor = this.useRandomization
            ? Utils.RandomRange(1 - this.randomizationDeviation, 1 + this.randomizationDeviation)
            : 1;

        const absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength * randomizationFactor);

        this.currentPosition.add(absoluteMovement);
    }

    private rotateByAxisVectorWithRotationStepSize(rotationAxisVector: Vector3): void {
        const randomizationFactor = this.useRandomization
            ? Utils.RandomRange(1 - this.randomizationDeviation, 1 + this.randomizationDeviation)
            : 1;

        this.currentRotation.multiply(
            new Quaternion().setFromAxisAngle(rotationAxisVector, this.rotationStepSize * randomizationFactor),
        );
    }
}
