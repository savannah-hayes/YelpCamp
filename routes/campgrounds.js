const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(message, 400);
  } else {
    next();
  }
}

router.get("/", catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}))

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
})

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash("success", "Successfully made a new campground")
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate("reviews");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
}))

router.put("/:id", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
  req.flash("success", "Successfully updated campground")
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:id", isLoggedIn, catchAsync(async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground")
  res.redirect("/campgrounds");
}))

module.exports = router;