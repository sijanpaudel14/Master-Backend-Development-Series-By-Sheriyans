PORT = 3000;
const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const app = express();

app.get("/", (req, res) => {
  res.send("Hey");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: "sijan",
    email: "sijan@sijan",
    age: 22, 
  });
  res.send(user);
});

app.get("/post/create", async (req, res) => {
  let user = await userModel.findOne({ email: "sijan@sijan" });

  let post = await postModel.create({
    postdata: "Hello How are you?",
    user: user._id, 
  });

  user.posts.push(post._id);
  await user.save();
  res.send({ post, user });
});

app.listen(PORT, () => {
  console.log("Running in port 3000!!!!");
});
