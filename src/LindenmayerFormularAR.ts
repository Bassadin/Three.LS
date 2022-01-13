import Turtle from './Turtle';
import { Rule } from './Rule';
import { LSystem } from './LSystem';
import Utils from './Utils';
import { scene, generateAndRepaintLindenmayerMesh } from './indexNormal';

export class LindenmayerFormularAR {
    private static instance: LindenmayerFormularAR;

    // private btnOne: HTMLInputElement;
    private presetSelect: HTMLInputElement;

    private btnOne: HTMLInputElement;
    private btnTwo: HTMLInputElement;


    public presetNumber: number = 0;


    private constructor() {
        this.btnOne = document.querySelector('#btnOne');
        this.btnTwo = document.querySelector('#btnTwo');

        this.presetSelect = document.querySelector('#preset');

        this.addListenerToBtn();
    }

    public static getInstance(): LindenmayerFormularAR {
        if (LindenmayerFormularAR.instance == undefined) LindenmayerFormularAR.instance = new LindenmayerFormularAR();
        return LindenmayerFormularAR.instance;
    }


    private addListenerToBtn(): void {
        //Download rules presets
        this.btnOne.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 0;
        });

        this.btnTwo.addEventListener('click', (e) => {
            e.stopPropagation();
            this.presetNumber = 1;
        });

        // this.presetSelect.addEventListener('change',  this.updateVal);

    }

    public updateVal(e: any): void {
        e.preventDefault();
        this.presetNumber = e.target.value;
        document.getElementById("actPreset").innerHTML = this.presetNumber.toString();
        console.log(e.target.value);
        console.log(this.presetNumber);
    }


    public generateLSystemImage(): Turtle {
        let axiom: string;
        let rule: string;
        let iterations: number;
        let degree: number;
        let colorOne: number[] = [];
        let colorTwo: number[] = [];

        // switch (+this.presetNumber) {
        //     case 0:
        //         axiom = "F";
        //         rule = "FF+[+F-∧∧∧F-F]-[-F+&&F+F]";
        //         iterations = 3
        //         colorOne = [0.0, 0.9, 0.0];
        //         colorTwo = [0.0, 0.9, 0.0];
        //         break;
        //     case 1:
        //         axiom = "F";
        //         rule = "F&F+[+F/-F-F]-[-F+F+F]";
        //         iterations = 3
        //         colorOne = [0.9, 0.0, 0.0];
        //         colorTwo = [0.9, 0.0, 0.0];
        //         break;
        //     default:
        //         axiom = "F";
        //         rule = "FF+[+F-∧∧∧F-F]-[-F+&&F+F]";
        //         iterations = 3
        //         colorOne = [0.0, 0.9, 0.0];
        //         colorTwo = [0.0, 0.9, 0.0];
        // }

        if(this.presetNumber === 0){
            axiom = "F";
            rule = "F&F+[+F/-F-F]-[-F+F+F]";
            iterations = 3;
            degree = 30;
            colorOne = [0.9, 0.0, 0.0];
            colorTwo = [0.9, 0.0, 0.0];
        }
        else if(this.presetNumber === 1){
            axiom = "F";
            rule = "FF+[+F-∧∧∧F-F]-[-F+&&F+F]";
            iterations = 3;
            degree = 25;
            colorOne = [0.0, 0.0, 0.9];
            colorTwo = [0.0, 0.9, 0.0];
        }
    
        // Turtle data
        const ruleset: Rule[] = [];
        ruleset.push(new Rule(axiom, rule));
        const lsys: LSystem = new LSystem('F', ruleset);
        for (let i = 0; i < iterations; i++) lsys.generate();


        const turtle: Turtle = new Turtle(lsys.getSentence(), 1, Utils.DegreesToRadians(degree), colorOne, colorTwo, Utils.RandomRange(0.8, 1.2), true);

        return turtle;
    }



}
