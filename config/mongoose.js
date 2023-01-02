const mongoose = require("mongoose");
const dotenv = require("dotenv");
mongoose.set("strictQuery", false);

const config = async () => {
  mongoose
    .connect(process.env.mongo)
    .then(() => {
      console.log("mongoose connceta ayye ketto");
    })
    .catch((err) => {
      console.log("mongoose entho sean unde");
    });
};
module.exports = config;
