const hid = require('./Hid')
const hid_transpiler = require("./hidTranspiler")
function b_CustomFunction(args) {
    console.log(args[0])
}

hid.bind("test", b_CustomFunction)

hid.run("(test \"hello\")")

// hid_transpiler.transpile("(new variable 1+1)", "out.js");
hid_transpiler.transpile("(new variable 1 + 1)", "out.js");
hid_transpiler.transpile("(print variable)", "out.js");