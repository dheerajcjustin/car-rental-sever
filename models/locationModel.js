const mongoose = require("mongoose");
const schema = mongoose.Schema;

const locationSchema = new schema(
  {
    location: { type: String, required: true, trim: true },
    pickupPoints: [{ name: { type: String } }],
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);
exports.Location = Location;
