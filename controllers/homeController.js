const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");
const { Booking } = require("../models/BookingModel");
const { TimeCombiner, isValidTime } = require("../utils/timeFormat");
const { getDateRange } = require("../utils/dateRange");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

const search = async (req, res) => {
  try {
    let { locationId, pickupDate, dropOffDate, pickupTime, dropOffTime, sort } =
      req.query;
    console.log("the req.quary .page is ", req.query.page);;
    let page = parseInt(req.query.page) || 1;
    page--;
    const limitNum = 3;

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
        .json(
          " pickup time  or dropoff time is invalid format or not in the brkectof "
        );
    let cars;
    if (sort) {
      if (sort.trim() == "high") {
        cars = await Car.find({ location: locationId }).sort({ price: -1 });
      }
      if (sort.trim() == "low") {
        cars = await Car.find({ location: locationId }).sort({ price: 1 });
      }
    }

    cars = await Car.find({ location: locationId }).select(
      "gearType fuelType seatNum location pickup vendor name price photos "
    );



    let locid = mongoose.Types.ObjectId(locationId)


    const availablePickups = await Car.aggregate([
      { $match: { location: locid } },
      { $unwind: "$pickupPoints" },
      {
        $group: {
          _id: "$pickupPoints",
        }
      }, {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "pickupPoints._id",
          as: "pickupPointDetails"
        }
      }
    ])
    // console.log("avilable pickups", availablePickups);
    // const newvalue = availablePickups.map(data => ({ _id: data._id, wowow: { corrds: data.pickupPointDetails[0].coords, name: data.pickupPointDetails[0] } }))
    const pickups = availablePickups.map(data => (data.pickupPointDetails[0].pickupPoints))[0]

    let newPickup = TimeCombiner(pickupDate, pickupTime);
    let newDropOff = TimeCombiner(dropOffDate, dropOffTime);


    let diff = Math.round((newDropOff - newPickup) / (1000 * 60 * 60));

    const time = {
      pickupDate: moment(newPickup).format("MMM Do YYYY"),
      dropOffDate: moment(newDropOff).format("MMM Do YYYY"),
      pickupTime,
      dropOffTime,
      rentPeriod: diff,
    };

    const bookedDates = getDateRange(pickupDate, dropOffDate)
    // console.log("booked dates", bookedDates);
    // [ 2023-01-20T18:30:00.000Z ]
    // const availableCars = await Car.find({ $and: [{ bookedDates: { $exists: true, $nin: [bookedDates] } }, { location: locid }] });
    // console.log("THE BOOKED CARS", availableCars);
    // console.log(vendors);
    console.log("page and limit num ", page, limitNum);
    cars = await Car.aggregate([

      { $match: { $and: [{ bookedDates: { $exists: true, $nin: [bookedDates] } }, { location: locid }] } },
      { $skip: page * limitNum },
      { $limit: limitNum },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationData"
        }
      },
      { $project: { gearType: 1, fuelType: 1, seatNum: 1, location: 1, pickup: 1, vendor: 1, name: 1, price: 1, photos: 1 } }

    ])

    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log("inside the data");
    res.status(201).json({ cars, time, pickups });
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
};

exports.search = search;

const home = async (req, res) => {
  try {
    const locations = await Location.find({ pickupPoints: { $exists: true, $type: 'array', $ne: [] } }).select(
      "location description image pickupPoints"
    );


    res.status(201).json({ locations });
  } catch (error) {
    res.sendStatus(500);
  }
};
exports.home = home;

const booking = async (req, res) => {
  try {
    res.status(201).json({ data: req.body });
    const { carId, payAmount } = req.body;
    let pickupDate = req.body.bookingTime.pickupDate;
    let dropOff = req.body.bookingTime.dropOffDate;
    pickupDate = moment(pickupDate, "MMM Do YYYY").toDate();
    dropOff = moment(dropOff, "MMM Do YYYY").toDate();
    const bookedDates = getDateRange(pickupDate, dropOff);

    await Car.updateOne(
      { _id: carId },
      { $push: { bookedTime: [...bookedDates] } }
    );
    const newBooking = new Booking({
      carId: req.body.carId,
      userId: req.user,
      pickupDate: req.body.bookingTime.pickupDate,
      dropOffDate: req.body.bookingTime.dropOffDate,
      pickupTime: req.body.bookingTime.pickupTime,
      dropOffTime: req.body.bookingTime.dropOffTime,
      price: payAmount,
    });
    newBooking.save();
  } catch (error) {
    res.status(500);
  }
};
exports.booking = booking;
const singleCar = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  let car = await Car.aggregate([{ $match: { _id: id } }, {
    $lookup: {
      foreignField: "pickupPoints._id",
      from: "locations",
      localField: "pickupPoints",
      as: "availableLocation",
    }
  }]);


  let arrya1 = car[0].availableLocation[0].pickupPoints;
  let arrya2 = car[0].pickupPoints;


  arrya1 = arrya1.map(elm => ({ name: elm.name, coords: elm.coords, _id: (String(elm._id)) }))
  arrya2 = arrya2.map(elm => (String(elm)))
  const newData = arrya1.filter(({ _id }) => arrya2.includes(_id));

  car = car[0];
  car.availableLocation = car.availableLocation[0]
  car.availableLocation.pickupPoints = newData;


  res.status(201).json({ car });

}
exports.singleCar = singleCar;