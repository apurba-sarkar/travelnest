const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const express = require("express");

const router = express.Router({ mergeParams: true });

// const route

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );
  router.route("/:reviewId").get(reviewController.getOneReview)

module.exports = router;
