const { Car } = require("../models/carModel");
const { Vendor } = require("../models/vendorModel");
const { getDateRange } = require("../utils/dateRange");

const addCar = async (req, res) => {
  const { carData, url } = req.body;
  console.log("body is ", req.body);
  // console.log("the date array ", req.body.availabl.start);
  console.log("useris ", req.user);

  try {
    const availableTime = getDateRange(
      carData.availableStart,
      carData.availableEnd
    );
    const car = new Car({
      name: carData.modelName,
      price: carData.price,
      seatNum: carData.seatNum,
      location: carData.location,
      price: carData.price,
      rcNumber: carData.rcNumber,
      verified: "pending",
      phots: url,
      vendor: req.user,
      availableTime,
    });
    await car.save();
    await Vendor.findByIdAndUpdate(req.user, { $push: { cars: car._id } });
    res.status(201).json("data saved successfully");
  } catch (error) {
    res.status(500).json("sever error call the developer");
  }

  // console.log("headers are", req.header);
  res.status(201).json(req.body);
};

exports.addCar = addCar;
const myCars = async (req, res) => {
  console.log("wowow inside the add car ");
  console.log(req.user);
  console.log("the roele is ", req.user);
  let cars = await Vendor.aggregate([
    { $unwind: "$cars" },
    {
      $lookup: {
        from: "cars",
        localField: "cars",
        foreignField: "_id",

        as: "vendorCars",
      },
    },
  ]);
  console.log(cars[0].vendorCars);
  cats = JSON.stringify(cars.vendorCars);

  res.status(201).json(`the user is ${cars}`);
};
exports.myCars = myCars;
