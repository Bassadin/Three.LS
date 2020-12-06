import { Matrix3, Matrix4, Vector3, Mesh } from 'three'
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

        console.log(pointsArray)

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
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationZ(this.rotationStepSize)
                    )
                    break
                case '-':
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationZ(-this.rotationStepSize)
                    )
                    break
                case '&':
                    console.log('a &')
                    console.log(this.currentRotation)
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationY(this.rotationStepSize)
                    )
                    console.log(this.currentRotation)
                    console.log('b &')
                    break
                case '∧': //Achtung, ∧ (mathematisches UND) und nicht ^ :D
                    console.log('a ∧')
                    console.log(this.currentRotation)
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationY(-this.rotationStepSize)
                    )
                    console.log(this.currentRotation)
                    console.log('b ∧')
                    break
                case '\\':
                    console.log('a \\')
                    console.log(this.currentRotation)
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationX(this.rotationStepSize)
                    )
                    console.log(this.currentRotation)
                    console.log('b \\')
                    break
                case '/':
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationX(-this.rotationStepSize)
                    )
                    break
                case '|':
                    this.currentRotation.applyMatrix4(
                        new Matrix4().makeRotationZ(Math.PI)
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
        let absoluteMovement: Vector3 = this.currentRotation
            .clone()
            .multiplyScalar(this.stepLength)

        console.log('currentRotation', this.currentRotation)
        console.log('absoluteMovement', absoluteMovement)

        this.currentPosition.add(absoluteMovement)
    }
}
