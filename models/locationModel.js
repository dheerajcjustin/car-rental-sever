const mongoose = require("mongoose");
const schema = mongoose.Schema;

const locationSchema = new schema(
  {

    coords: { lat: { type: Number }, lng: { type: Number } },
    location: { type: String },
    pickupPoints: [{ name: { type: String }, coords: { lat: { type: Number }, lng: { type: Number } } }],
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);
exports.Location = Location;
