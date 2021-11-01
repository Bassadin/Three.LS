import { Vector3, Quaternion, BufferGeometry, Float32BufferAttribute, MeshBasicMaterial, Mesh } from 'three';
import { BaseTurtle } from './BaseTurtle';

export class Turtle3D extends BaseTurtle {
    addGeometryToScene(scene: THREE.Scene): void {
        console.time('Geometry creation');
        const tries: number[] = [];
        const bufferGeometry: BufferGeometry = new BufferGeometry();
        const colorsArray: number[] = [];
        for (let i = 0; i < this.instructionString.length; i++) {
            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone();
                    const vertices: any[] = new Array(8);
                    const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];

                    this.move();
                    const currentPositionAfterMove = this.currentPosition.clone();
                    const track: Vector3 = new Vector3(
                        currentPositionAfterMove.x - currentPositionBeforeMove.x,
                        currentPositionAfterMove.y - currentPositionBeforeMove.y,
                        currentPositionAfterMove.z - currentPositionBeforeMove.z,
                    );

                    const trackLength: number = track.length();

                    vertices[0] = [
                        currentPositionBeforeMove.x - trackLength / 2,
                        currentPositionBeforeMove.y,
                        currentPositionBeforeMove.z + trackLength / 2,
                    ];
                    vertices[1] = [
                        currentPositionBeforeMove.x + trackLength / 2,
                        currentPositionBeforeMove.y,
                        currentPositionBeforeMove.z + trackLength / 2,
                    ];
                    vertices[2] = [
                        currentPositionBeforeMove.x + trackLength / 2,
                        currentPositionBeforeMove.y,
                        currentPositionBeforeMove.z - trackLength / 2,
                    ];
                    vertices[3] = [
                        currentPositionBeforeMove.x - trackLength / 2,
                        currentPositionBeforeMove.y,
                        currentPositionBeforeMove.z - trackLength / 2,
                    ];
                    vertices[4] = [
                        currentPositionAfterMove.x - trackLength / 2,
                        currentPositionAfterMove.y,
                        currentPositionAfterMove.z + trackLength / 2,
                    ];
                    vertices[5] = [
                        currentPositionAfterMove.x + trackLength / 2,
                        currentPositionAfterMove.y,
                        currentPositionAfterMove.z + trackLength / 2,
                    ];
                    vertices[6] = [
                        currentPositionAfterMove.x + trackLength / 2,
                        currentPositionAfterMove.y,
                        currentPositionAfterMove.z - trackLength / 2,
                    ];
                    vertices[7] = [
                        currentPositionAfterMove.x - trackLength / 2,
                        currentPositionAfterMove.y,
                        currentPositionAfterMove.z - trackLength / 2,
                    ];

                    tries.push(
                        ...[
                            // front face
                            // first tri
                            ...vertices[0],
                            ...vertices[1],
                            ...vertices[5],
                            // second tri
                            ...vertices[0],
                            ...vertices[5],
                            ...vertices[4],
                            //right face
                            //first tri
                            ...vertices[1],
                            ...vertices[2],
                            ...vertices[6],
                            //second tri
                            ...vertices[1],
                            ...vertices[6],
                            ...vertices[5],
                            //left face
                            //first tri
                            ...vertices[3],
                            ...vertices[0],
                            ...vertices[4],
                            //second tri
                            ...vertices[3],
                            ...vertices[4],
                            ...vertices[7],
                            //back face
                            //first tri
                            ...vertices[2],
                            ...vertices[3],
                            ...vertices[7],
                            // second tri
                            ...vertices[2],
                            ...vertices[7],
                            ...vertices[6],
                            // bottom face
                            // first tri
                            ...vertices[3],
                            ...vertices[1],
                            ...vertices[0],
                            // second tri
                            ...vertices[3],
                            ...vertices[2],
                            ...vertices[1],
                            // top face
                            // first tri
                            ...vertices[4],
                            ...vertices[5],
                            ...vertices[7],
                            // second tri
                            ...vertices[5],
                            ...vertices[6],
                            ...vertices[7],
                        ],
                    );

                    for (let i = 0; i < vertices.length * 12; i++) {
                        colorsArray.push(...newColors);
                    }

                    break;
                case 'G': //Move in current direction
                    this.move();
                    break;
                case '[':
                    this.saveState();
                    break;
                case ']':
                    this.loadState();
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
        // console.log(tries);

        bufferGeometry.setAttribute('position', new Float32BufferAttribute(tries, 3));

        // console.log(colorsArray);

        bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

        // console.log(bufferGeometry);

        const material = new MeshBasicMaterial({
            vertexColors: true,
        });

        const mesh = new Mesh(bufferGeometry, material);
        scene.add(mesh);

        // const line = new MeshLine()
        // line.setGeometry(bufferGeometry, (p: any) => 2 + Math.sin(50 * p))
        // const material = new MeshLineMaterial({
        //     lineWidth: 0.02,
        //     dashArray: 1,
        // })
        // const mesh = new Mesh(line, material)
        // scene.add(mesh)

        console.timeEnd('Geometry creation');
    }

    move(): void {
        const absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength);

        this.currentPosition.add(absoluteMovement);
    }
}
