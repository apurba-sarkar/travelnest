const mongoose = require("mongoose");

const travelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "A travel must have a duration"],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A travel must have a price"],
  },
  ratingQuantiity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A travel have must a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A travel must have a difficulty"],
  },
  priceDiscount: Number,
  summery: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A trvel must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    selec: false,
  },
  startDates: [Date],
});

const Travel = mongoose.model("Travel", travelSchema);

module.exports = Travel;
