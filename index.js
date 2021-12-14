const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground")

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected")
})

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/campground", async (req, res) => {
  const camp = new Campground({ 
    title: "my back yard",
    description: "affordable camping!"
 })
  await camp.save()
  res.send(camp)
})

app.listen(3000, () => {
  console.log("serving on port 3000")
})
