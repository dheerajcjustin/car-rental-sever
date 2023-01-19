const mongoose = require("mongoose");
const { Location } = require("../models/locationModel");

const addLocation = async (req, res) => {
  try {
    const { location, image, description } = req.body;

    if (!location || !image || !description)
      return res.status(400).json("location,image ,description is must");
    const locationExits = await Location.findOne({ location });
    if (locationExits)
      return res.status(409).json("location is already existed");

    const newLocation = new Location({ location, image, description });
    await newLocation.save();
    res.status(201).json(`location saved successful ${newLocation}`);
  } catch (error) {
    console.error("location add error ", error);
    res.status(500).json("server addicu poy");
  }
};
exports.addLocation = addLocation;

const addPickupPoint = async (req, res) => {
  try {
    console.log("body of pickup point");
    const { pickupPoint, locationId } = req.body;
    if (!pickupPoint || !locationId)
      return res.status(400).json("pickupPoint and locationId are must ");
    const location = await Location.findByIdAndUpdate(locationId, {
      $push: { pickupPoints: { name: pickupPoint } },
    });
    if (!location) return res.status(400).json("invalid location id ");

    res.status(201).json(`pick up point updated`);
  } catch (error) {
    console.error("location add error ", error);
    res.status(500).json("server addicu poy");
  }
};
exports.addPickupPoint = addPickupPoint;
