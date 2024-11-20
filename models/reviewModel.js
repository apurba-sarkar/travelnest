const mongoose = require("mongoose");
const Travel = require("./travelModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    travel: {
      type: mongoose.Schema.ObjectId,
      ref: "Travel",
      required: [true, "Review must belong to a travel"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.index({ travel: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "travel",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calCAverageRatings = async function (travelId) {
  const stats = await this.aggregate([
    {
      $match: { travel: travelId },
    },
    {
      $group: {
        _id: "$travel",
        nRatings: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.lenght > 0) {
    await Travel.findByIdAndUpdate(travelId, {
      ratingQuantiity: stats[0].nRatings,
      ratingAverage: stats[0].avgRatings,
    });
  } else {
    await Travel.findByIdAndUpdate(travelId, {
      ratingQuantiity: 0,
      ratingAverage: 4.5,
    });
  }
};

// !remind that part

reviewSchema.post("save", function () {
  this.constructor.calCAverageRatings(this.travel);
});

// !remind that part
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calCAverageRatings(this.r.travel);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
