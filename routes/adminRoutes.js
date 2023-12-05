const express = require("express");
const router = express.Router();
const {
      addLocation,
      addPickupPoint,
      locationList,
      locationDelete,
      getPickupPoints,
} = require("../controllers/locationManagement");
const {
      carList,
      VerifyCar,
      VendorList,
      vendorReports,
} = require("../controllers/adminController");
const {
      adminSignup,
      loginAdmin,
      otpVerify,
} = require("../controllers/adminAuth");
router.post("/location", addLocation).get("/location", locationList);
router.route("/location/:id").delete(locationDelete).get(getPickupPoints);
router.post("/pickupPoint", addPickupPoint);
router.get("/carsList", carList);
router.patch("/car/:id", VerifyCar);
router.get("/vendors", VendorList);
router.post("/signup", adminSignup);
router.post("/otpVerify", otpVerify);
router.post("/login", loginAdmin);
router.get("/vendorReports", vendorReports);

module.exports = router;
