const { default: mongoose } = require("mongoose");
const { Car } = require("../models/carModel");
const { Location } = require("../models/locationModel");
const objectid = require("valid-objectid");
const { updateOne } = require("../models/tokenModel");
const carList = async (req, res) => {
  const cars = await Car.find();
  console.log(cars);
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
        .json("ony valid status option are (rejected, verified) ");
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
