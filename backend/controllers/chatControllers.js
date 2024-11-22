import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User Id is not send in the request" });
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    if (isChat.length > 0) {
      return res.json(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
    }
    const createChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );
    return res.status(200).json(FullChat);
  } catch (error) {
    console.error(error, "hello");
    return res
      .status(400)
      .json({ error: error.message || "Internal Server Error" });
  }
});

export const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name picture email",
        });
        res.status(200).json(result);
      });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
});

export const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please Fill All the fields" });
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      message: "More than 2 users are required to form a group chat",
    });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      // .map((user) => ({
      //   ...user,
      //   isAdmin: user._id === req.user._id,
      // }))
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
});

export const renameGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json({ error: "Chat not found" });
      // throw new Error("Chat not found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message || "Internal Server Error" });
  }
});

export const addToGroupChat = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(404).json({ message: "Group Chat not found" });
    } else {
      res.status(200).json(added);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
});

export const removeFromGroupChat = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removedUser) {
      res.status(404).json({ message: "Group Chat not found" });
    } else {
      res.status(200).json(removedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
});
