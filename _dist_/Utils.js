import {BufferGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial} from "../web_modules/three.js";
export default class Utils {
  static DegreesToRadians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
  }
  static RandomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  static createPlane() {
    const bufferGeometry = new BufferGeometry();
    const newColors = [Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3, Math.random() * 0.7 + 0.3];
    const vertices = [];
    const tris = [];
    vertices[0] = [-5, -5, 2.5];
    vertices[1] = [5, -5, 2.5];
    vertices[2] = [5, -5, -2.5];
    vertices[3] = [-5, -5, -2.5];
    tris.push(...[...vertices[0], ...vertices[1], ...vertices[2], ...vertices[0], ...vertices[2], ...vertices[3]]);
    const colorsArray = [
      ...newColors,
      ...newColors,
      ...newColors,
      ...newColors,
      ...newColors,
      ...newColors
    ];
    bufferGeometry.setAttribute("position", new Float32BufferAttribute(tris, 3));
    bufferGeometry.setAttribute("color", new Float32BufferAttribute(colorsArray, 3));
    const material = new MeshBasicMaterial({
      vertexColors: true
    });
    const mesh = new Mesh(bufferGeometry, material);
    return mesh;
  }
}
//# sourceMappingURL=Utils.js.map
