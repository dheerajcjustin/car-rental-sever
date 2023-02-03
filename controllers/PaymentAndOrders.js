const stripe = require("stripe")(process.env.STRIPE_SK, {
    apiVersion: "2022-11-15",
});


exports.config = (req, res) => {
    console.log("payment request kiteee")

    res.send({
        publishableKey: process.env.STRIPE_PK,
    });
}

exports.createPaymentIntent = async (req, res) => {
    const { payAmount } = req.body
    console.log("{{{{{{payAmount}}}}}}", payAmount)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "INR",
            amount: payAmount * 100,
            description: "Car Rental  payment",
            payment_method_types: ["card"],
        });

        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
}

exports.paymentDone = async (req, res) => {
    console.log(req.body);

    res.status(201).json({ data: req.body })
}