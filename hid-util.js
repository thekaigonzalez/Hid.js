/// Hid utilities
/// contains assert, etc...
/// this file should be included with hid.js for added functionality.

const hid = require("./Hid")

hid.bind("eval", function (args) {
    let s = eval(args[0])

    return s;
})

hid.bind("assert", function(args) {
    let s = eval(args[0]);

    if (s == false) {
        console.log("hid-util:17: assertion failed! " + args[0])
        return "null"
    } else {
        return "success"
    }
})