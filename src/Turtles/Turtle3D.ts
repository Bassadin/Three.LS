import { Vector3, Quaternion, BufferGeometry, Float32BufferAttribute, MeshBasicMaterial, Mesh, Matrix4 } from 'three';
import { BaseTurtle } from './BaseTurtle';

export class Turtle3D extends BaseTurtle {
    addGeometryToScene(scene: THREE.Scene): Mesh {
        console.time('Geometry creation');
        const tris: number[] = [];
        const bufferGeometry: BufferGeometry = new BufferGeometry();
        const colorsArray: number[] = [];
        const leafCenterPositions: Vector3[] = [];
        for (let i = 0; i < this.instructionString.length; i++) {
            const tries: number[] = [];
            const bufferGeometry: BufferGeometry = new BufferGeometry();
            const colorsArray: number[] = [];

            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone();
                    const vertices: any[] = new Array(8);
                    this.newColors = [
                        (this.colorIndex / this.instructionString.length) * 0.2 +
                            this.colorIndex / 100 +
                            (Math.random() * (0.2 - 0.05) + 0.05),
                        (this.colorIndex / this.instructionString.length) * 30 * 0.8 +
                            this.colorIndex / 100 +
                            (Math.random() * (0.2 - 0.05) + 0.05),
                        (this.colorIndex / this.instructionString.length) * 50 * 0.1 +
                            this.colorIndex / 100 +
                            (Math.random() * (0.1 - 0.05) + 0.05),
                    ];
                    // console.log("Farbe:", this.newColors)
                    this.colorIndex++;

                    this.move();
                    const currentPositionAfterMove = this.currentPosition.clone();

                    leafCenterPositions.push(
                        currentPositionAfterMove.clone().sub(currentPositionBeforeMove.clone()).divideScalar(2),
                    );

                    const track: Vector3 = new Vector3(
                        currentPositionAfterMove.x - currentPositionBeforeMove.x,
                        currentPositionAfterMove.y - currentPositionBeforeMove.y,
                        currentPositionAfterMove.z - currentPositionBeforeMove.z,
                    );

                    const trackLength: number = track.length() + (Math.random() * 0.08 - 0.04);

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

                    tris.push(
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

                    for (let j = 0; j < vertices.length * 12; j++) {
                        colorsArray.push(...this.newColors);
                    }

                    bufferGeometry.setAttribute('position', new Float32BufferAttribute(tries, 3));

                    // console.log(colorsArray);

                    bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

                    // console.log(bufferGeometry);

                    const material = new MeshBasicMaterial({
                        vertexColors: true,
                    });

                    const mesh = new Mesh(bufferGeometry, material);

                    setTimeout(
                        function (scene, mesh) {
                            scene.add(mesh);
                        },
                        500,
                        scene,
                        mesh,
                    );

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
                    // this.newColors = [0.3/(0.1/i),0.7,0.1];
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), this.rotationStepSize),
                    );
                    break;
                case '-':
                    // this.newColors = [0.3/(0.1*i),0.7,0.1];
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
                    // this.newColors = [0.3/(0.1*i),0.5,0.1];
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

        bufferGeometry.setAttribute('position', new Float32BufferAttribute(tris, 3));
        bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

        const material = new MeshBasicMaterial({
            vertexColors: true,
        });

        let centerPoint: Vector3 = new Vector3();
        leafCenterPositions.forEach((eachVector3: Vector3) => {
            centerPoint.add(eachVector3);
        });
        centerPoint = centerPoint.divideScalar(leafCenterPositions.length);

        const mesh = new Mesh(bufferGeometry, material);
        mesh.applyMatrix4(new Matrix4().makeTranslation(centerPoint.x, centerPoint.y, centerPoint.z));
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
        scene.add(createPlane());
        return mesh;
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

    // console.log(colorsArray);

    bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

    // console.log(bufferGeometry);

    const material = new MeshBasicMaterial({
        vertexColors: true,
    });

    const mesh = new Mesh(bufferGeometry, material);
    return mesh;
}
