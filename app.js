var express = require("express");
var app = express();
var foreignAgent = require("./foreign-agent.js")

app.get("/", function(req, res) {
    // res.send("Hello World!");
    // console.log("foreignAgent", foreignAgent);
    login().then(response => {
        if (response.ERROR != null) {
            res.send("Erro de autenticação");
        } else {
            res.send("Usuário autenticado");
        }
    });
});

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});

function login() {
    return foreignAgent.login("08010341000150", "109047").then(response => {
        foreignAgent.getList();
        return response;
    });
}
