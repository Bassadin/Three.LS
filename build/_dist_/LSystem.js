export class LSystem {
  constructor(axiom, rule) {
    this.sentence = axiom;
    this.ruleset = rule;
    this.generation = 0;
  }
  generate() {
    let nextGenerationString = [];
    for (let i = 0; i < this.sentence.length; i++) {
      let currentCharacter = this.sentence[i];
      let replace = currentCharacter;
      for (let j = 0; j < this.ruleset.length; j++) {
        if (this.ruleset[j].getA() == currentCharacter) {
          replace = this.ruleset[j].getB();
          break;
        }
      }
      nextGenerationString.push(replace);
    }
    this.sentence = nextGenerationString.join("");
    this.generation++;
  }
  getSentence() {
    return this.sentence;
  }
  getGeneration() {
    return this.generation;
  }
}
