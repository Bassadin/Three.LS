import * as THREE from 'three'
import { Vector3 } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

export class Turtle {
    instructionString: string
    stepLength: number
    rotationStepSize: number //In radians

    //Rotation
    private currentRotation: number = 0
    private rotationSaveStateArray: number[] = []

    //Position
    private currentPosition: Vector3 = new Vector3(0, -3, 0)
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

    render(scene: THREE.Scene) {
        //Set the line material
        const material = new MeshLineMaterial({
            color: 0xffffff,
            lineWidth: 0.05,
        })

        for (let i: number = 0; i < this.instructionString.length; i++) {
            let currentCharacter: string = this.instructionString.charAt(i)

            switch (currentCharacter) {
                case 'F': //Move and draw line in current direction
                    let points: Vector3[] = []
                    points.push(this.currentPosition.clone())
                    this.move()
                    points.push(this.currentPosition.clone())

                    const line = new MeshLine()
                    line.setPoints(points)
                    const mesh = new THREE.Mesh(line, material)
                    scene.add(mesh)
                    break
                case 'G': //Move in current direction
                    this.move()
                    break
                case '+': //Increase direction rotation
                    this.currentRotation += this.rotationStepSize
                    break
                case '-': //Decrease direction rotation
                    this.currentRotation -= this.rotationStepSize
                    break
                case '[': //Save state
                    this.positionSaveStateArray.push(
                        this.currentPosition.clone()
                    )
                    this.rotationSaveStateArray.push(this.currentRotation)
                    break
                case ']': //Load state
                    if (this.positionSaveStateArray.length == 0) {
                        throw new Error(
                            'Cannot load state before it has been written at least once'
                        )
                    }
                    this.currentPosition = this.positionSaveStateArray.pop()
                    this.currentRotation = this.rotationSaveStateArray.pop()
                    break
                default:
                    break
            }
        }
    }

    move() {
        let newPosition: Vector3 = this.currentPosition.clone()
        newPosition.x += Math.sin(this.currentRotation) * this.stepLength
        newPosition.y += Math.cos(this.currentRotation) * this.stepLength
        this.currentPosition = newPosition
    }
}
