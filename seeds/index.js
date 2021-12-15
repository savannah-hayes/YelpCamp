const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur reiciendis accusantium nihil veniam inventore nesciunt nulla enim expedita ex! Commodi quae laborum nihil placeat modi amet corrupti fugit inventore rem!",
      price
    })
    await camp.save();
  }
}
 
seedDB().then(() => {
  mongoose.connection.close();
})