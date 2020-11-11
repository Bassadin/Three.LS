class LSystem {
    sentence: String // The sentence (a String)
    ruleset: Rule[] // The ruleset (an array of Rule objects)
    generation: number // Keeping track of the generation #

    // Construct an LSystem with a startin sentence and a ruleset
    constructor(axiom: String, r: Rule[]) {
        this.sentence = axiom
        this.ruleset = r
        this.generation = 0
    }

    // Generate the next generation
    generate() {
        // An empty StringBuffer that we will fill
        let nextgen: String[] = []
        // For every character in the sentence
        for (let i: number = 0; i < this.sentence.length; i++) {
            // What is the character
            let curr: String = this.sentence.charAt(i)
            // We will replace it with itself unless it matches one of our rules
            let replace: String = '' + curr
            // Check every rule
            for (let j: number = 0; j < this.ruleset.length; j++) {
                let a: String = this.ruleset[j].getA()
                // if we match the Rule, get the replacement String out of the Rule
                if (a == curr) {
                    replace = this.ruleset[j].getB()
                    break
                }
            }
            // Append replacement String
            nextgen.push(replace)
        }
        // Replace sentence
        this.sentence = nextgen.toString()
        // Increment generation
        this.generation++
    }

    getSentence(): String {
        return this.sentence
    }

    getGeneration(): number {
        return this.generation
    }
}
