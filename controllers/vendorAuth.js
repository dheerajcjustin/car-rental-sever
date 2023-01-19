const { Vendor } = require("../models/vendorModel");
const Token = require("../models/tokenModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Joi = require("joi");

const loginVendor = async (req, res) => {
  console.log("inside the login body is ", req.body);
  const { mobile, password } = req.body;
  try {
    console.log("checking the user the data giviven by t ", req.body);

    if (mobile == "9876543210" && password == "qazwsxedc") {
      console.log("hai inside the if of login vendor");
      // const vendor = await Vendor.findOne({ mobile });
      // if (vendor) {
      //   console.log();
      //   console.log("vendor is  found ", vendor);
      //   const validPass = await bcrypt.compare(password, user.password);
      //
      //   console.log("valid pass is comming ");

      //   if (validPass) {
      console.log("valid pass ");
      const userData = {
        name: "vendorDemo",
        userId: "5f66ff9b23b6102410a0c5fa",
        mobile: "944263202",
      };
      const tokenData = {
        role: "vendor",
        userData: {
          name: "vendorDemo",
          userId: "5f66ff9b23b6102410a0c5fa",
          mobile: "944263202",
        },
      };
      const accessToken = await JWT.sign(
        tokenData,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("login succes fuls ");
      return res.status(201).json({
        message: "login successful",
        accessToken,
        user: userData,
        userType: "vendor",
      });
      //   }
    }
    console.log("invalid password or username");
    res.status(400).json({ massage: "invalid user name of password" });
  } catch (error) {
    console.log("erreor");
    console.log("somthing went worindg ");

    console.log(error.massage);
    res.status(400).json({ massage: "invalid user name of password" });
  }
};
exports.loginVendor = loginVendor;
