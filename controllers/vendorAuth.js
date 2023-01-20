const { Vendor, validate } = require("../models/vendorModel");
const Token = require("../models/tokenModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Joi = require("joi");
const { sendOtp, otpVerifyFunction } = require("../utils/Otp");

const signupVendor = async (req, res) => {
  validate(req.body);
  const userExits = await Vendor.findOne(
    { mobile: req.body.mobile },
    { verified: true }
  );
  if (userExits) {
    res
      .status(409)
      .json({ message: "email,or mobile  already excites, signup failed" });
  } else {
    const hash = await bcrypt.hash(req.body.password, 5);

    const user = new Vendor({
      name: req.body.name,
      mobile: req.body.mobile,
      password: hash,
      verified: false,
    });
    try {
      await user.save();
      const response = await sendOtp(req.body.mobile);
      if (response.status === true) {
        res.status(201).json({
          message: `successfully signup  and `,
          otpStatus: `sending to ${req.body.mobile} `,
        });
      } else {
        res.status(400).json({
          message: `twlio error or sever down  `,
          otpStatus: `sending to${req.body.mobile} `,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "some went wrong  ", error });
    }
  }
};
exports.signupVendor = signupVendor;
const otpVerify = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const response = await otpVerifyFunction(otp, mobile);
    console.log("response of otp", response);
    if (response.status === true) {
      const user = await Vendor.findOneAndUpdate(
        { mobile },
        { verified: true }
      );
      const tokenData = {
        role: "vendor",
        userData: {
          name: user.name,
          userId: user._id,
          mobile: user.mobile,
        },
      };
      const accessToken = await JWT.sign(
        tokenData,
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.status(201).json({
        message: "otp successful",
        accessToken,
        user,
        userType: "user",
      });
    } else {
      res.status(400).json({ message: " invalid otp verification " });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "server error failed", error: error.massage });
  }
};
exports.otpVerify = otpVerify;

const loginVendor = async (req, res) => {
  console.log("inside the login body is ", req.body);
  console.log("inside the login body is ", req.body);
  const { mobile, password } = req.body;
  if (!mobile || !password) return res.status(400).json("mobile password must");
  try {
    console.log("checking the user ");

    const user = await Vendor.findOne({ mobile, verified: true });
    if (user) {
      console.log();
      console.log("uer is  found ", user);
      const validPass = await bcrypt.compare(password, user.password);
      const tokenData = {
        role: "vendor",
        userData: {
          name: user.name,

          userId: user._id,
          mobile: user.mobile,
        },
      };
      console.log("valid pass is comming ");

      if (validPass) {
        console.log("valid pass ");

        const accessToken = await JWT.sign(
          tokenData,
          process.env.ACCESS_TOKEN_SECRET
        );
        console.log("login succes fuls ");
        return res.status(201).json({
          message: "login successful",
          accessToken,
          user,
          userType: "vendor",
        });
      }
    }
    console.log("invalid password or username");
    res.status(400).json({ massage: "invalid user name of password" });
  } catch (error) {
    console.log("erreor");
    console.log("somthing went worindg ");

    console.log(error.massage);
    res.status(500).json({ massage: "server error user name of password" });
  }
};
exports.loginVendor = loginVendor;
