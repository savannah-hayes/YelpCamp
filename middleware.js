const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have authorization to access this resource");
    return res.redirect(`/campgrounds/${id}`);
  };
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have authorization to access this resource");
    return res.redirect(`/campgrounds/${id}`);
  };
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  validateCampground,
  isAuthor,
  isReviewAuthor,
  validateReview
};