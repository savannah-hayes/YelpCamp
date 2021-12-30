const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");

const Campground = require("../models/campground");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js")

const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(message, 400);
  } else {
    next();
  }
}

const isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have authorization to access this resource");
    return res.redirect(`/campgrounds/${req.params.id}`);
  };
  next();
}

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review")
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted your review")
  res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;