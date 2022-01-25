export class Rule {
    private replaceFrom: string;
    private replaceTo: string;

    constructor(a_: string, b_: string) {
        if (a_.length != 1) {
            console.error('No left-hand empty rulesets supported');
        } else {
            this.replaceFrom = a_;
            this.replaceTo = b_;
        }
    }

    getReplaceFrom(): string {
        return this.replaceFrom;
    }

    getReplaceTo(): string {
        return this.replaceTo;
    }
}
