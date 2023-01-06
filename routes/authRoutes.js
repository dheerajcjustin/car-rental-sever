const express = require("express");
const { validate } = require("../models/userModel");
const {
  signupWithEmail,
  loginWithEmail,
  otpVerify,
} = require("../controllers/userAuthController");
const validateReqBody = require("../middleware/validateReqBody");
// const { verifyToken } = require("../helpers/authJwt");
const router = express.Router();

//localhost:5000/auth

//body: password , email, mobile , name
//retun otp for the number , signup  ,falied or successs
router.post("/signupEmail", validateReqBody(validate), signupWithEmail);
//body :   mobile  and password
router.post("/loginEmail", loginWithEmail);

//body mobile and otp
router.post("/otpVerify", otpVerify);

module.exports = router;
