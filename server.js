require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
const dbConnect = require("./config/mongoose");
const userRoutes = require("./routes/userRoutes");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
dbConnect();

server.use("/user", userRoutes);

server.use("*", (req, res) => {
  res.status(404).json("welcome to car rental api and you have invalid path");
});

server.listen(process.env.port, () => {
  console.log(
    "server run ayye !!!! at http://localhost:" + process.env.port + "/"
  );
});
