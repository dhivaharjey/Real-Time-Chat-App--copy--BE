import express from "express";
import {
  allUsers,
  authUser,
  forgetPassword,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";

import authentication from "../middleware/authMiddleware.js";
import verifyResetLinkToken from "../middleware/verifyResetLink.js";

const userRouter = express.Router();

userRouter.route("/").post(registerUser).get(authentication, allUsers);
userRouter.post("/login", authUser);
userRouter.get("/check-auth", authentication, (req, res) => {
  res.status(200).json(req.user);
});
userRouter.post("/forget-password", forgetPassword);
userRouter.get("/verify-token/:token", verifyResetLinkToken, (req, res) => {
  console.log("route", req.user);

  return res.status(200).json(req.user);
});
userRouter.post("/reset-password/:token", verifyResetLinkToken, resetPassword);
export default userRouter;
