const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "61cdcfc1b290c0891caa5e44",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur reiciendis accusantium nihil veniam inventore nesciunt nulla enim expedita ex! Commodi quae laborum nihil placeat modi amet corrupti fugit inventore rem!",
      price,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/drnhfd7jz/image/upload/v1641227965/YelpCamp/Main-image.jpg',
          filename: 'YelpCamp/ounlsin0fc0xwiwcb10g',
        },
        {
          url: 'https://res.cloudinary.com/drnhfd7jz/image/upload/v1641068109/YelpCamp/oxf1rwg3zdt0fffphvui.jpg',
          filename: 'YelpCamp/oxf1rwg3zdt0fffphvui',
        }
      ]
    })
    await camp.save();
  }
}

seedDB().then(() => {
  db.close();
})