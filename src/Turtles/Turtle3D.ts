import { Matrix3, Matrix4, Vector3, Mesh, Quaternion } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { BaseTurtle } from './BaseTurtle'

export class Turtle3D extends BaseTurtle {
    render(scene: THREE.Scene): void {
        //Set the line material
        const material = new MeshLineMaterial({
            color: 0xffffff,
            lineWidth: 0.05,
        })

        const pointsArray = this.pointsArray()

        for (let i: number = 0; i < pointsArray.length; i++) {
            const line = new MeshLine()
            line.setPoints(pointsArray[i])
            const mesh = new Mesh(line, material)
            scene.add(mesh)
        }
    }

    pointsArray(): Vector3[][] {
        let points: Vector3[][] = []

        for (let i: number = 0; i < this.instructionString.length; i++) {
            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    let newPoints = []
                    newPoints.push(this.currentPosition.clone())
                    this.move()
                    newPoints.push(this.currentPosition.clone())
                    points.push(newPoints)
                    break
                case 'G': //Move in current direction
                    this.move()
                    break
                case '[': //Save state
                    this.saveState()
                    break
                case ']': //Load state
                    this.loadState()
                    break
                case '+':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 0, 1),
                            this.rotationStepSize
                        )
                    )
                    break
                case '-':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 0, -1),
                            this.rotationStepSize
                        )
                    )
                    break
                case '&':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 1, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '∧': //Achtung, ∧ (mathematisches UND) und nicht ^ :D
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, -1, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '\\':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(1, 0, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '/':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(-1, 0, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '|':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(1, 0, 0),
                            Math.PI
                        )
                    )
                    break
                default:
                    console.log(
                        'Unknown axiom character: ' +
                            this.instructionString.charAt(i)
                    )
                    break
            }
        }
        return points
    }

    move(): void {
        let absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength)

        this.currentPosition.add(absoluteMovement)
    }
}
