const { Location } = require("../models/locationModel");
const { Vendor } = require("../models/vendorModel");
const { Order } = require("../models/OrderModel");
const { getDateRange } = require("../utils/dateRange")
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const { Car } = require("../models/carModel")



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
    try {

    } catch (error) {

    }
    console.log("inside the paymemt done to review the the body gerting")
    console.log(req.body);
    const { carId, payAmount, selectedPickup, bookingTime } = req.body;
    if (!carId || !payAmount || !selectedPickup || !bookingTime) return res.status(400).json({
        message: "invalid datas ", exampleData: `{
        carId: '63db5cb8976021a562073430',
        payAmount: 1012,
        selectedPickup: '63da34f1f6737cdf865ff29e',
        bookingTime: {
          pickupDate: 'Feb 4th 2023',
          dropOffDate: 'Feb 4th 2023',
          pickupTime: '10.00 AM',
          dropOffTime: '11.00 AM ',
          rentPeriod: 1
        }
      }`})


    console.log("swelejfkds,", selectedPickup);
    const pickup = mongoose.Types.ObjectId(selectedPickup)




    const selectLocation = await Location.findOne({ "pickupPoints._id": pickup })
    const pickupPoint = selectLocation.pickupPoints.filter(pick => pick.id == pickup)
    console.log("pickup pintei is ", pickupPoint[0]);
    // console.log("selected location is ", selectLocation);




    const order = new Order({ carId, price: payAmount, selectedPickup, pickupDate: bookingTime.pickupDate, dropOffDate: bookingTime.dropOffDate, pickupTime: bookingTime.pickupTime.trim(), dropOffTime: bookingTime.dropOffTime.trim(), pickup: pickupPoint[0] })
    console.log(order);
    await order.save();
    let pickupDate = moment(bookingTime.pickupDate, "MMM Do YYYY").toDate();
    let dropOff = moment(bookingTime.dropOffDate, "MMM Do YYYY").toDate();
    const bookedDates = getDateRange(pickupDate, dropOff);
    console.log(bookedDates);

    await Car.updateOne(
        { _id: carId },
        { $push: { bookedTime: [...bookedDates] } }
    );




    res.status(201).json({ data: req.body })
}