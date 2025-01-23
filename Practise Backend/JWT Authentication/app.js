// Learned how to set and read cookies in browser
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.get("/", function(req, res){
    bcrypt.compare("pololololo", '$2b$10$effxT9Dveskk6ottTEUDau/7GQZ97ILg/wbP1R.80axxRduwvRune', function(err, result){
            console.log(result);
            
    })
})

app.listen(3000);