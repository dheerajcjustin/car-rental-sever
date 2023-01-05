const { User } = require("../models/userModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_AUTH_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
// const verifySid = "VA7ef903c2bf7c1b4b3adfc21cf48fd7a7";

const signupWithEmail = async (req, res) => {
  const userExits = await User.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });
  if (userExits) {
    res
      .status(202)
      .json({ message: "email,or mobile  already excites, signup failed" });
  } else {
    const hash = await bcrypt.hash(req.body.password, 5);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hash,
    });
    try {
      await user.save();

      const accessToken = await JWT.sign(
        { name: req.body.name, email: req.body.email, userId: user._id },
        "paratuladapatti"
      );
      sendOtp(req.body.mobile);
      res.status(201).json({ message: "successfully signup ", accessToken });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "some went wrong  ", error });
    }
  }
};
exports.signupWithEmail = signupWithEmail;

const otpVerify = (req, res) => {
  console.log("hai req.body is  otp verigy ", req.body);
  const response = otpVerifyFunction(req.body.otp, req.body.mobile);
  console.log("response of otp", response);
  res.json(response);
};
exports.otpVerify = otpVerify;

const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      const accessToken = await JWT.sign(
        { name: user.name, email: user.email, userId: user._id },
        "paratuladapatti"
      );
      return res.status(201).json({ message: "login successful", accessToken });
    }
  }
  res.status(202).json({ massage: "invalid user name of password" });
};
exports.loginWithEmail = loginWithEmail;

function sendOtp(mobile) {
  mobile = Number(mobile);
  client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: `+91${mobile}`, channel: "sms" })
    .then((verification) => {
      console.log("verification chek send opt", verification_check.status);

      return verification.status;
    });
}

function otpVerifyFunction(otp, mobile) {
  client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: `+91${mobile}`, code: otp })
    .then((verification_check) => {
      console.log("verifcation ckeck otp  ", verification_check.status);
      return verification_check.status;
    });
}
