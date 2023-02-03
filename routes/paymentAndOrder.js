const express = require("express");
const router = express.Router();

const { config, createPaymentIntent, paymentDone } = require("../controllers/PaymentAndOrders")

router.get("/config", config)
router.post("/createPaymentIntent", createPaymentIntent);
router.post("/paymentDone", paymentDone);



module.exports = router;
