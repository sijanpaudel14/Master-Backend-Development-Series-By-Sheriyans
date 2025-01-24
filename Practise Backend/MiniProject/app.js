const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import the session and flash message middleware
const sessionFlashMiddleware = require("./middlewares/sessionFlash");

// Use the session and flash middleware
sessionFlashMiddleware(app);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.render("index");
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/profile", isLoggedIn, (req, res) => {
    console.log(req.user);
    res.redirect("login");
});

app.post("/register", async (req, res) => {
  let { name, username, email, age, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    req.flash("error_msg", "User already registered");
    return res.redirect("/"); 
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        email,
        age,
        username,
        password: hash,
      });

      // Create JWT token
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);

      // Flash success message
      req.flash("success_msg", "You have successfully registered!");
      res.redirect("/"); 
    });
  });
});


app.post("/login", async (req, res) => {
  let {email, password} = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error_msg", "Something went wrong!!");
    return res.redirect("/login"); 
  }

  bcrypt.compare(password, user.password, (err, result ) => {
    if (result){
        req.flash("success_msg", "Your are successfully logged in!!");
        let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
        res.cookie("token", token);
        return res.redirect("/");
    }
    else {
        req.flash("error_msg", "Something went wrong!!");
        res.redirect('/login');
    }
  })
 
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login"); 
});

function isLoggedIn(req, res, next){
    if (req.cookies.token === "") res.send("You must be logged in");
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
}


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
