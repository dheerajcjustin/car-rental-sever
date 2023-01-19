const express = require("express");
const router = express.Router();
const { loginVendor } = require("../controllers/vendorAuth");
const { addCar } = require("../controllers/vendorController");

router.post("/login", loginVendor);
router.post("/addCar", addCar);
module.exports = router;
