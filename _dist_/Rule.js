export class Rule {
  constructor(a_, b_) {
    if (a_.length != 1) {
      throw new Error("a must be 1 character");
    }
    this.a = a_;
    this.b = b_;
  }
  getA() {
    return this.a;
  }
  getB() {
    return this.b;
  }
}
