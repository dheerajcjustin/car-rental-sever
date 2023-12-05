const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BookingSchema = new schema(
      {
            pickupDate: { type: String, required: true, trim: true },
            dropOffDate: { type: String, required: true, trim: true },
            pickupTime: { type: String, required: true, trim: true },
            dropOffTime: { type: String, required: true, trim: true },
            userId: { type: mongoose.Types.ObjectId },
            carId: { type: mongoose.Types.ObjectId },
            pickupStatus: { type: Boolean, default: false },
            dropOffStatus: { type: Boolean, default: false },
      },
      { timestamps: true },
);

const Booking = mongoose.model("Booking", BookingSchema);
exports.Booking = Booking;
