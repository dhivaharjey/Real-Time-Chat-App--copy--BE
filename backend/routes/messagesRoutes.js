import express from "express";
import { allMessages, sendMessage } from "../controllers/messageControllers.js";
import authentication from "../middleware/authMiddleware.js";

const messageRoutes = express.Router();
messageRoutes.route("/").post(authentication, sendMessage);
messageRoutes.route("/:chatId").get(authentication, allMessages);
export default messageRoutes;
