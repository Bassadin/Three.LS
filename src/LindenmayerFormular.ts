import { Turtle3D } from './Turtles/Turtle3D';
import { Rule } from './Rule';
import { LSystem } from './LSystem';
import { Utils } from './Utils';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { scene } from './index';

export class LindenmayerFormular {
    private static instance: LindenmayerFormular;

    private btnAdd: HTMLInputElement;
    private btnRemove: HTMLInputElement;
    private btnUpload: HTMLInputElement;
    private btnDownload: HTMLInputElement;
    private objDownloadButton: HTMLInputElement;
    private fileUpload: HTMLInputElement;

    private rulesWrapper: HTMLDivElement;

    private countAllRules: number;

    private constructor() {
        this.btnAdd = document.querySelector('#btnAddRule');
        this.btnRemove = document.querySelector('#btnRemoveRule');
        this.btnUpload = document.querySelector('#btnUpload');
        this.btnDownload = document.querySelector('#btnDownload');
        this.rulesWrapper = document.querySelector('#rulesWrapper');
        this.objDownloadButton = document.querySelector('#btnDownloadOBJ');
        this.fileUpload = document.querySelector('#jsonUpload');

        this.countAllRules = 1;

        this.addListenerToAddButton();
        this.addListenerToRemoveButton();
        this.addListenerToDownloadButton();
        this.addListenerToUploadButton();
        this.addListenerToOBJDownloadButton();
    }

    public static getInstance(): LindenmayerFormular {
        if (LindenmayerFormular.instance == undefined) LindenmayerFormular.instance = new LindenmayerFormular();
        return LindenmayerFormular.instance;
    }

    private addListenerToAddButton(): void {
        this.btnAdd.addEventListener('click', () => {
            this.addNewRuleField();
        });
    }

    private addNewRuleField(): void {
        this.rulesWrapper.insertAdjacentHTML(
            'beforeend',
            ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' +
                (this.countAllRules + 1) +
                '"> <div class="interface__input-inner-wrapper"> <label>A' +
                (this.countAllRules + 1) +
                '</label> <input class="interface__input-field axioms" type="text" id="axiom' +
                (this.countAllRules + 1) +
                '" maxlength="1" placeholder="F" required> </div> <div class="interface__input-inner-wrapper"> <label>R' +
                (this.countAllRules + 1) +
                '</label> <input class="interface__input-field rules" type="text" id="rule' +
                (this.countAllRules + 1) +
                '" placeholder="FF+[+F-F-F]-[-F+F+F]" required> </div> </div>'
        );
        this.countAllRules++;
        if (this.btnRemove.disabled == true) this.btnRemove.disabled = false;
    }

    private addListenerToRemoveButton(): void {
        this.btnRemove.addEventListener('click', () => {
            this.removeRuleField();
        });
    }

    private removeRuleField(): void {
        const allRulesLength = this.rulesWrapper.children.length;

        if (allRulesLength > 1) {
            document.querySelector('#count' + this.countAllRules).remove();
            this.countAllRules--;
        }

        if (this.countAllRules <= 1) this.btnRemove.disabled = true;
    }

    private addListenerToDownloadButton(): void {
        this.btnDownload.addEventListener('click', () => {
            let baseAxiom = (document.getElementById('sentence') as HTMLInputElement).value;
            let ruleString = [];
            let axiomString = [];
            //test
            for (let j: number = 1; j <= this.countAllRules; j++) {
                let value: string = j.toString();
                ruleString[j - 1] = (document.getElementById('rule' + value) as HTMLInputElement).value;
                axiomString[j - 1] = (document.getElementById('axiom' + value) as HTMLInputElement).value;
            }

            let iterationsCount = (document.getElementById('countIterations') as HTMLInputElement).value;
            //
            let turningAngle = (document.getElementById('degrees') as HTMLInputElement).value;
            let stepLength = (document.getElementById('steplength') as HTMLInputElement).value;

            let newObject = {
                Satz: baseAxiom,
                Axiom1: axiomString,
                Rule1: ruleString,
                IterationsCount: iterationsCount,
                Drehwinkel: turningAngle,
                Schrittlänge: stepLength,
            };
            let json_string = JSON.stringify(newObject, undefined, 2);
            let link = document.createElement('a');
            link.download = 'data.json';
            let blob = new Blob([json_string], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });
    }

    private addListenerToUploadButton(): void {
        this.btnUpload.addEventListener('click', () => {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                let obj: any = JSON.parse(reader.result.toString());
                let moreRulesExist = true;
                console.log(obj.Rule1[1]);
                //Liest X Rule und Axiom Werte ab
                for (let j = 1; moreRulesExist == true; j++) {
                    let value: string = j.toString();
                    if (obj.Rule1[j - 1] == null) {
                        moreRulesExist = false;
                        this.removeRuleField();
                    } else {
                        (<HTMLInputElement>document.getElementById('rule' + value)).value = obj.Rule1[j - 1];
                        (<HTMLInputElement>document.getElementById('axiom' + value)).value = obj.Axiom1[j - 1];
                        this.addNewRuleField();
                    }
                }
                (<HTMLInputElement>document.getElementById('countIterations')).value = obj.IterationsCount;
                (<HTMLInputElement>document.getElementById('degrees')).value = obj.Drehwinkel;
                (<HTMLInputElement>document.getElementById('steplength')).value = obj.Schrittlänge;
                (<HTMLInputElement>document.getElementById('sentence')).value = obj.Satz;
            };
            //Reduzierung von rule Feldern
            let staticRuleCounter = this.countAllRules;
            for (let i = 1; i <= staticRuleCounter; i++) {
                this.removeRuleField();
            }
            reader.readAsText(this.fileUpload.files[0]);
        });
    }

    public generateLSystemImage(): Turtle3D {
        const axioms: string[] = new Array();
        const rules: string[] = new Array();

        document.querySelectorAll('.axioms').forEach((element) => {
            axioms.push((<HTMLInputElement>element).value.toUpperCase());
        });

        document.querySelectorAll('.rules').forEach((element) => {
            rules.push((<HTMLInputElement>element).value.toUpperCase());
        });

        const sentence: string = (<HTMLInputElement>document.querySelector('#sentence')).value.toUpperCase();

        const iterations: number = parseInt((<HTMLInputElement>document.querySelector('#countIterations')).value);
        const degrees: number = parseInt((<HTMLInputElement>document.querySelector('#degrees')).value);
        const steplength: number = parseInt((<HTMLInputElement>document.querySelector('#steplength')).value) / 10;

        let ruleset: Rule[] = [];

        for (let i = 0; i < axioms.length; i++) {
            ruleset.push(new Rule(axioms[i], rules[i]));
        }

        let lsys: LSystem = new LSystem(sentence, ruleset);

        console.time('L System generation');
        for (let i: number = 0; i < iterations; i++) lsys.generate();

        console.timeEnd('L System generation');

        let turtle: Turtle3D = new Turtle3D(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees));

        return turtle;
    }

    private addListenerToOBJDownloadButton(): void {
        //Download rules presets
        this.objDownloadButton.addEventListener('click', () => {
            const exporter = new OBJExporter();
            const result = exporter.parse(scene);

            let link = document.createElement('a');
            link.download = 'l_system.obj';
            let blob = new Blob([result], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });
    }
}
