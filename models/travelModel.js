const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
// const User = require("./userModel");

const travelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, "must have equal and less than 40 character"],
      minlength: [10, "must have equal and greater than 10 character"],
      // validate: [validator.isAlpha, "travel name only contain characters"],
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
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price should below the regular {VALUE} price",
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
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

travelSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// !virtual populate for relation-->populate should be added to the controller
travelSchema.virtual("reviews", {
  ref: "Review", //!model name
  foreignField: "travel",
  localField: "_id"
});

//!end-

travelSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
  console.log(this);
});

// travelSchema.pre('save',async function(next){
//   const guidesPromises = this.guides.map(async id=> await User.findById(id))
//   this.guides =await Promise.all(guidesPromises)
//   next()
// })

// travelSchema.post("save",function(doc,next){
//   console.log(doc)
//   next()

// })
// Query

travelSchema.pre(/^find/, function (next) {
  this.find({ secretTravel: { $ne: true } });
  this.start = Date.now();
  next();
});


// *popualte used with pre method --> no need to add on controller

travelSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
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
