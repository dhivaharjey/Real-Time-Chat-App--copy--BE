import express from "express";
import authentication from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroupChat,
  createGroupChat,
  fetchChats,
  removeFromGroupChat,
  renameGroup,
} from "../controllers/chatControllers.js";

const chatRoute = express.Router();
chatRoute.route("/").post(authentication, accessChat);
chatRoute.route("/").get(authentication, fetchChats);
chatRoute.route("/group").post(authentication, createGroupChat);
chatRoute.route("/rename-group").put(authentication, renameGroup);
chatRoute.route("/add-to-group").put(authentication, addToGroupChat);
chatRoute.route("/remove-from-group").put(authentication, removeFromGroupChat);
export default chatRoute;
