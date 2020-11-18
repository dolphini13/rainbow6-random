const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
let attackers_data = require("./data/attackers.json");
let defenders_data = require("./data/defenders.json");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded ({extended: true}));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", function(req, res){
    res.render('home')
});

app.get("/test", function(req, res){
    res.render('test')
});

app.post("/attacker_result", function(req, res){
    let attackers = req.body.attackers;
    let random_op = random_item(attackers);
    let data = op_info(random_op, "attack");
    res.render('attacker_result', {data: data})
});

app.post("/defender_result", function(req, res){
    let defenders = req.body.defenders;
    let random_op = random_item(defenders);
    let data = op_info(random_op, "defend");
    res.render('defender_result', {data: data})
});

// helper 
// randomiser
function random_item(arr) {
    // if not array, return it as it is single item
    if(!Array.isArray(arr)) return arr; 
    const random = arr[Math.floor(Math.random() * arr.length)];
    return random;
}

// compare string 
function compare(string1, string2){
    return string1.toUpperCase() === string2.toUpperCase()
}

// op info 
function op_info(op_name, flag) {
    // declare variables to hold info
    let op_info;
    let random_attachment;
    if(flag == "attack") {
        for(let attacker of attackers_data) {
            if(compare(attacker.name, op_name)){
                op_info = attacker;
                break;
            }
        }
    } else {
        for(let defender of defenders_data) {
            if(compare(defender.name, op_name)){
                op_info = defender;
                break;
            }
        }
    }
    console.log(op_info.name);
    // random primary
    let random_primary = random_item(op_info.primary);
    let primary_attachments = [];
    Object.keys(random_primary.attachment).forEach(function(key) {
        random_attachment = random_item(random_primary.attachment[key]);
        primary_attachments.push(random_attachment);
    });
    console.log(random_primary.name);
    console.log(primary_attachments);

    // random secondary
    let random_secondary = random_item(op_info.secondary);
    let secondary_attachments = [];
    Object.keys(random_secondary.attachment).forEach(function(key) {
        random_attachment = random_item(random_secondary.attachment[key]);
        secondary_attachments.push(random_attachment);
    });
    console.log(random_secondary.name);
    console.log(secondary_attachments);

    // gadgets
    let random_gadget = random_item(op_info.gadget);
    console.log(random_gadget + "\n");
    let data = {
        op_info: op_info,
        primary: random_primary,
        primary_attachments: primary_attachments,
        secondary: random_secondary,
        secondary_attachments: secondary_attachments,
        gadget: random_gadget
    }
    return data;
}
app.listen(3000, function(){
    console.log("Serving from port 3000");
});