const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/create", function (req, res) {
  console.log(req.body);
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.description,
    function (err) {
      res.redirect("/");
    }
  );
});
app.post("/edit", function (req, res) {
    console.log(req.body);
       // Ensure that `prevName` and `newName` are in the request body
       const prevName = req.body.prevName;
       const newName = req.body.newName.split(" ").join(""); // Removing spaces from newName
   
    fs.rename(`./files/${prevName}`, `./files/${newName.split(" ").join("")}.txt`, function(err){
        res.redirect('/');
    })

  });

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show", { filename: req.params.filename, filedata: filedata });
    }
  );
});
app.get("/edit/:filename", function (req, res) {
      res.render("edit", {filename:req.params.filename});

});

app.listen(3000);
