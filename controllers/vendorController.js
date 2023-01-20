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
      verified: false,
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
