
function b_print(args) {
    args.forEach(item => {
        process.stdout.write(item)
    });
    console.log()
}

var funcs = {
    "print": b_print
}

var vars = {}

function CompileHid(hid_code) {
    let state = 0;
    let key = "";
    let place = ""
    let likely = false
    let istype = false
    let argsv = []
    for (let i = 0 ; i < hid_code.length; ++ i) {
        if (hid_code[i] == '(' && state == 0) {
            state = 1;
            // console.log("Opening object");
        } else if (hid_code[i] == ' ' && state == 1) {
            // console.log("keyword " + place)
            key = place;
            place = ""
            state = 2
        } else if (hid_code[i] == ' ' && state == 2) {
            // console.log("argument " + place)
            argsv.push(place);
            place = ""
        } else if (hid_code[i] == '"' && state == 2) {
            // console.log("open string")
            state = 3
        } else if (hid_code[i] == '"' && state == 3) {
            // console.log("close string")
           state = 2;
        } else if (hid_code[i] == '"' && state == 0) { /* is a basic string */
            state = 556
            istype = true
        } else if (hid_code[i] == '"' && state == 556) { 
            return place;
        } else if (hid_code[i] == ')' && state != 3) {
            //  console.log("Closing object")

             if (place.length > 0) {
                //  console.log("Argument " + place)
                 argsv.push(place);
                 place =  ""
             }
        } else {
            if (hid_code[i] != "(" || hid_code[i] != ")" || hid_code[i] != "-" || hid_code[i] != "\"") {
                likely = true;
            }
            if (hid_code[i] == "(" || hid_code[i] == ")" || hid_code[i] == "-" || hid_code[i] == "\"") {
                likely = false;
                console.log("degrade variable level")
            }
            
            place = place + hid_code[i];
        }
    }

    if (key == undefined) {
        console.log("hid.js:compiler:60: no keyword after 2 assertions?");
    }

    if (likely == true) {
        // console.log("Likely a variable")
    }
    return {
        keyword: key,
        args: argsv,
        basic_type: istype
    }
} 

function RunHid(str) {
    let ast = CompileHid(str);
    // console.log("ast.key: " + ast.keyword)
    if (ast.keyword == undefined && ast.args == undefined) { /* is string */
        return ast
    }
    
    else if (ast.keyword == "new") {
        let name = ast.args[0]
        let value = ast.args[1]

        if (name == undefined || value == undefined) {
            console.log("hid.js:59: one or two values weren't supplied.")
        } else {
            vars[name] = value;
        }
    }
    else if (funcs[ast.keyword] == undefined) {
        console.log("hid: error: not a function, '" + ast.keyword + "'");
        console.log(vars);
    } else {
        let i = 0;
        ast.args.forEach(function(item) {
            
            if (item in vars) {
                ast.args[i] = vars[ast.args[i]]
            }

            i = i + 1
        })
        return funcs[ast.keyword](ast.args)
    }
}

function AddBind(name, fnc) {
    funcs[name] = fnc
}

module.exports.compile = CompileHid

module.exports.run = RunHid

module.exports.bind = AddBind