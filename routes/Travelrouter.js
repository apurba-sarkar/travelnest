const express = require("express");
const travelController = require("../controllers/travelController");
const authController = require("../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./reviewRoute");

const router = express.Router();

router.use("/:travelId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(travelController.aliasTopTravel, travelController.getAllTravel);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide","guide"),
    travelController.getMonthlyPlan
  );

router.route("/travel-stats").get(travelController.getTravelStats);
router
  .route("/")
  .get(
    // !pubically exposed
    // authController.protect,
    travelController.getAllTravel
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    // travelController.checkBody,
    travelController.createTravel
  );

router
  .route("/:id")
  .get(travelController.getTravel)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    travelController.updateTravel
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    travelController.deleteTravel
  );

// router
//   .route("/:travelId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
