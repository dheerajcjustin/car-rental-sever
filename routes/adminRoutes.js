const express = require("express");
const router = express.Router();
const {
  addLocation,
  addPickupPoint,
} = require("../controllers/locationManagement");

router.post("/location", addLocation);
router.post("/pickupPoint", addPickupPoint);
module.exports = router;
