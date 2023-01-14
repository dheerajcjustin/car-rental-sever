const express = require("express");
const { validate } = require("../models/userModel");
const {
  signupWithEmail,
  loginWithEmail,
  otpVerify,
  changePassword,
  forgotPassword,
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

// body mobile number user need to be changed
//result will have passwordToken and userId both are need change the password
router.post("/forgotPassword", forgotPassword);

//body passwordToken  and userId and the newPassword
router.post("/changePassword", changePassword);

module.exports = router;
