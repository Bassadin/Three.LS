import * as THREE from 'three'
import { Vector3 } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { BaseTurtle } from './BaseTurtle'

export class Turtle2D extends BaseTurtle {
    render(scene: THREE.Scene): void {
        //Set the line material
        const material = new MeshLineMaterial({
            color: 0xffffff,
            lineWidth: 0.05,
        })

        const pointsArray = this.pointsArray()

        console.log(pointsArray)

        for (let i: number = 0; i < pointsArray.length; i++) {
            const geometry = new THREE.Geometry()
            geometry.vertices.push(pointsArray[i][0])
            geometry.vertices.push(pointsArray[i][1])
            const line = new MeshLine(geometry)
            const mesh = new THREE.Mesh(line, material)
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
                case '+': //Increase direction rotation
                    this.currentRotation.z -= this.rotationStepSize
                    break
                case '-': //Decrease direction rotation
                    this.currentRotation.z += this.rotationStepSize
                    break
                case '[': //Save state
                    this.saveState()
                    break
                case ']': //Load state
                    this.loadState()
                    break
                default:
                    break
            }
        }
        return points
    }

    move(): void {
        let newPosition: Vector3 = this.currentPosition.clone()
        newPosition.x += Math.sin(this.currentRotation.z) * this.stepLength
        newPosition.y += Math.cos(this.currentRotation.z) * this.stepLength
        this.currentPosition = newPosition
    }
}
