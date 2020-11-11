export class Utils {
    static degreesToRadians(degrees: number): number {
        let pi: number = Math.PI
        return degrees * (pi / 180)
    }
}
