const { User } = require("../models/userModel");
const Token = require("../models/tokenModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Joi = require("joi");
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
      .status(409)
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
      const user = await User.findOneAndUpdate({ mobile }, { verified: true });
      const tokenData = {
        role: "user",
        userData: {
          name: user.name,
          email: user.email,
          userId: user._id,
          mobile: user.mobile,
        },
      };
      const accessToken = await JWT.sign(
        tokenData,
        process.env.ACCESS_TOKEN_SECRET
      );
      res
        .status(201)
        .json({ message: "otp verification successful", accessToken, user });
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
  console.log();
  console.log();
  console.log();

  console.log("inside the login body is ", req.body);
  const { mobile, password } = req.body;
  try {
    console.log("checking the user ");

    const user = await User.findOne({ mobile });
    if (user) {
      console.log();
      console.log("uer is  found ", user);
      const validPass = await bcrypt.compare(password, user.password);
      const tokenData = {
        role: "user",
        userData: {
          name: user.name,
          email: user.email,
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
        return res
          .status(201)
          .json({ message: "login successful", accessToken, user });
      }
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
exports.loginWithEmail = loginWithEmail;

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      mobile: req.body.mobile,
      verified: true,
    });
    if (user) {
      console.log("the user need to be forgot password", user);
      const response = await sendOtp(mobile);
      if (response.status === true) {
        let passwordToken = await Token.findOne({ userId: user._id });
        if (!passwordToken) {
          passwordToken = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
        }
      } else {
        res.status(406).json({
          message: `otp failed for  at ${mobile} contact developer`,
        });
      }
      res.status(201).json({
        message: `otp send successfully at ${mobile}`,
        passwordToken: passwordToken.token,
        userId: passwordToken.userId,
      });
    } else {
      res
        .status(400)
        .json({ message: `there is no user with mobile number${mobile}` });
    }
  } catch (error) {
    res.status(500).json("server addichu poy, call the developer");
  }
};
exports.forgotPassword = forgotPassword;

const changePassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { password, userId, token } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send("invalid at userId,  is no user with that userId or expired");

    const passwordToken = await Token.findOne({
      userId: userId,
      token: token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");
    user.password = password;
    await user.save();
    await passwordToken.delete();
    res.status(201).json("password changed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("server addichu poy, call the developer");
  }
};
exports.changePassword = changePassword;
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
