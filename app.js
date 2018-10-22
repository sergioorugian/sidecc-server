// var express = require("express");
// var app = express();
var app = require("express")();
var security = require("./security.js");

app.listen(3000, function() {
    console.log("...");
});

app.get("/", function(req, res) {
    // send index html page
    // load current user 
});

app.get("/login", function(req, res) {

    const loginResponse = security.login();
    if (loginResponse == null) {
        res.send("Erro de autenticação");
        return;
    }
    res.send("Usuário autenticado");

});
