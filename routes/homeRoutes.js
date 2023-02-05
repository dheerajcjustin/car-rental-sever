const { search, home, singleCar } = require("../controllers/homeController");
const { bookings } = require("../controllers/userController")
const { verifyJWT } = require("../middleware/authJwt");
const { userAuth } = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();
router.get("/car/:id", singleCar)
router.get("/setup", home);
// router.use("/search", verifyJWT);
router.get("/search", search);
router.get("/bookings", verifyJWT, userAuth, bookings)


module.exports = router;
