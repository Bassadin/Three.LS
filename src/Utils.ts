export class Utils {
    static degreesToRadians(radians: number): number {
        let pi: number = Math.PI
        return radians * (180 / pi)
    }
}
