const hid = require ("./Hid")
require("./hid-util")
hid.bind("help", function() {
    console.log("")
})

const prompt = require('prompt-sync')();
 
console.log("Hid.js interpreter 1.0");

while (true) {
    const code = prompt('>>>');

    console.log(hid.run(code));
}