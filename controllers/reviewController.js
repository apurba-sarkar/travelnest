const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.travelId) filter = { travel: req.params.travelId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });
// exports.getSpecificReviewOfTravel = catchAsync(async (req, res, next) => {
//   const reviews = await Review.findById(req.params.reviewId);

//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTravelUserIds = (req, res, next) => {
  if (!req.body.travel) req.body.travel = req.params.travelId;
  if (!req.body.user) req.body.user = req.user.id;
  
  next();
};
// exports.createReview = catchAsync(async (req, res, next) => {
//   // !when not specified

//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: "success",
//     // results:reviews.length,
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
