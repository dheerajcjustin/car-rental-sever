require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
const dbConnect = require("./config/mongoose");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const corsOptions = require("./config/corsOption");
const credentials = require("./middleware/credentials");
const vendorRoutes = require("./routes/vendorRoutes");
const morgan = require("morgan");

server.use(credentials);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors(corsOptions));
dbConnect();
server.use(morgan("dev"));
server.use("/", homeRoutes);
server.use("/auth", authRoutes);
server.use("/vendor", vendorRoutes);
server.use("/admin", adminRoutes);
server.use("*", (req, res) => {
  res.status(404).json("welcome to car rental api and you have invalid path");
});

server.listen(process.env.port, () => {
  console.log(
    "server run ayye !!!! at http://localhost:" + process.env.port + "/"
  );
});
