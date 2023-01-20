const express = require("express");
const router = express.Router();
const {
  loginVendor,
  signupVendor,
  otpVerify,
} = require("../controllers/vendorAuth");
const { addCar } = require("../controllers/vendorController");
const { verifyJWT } = require("../middleware/authJwt");
const { vendorAuth } = require("../middleware/vendorAuth");

router.post("/login", loginVendor);
router.post("/signup", signupVendor);
router.post("/otpVerify", otpVerify);
router.post("/addCar", verifyJWT, vendorAuth, addCar);
module.exports = router;
