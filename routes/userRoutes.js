const express = require("express");
const { validate } = require("../models/userModel");
const {
  signupWithEmail,
  loginWithEmail,
} = require("../controllers/userAuthController");
const validateReqBody = require("../middleware/validateReqBody");
// const { verifyToken } = require("../helpers/authJwt");
const router = express.Router();

router.post("/signupEmail", validateReqBody(validate), signupWithEmail);
router.post("/loginEmail", loginWithEmail);

module.exports = router;
