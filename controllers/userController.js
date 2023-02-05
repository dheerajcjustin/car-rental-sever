
const { Order } = require("../models/OrderModel");
const moment = require("moment");
const mongoose = require("mongoose");

exports.bookings = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user)
        let myBookings = await Order.aggregate([{ $match: { $and: [{ userId: userId }, { dropOffStatus: true }] }, }, {
            $lookup: {
                from: "cars",
                localField: "carId",
                foreignField: "_id",
                as: "carData"
            }
        }]);
        let upComingDropOff = await Order.aggregate([{ $match: { $and: [{ userId }, { pickupStatus: true }, { dropOffStatus: false }] } }, {
            $lookup: {
                from: "cars",
                localField: "carId",
                foreignField: "_id",
                as: "carData"
            }
        }])

        let upComingPickups = await Order.aggregate([{ $match: { $and: [{ userId }, { pickupStatus: false }] } }, {
            $lookup: {
                from: "cars",
                localField: "carId",
                foreignField: "_id",
                as: "carData"
            }
        }])

        if (upComingPickups.length > 0) {
            // console.log("upcoming pidups", upComingPickups);
            upComingPickups.forEach(data => data.carData = data.carData[0])
            // console.log("upcoming pidups AFTER", upComingPickups);

        };
        if (myBookings.length > 0) {
            // myBookings.carData = myBookings.carData[0]
            myBookings.forEach(data => data.carData = data.carData[0])

            // console.log("upcoming myBookings", myBookings);

        };
        if (upComingDropOff.length > 0) {

            // upComingDropOff.carData = upComingDropOff.carData[0]
            upComingDropOff.forEach(data => data.carData = data.carData[0])

            // console.log("upcoming upComingDropOff", upComingDropOff);

        };

        console.log(upComingPickups);
        res.status(201).json({ myBookings, upComingPickups, upComingDropOff });
    } catch (error) {
        console.log(error);
        res.status(500)
    }



}