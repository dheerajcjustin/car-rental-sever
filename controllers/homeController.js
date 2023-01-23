const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");

const search = async (req, res) => {
  try {
    const filters = req.query;
    const { locationId, pickupDate, dropOffDate, pickupTime, dropOffTime } =
      req.query;

    console.log(filters);
    // const { location, pickupDate, dropOffDate } = req.body;
    if (!location || !pickupDate || !dropOffDate)
      return res
        .status(400)
        .json({
          message: "location (id ) pickupDate droopOffDate are required",
          example:
            "/search?pickupDate=${searchOptions.pickupDate}&pickupTime=${searchOptions.pickupTime}&dropOffDate=${searchOptions.dropOffDate}&dropOffTime=${searchOptions.dropOffTime} &locationId=${locationId}",
        });
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
    res.status(201).json({ locations, topPicks });
  } catch (error) {}
};
exports.home = home;
