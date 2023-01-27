const express = require("express");
const router = express.Router();
const {
  addLocation,
  addPickupPoint,
  locationList,
  locationDelete,
} = require("../controllers/locationManagement");
const { carList, VerifyCar } = require("../controllers/adminController");

router.post("/location", addLocation).get("/location", locationList);

router.delete("/location/:id", locationDelete);

router.post("/pickupPoint", addPickupPoint);
router.get("/carsList", carList);
router.patch("/car/:id", VerifyCar);
module.exports = router;
