import { Turtle3D } from './Turtles/Turtle3D'
import { Rule } from './Rule'
import { LSystem } from './LSystem'
import { Utils } from './Utils'

export class LindenmayerFormular {
    private static instance: LindenmayerFormular;

    private btnAdd: HTMLInputElement
    private btnRemove: HTMLInputElement
    private btnUpload: HTMLInputElement
    private btnDownload: HTMLInputElement

    private rulesWrapper: HTMLDivElement

    private countAllRules: number

    private constructor() {
            this.btnAdd = document.querySelector('#btnAddRule')
            this.btnRemove = document.querySelector('#btnRemoveRule')
            this.btnUpload = document.querySelector('#btnUpload')
            this.btnDownload = document.querySelector('#btnDownload')
            this.rulesWrapper = document.querySelector('#rulesWrapper')
            this.countAllRules = 1

            this.addListenerToAddButton();
            this.addListenerToRemoveButton();
    }

    public static getInstance(): LindenmayerFormular {
        if(LindenmayerFormular.instance == undefined)
            LindenmayerFormular.instance = new LindenmayerFormular();
        return LindenmayerFormular.instance
    }

    private addListenerToAddButton(): void {
        this.btnAdd.addEventListener('click', () => {
            this.rulesWrapper.insertAdjacentHTML(
                'beforeend',
                ' <div class="interface__rule-wrapper" style="margin-top: 1rem;" id="count' +
                    (this.countAllRules + 1) +
                    '"> <div class="interface__input-inner-wrapper"> <label>Axiom ' +
                    (this.countAllRules + 1) +
                    '</label> <input class="interface__input-field axioms" type="text" id="axiom' +
                    (this.countAllRules + 1) +
                    '" maxlength="1""> </div> <div class="interface__input-inner-wrapper"> <label>Regel ' +
                    (this.countAllRules + 1) +
                    '</label> <input class="interface__input-field rules" type="text" id="rule' +
                    (this.countAllRules + 1) +
                    '"> </div> </div>'
            )
            this.countAllRules++
            if (this.btnRemove.disabled == true) this.btnRemove.disabled = false
        })
    }

    private addListenerToRemoveButton(): void {
        this.btnRemove.addEventListener('click', () => {
            const allRulesLength = this.rulesWrapper.children.length

            if (allRulesLength > 1) {
                document.querySelector('#count' + this.countAllRules).remove()
                this.countAllRules--
            }

            if (this.countAllRules <= 1) this.btnRemove.disabled = true
        })
    }

    public generateLSystemImage(): Turtle3D {
        const axioms: string[] = new Array()
        const rules: string[] = new Array()
    
        document.querySelectorAll('.axioms').forEach((element) => {
            axioms.push((<HTMLInputElement>element).value.toUpperCase())
        })
    
        document.querySelectorAll('.rules').forEach((element) => {
            rules.push((<HTMLInputElement>element).value.toUpperCase())
        })
    
        const sentence: string = (<HTMLInputElement>(
            document.querySelector('#sentence')
        )).value.toUpperCase()
    
        const iterations: number = parseInt(
            (<HTMLInputElement>document.querySelector('#countIterations')).value
        )
        const degrees: number = parseInt(
            (<HTMLInputElement>document.querySelector('#degrees')).value
        )
        const steplength: number =
            parseInt(
                (<HTMLInputElement>document.querySelector('#steplength')).value
            ) / 10
    
        let ruleset: Rule[] = []
    
        for (let i = 0; i < axioms.length; i++) {
            ruleset.push(new Rule(axioms[i], rules[i]))
        }
    
        let lsys: LSystem = new LSystem(sentence, ruleset)
    
        console.time('L System generation')
        for (let i: number = 0; i < iterations; i++)
            lsys.generate()

        console.timeEnd('L System generation')
    
        let turtle: Turtle3D = new Turtle3D(
            lsys.getSentence(),
            steplength,
            Utils.DegreesToRadians(degrees)
        )

        return turtle
    }
}