const { Location } = require("../models/locationModel");
const { Car } = require("../models/carModel");
const { Booking } = require("../models/BookingModel");
const { TimeCombiner, isValidTime } = require("../utils/timeFormat");
const { getDateRange } = require("../utils/dateRange");
const moment = require("moment");

const search = async (req, res) => {
  try {
    let { locationId, pickupDate, dropOffDate, pickupTime, dropOffTime, sort } =
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
        .json(
          " pickup time  or dropoff time is invalid format or not in the brkectof "
        );
    let cars;
    if (sort) {
      if (sort.trim() == "high") {
        console.log("sorting by price high");
        cars = await Car.find().sort({ price: -1 });
      }
      if (sort.trim() == "low") {
        console.log("sorting by price low");
        cars = await Car.find().sort({ price: 1 });
      }
    }
    cars = await Car.find().select(
      "gearType fuelType seatNum location pickup vendor name price photos"
    );

    let newPickup = TimeCombiner(pickupDate, pickupTime);
    let newDropOff = TimeCombiner(dropOffDate, dropOffTime);

    console.log("new pickup and dropoff", newPickup, newDropOff);

    let diff = Math.round((newDropOff - newPickup) / (1000 * 60 * 60));

    console.log("the how many hours are going to rent", diff);
    const time = {
      pickupDate: moment(newPickup).format("MMM Do YYYY"),
      dropOffDate: moment(newDropOff).format("MMM Do YYYY"),
      pickupTime,
      dropOffTime,
      rentPeriod: diff,
    };

    // console.log(cars);
    res.status(201).json({ cars, time });
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
  } catch (error) {
    console.log("eerrrer ", error);
    res.sendStatus(500);
  }
};
exports.home = home;

const booking = async (req, res) => {
  try {
    console.log("req.body from booking", req.body);
    res.status(201).json({ data: req.body });
    const { carId } = req.body;
    console.log("car Id ", carId);
    let pickupDate = req.body.bookingTime.pickupDate;
    let dropOff = req.body.bookingTime.dropOffDate;
    console.log(pickupDate);
    pickupDate = moment(pickupDate, "MMM Do YYYY").toDate();
    dropOff = moment(dropOff, "MMM Do YYYY").toDate();
    const bookedDates = getDateRange(pickupDate, dropOff);
    console.log("booked dates", bookedDates);
    // console.log("new time is ", newTime);

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
    });
    newBooking.save();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
exports.booking = booking;
