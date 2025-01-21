const express = require('express')

const app = express();

app.get("/", function(req, res){
    res.send("champdfsion mera anuj");
} )
app.get("/profile", function(req, res){
    res.send("champitid jfdffdsafddfsfadfafsfdfsadfon ufsfdfdafska coach");
} )
app.listen(3000);