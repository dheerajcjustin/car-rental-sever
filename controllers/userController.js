const { Order } = require("../models/OrderModel");
const { Vendor } = require("../models/vendorModel");
const moment = require("moment");
const mongoose = require("mongoose");
const { tryCatch } = require("../utils/tryCatch");
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
exports.reportVendor = tryCatch(async (req, res) => {
    const { message, carId, vendorId, carData } = req.body;
    if (!message || !carId || !vendorId) return res.status(400).json("invalid data ,must have 'message','carId','vendorId'")
    const vendor = mongoose.Types.ObjectId(vendorId)
    await Vendor.updateOne({ _id: vendor }, { $push: { reports: { message, carId } } })
    const elm = await Vendor.findOne({ _id: vendor });
    res.status(201).json(elm);
})