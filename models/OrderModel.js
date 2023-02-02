const mongoose = require("mongoose");
const Joi = require("joi");
const { boolean } = require("joi");

// const passportLocalMongoose=require("passport-local-mongoose")

const schema = mongoose.Schema;

const orderSchema = new schema(
    {
        pickupDate: { type: Date },
        pickupTime: {
            type: String, enum:
                [
                    "10.00 AM",
                    "11.00 AM",
                    "12.00 PM",
                    "01.00 PM",
                    "02.00 PM",
                    "03.00 PM",
                    "04.00 PM",
                    "05.00 PM",
                ]
        },
        dropOffDate: { type: Date },
        dropOffTime: {
            type: String, enum:
                [
                    "10.00 AM",
                    "11.00 AM",
                    "12.00 PM",
                    "01.00 PM",
                    "02.00 PM",
                    "03.00 PM",
                    "04.00 PM",
                    "05.00 PM",
                ]
        },
        carId: { type: mongoose.Types.ObjectId },
        pickup: [{ type: mongoose.Types.ObjectId }],
        userId: { type: mongoose.Types.ObjectId },
        price: { type: Number },
        pickupStatus: { type: Boolean, default: false },
        dropOffStatus: { type: Boolean, default: false },
    },
    { timestamps: true }
);




const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
