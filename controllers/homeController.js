const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");
const { TimeCombiner, isValidTime } = require("../utils/timeFormat");

const search = async (req, res) => {
  try {
    let { locationId, pickupDate, dropOffDate, pickupTime, dropOffTime } =
      req.query;

    if (
      !locationId ||
      !pickupDate ||
      !dropOffDate ||
      !dropOffTime ||
      !pickupTime
    )
      return res.status(400).json({
        message: "locationId  pickupDate droopOffDate are required",
        example:
          "/search?pickupDate=${searchOptions.pickupDate}&pickupTime=${pickupTime}&dropOffDate=${searchOptions.dropOffDate}&dropOffTime=${searchOptions.dropOffTime} &locationId=${locationId}",
      });

    if (!isValidTime(pickupTime) || !isValidTime(dropOffTime))
      return res
        .status(400)
        .json(" pickup time  or dropoff time is invalid format ");
    pickupDate = new Date(pickupDate);
    dropOffDate = new Date(dropOffDate);

    // console.log(pickupDate, dropOffDate);
    const cars = await Car.find();

    const newPickup = TimeCombiner(pickupDate, pickupTime);
    const newDropOff = TimeCombiner(dropOffDate, dropOffTime);

    console.log(
      "new pickup and dropoff",
      new Date(newPickup),
      new Date(newDropOff)
    );

    // console.log(cars);
    res.status(201).json(cars);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
};

exports.search = search;

const home = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).select(
      "location description image pickupPoints"
    );
    const topPicks = await Car.find();
    res.status(201).json({ locations, topPicks });
  } catch (error) {}
};
exports.home = home;
