import { BufferGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial } from 'three';

export default class Utils {
    // Convert degrees to radians
    public static DegreesToRadians(degrees: number): number {
        const pi: number = Math.PI;
        return degrees * (pi / 180);
    }

    // Random double between min and max
    public static RandomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    // Return a basic ground plane
    public static createPlane(): THREE.Mesh {
        const bufferGeometry: THREE.BufferGeometry = new BufferGeometry();
        const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];
        const vertices: any[] = [];
        const tris: number[] = [];
        vertices[0] = [-5, -5, 2.5];
        vertices[1] = [5, -5, 2.5];
        vertices[2] = [5, -5, -2.5];
        vertices[3] = [-5, -5, -2.5];
        tris.push(...[...vertices[0], ...vertices[1], ...vertices[2], ...vertices[0], ...vertices[2], ...vertices[3]]);
        const colorsArray: number[] = [
            ...newColors,
            ...newColors,
            ...newColors,
            ...newColors,
            ...newColors,
            ...newColors,
        ];
        bufferGeometry.setAttribute('position', new Float32BufferAttribute(tris, 3));

        bufferGeometry.setAttribute('color', new Float32BufferAttribute(colorsArray, 3));

        const material = new MeshBasicMaterial({
            vertexColors: true,
        });

        const mesh = new Mesh(bufferGeometry, material);
        return mesh;
    }
}
