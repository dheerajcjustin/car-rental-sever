const express = require("express");
const router = express.Router();
const {
  loginVendor,
  signupVendor,
  otpVerify,
  ChangePasswordOtp,
  changePassword,
  forgotPassword, profilePatch, sendOtp, getProfile, patchProfilePic
} = require("../controllers/vendorAuth");
const { addCar, myCars, VendorBookings, bookingsStatus } = require("../controllers/vendorController");
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
router.get("/myCars", verifyJWT, vendorAuth, myCars);
router.get("/bookings", verifyJWT, vendorAuth, VendorBookings)
router.patch("/bookingsStatus", verifyJWT, vendorAuth, bookingsStatus);
router.patch("/profile", verifyJWT, vendorAuth, profilePatch);
router.post("/sendOtp", verifyJWT, vendorAuth, sendOtp)
router.get("/profile", verifyJWT, vendorAuth, getProfile)
router.patch("/profilePic", verifyJWT, vendorAuth, patchProfilePic)



module.exports = router;
