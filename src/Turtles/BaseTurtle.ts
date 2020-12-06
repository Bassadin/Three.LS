import * as THREE from 'three'
import { Vector3 } from 'three'

export abstract class BaseTurtle {
    protected instructionString: string
    protected stepLength: number
    protected rotationStepSize: number //In radians

    //Rotation
    protected currentRotation: Vector3 = new Vector3(0, 1, 0)
    private rotationSaveStateArray: Vector3[] = []

    //Position
    protected currentPosition: Vector3 = new Vector3(0, -5, 0)
    private positionSaveStateArray: Vector3[] = []

    constructor(
        instructionString: string,
        stepLength: number,
        rotationStepSize: number
    ) {
        this.instructionString = instructionString
        this.stepLength = stepLength
        this.rotationStepSize = rotationStepSize
    }

    abstract render(scene: THREE.Scene): void

    saveState(): void {
        this.positionSaveStateArray.push(this.currentPosition.clone())
        this.rotationSaveStateArray.push(this.currentRotation.clone())
    }

    loadState(): void {
        if (this.positionSaveStateArray.length == 0) {
            throw new Error(
                'Cannot load state before it has been written at least once'
            )
        }
        this.currentPosition = this.positionSaveStateArray.pop()
        this.currentRotation = this.rotationSaveStateArray.pop()
    }
}
