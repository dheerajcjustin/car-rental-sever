const { Order } = require("../models/OrderModel");
const { Vendor } = require("../models/vendorModel");
const { User } = require("../models/userModel")
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

exports.getProfile = tryCatch(async (req, res) => {
    const userId = req.user;
    const profile = await User.findById(vendorId).select("name mobile profilePic")
    res.send(201).json(profile);
})

exports.patchProfilePic = tryCatch(async (req, res) => {
    const vendorId = req.user;
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json("image is not found");
    const profile = await User.findByIdAndUpdate(vendorId, { $set: { profilePic: profilePic } }).select("name mobile profilePic")
    res.sendStatus(201);
})



exports.profilePatch = tryCatch(async (req, res) => {

    console.log(req.body);
    const { name, mobile, otp } = req.body;
    const vendorId = req.user;
    const response = await otpVerifyFunction(otp, mobile);
    console.log("response of otp", response);
    if (response.status === true) {
        if (name && name.length > 2) {
            await User.updateOne({ _id: vendorId }, { $set: { name: name, mobile: mobile } });
        } else {
            await User.updateOne({ _id: vendorId }, { $set: { mobile: mobile } });

        }
        res.status(201).json(req.body)
    } else {
        res.status(400);
    }
})
exports.sendOtp = tryCatch(async (req, res) => {
    const { name, mobile } = req.body;

    console.log(mobile);
    const checkMobile = await User.findOne({ mobile })
    if (String(checkMobile._id) == req.user) {
        const response = await sendOtp(mobile);
        if (response.status === true) {
            res.status(201).json({ mobile, name })
        } else {
            res.status(400).json({ message: response.status })
        }
    } else {
        res.status(400).json("mobile number already exits");
    }


})