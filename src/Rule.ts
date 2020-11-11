class Rule {
    a: String
    b: String

    constructor(a_: String, b_: String) {
        if (a_.length != 1) {
            throw new Error('a must be 1 character')
        }
        this.a = a_
        this.b = b_
    }

    getA(): String {
        return this.a
    }

    getB(): String {
        return this.b
    }
}
