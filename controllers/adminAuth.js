const { Admin, validateAdmin } = require("../models/adminModel");
const { tryCatch } = require("../utils/tryCatch");
const { sendOtp, otpVerifyFunction } = require("../utils/Otp");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
exports.adminSignup = tryCatch(async (req, res) => {
      validateAdmin(req.body);
      const userExits = await Admin.findOne(
            { mobile: req.body.mobile },
            { verified: true },
      );
      if (userExits?.name) {
            res.status(409).json({
                  message: "email,or mobile  already excites, signup failed",
            });
      } else {
            const hash = await bcrypt.hash(req.body.password, 5);

            const user = new Admin({
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
});

const otpVerify = tryCatch(async (req, res) => {
      const { mobile, otp } = req.body;
      const response = await otpVerifyFunction(otp, mobile);
      console.log("response of otp", response);
      if (response.status === true) {
            const user = await Admin.findOneAndUpdate(
                  { mobile },
                  { verified: true },
            );
            const tokenData = {
                  role: "admin",
                  userData: {
                        name: user.name,
                        userId: user._id,
                        mobile: user.mobile,
                  },
            };
            const accessToken = await JWT.sign(
                  tokenData,
                  process.env.ACCESS_TOKEN_SECRET,
            );
            return res.status(201).json({
                  message: "otp successful",
                  accessToken,
                  user,
                  userType: "admin",
            });
      } else {
            res.status(400).json({ message: " invalid otp verification " });
      }
});
exports.otpVerify = otpVerify;
const loginVendor = tryCatch(async (req, res) => {
      console.log("inside the login body is ", req.body);
      console.log("inside the login body is ", req.body);
      const { mobile, password } = req.body;
      if (!mobile || !password)
            return res.status(400).json("mobile password must");
      const user = await Vendor.findOne({ mobile, verified: true });
      if (user) {
            const validPass = await bcrypt.compare(password, user.password);
            const tokenData = {
                  role: "admin",
                  userData: {
                        name: user.name,
                        userId: user._id,
                        mobile: user.mobile,
                  },
            };
            if (validPass) {
                  const accessToken = await JWT.sign(
                        tokenData,
                        process.env.ACCESS_TOKEN_SECRET,
                  );
                  console.log("login succes fuls ");
                  return res.status(201).json({
                        message: "login successful",
                        accessToken,
                        user,
                        userType: "admin",
                  });
            }
      }
      console.log("invalid password or username");
      res.status(400).json({ massage: "invalid user name of password" });
});
exports.loginAdmin = loginVendor;
