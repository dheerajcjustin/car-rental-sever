const { Vendor, validate } = require("../models/vendorModel");
const Token = require("../models/tokenModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Joi = require("joi");
const { sendOtp, otpVerifyFunction } = require("../utils/Otp");
const { tryCatch } = require("../utils/tryCatch")

const signupVendor = async (req, res) => {
  validate(req.body);
  const userExits = await Vendor.findOne(
    { mobile: req.body.mobile },
    { verified: true }
  );
  if (userExits?.name) {
    console.log("user is aleray exits while signup", userExits);
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
        res.status(503).json({
          message: `twlio error or sever down  `,
          otpStatus: `sending to${req.body.mobile} `,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "some went wrong  ", error });
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
const forgotPassword = async (req, res) => {
  const { mobile } = req.body;
  try {
    const user = await Vendor.findOne({
      mobile: req.body.mobile,
      verified: true,
    });
    if (user) {
      console.log("the user need to be forgot password", user);
      const response = await sendOtp(mobile);
      if (response.status === true) {
        res
          .status(201)
          .json(`otp send successfully at to change password ${mobile}`);
      } else {
        res
          .status(500)
          .json(
            `otp failed for network error   at ${mobile} contact developer`
          );
      }
    } else {
      res.status(400).json(`there is no user with mobile number${mobile}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
exports.forgotPassword = forgotPassword;

const ChangePasswordOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const response = await otpVerifyFunction(otp, mobile);
    console.log("response of otp", response);
    if (response.status === true) {
      const user = await Vendor.findOne({
        mobile: req.body.mobile,
        verified: true,
      });
      if (user?.name) {
        let passwordToken = await Token.findOne({ userId: user._id });
        if (!passwordToken) {
          passwordToken = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
        }
        res.status(201).json({
          message: "token and userId  for password change send successfull   ",
          passwordToken: passwordToken.token,
          userId: passwordToken.userId,
        });
      } else {
        res.status(400).json("invalid mobile");
      }
    } else {
      res.status(400).json("invalid otp");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("server addichr poy");
  }
};
exports.ChangePasswordOtp = ChangePasswordOtp;

const changePassword = async (req, res) => {
  console.log("what is inside password change");
  try {
    const schema = Joi.object({
      password: Joi.string().required(),
      userId: Joi.string().required(),
      passwordToken: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { password, userId, passwordToken } = req.body;
    console.log(password);
    console.log(userId);
    console.log(passwordToken);
    console.log("this change passowrd working");
    const uid = mongoose.Types.ObjectId(userId);
    const user = await Vendor.findOne({ _id: uid });
    console.log("user is in passowed dchandg ", user);
    if (!user)
      return res
        .status(400)
        .send("invalid at userId,  is no user with that userId or expired");
    const token = await Token.findOne({
      userId: uid,
      token: passwordToken,
    });
    if (!token)
      return res.status(400).send("Token error   Invalid link or expired");
    const hash = await bcrypt.hash(password, 5);
    user.password = hash;
    await user.save();
    // await passwordToken.delete();
    res.status(201).json("password changed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("server addichu poy, call the developer");
  }
};
exports.changePassword = changePassword;

exports.profilePatch = tryCatch(async (req, res) => {

  console.log(req.body);
  const { name, mobile, otp } = req.body;
  const vendorId = req.user;
  const response = await otpVerifyFunction(otp, mobile);
  console.log("response of otp", response);
  if (response.status === true) {
    await Vendor.updateOne({ _id: vendorId }, { $set: { name: name, mobile: mobile } });
    res.status(200).json(req.body)
  } else {
    res.status(400);
  }
})
exports.sendOtp = tryCatch(async (req, res) => {
  const { name, mobile } = req.body;

  console.log(mobile);
  const checkMobile = await Vendor.findOne({ mobile })
  if (String(checkMobile._id) == req.user) {
    const response = await sendOtp(mobile);
    if (response.status === true) {
      res.status(201).json({ mobile, name })
    } else {
      res.status(400).json("invalid mobile")
    }
  } else {
    res.status(400).json("mobile number already exits");
  }


})

exports.getProfile = tryCatch(async (req, res) => {
  const vendorId = req.user;
  const profile = await Vendor.findById(vendorId).select("name mobile profilePic")
  res.send(201).json(profile);
})