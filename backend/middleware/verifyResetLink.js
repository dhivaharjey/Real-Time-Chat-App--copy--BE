import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

const verifyResetLinkToken = async (req, res, next) => {
  const token = req.params.token;

  if (!token) {
    return res.status(404).json({ error: "Token is Missing !!!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found.middle" });
    }
    req.user = user;
    // console.log("crossed");
    console.log("verfiy", req.user);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    console.log("rrrrrrrrrrr", error);

    return res.status(401).json({ error: "Invalid token." });
  }
};
export default verifyResetLinkToken;
