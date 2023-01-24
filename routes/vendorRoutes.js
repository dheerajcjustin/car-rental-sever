const express = require("express");
const router = express.Router();
const {
  loginVendor,
  signupVendor,
  otpVerify,
  ChangePasswordOtp,
  changePassword,
  forgotPassword,
} = require("../controllers/vendorAuth");
const { addCar, myCars } = require("../controllers/vendorController");
const { verifyJWT } = require("../middleware/authJwt");
const { vendorAuth } = require("../middleware/vendorAuth");

router.post("/login", loginVendor);
router.post("/signup", signupVendor);
router.post("/otpVerify", otpVerify);
router.post("/addCar", verifyJWT, vendorAuth, addCar);
router.post("/forgotPassword", forgotPassword);
router.post("/changePassword", changePassword);
router.post("/ChangePasswordOtp", ChangePasswordOtp);
router.get("/myCars", verifyJWT, vendorAuth, myCars);

module.exports = router;
