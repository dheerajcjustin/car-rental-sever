const express = require("express");
const { validate } = require("../models/userModel");
const {
  signupWithEmail,
  loginWithEmail,
  otpVerify,
  changePassword,
  forgotPassword,
  ChangePasswordOtp,
  resendOtp,
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

// body mobile
// otp will sent to user phone ,and save mobile number for checking
router.post("/forgotPassword", forgotPassword);

//  body (otp,mobile)
///result (201) will be the (userId , passwordToken) both need to change password
// 400 invalid otp or mobile
// 500 call the develeper server addichu poy
router.post("/ChangePasswordOtp", ChangePasswordOtp);

//body userId , PasswordToken, password(the new password)
router.post("/changePassword", changePassword);
router.post("/resendOtp", resendOtp);

module.exports = router;
