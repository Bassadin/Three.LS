import * as THREE from 'three';
import { Quaternion, Vector3 } from 'three';

export abstract class BaseTurtle {
    protected instructionString: string;
    protected stepLength: number;
    protected rotationStepSize: number; //In radians

    //Rotation
    protected currentRotation: Quaternion = new Quaternion();
    private rotationSaveStateArray: Quaternion[] = [];

    //Position
    protected currentPosition: Vector3 = new Vector3(0, -5, 0);
    private positionSaveStateArray: Vector3[] = [];

    //Color
    protected newColors: number[] = [0.3,0.7,0.1];
    private colorSaveStateArray: number[] = [];


    constructor(instructionString: string, stepLength: number, rotationStepSize: number) {
        this.instructionString = instructionString;
        this.stepLength = stepLength;
        this.rotationStepSize = rotationStepSize;
    }

    abstract addGeometryToScene(_scene: THREE.Scene): void;

    saveState(): void {
        this.positionSaveStateArray.push(this.currentPosition.clone());
        this.rotationSaveStateArray.push(this.currentRotation.clone());
        // this.colorSaveStateArray.push(this.newColors.push());
        console.log("save", this.newColors);
    }

    loadState(): void {
        if (this.positionSaveStateArray.length == 0) {
            throw new Error('Cannot load state before it has been written at least once');
        }
        this.currentPosition = this.positionSaveStateArray.pop();
        this.currentRotation = this.rotationSaveStateArray.pop();
        // this.newColors[0] = this.colorSaveStateArray.pop();
        console.log("load", this.newColors);

    }
}
