const { search } = require("../controllers/homeController");
const express = require("express");
const router = express.Router();
router.get("/search", search);

module.exports = router;
