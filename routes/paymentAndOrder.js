const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/authJwt");
const { userAuth } = require("../middleware/userAuth");

const { config, createPaymentIntent, paymentDone } = require("../controllers/PaymentAndOrders")

router.get("/config", verifyJWT, userAuth, config)
router.post("/createPaymentIntent", verifyJWT, userAuth, createPaymentIntent);
// order post /paymentDone
router.post("/paymentDone", verifyJWT, userAuth, paymentDone);



module.exports = router;
