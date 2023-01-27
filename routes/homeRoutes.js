const { search, home } = require("../controllers/homeController");
const { verifyJWT } = require("../middleware/authJwt");
const express = require("express");
const router = express.Router();
router.get("/", home);
// router.use("/search", verifyJWT);
router.get("/search", search);

module.exports = router;
