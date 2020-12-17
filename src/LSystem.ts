import { Rule } from './Rule'

export class LSystem {
    private sentence: string // The sentence (a string)
    private ruleset: Rule[] // The ruleset (an array of Rule objects)
    private generation: number // Keeping track of the generation #

    // Construct an LSystem with a startin sentence and a ruleset
    constructor(axiom: string, rule: Rule[]) {
        this.sentence = axiom
        this.ruleset = rule
        this.generation = 0
    }

    // Generate the next generation
    generate() {
        let nextGenerationString: string[] = []
        for (let i: number = 0; i < this.sentence.length; i++) {
            let currentCharacter: string = this.sentence[i]
            let replace: string = currentCharacter
            for (let j: number = 0; j < this.ruleset.length; j++) {
                if (this.ruleset[j].getA() == currentCharacter) {
                    replace = this.ruleset[j].getB()
                    break
                }
            }
            // Append replacement string
            nextGenerationString.push(replace)
        }
        // Replace sentence
        this.sentence = nextGenerationString.join('')
        // Increment generation
        this.generation++
    }

    getSentence(): string {
        return this.sentence
    }

    getGeneration(): number {
        return this.generation
    }
}
