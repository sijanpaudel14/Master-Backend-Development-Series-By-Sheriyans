// Learned how to set and read cookies in browser
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());

app.get("/", function(req, res){
    res.cookie("name", "harsh");
    res.send("home");
})

app.get("/read", function(req, res){
    console.log(req.cookies);
    res.send("read page");
})

app.listen(3000);