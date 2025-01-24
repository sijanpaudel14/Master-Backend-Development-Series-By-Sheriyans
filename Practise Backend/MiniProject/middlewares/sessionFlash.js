// middlewares/sessionFlash.js

const session = require("express-session");
const flash = require("connect-flash");

module.exports = (app) => {
  // Set up session middleware (required for flash messages)
  app.use(
    session({
      secret: "secret-key",
      resave: false,
      saveUninitialized: true,
    })
  );

  // Set up flash message middleware
  app.use(flash());

  // Middleware to make flash messages available in views
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
  });
};
