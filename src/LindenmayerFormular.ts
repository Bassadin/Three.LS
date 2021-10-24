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
                '" placeholder="FF+[+F-F-F]-[-F+F+F]" required> </div> </div>',
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
            const baseAxiom = (document.getElementById('sentence') as HTMLInputElement).value;
            const ruleString = [];
            const axiomString = [];
            //test
            for (let j = 1; j <= this.countAllRules; j++) {
                const value: string = j.toString();
                ruleString[j - 1] = (document.getElementById('rule' + value) as HTMLInputElement).value;
                axiomString[j - 1] = (document.getElementById('axiom' + value) as HTMLInputElement).value;
            }

            const iterationsCount = (document.getElementById('countIterations') as HTMLInputElement).value;
            //
            const turningAngle = (document.getElementById('degrees') as HTMLInputElement).value;
            const stepLength = (document.getElementById('steplength') as HTMLInputElement).value;

            const newObject = {
                baseAxiom: baseAxiom,
                replaceFrom: axiomString,
                replaceTo: ruleString,
                iterationsCount: iterationsCount,
                turningAngle: turningAngle,
                stepLength: stepLength,
            };
            const json_string = JSON.stringify(newObject, undefined, 2);
            const link = document.createElement('a');
            link.download = 'data.json';
            const blob = new Blob([json_string], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });
    }

    private addListenerToUploadButton(): void {
        this.btnUpload.addEventListener('click', () => {
            const reader = new FileReader();
            /*eslint-disable */
            reader.onload = (_event: ProgressEvent) => {
                /*eslint-enable */
                const obj: any = JSON.parse(reader.result.toString());
                let moreRulesExist = true;
                //Liest X Rule und Axiom Werte ab
                for (let j = 1; moreRulesExist == true; j++) {
                    const value: string = j.toString();
                    if (obj.replaceTo[j - 1] == null) {
                        moreRulesExist = false;
                        this.removeRuleField();
                    } else {
                        (<HTMLInputElement>document.getElementById('rule' + value)).value = obj.replaceTo[j - 1];
                        (<HTMLInputElement>document.getElementById('axiom' + value)).value = obj.replaceFrom[j - 1];
                        this.addNewRuleField();
                    }
                }
                (<HTMLInputElement>document.getElementById('countIterations')).value = obj.iterationsCount;
                (<HTMLInputElement>document.getElementById('degrees')).value = obj.turningAngle;
                (<HTMLInputElement>document.getElementById('steplength')).value = obj.stepLength;
                (<HTMLInputElement>document.getElementById('sentence')).value = obj.baseAxiom;
            };
            //Reduzierung von rule Feldern
            const staticRuleCounter = this.countAllRules;
            for (let i = 1; i <= staticRuleCounter; i++) {
                this.removeRuleField();
            }

            if (!this.fileUpload.files[0]) alert('Bitte Datei auswählen');
            else reader.readAsText(this.fileUpload.files[0]);
        });
    }

    public generateLSystemImage(): Turtle3D {
        const axioms: string[] = [];
        const rules: string[] = [];

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

        const ruleset: Rule[] = [];

        for (let i = 0; i < axioms.length; i++) {
            ruleset.push(new Rule(axioms[i], rules[i]));
        }

        const lsys: LSystem = new LSystem(sentence, ruleset);

        console.time('L System generation');
        for (let i = 0; i < iterations; i++) lsys.generate();

        console.timeEnd('L System generation');

        const turtle: Turtle3D = new Turtle3D(lsys.getSentence(), steplength, Utils.DegreesToRadians(degrees));

        return turtle;
    }

    private addListenerToOBJDownloadButton(): void {
        //Download rules presets
        this.objDownloadButton.addEventListener('click', () => {
            const exporter = new OBJExporter();
            const result = exporter.parse(scene);

            const link = document.createElement('a');
            link.download = 'l_system.obj';
            const blob = new Blob([result], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });
    }
}
