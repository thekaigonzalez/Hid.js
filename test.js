const hid = require('./Hid')

function b_CustomFunction(args) {
    console.log(args[0])
}

hid.bind("test", b_CustomFunction)

hid.run("(test \"hello\")")