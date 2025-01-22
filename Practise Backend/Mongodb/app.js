//app.js

const express = require("express");
const app = express();
const userModel = require("./usermodel");

app.get("/", (req, res) => {
  res.send("heymyboy");
});
app.get("/create", async (req, res) => {
  let createduser = await userModel.create({
    name: "Sijan",
    email: "sijan@gmail.com",
    username: "sijan", 
  });
  res.send(createduser);
});
app.get("/create", async (req, res) => {
  let createduser = await userModel.create({
    name: "Suchana",
    email: "sijan@gmail.com",
    username: "sijan", 
  });
  res.send(createduser);
});
app.get("/update", async (req, res) => {
  let updateduser = await userModel.findOneAndUpdate({username:"sijan"}, {name: "Sijan Paudel"}, {new: true});

  res.send(updateduser);
});
app.get("/read", async (req, res) => {
  let readUser = await userModel.find();

  res.send(readUser);
});

app.listen(3000);
