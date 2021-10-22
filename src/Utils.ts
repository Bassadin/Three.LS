export class Utils {
    static DegreesToRadians(degrees: number): number {
        const pi: number = Math.PI;
        return degrees * (pi / 180);
    }

    static RandomNumber(min: number, max: number): number {
        return Math.random() * (+max - +min) + +min;
    }
}
