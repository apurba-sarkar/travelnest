const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.travelId) filter = { travel: req.params.travelId };
  const reviews = await Review.find(filter);
  
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.getOneReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.travelId) filter = { travel: req.params.travelId };
  const reviews = await Review.find(filter);
  
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // !when not specified
  if (!req.body.travel) req.body.travel = req.params.travelId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    // results:reviews.length,
    data: {
      review: newReview,
    },
  });
});
