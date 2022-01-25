export class Rule {
  constructor(a_, b_) {
    if (a_.length != 1) {
      console.error("No left-hand empty rulesets supported");
    } else {
      this.replaceFrom = a_;
      this.replaceTo = b_;
    }
  }
  getReplaceFrom() {
    return this.replaceFrom;
  }
  getReplaceTo() {
    return this.replaceTo;
  }
}
//# sourceMappingURL=Rule.js.map
