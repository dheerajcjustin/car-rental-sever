const { search, home, singleCar, } = require("../controllers/homeController");
const { bookings, reportVendor, getProfile, patchProfilePic, profilePatch, sendOtp } = require("../controllers/userController")
const { verifyJWT } = require("../middleware/authJwt");
const { userAuth } = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();
router.get("/car/:id", singleCar)
router.get("/setup", home);
// router.use("/search", verifyJWT);
router.get("/search", search);
router.get("/bookings", verifyJWT, userAuth, bookings)
router.post("/reportVendor", verifyJWT, userAuth, reportVendor)
router.get("/profile", verifyJWT, userAuth, getProfile)
router.patch("profilePic", verifyJWT, userAuth, patchProfilePic);

router.post("/sendOtp", verifyJWT, userAuth, sendOtp);
router.patch("/profile", verifyJWT, userAuth, profilePatch);


module.exports = router;
