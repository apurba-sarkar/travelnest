const express = require("express");
const travelController = require("../controllers/travelController");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(travelController.aliasTopTravel, travelController.getAllTravel);
router.route("/monthly-plan/:year").get(travelController.getMonthlyPlan);

router.route("/travel-stats").get(travelController.getTravelStats);
router.route("/").get(travelController.getAllTravel).post(
  // travelController.checkBody,
  travelController.createTravel
);

router
  .route("/:id")
  .get(travelController.getTravel)
  .patch(travelController.updateTravel)
  .delete(travelController.deleteTravel);

module.exports = router;
