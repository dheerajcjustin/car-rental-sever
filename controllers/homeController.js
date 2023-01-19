const { Location } = require("../models/locationModel");

const search = async (req, res) => {
  console.log(req.query);
  if (!req.query.location && !req.query.pickupDate && !req.query.dropOffDate) {
    res.status(400).json({
      message: "invalid query",
      example:
        "http://localhost:5000/search?location=wayanad&pickupDate=2023-01-12&dropOffDate=2023-01-12",
    });
  } else {
    const car = [
      {
        name: "amg g class",
        millage: "12 Km/L",
        price: "1200",
        image:
          "https://res.cloudinary.com/ducziw6jk/image/upload/v1673349269/rental/car3_f0bkir.jpg",
      },
      {
        name: "jepp compass",
        millage: "14 Km/L",
        price: "1100",
        image:
          "https://res.cloudinary.com/ducziw6jk/image/upload/v1673349269/rental/index_elgiqj.jpg",
      },
    ];
    res.status(201).json(car);
  }
};
exports.search = search;

const home = async (req, res) => {
  try {
    const locations = await Location.find().select(
      "location description image pickupPoints"
    );
    res.status(201).json(locations);
  } catch (error) {}
};
exports.home = home;
