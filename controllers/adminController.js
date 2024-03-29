const { default: mongoose } = require("mongoose");
const { Car } = require("../models/carModel");
const { Vendor } = require("../models/vendorModel");
const { Admin, validateAdmin } = require("../models/adminModel");
const { tryCatch } = require("../utils/tryCatch");
const { Location } = require("../models/locationModel");
const objectid = require("valid-objectid");
const { updateOne } = require("../models/tokenModel");
const { sendOtp, otpVerifyFunction } = require("../utils/Otp");
const carList = async (req, res) => {
      const cars = await Car.aggregate([
            {
                  $lookup: {
                        as: "vendor",
                        from: "vendors",
                        foreignField: "_id",
                        localField: "vendor",
                  },
            },
      ]);
      return res.status(201).json(cars);
};
exports.carList = carList;

const VerifyCar = async (req, res) => {
      try {
            console.log("paramsaf", req.params);
            const { id } = req.params;
            if (!objectid.isValid(id)) {
                  return res.status(422).json("Invalid Id");
                  // return next(new Error("Invalid ID"));
            }
            const options = ["rejected", "verified"];
            const { status } = req.body;
            if (!options.includes(req.body.status)) {
                  return res
                        .status(406)
                        .json(
                              "ony valid status option are (rejected, verified) ",
                        );
            }
            const carId = mongoose.Types.ObjectId(id);
            await Car.updateOne({ _id: carId }, { verified: status });
            res.status(201).json("wowo update succcresfull");
      } catch (error) {
            console.log(error);
            res.sendStatus(500);
      }
};
exports.VerifyCar = VerifyCar;
exports.VendorList = tryCatch(async (req, res) => {
      // console.log("req.params", req.query);
      let page = parseInt(req.query.page) || 1;
      page--;
      const limitNum = 3;
      // console.log("page = ", page);
      const vendors = await Vendor.find()
            .select("name mobile verified")
            .skip(page * limitNum)
            .limit(limitNum);
      // console.log(vendors);
      // const newARrya = [];
      // vendors.push(...vendors.map(vet => ({ name: vet.name, mobile: vet.mobile, verified: true, _id: vet._id + "a" })))
      // vendors.push(vendors.map(vet => vet._id + "a"))
      console.log(vendors);
      res.status(201).json(vendors);
});

exports.vendorReports = tryCatch(async (req, res) => {
      const reports = await Vendor.aggregate([
            { $unwind: "$reports" },
            {
                  $match: { "reports.readStatus": false },
            },
            {
                  $lookup: {
                        localField: "carId",
                        as: "carData",
                        foreignField: "_id",
                        from: "cars",
                  },
            },
      ]);
      res.status(201).json(reports);
});
