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
/// 
/// VENDOR ROUTES,BASE ROUTE "/vendor"
///

// vendor login body:mobile,password ,result token
router.post("/login", loginVendor);

//vendor signup body: name,mobile,password ,result :otp
router.post("/signup", signupVendor);

// otp verify after signup  body: mobile,otp
router.post("/otpVerify", otpVerify);

// body mobile result otp
router.post("/forgotPassword", forgotPassword);

// body mobile and otp,  result token,userId
router.post("/changePassword", changePassword);

//  body userId,token,password
router.post("/ChangePasswordOtp", ChangePasswordOtp);



//require token

//adding car body:carData,photos,documents
//carData object contains {modelName,price,seatNum,location < object id >,rcNumber,pickupPoints  < Arrya of objectid >} 
// photos is Array contains 3 url of image of car in the order [front,back,side] ;
//document is Array contains 3 url of image of car documents in the order [RC,pollution,insurance]

router.post("/addCar", verifyJWT, vendorAuth, addCar);

//
router.get("/myCars", verifyJWT, vendorAuth, myCars);

module.exports = router;
