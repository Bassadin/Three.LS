export class Rule {
  constructor(a_, b_) {
    if (a_.length != 1) {
      alert("Bitte alle Felder ausf\xFCllen");
    } else {
      this.a = a_;
      this.b = b_;
    }
  }
  getA() {
    return this.a;
  }
  getB() {
    return this.b;
  }
}
