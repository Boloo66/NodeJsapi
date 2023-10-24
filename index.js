const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
const bodyParser = require("body-parser");

let port = process.env.PORT || 3010;  

//Validation using JOI
function validateFruit(fruit){
    const schema = Joi.object({
        name: Joi.string()  .min(3) .required()
    });
    const validation = schema.validate(fruit);
    return validation;

    //return Joi.validate(fruit, schema);
}
//middleware set-up 
app.use(express.json());
app.use(bodyParser.json());

const fruits = [
    {name:"Apples", id:1},
    {name:"Bananas", id:2},
    {name:"Cherries", id:3},
    {name:"Dates", id:4},
    {name:"Grapes", id:5},
    {name:"Lemons", id:6},
    {name:"Melons", id:7}
];

app.get("/", (req, res) => {
    res.send("Join my x community for web3 and defi alphas: x.com/justcryptonme/ ");
})

app.get("/api/fruits", (req, res) => {
    res.send(fruits);
})

app.get("/api/fruits/:id", (req, res) => {
    let fruit = fruits.find(c => c.id === parseInt(req.params.id));
    if(!fruit) res.status(404).send("fruit not found");
    res.send(fruit);
})

//Handler for POST
app.post("/api/fruits", (req, res) => {
    const {error} =  validateFruit(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const fruit = {
        id: fruits.length + 1,
        name: req.body.name
    }
    fruits.push(fruit);
    res.send(fruit);
    res.sendStatus(201);
})

//Update request handler
app.put("/api/fruits/:id", (req, res) => {
    // check for fruit existence
    let user_fruit = fruits.find(c => c.id === parseInt(req.params.id));
    if(!user_fruit) res.status(404).send("Fruit not found");

    // update the fruit in the frits list of object
    const {error} = validateFruit(req.body);
    if(error){
        res.status("400").send(error.details[0].message);
        return;
    }

    user_fruit.name = req.body.name;
    res.status(204).send(user_fruit);
    
})

//DELETE Handler
app.delete("/api/fruits/:id", (req, res) => {
    // check for fruit in list using index
    let fruit = fruits.find(c => c.id === parseInt(req.params.id));
    if(!fruit) res.status(404).send("Fruit not found");

    //delete resource from list
    let index = fruits.indexOf(fruit);
    fruits.splice(index, 1);
    res.status(204).send(" resource deleted");
    
})


app.listen(port, () => {
    console.log(`Listening on port ${port}.....`)
})