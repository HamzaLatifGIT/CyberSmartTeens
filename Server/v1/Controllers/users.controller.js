const express = require("express");
const Users = require("../Models/users.model");
const jwt = require("jsonwebtoken");
const JWT = require("../../Utilities/generateToken");
const { uploadFile } = require("../../Utilities/uploader");




require("dotenv").config();

// Login User
exports.Loginuser = async (req, res) => {
  try {
    var { email, password } = req.body;

    const result = await Users.findOne({ email: email });
    if (!result) return res.status(402).json({ status: "failed", message: "Invalid Email or Password" })
    if (!result.comparePassword(password, result?.password)) return res.status(402).json({ status: "failed", message: "Invalid Email or Password" })
    let Token = JWT.generateToken({ email: result.email, role: result.role })

    var { password, ...other } = result?._doc;
    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: other,
        accessToken: Token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};
// Register User
exports.RegisterUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

   
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "failed", message: "Email already exists" });
    }

   
    const newUser = new Users({
      email,
      password,
      firstName,
      lastName,
      role 
    });

    await newUser.save();
    console.log(newUser)

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
};


// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    let UserData = req.UserData;
    let { password, ...otherData } = UserData;

    res.status(200).json({
      status: "success",
      message: "Profile Fetched Successfully",
      data: {
        result: otherData,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};
// Update user Profile
exports.updateUserProfile = async (req, res) => {
  try {
    let UserData = req.UserData;
    let Payload = req.body;
    console.log("========" , Payload);
    console.log(req.file);

    if (req?.file) {
      Payload.profileImage = await uploadFile(req.file)
    }

    let UpdateUser = await Users.findByIdAndUpdate(UserData?._id, { "$set": Payload })

    res.status(200).json({
      status: "success",
      message: "Profile Updated Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};


