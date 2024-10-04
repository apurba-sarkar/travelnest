const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator")

const travelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, "must have equal and less than 40 character"],
      minlength: [10, "must have equal and greater than 10 character"],
      validate:[validator.isAlpha, "travel name only contain characters"]
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "please choose among easy,medium and difficult",
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator:function(val) {
          return val < this.price;
        },
        message:'Discount price should below the regular {VALUE} price',
      },
    },
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
      select: false,
    },
    startDates: [Date],
    secretTravel: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

travelSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

travelSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
  console.log(this);
});

// travelSchema.post("save",function(doc,next){
//   console.log(doc)
//   next()

// })
// Query

travelSchema.pre(/^find/, function (next) {
  this.find({ secretTravel: { $ne: true } });
  next();
});

// Aggregation middleware
travelSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTravel: { $ne: true } } });
  console.log(this.pipeline);
  next();
});
const Travel = mongoose.model("Travel", travelSchema);

module.exports = Travel;
