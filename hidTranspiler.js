/// Using HID syntax trees to generate javascript

const hid = require("./Hid")
const fs = require("fs")

let cache = {}

function isValid(code) {
    try {
        eval(code)
        return true
    }
    catch (e) {
        return false
    }
}

function transpile(hid_code, outfile) {
    let ast = hid.compile(hid_code);
    let istype = false;
    if (!ast.basic_type && !ast.args && !ast.keyword) { /* if it's a type */
        istype = true;
    }

    if (!istype) {
        if (ast.keyword == "print") {
            ast.args.forEach(element => {
                try {
                    eval(element)
                    fs.appendFileSync(outfile, "\nconsole.log(" + element + ")\n")
                }
                catch (e) {
                    if (element in cache) {
                        fs.appendFileSync(outfile, "\nconsole.log(" + element + ")\n")
                    } else {
                        fs.appendFileSync(outfile, "\nconsole.log('" + element + "')\n")
                    }
                }
                
            });
        } else if (ast.keyword == "new") {
            let actval = "";

            let value = ast.args.slice(1, ast.args.length);
            value.forEach(val => {
                actval = actval + val;
            });

            cache[ast.args[0]] = "cached"
            
            if (isValid(value)) {
                
                fs.appendFileSync(outfile, "\nlet " + ast.args[0] + " = " + actval);
            } else {
                fs.appendFileSync(outfile, "\nlet " + ast.args[0] + " = '" + actval + "'");
            }
        }
    }
}

module.exports.transpile = transpile