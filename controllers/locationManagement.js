const mongoose = require("mongoose");
const { Location } = require("../models/locationModel");
const objectid = require("valid-objectid");

const addLocation = async (req, res) => {
      try {
            const { location, image, description, coords } = req.body;
            if (!location || !image || !description)
                  return res
                        .status(400)
                        .json("location,image ,description is must");
            const locationExits = await Location.findOne({ location });
            if (locationExits)
                  return res.status(409).json("location is already existed");

            const newLocation = new Location({
                  location,
                  image,
                  description,
                  coords,
            });
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
            const { coords, locationId, pickupPoint } = req.body;
            const { lat, lng } = coords;
            if (!lat || !lng || !locationId || !pickupPoint)
                  return res
                        .status(400)
                        .json("pickupPoint and locationId are must ");
            const location = await Location.findByIdAndUpdate(locationId, {
                  $push: { pickupPoints: { name: pickupPoint, coords } },
            });
            if (!location) return res.status(400).json("invalid location id ");

            res.status(201).json(`pick up point updated`);
      } catch (error) {
            console.error("location add error ", error);
            res.status(500);
      }
};
exports.addPickupPoint = addPickupPoint;

const getPickupPoints = async (req, res) => {
      try {
            console.log("wowow inside get pickups");

            const locationId = req.params.id;
            let pickupPoints = await Location.findById(locationId);
            console.log("wowow inside get pickups with pickups", pickupPoints);

            res.status(200).json(pickupPoints);
      } catch (error) {
            console.log(error);
            res.status(500);
      }
};
exports.getPickupPoints = getPickupPoints;
const locationList = async (req, res) => {
      try {
            const locations = await Location.find({ isActive: true });
            console.log("the list of locatio is", locations);

            res.status(201).json(locations);
      } catch (error) {
            console.error(error);
            res.sendStatus(500);
      }
};
exports.locationList = locationList;

const locationDelete = async (req, res) => {
      try {
            console.log("inside the locations list");
            const { id } = req.params;
            if (!objectid.isValid(id))
                  return res.status(422).json("Invalid Id");
            const locationId = mongoose.Types.ObjectId(id);
            await Location.updateOne({ _id: locationId }, { isActive: false });
            res.status(201).json("wowo update succcresfull");
      } catch (err) {
            console.log("error ouccres and it  is ", err);
            res.status(500).json("sever down");
      }
};
exports.locationDelete = locationDelete;
