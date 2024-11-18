const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);
router.patch(
  "/updateMyPassword",
  // authController.protect,
  authController.updatePassword
);

router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateme", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .get(userController.createUser)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

module.exports = router;
