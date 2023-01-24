const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");

const search = async (req, res) => {
  try {
    const filters = req.query;
    // if (filters) {
    //   console.log("wowow 403cslsjdfrkfjda;eslfkj");
    //   return res.status(403).json("invalie");
    // }
    let { locationId, pickupDate, dropOffDate, pickupTime, dropOffTime } =
      req.query;
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log("headers of ther  req", authHeader);
    console.log("the data is from middle ware", req.user, req.role);

    // console.log(filters);
    // const { location, pickupDate, dropOffDate } = req.body;
    if (!locationId || !pickupDate || !dropOffDate)
      return res.status(400).json({
        message: "locationId  pickupDate droopOffDate are required",
        example:
          "/search?pickupDate=${searchOptions.pickupDate}&pickupTime=${searchOptions.pickupTime}&dropOffDate=${searchOptions.dropOffDate}&dropOffTime=${searchOptions.dropOffTime} &locationId=${locationId}",
      });
    pickupDate = new Date(pickupDate);
    dropOffDate = new Date(dropOffDate);
    // console.log(pickupDate, dropOffDate);
    const cars = await Car.find();
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
    const locations = await Location.find().select(
      "location description image pickupPoints"
    );
    const topPicks = await Car.find();
    res.status(201).json({ locations, topPicks });
  } catch (error) {}
};
exports.home = home;
