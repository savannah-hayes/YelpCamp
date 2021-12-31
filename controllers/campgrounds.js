const Campground = require("../models/campground");

const index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

const newForm = (req, res) => {
  res.render("campgrounds/new");
};

const createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground")
  res.redirect(`/campgrounds/${campground._id}`)
};

const showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

const editForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  };
  res.render("campgrounds/edit", { campground });
};

const updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash("success", "Successfully updated campground")
  res.redirect(`/campgrounds/${campground._id}`)
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground")
  res.redirect("/campgrounds");
};

module.exports = {
  index,
  newForm,
  createCampground,
  showCampground,
  editForm,
  updateCampground,
  deleteCampground
};