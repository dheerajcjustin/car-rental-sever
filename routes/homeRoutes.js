const { search, home } = require("../controllers/homeController");
const express = require("express");
const router = express.Router();
router.get("/", home);
router.get("/search", search);

module.exports = router;
