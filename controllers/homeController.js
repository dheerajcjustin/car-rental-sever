const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");

const search = async (req, res) => {
  try {
    const { location, pickupDate, dropOffDate } = req.body;
    if (!location || !pickupDate || !dropOffDate)
      return res
        .status(400)
        .json("location (id ) pickupDate droopOffDate are required");
    const cars = await Car.find();
    res.status(201).json(cars);
  } catch (error) {
    res.status(500).json("server error");
  }
};

exports.search = search;

const home = async (req, res) => {
  try {
    const locations = await Location.find().select(
      "location description image pickupPoints"
    );
    const topPicks = await Car.find();
    res.status(201).json(locations, topPicks);
  } catch (error) {}
};
exports.home = home;
