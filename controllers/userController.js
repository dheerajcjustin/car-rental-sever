
const { Order } = require("../models/OrderModel");
const moment = require("moment");
const mongoose = require("mongoose");

exports.bookings = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user)
        let completedEvents = await Order.aggregate([{ $match: { $and: [{ userId: userId }, { dropOffStatus: true }] }, }, {
            $lookup: {
                from: "cars",
                localField: "carId",
                foreignField: "_id",
                as: "carData"
            }
        }]);
        let upComingEvents = await Order.aggregate([{ $match: { $and: [{ userId }, { dropOffStatus: false }] } }, {
            $lookup: {
                from: "cars",
                localField: "carId",
                foreignField: "_id",
                as: "carData"
            }
        }])


        if (upComingEvents.length > 0) {
            // console.log("upcoming pidups", upComingPickups);
            upComingEvents.forEach(data => data.carData = data.carData[0])
            // console.log("upcoming pidups AFTER", upComingPickups);

        };
        if (completedEvents.length > 0) {
            // myBookings.carData = myBookings.carData[0]
            completedEvents.forEach(data => data.carData = data.carData[0])

            // console.log("upcoming myBookings", myBookings);

        };


        res.status(201).json({ upComingEvents, completedEvents });
    } catch (error) {
        console.log(error);
        res.status(500)
    }



}