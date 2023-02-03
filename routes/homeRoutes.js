const { search, home, booking, singleCar } = require("../controllers/homeController");
const { orderPost } = require("../controllers/userController")
const { verifyJWT } = require("../middleware/authJwt");
const { userAuth } = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();
router.get("/car/:id", singleCar)
router.get("/setup", home);
// router.use("/search", verifyJWT);
router.get("/search", search);
router.post("/booking", verifyJWT, userAuth, booking);
router.post("/order", verifyJWT, userAuth, orderPost)

module.exports = router;
