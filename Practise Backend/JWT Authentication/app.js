// Learned how to set and read cookies in browser
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.get("/", function(req, res){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash("pololololo", salt, function(err, hash){
            // Store hash in your password DB
            console.log(hash);
        });
    });
})

app.listen(3000);