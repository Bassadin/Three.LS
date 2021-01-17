export class Rule {
    private a: string;
    private b: string;

    constructor(a_: string, b_: string) {
        if (a_.length != 1) {
            alert('Bitte alle Felder ausfüllen')
        } else {
            this.a = a_;
            this.b = b_;
        }
    }

    getA(): string {
        return this.a;
    }

    getB(): string {
        return this.b;
    }
}
