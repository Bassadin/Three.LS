import Turtle from './Turtle';
import { Rule } from './Rule';
import { LSystem } from './LSystem';
import Utils from './Utils';

export class LindenmayerFormularAR {
    private static instance: LindenmayerFormularAR;
    public presetNumber = 0;

    // private btnOne: HTMLInputElement;
    private btnOne: HTMLInputElement;
    private btnTwo: HTMLInputElement;
    private btnThree: HTMLInputElement;
    private btnFour: HTMLInputElement;

    private constructor() {
        this.btnOne = document.querySelector('#btnOne');
        this.btnTwo = document.querySelector('#btnTwo');
        this.btnThree = document.querySelector('#btnThree');
        this.btnFour = document.querySelector('#btnFour');

        this.addListenerToBtn();
    }

    public static getInstance(): LindenmayerFormularAR {
        if (LindenmayerFormularAR.instance == undefined) LindenmayerFormularAR.instance = new LindenmayerFormularAR();
        return LindenmayerFormularAR.instance;
    }

    public generateLSystemImage(): Turtle {
        let axiom: string;
        let rule: string;
        let iterations: number;
        let degree: number;
        let colorOne: number[] = [];
        let colorTwo: number[] = [];

        if (this.presetNumber === 0) {
            axiom = 'F';
            rule = 'F&F+[+F/-F-F]-[-F+F+F]';
            iterations = 3;
            degree = 50;
            colorOne = [0.45, 0.29, 0.13];
            colorTwo = [0.4, 0.72, 0.02];
        } else if (this.presetNumber === 1) {
            axiom = 'F';
            rule = 'FF+[+F-∧∧∧F-F]-[-F+&&F+F]';
            iterations = 3;
            degree = 25;
            colorOne = [0.1, 0.0, 0.4];
            colorTwo = [0.0, 0.0, 0.9];
        } else if (this.presetNumber === 2) {
            axiom = 'F';
            rule = 'F[+F/F]∧';
            iterations = 7;
            degree = 25;
            colorOne = [0.9, 0.0, 0.0];
            colorTwo = [0.45, 0.29, 0.13];
        } else if (this.presetNumber === 3) {
            axiom = 'F';
            rule = 'FF+[+F-/F-F]-[-F+&&F+F]';
            iterations = 3;
            degree = 25;
            colorOne = [0.9, 0.0, 0.0];
            colorTwo = [0.0, 0.9, 0.9];
        }

        // Turtle data
        const ruleset: Rule[] = [];
        ruleset.push(new Rule(axiom, rule));
        const lsys: LSystem = new LSystem('F', ruleset);
        for (let i = 0; i < iterations; i++) lsys.generate();

        const turtle: Turtle = new Turtle(
            lsys.getSentence(),
            1,
            Utils.DegreesToRadians(degree),
            colorOne,
            colorTwo,
            Utils.RandomRange(0.8, 1.2),
            true,
        );

        return turtle;
    }

    private addListenerToBtn(): void {
        this.btnOne.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 0;
            document.getElementById('actPreset').innerHTML = this.presetNumber.toString();
        });

        this.btnTwo.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 1;
            document.getElementById('actPreset').innerHTML = this.presetNumber.toString();
        });

        this.btnThree.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 2;
            document.getElementById('actPreset').innerHTML = this.presetNumber.toString();
        });

        this.btnFour.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 3;
            document.getElementById('actPreset').innerHTML = this.presetNumber.toString();
        });
    }
}
