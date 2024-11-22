import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();
const authentication = expressAsyncHandler(async (req, res, next) => {
  const authHeader =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");

  const token = authHeader && req.headers.authorization.split(" ")[1];
  // const token = req?.cookies?.authToken;
  // console.log("token from req cookie", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
    // return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    // const decode = jwt.decode(token);
    // console.log("d", decode);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    // console.log(user, "middleware");

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found.middle" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token." });
  }
});

export default authentication;
