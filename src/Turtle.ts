class Turtle {
    todo: String
    len: number
    theta: number

    constructor(s: String, l: number, t: number) {
        this.todo = s
        this.len = l
        this.theta = t
    }

    render() {
        //   stroke(0, 175);
        for (let i: number = 0; i < this.todo.length; i++) {
            let c: String = this.todo.charAt(i)

            if (c == 'F' || c == 'G') {
                //   line(0, 0, len, 0);
                //   translate(len, 0);
            } else if (c == '+') {
                //   rotate(theta);
            } else if (c == '-') {
                //   rotate(-theta);
            } else if (c == '[') {
                //   pushMatrix();
            } else if (c == ']') {
                //   popMatrix();
            }
        }
    }

    setLen(l: number) {
        this.len = l
    }

    changeLen(percent: number) {
        this.len *= percent
    }

    setToDo(s: String) {
        this.todo = s
    }
}
