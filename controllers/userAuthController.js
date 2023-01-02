const { User } = require("../models/userModel");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const signupWithEmail = async (req, res) => {
  const userExits = await User.findOne({ email: req.body.email });
  if (userExits) {
    console.log(userExits);
    res.status(202).json({ message: "email already excites" });
  } else {
    const hash = await bcrypt.hash(req.body.password, 5);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    try {
      await user.save();

      const accessToken = await JWT.sign(
        { name: req.body.name, email: req.body.email, userId: user._id },
        "paratuladapatti"
      );
      res.status(201).json({ message: "successfully signup ", accessToken });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "some went wrong  ", error });
    }
  }
};
exports.signupWithEmail = signupWithEmail;

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
