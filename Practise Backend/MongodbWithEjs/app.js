const express = require("express");
const path = require("path");
const app = express();
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index");
});


app.get("/read", async (req, res) => {
  let users = await userModel.find();
  res.render("read", { users });
});



app.get("/edit/:userid", async (req, res) => {
  let user = await userModel.findOne( {_id:req.params.userid});
  res.render("edit", { user });
});


app.post("/update/:userid", async (req, res) => {
    let {image, name, email} = req.body;
  let user = await userModel.findOneAndUpdate( {_id:req.params.userid}, {name, image, email}, {new:true});
  res.redirect("/read");
});



app.get("/delete:id", async (req, res) => {
  let users = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});



app.post("/create", async (req, res) => {
  try {
    // Create user in MongoDB
    const createdUser = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
    });

    // Redirect with success message
    res.redirect("/?success=true");
  } catch (error) {
    console.error(error);
    res.redirect("/?success=false");
  }
});

app.listen(3000);
