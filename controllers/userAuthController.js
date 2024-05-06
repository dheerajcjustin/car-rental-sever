const { User, validate } = require("../models/userModel");
const Token = require("../models/tokenModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Joi = require("joi");
const { otpVerifyFunction, sendOtp } = require("../utils/Otp");

// const verifySid = "VA7ef903c2bf7c1b4b3adfc21cf48fd7a7";

const signupWithEmail = async (req, res) => {
      validate(req.body);
      const userExits = await User.findOne({
            $and: [{ mobile: req.body.mobile }, { verified: true }],
      });
      if (userExits?.name) {
            res.status(409).json({
                  message: " mobile  already excites, signup failed",
            });
      } else {
            const hash = await bcrypt.hash(req.body.password, 5);

            const user = new User({
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
                  res.status(500).json({ message: "some went wrong  ", error });
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
                  const user = await User.findOneAndUpdate(
                        { mobile },
                        { verified: true }
                  );
                  const tokenData = {
                        role: "user",
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
                  res.status(400).json({
                        message: " invalid otp verification ",
                  });
            }
      } catch (error) {
            console.log(error);
            res.status(500).json({
                  message: "server error failed",
                  error: error.massage,
            });
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

            const user = await User.findOne({
                  $and: [{ mobile: req.body.mobile }, { verified: true }],
            });
            if (user.name) {
                  console.log();
                  console.log("uer is  found ", user);
                  const validPass = await bcrypt.compare(
                        password,
                        user.password
                  );
                  const tokenData = {
                        role: "user",
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
                              userType: "user",
                        });
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
      const { mobile } = req.body;
      try {
            const user = await User.findOne({
                  mobile: req.body.mobile,
                  verified: true,
            });
            if (user) {
                  console.log("the user need to be forgot password", user);
                  const response = await sendOtp(mobile);
                  if (response.status === true) {
                        res.status(201).json(
                              `otp send successfully at to change password ${mobile}`
                        );
                  } else {
                        res.status(500).json(
                              `otp failed for network error   at ${mobile} contact developer`
                        );
                  }
            } else {
                  res.status(400).json(
                        `there is no user with mobile number${mobile}`
                  );
            }
      } catch (error) {
            console.log(error);
            res.status(500).json("server addichu poy, call the developer");
      }
};
exports.forgotPassword = forgotPassword;

const ChangePasswordOtp = async (req, res) => {
      try {
            const { mobile, otp } = req.body;
            const response = await otpVerifyFunction(otp, mobile);
            console.log("response of otp", response);
            if (response.status === true) {
                  const user = await User.findOne({
                        mobile: req.body.mobile,
                        verified: true,
                  });
                  if (user) {
                        let passwordToken = await Token.findOne({
                              userId: user._id,
                        });
                        if (!passwordToken) {
                              passwordToken = await new Token({
                                    userId: user._id,
                                    token: crypto
                                          .randomBytes(32)
                                          .toString("hex"),
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

            const user = await User.findById(userId);
            if (!user)
                  return res
                        .status(400)
                        .send(
                              "invalid at userId,  is no user with that userId or expired"
                        );
            const token = await Token.findOne({
                  userId: userId,
                  token: passwordToken,
            });
            if (!token) return res.status(400).send("Invalid link or expired");
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

const resendOtp = async (req, res) => {
      console.log(req.body);
      try {
            const { mobile } = req.body;
            const response = await sendOtp(mobile);

            if (response.status === true) {
                  res.status(201).json({
                        message: `success`,
                        otpStatus: `sending to${mobile} `,
                  });
            } else {
                  res.status(400).json({
                        message: `error`,
                        otpStatus: `sending to${mobile} `,
                  });
            }
      } catch (error) {
            console.log(error);
            res.status(500).json({ message: "error", error });
      }
};
exports.resendOtp = resendOtp;
