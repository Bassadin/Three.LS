import { Mesh } from 'three';
import { LSystem } from './LSystem';

export class Turtle extends Mesh {
    private lsystem: LSystem;
    private turtle: Turtle;

    constructor(lsystem: LSystem, turtle: Turtle) {
        super();
    }
}
