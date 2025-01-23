const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.get("/", function (req, res) {
  // Setting up JWT
  let token = jwt.sign({ email: "sijanpaudel@gmail.com" }, "secret");
  res.cookie("token", token);
  console.log(token);
  res.send("done");
});

app.get('/read', function(req, res){
    // console.log(req.cookies);
    let data = jwt.verify(req.cookies.token, 'secret')
    console.log(data);
    
})

app.listen(3000);
