const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, error => {
      if (error) return next(error);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    })
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("register");
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logout successful!");
  res.redirect("/campgrounds");
})

module.exports = router;