import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const generateToken = (id, expiresIn = "") => {
  // console.log("user i from generatte token", id);

  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "10h" });
};

export default generateToken;
