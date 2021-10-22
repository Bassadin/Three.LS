export class Utils {
  static DegreesToRadians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
  }
  static RandomNumber(min, max) {
    return Math.random() * (+max - +min) + +min;
  }
}
