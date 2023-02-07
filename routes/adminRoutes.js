const express = require("express");
const router = express.Router();
const {
  addLocation,
  addPickupPoint,
  locationList,
  locationDelete, getPickupPoints
} = require("../controllers/locationManagement");
const { carList, VerifyCar, VendorList } = require("../controllers/adminController");

router.post("/location", addLocation).get("/location", locationList);

router.route("/location/:id").delete(locationDelete).get(getPickupPoints);

router.post("/pickupPoint", addPickupPoint);
router.get("/carsList", carList);

router.patch("/car/:id", VerifyCar);
router.get("/vendors", VendorList)
module.exports = router;
