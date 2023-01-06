const { User } = require("../models/userModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("express");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_AUTH_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
// const verifySid = "VA7ef903c2bf7c1b4b3adfc21cf48fd7a7";

const signupWithEmail = async (req, res) => {
  const userExits = await User.findOne({
    $and: [
      {
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      },
      { verified: true },
    ],
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
      verified: false,
    });
    try {
      await user.save();
      const response = await sendOtp(req.body.mobile);
      if (response.status === true) {
        res.status(201).json({
          message: `successfully signup  and `,
          otpStatus: `sending to${req.body.mobile} `,
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
exports.signupWithEmail = signupWithEmail;

const otpVerify = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const response = await otpVerifyFunction(otp, mobile);
    console.log("response of otp", response);
    if (response.status === true) {
      const accessToken = await JWT.sign(
        {
          name: user.name,
          email: user.email,
          userId: user._id,
          mobile: user.mobile,
        },
        "paratuladapatti"
      );
      await User.updateOne({ mobile }, { verified: true });
      res
        .status(201)
        .json({ message: "otp verification successful", accessToken });
    } else {
      res.status(400).json({ message: " invalid otp verification " });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "otp failed", error: error.massage });
  }
};
exports.otpVerify = otpVerify;

const loginWithEmail = async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });
  if (user) {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      const accessToken = await JWT.sign(
        {
          name: user.name,
          email: user.email,
          userId: user._id,
          mobile: user.mobile,
        },
        "paratuladapatti"
      );
      return res.status(201).json({ message: "login successful", accessToken });
    }
  }
  res.status(400).json({ massage: "invalid user name of password" });
};
exports.loginWithEmail = loginWithEmail;

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ mobile: req.body.mobile });
  if (user) {
    const response = await sendOtp(mobile);
    const accessToken = await JWT.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
        mobile: user.mobile,
      },
      "paratuladapatti"
    );
    res.status(201).json({ message: `otp send successfully at ${mobile}` });
  } else {
    res
      .status(202)
      .json({ message: `there is no user with mobile number${mobile}` });
  }
};

const forgotPasswordPost = async (req, res) => {
  const password = req.body.password;
  if (password < 8) {
    res.status(202).json({ message: "password must more than 8 character" });
  } else {
    try {
      await User.updateOne();
    } catch (error) {}
  }
};

async function sendOtp(mobile) {
  mobile = Number(mobile);

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" });
    return { status: true, verification };
  } catch (error) {
    return { status: false, error };
  }

  // .then((verification) => {
  //   console.log("verification chek send opt", verification_check.status);

  //   return verification.status;
  // });
  console.log("verification", verification);
  return { status: verification.status };
}

async function otpVerifyFunction(otp, mobile) {
  const verification_check = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: `+91${mobile}`, code: otp });
  console.log("verifcation ckeck otp  ", verification_check.status);
  if (verification_check.status == "approved") {
    return { status: true };
  } else {
    return { status: false };
  }
}
