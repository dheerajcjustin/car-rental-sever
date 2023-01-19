const mongoose = require("mongoose");
const Joi = require("joi");
const { boolean } = require("joi");

// const passportLocalMongoose=require("passport-local-mongoose")

const schema = mongoose.Schema;

const carSchema = new schema(
  {
    vendor: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true, trim: true },
    price: { type: Number },
    rcNumber: { type: Number },
    availableStart: { type: String },
    availableEnd: { type: String },
    bookingStart_date: { type: String },
    bookingEnd_date: { type: String },
    bookingStart_time: { type: String },
    bookingEnd_time: { type: String },
    isActive: { type: Boolean },
    phots: [{ type: String }],
  },
  { timestamps: true }
);

function validateCar(car) {
  const schema = Joi.object({
    name: Joi.string()
      .regex(/^[a-zA-Z0-9 ,.'-]+$/)
      .min(5)
      .max(50)
      .required(),
    // email: Joi.string().min(3).max(255).required(),
    // price: Joi.string().required(),
    // mobile: Joi.string()
    //   .regex(/^[0-9]+$/)
    //   .min(10)
    //   .max(10)
    //   .required(),
  });
  let result = schema.validate(user);
  //   if (!result["error"]) result = validatePassword(user.password);

  return result;
}

const Car = mongoose.model("Car", carSchema);
exports.Car = Car;
exports.validateCar = validateCar;
