// Set the port for the server to listen on
PORT = 3000;

// Import required dependencies
const express = require("express");
const app = express(); // Create an Express application
const userModel = require("./models/user"); // Import the user model for database interaction
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import JSON Web Token for authentication

const path = require("path"); // Import path module to work with file paths
const cookieParser = require("cookie-parser"); // Middleware to parse cookies

// Set up middleware
app.set("view engine", "ejs"); // Set EJS as the view engine for rendering templates
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory
app.use(cookieParser()); // Enable cookie parsing for reading and setting cookies

// Define the home route
app.get("/", (req, res) => {
  res.render("index"); // Render the 'index.ejs' file
});

// Define route for creating a new user
app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body; // Destructure user input from the request body

  // Hash the password using bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).send("Error generating salt");

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).send("Error hashing password");

      try {
        // Create a new user document in the database
        let createdUser = await userModel.create({
          username,
          email,
          password: hash, // Store the hashed password
          age,
        });

        // Generate a JWT token for the user
        let token = jwt.sign({ email }, "shhhhhhhhhhhh");

        // Set the token in a cookie
        res.cookie("token", token);

        // Redirect to the home page after successful account creation
        res.redirect("/");
      } catch (error) {
        res.status(500).send("Error creating user");
      }
    });
  });
});

// Define the login page route
app.get("/login", (req, res) => {
  res.render("login"); // Render the 'login.ejs' file
});

// Handle user login
app.post("/login", async (req, res) => {
  // Find the user by email in the database
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.send("Something is wrong"); // If user doesn't exist, send an error message

  // Compare the hashed password with the provided password
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      // If passwords match, generate a JWT token
      let token = jwt.sign({ email: user.email }, "shhhhhhhhhhhh");
      res.cookie("token", token); // Set the token in a cookie

      res.send("Success!"); // Send success message
    } else {
      res.send("Wrong!"); // If passwords don't match, send an error message
    }
  });
});

// Handle user logout
app.get("/logout", (req, res) => {
  res.cookie("token", ""); // Clear the JWT token cookie
  res.redirect("/"); // Redirect to the home page
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

// What this code does:
// 1. Creates user accounts: 
//    - Uses Mongoose schema and model to define the user structure
//    - Hashes passwords with bcrypt before saving them to the database
// 2. Implements user login:
//    - Verifies passwords with bcrypt
//    - Generates a JWT token for authenticated sessions
// 3. Handles logout by clearing the JWT token from cookies
