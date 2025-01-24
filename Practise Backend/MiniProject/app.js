const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require('./config/multerconfig')
const path = require('path');

// Import the session and flash message middleware
const sessionFlashMiddleware = require("./middlewares/sessionFlash");

// Use the session and flash middleware
sessionFlashMiddleware(app);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());




app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile/upload", (req, res) => {
  res.render("profileupload");
});
app.post("/upload",isLoggedIn, upload.single('image'), async (req, res) => {
  let user = await userModel.findOne({email:req.user.email});
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect('/profile')
;
});

// app.get("/test", (req, res) => {
//   res.render("test");
// });


// app.post("/upload", upload.single("image"), (req, res) => {
//   console.log(req.file);
// });

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");

  res.render("profile", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );

  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content,
  });
  console.log(post);

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
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
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error_msg", "Something went wrong!!");
    return res.redirect("/login");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      req.flash("success_msg", "Your are successfully logged in!!");
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.redirect("/profile");
    } else {
      req.flash("error_msg", "Something went wrong!!");
      res.redirect("/login");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect("/login");

  try {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.redirect("/login");
  }
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
