const { default: mongoose } = require("mongoose");
const { Car } = require("../models/carModel");
const { Vendor } = require("../models/vendorModel");
const { Order } = require("../models/OrderModel")
const { getDateRange } = require("../utils/dateRange");
const { tryCatch } = require("../utils/tryCatch")
const addCar = async (req, res) => {
  const { carData, documents, photos } = req.body;
  // console.log("body is ", req.body);
  // console.log("the date array ", req.body.availabl.start);
  console.log("the car data is in add vendor", carData);
  // console.log("useris ", req.user);
  console.log("douments ,", documents);
  console.log("photos ", photos);
  try {
    const vendorId = mongoose.Types.ObjectId(req.user);
    // const availableTime = getDateRange(
    //   carData.availableStart,
    //   carData.availableEnd
    // );
    const car = new Car({
      name: carData.modelName,
      price: carData.price,
      seatNum: carData.seatNum,
      location: carData.location,
      price: carData.price,
      rcNumber: carData.rcNumber,
      pickupPoints: [...carData.pickupPoints],
      verified: "pending",
      photos: photos,
      documents: documents,
      vendor: vendorId,
      isActive: true,
      fuelType: carData.fuelType,
      gearType: carData.transmission,
    });
    await car.save();
    await Vendor.findByIdAndUpdate(req.user, { $push: { cars: car._id } });
    res.status(201).json("data saved successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("sever error call the developer");
  }
  // console.log("headers are", req.header);
  //  res.status(201).json(req.body);
};
exports.addCar = addCar;
const myCars = async (req, res) => {
  console.log("wowow inside the add car ");
  console.log(req.user);
  console.log("the roele is ", req.user);
  const userId = mongoose.Types.ObjectId(req.user);
  let cars = await Car.aggregate([
    { $match: { vendor: userId } },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    { $unwind: "$location" },
    {
      $project: {
        seatNum: 1,
        "location.location": 1,
        "location._id": 1,
        name: 1,
        rcNumber: 1,
        price: 1,
        photos: 1,
        verified: 1,
      },
    },
  ]);
  // console.log(cars[0]);
  // cars = cars[0]?.vendorCars;
  console.log("vendor cars locarionsdfadskfaskj", cars);
  // const cats = JSON.stringify();
  res.status(201).json(cars);
};
exports.myCars = myCars;
exports.VendorBookings = tryCatch(async (req, res) => {
  const vendorId = mongoose.Types.ObjectId(req.user);
  const upComingEvents = await Car.aggregate([{
    $match: { vendor: vendorId },
  }, {
    $lookup: {
      localField: "_id",
      foreignField: "carId",
      from: "orders",
      as: "myOrders"
    }
  }, { $unwind: "$myOrders" },
  { $match: { "myOrders.dropOffStatus": false } }
  ]);
  const completedEvents = await Car.aggregate([{
    $match: { vendor: vendorId },
  }, {
    $lookup: {
      localField: "_id",
      foreignField: "carId",
      from: "orders",
      as: "myOrders"
    }
  }, { $unwind: "$myOrders" },
  { $match: { "myOrders.pickupStatus": true, "myOrders.dropOffStatus": true } }
  ]);
  // console.log(upComingEvents.map(evnet => evnet.myOrders))
  res.status(201).json({ upComingEvents, completedEvents })
})

exports.bookingsStatus = tryCatch(async (req, res) => {
  const { orderId, pickupStatus, dropOffStatus } = req.body;
  console.log("dropOffStatus", (dropOffStatus));
  console.log("pickupStatus", (pickupStatus),);
  if (pickupStatus) {
    console.log("pickupStatus");
  }
  if (dropOffStatus) {
    console.log("dropOffStatus");
  }
  // if (pickupStatus || dropOffStatus) return res.status(400).json("valid status  values are 'pickupStatus' ,'dropOffStatus' ")

  let order;
  if (pickupStatus) {
    order = await Order.findByIdAndUpdate(orderId, { $set: { pickupStatus: true } })
    return res.status(201).json(order);
  } if (dropOffStatus) {
    order = await Order.findByIdAndUpdate(orderId, { $set: { dropOffStatus: true } })
    return res.status(201).json(order);

  }
  res.status(201)
})