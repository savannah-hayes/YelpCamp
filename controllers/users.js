const User = require("../models/user");

const renderRegister = (req, res) => {
  res.render("users/register");
};

const register = async (req, res, next) => {
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
};

const renderLogin = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res) => {
  req.logout();
  req.flash("success", "Logout successful!");
  res.redirect("/campgrounds");
};

module.exports = {
  renderRegister,
  register,
  renderLogin,
  login,
  logout
}