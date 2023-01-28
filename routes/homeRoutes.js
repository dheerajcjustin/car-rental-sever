const { search, home, booking } = require("../controllers/homeController");
const { verifyJWT } = require("../middleware/authJwt");
const { userAuth } = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();
router.get("/", home);
// router.use("/search", verifyJWT);
router.get("/search", search);
router.post("/booking", verifyJWT, userAuth, booking);

module.exports = router;
