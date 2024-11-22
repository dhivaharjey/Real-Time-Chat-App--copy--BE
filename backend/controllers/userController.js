import asyncHandler from "express-async-handler";
import {
  logInValidation,
  resetPasswordValidation,
  signUpValidation,
} from "../validation/validationSchema.js";
import User from "../models/userModel.js";
import generateToken from "../Config/generateToken.js";
import expressAsyncHandler from "express-async-handler";
// import multer from "multer";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { sendRsetLink } from "../utils/resetPasswordLink.js";
import jwt from "jsonwebtoken";

dotenv.config();
export const registerUser = asyncHandler(async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, confirmPassword, picture } = req.body;

    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      process.env.DECRYPT_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    const decryptedConfirmPassword = CryptoJS.AES.decrypt(
      confirmPassword,
      process.env.DECRYPT_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    // console.log(
    //   "decryptedPassword",
    //   decryptedPassword,
    //   "confirm pass decrypt ",
    //   decryptedConfirmPassword
    // );
    const validationData = {
      name,
      email,
      password: decryptedPassword,
      confirmPassword: decryptedConfirmPassword,
      picture,
    };
    const validatedData = signUpValidation(validationData);
    // const { name, email, password, picture } = validatedData;
    // console.log(validatedData);

    const isUserNameExists = await User.findOne({ name: validatedData.name });
    if (isUserNameExists) {
      return res.status(401).json({ error: "User Name Already Exists" });
    }
    const isUserEmailExists = await User.findOne({
      email: validatedData.email,
    });
    if (isUserEmailExists) {
      return res.status(401).json({ error: "User Email Already Exists" });
    }
    // console.log("validationData", validationData);

    // const picture = req.file ? req.file.path : validatedData.picture;
    const user = new User({
      name,
      email,
      password: decryptedPassword,
      picture,
    });
    await user.save();

    if (user) {
      return res.status(201).json({
        ...user._doc,
        // token: generateToken(user._id),
        message: "User Registered Successfully",
      });
    }
  } catch (error) {
    if (error.message) {
      res.status(400).json({
        error: error.message,
      });
      console.log(error.message);
    }
    console.log(error);

    return res
      .status(500)
      .json({ status: false, error: "Internal server error!" });
  }
});

export const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log("body", password);

  const decryptedPassword = CryptoJS.AES.decrypt(
    password,
    process.env.DECRYPT_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  console.log("decrypt", decryptedPassword);
  const validationData = { email, password: decryptedPassword };

  try {
    const validatedData = logInValidation(validationData);
    const { email, password } = validatedData;
    const user = await User.findOne({ email }); // or User.findOne({ email:validationData.email  })
    // console.log(user);

    // console.log("validationresult pass", password);
    // console.log(password);

    if (!user) {
      return res.status(401).json({ error: "Email is Invalid" });
    }
    // const testPassword = "Dhivahar@123";
    const isPassword = await user.comparePassword(validatedData.password); // comparePassword(validationData.password)
    // console.log(isPassword);
    if (!isPassword) {
      return res.status(401).json({ error: "Password is Invalid" });
    }

    const token = generateToken(user._id);
    console.log("generated token", token);
    console.log("user", user._id, user);

    // res.cookie("authToken", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    // });
    return res.status(200).json({
      ...user._doc,
      token: generateToken(user._id),
      status: true,
      message: "Logged In Successfully!",
      //  token,
    });
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      return res.status(400).json({ status: false, error: error.message });
    }
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error!" });
  }
});

export const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export const forgetPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    if (
      user.resetPasswordTokenExpires &&
      user.resetPasswordTokenExpires > Date.now()
    ) {
      return res.status(400).json({
        message:
          "Reset Link is already send in Email try again after 15 minutes",
      });
    } else {
      console.log(email);
      // const token1 = generateToken(user._id, "15m");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15m",
      });

      user.resetPasswordTokenExpires = Date.now() + 900000;
      await user.save();
      await sendRsetLink(email, token);
      return res
        .status(200)
        .json({ message: "Reset Link sent successfully in your Email " });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  const user = req.user;
  const decryptedPassword = CryptoJS.AES.decrypt(
    password,
    process.env.DECRYPT_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  const decryptedConfirmPassword = CryptoJS.AES.decrypt(
    confirmPassword,
    process.env.DECRYPT_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  const validationData = {
    password: decryptedPassword,
    confirmPassword: decryptedConfirmPassword,
  };
  try {
    console.log("body-----", req.body);
    console.log("user-----", user);

    const validatedData = resetPasswordValidation(validationData);
    console.log(validatedData);
    console.log("validatedData------", validatedData);

    if (!user) {
      if (!user) {
        console.log("User not found.");
        return res.status(404).json({ error: "User not found.middle" });
      }
    }
    const isOldPassword = await user.comparePassword(validatedData.password);
    if (isOldPassword) {
      return res
        .status(409)
        .json({ error: "New Password Should not be same as old password " });
    } else {
      // user.password = password;
      user.password = validatedData.password;
      await user.save();
      return res.status(200).json({ message: "Password Changed Successfully" });
    }
  } catch (error) {
    console.log(error);

    res
      .status(400)
      .json({ error: error.message || "Couldn't Change password" });
  }
});
