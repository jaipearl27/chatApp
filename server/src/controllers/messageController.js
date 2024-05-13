import { messageModel } from "../models/messageModel.js";

export const getAllMessages = async (roomId) => {
  try {
    if (!roomId) res.status(400).json({ message: "id not found" });
    const messages = await messageModel.find({ roomName: roomId });
    if (messages.length > 0) {
      const response = {
        chats: messages,
        status: true,
        message: `Messages found successfully`,
      };
      return response;
    } else {
      const response = {
        chats: messages,
        status: true,
        message: `No messages for this room found`,
      };
      return response;
    }
  } catch (error) {
    console.log(error);
    const response = {
      data: [],
      status: false,
      message: error?.message,
    };
    return response;
  }
};

export const getChatHistory = async (userName) => {
  // Define the pipeline for aggregation
  const pipeline = [
    {
      $match: { userName: userName },
    },
    {
      $group: {
        _id: "$roomName",
        messages: { $push: "$$ROOT" },
        roomTitle: { $last: "$roomTitle" },
        roomType: { $last: "$roomType" },
        users: {$last: "$users"}
      },
    },
  ];

  const chatHistory = await messageModel.aggregate(pipeline).catch((error) => {
    console.error(error.message);
  });

  return { status: true, chatHistory: chatHistory };
};

export const addMessage = async (newMessage) => {
  try {
    const data = {
      roomName: newMessage.roomName,
      roomTitle: newMessage.roomTitle,
      roomType: newMessage.roomType,
      userId: newMessage.userId,
      userName: newMessage.userName,
      users: newMessage?.users,
      message: newMessage.message,
      readBy: newMessage.readBy,
      reactions: newMessage.reactions,
      timestamp: newMessage.timestamp,
    };

    const messageData = new messageModel(data);
    const result = await messageData.save();

    console.log("message added", result);
    if (result) {
      return { status: true, data: data };
    }
    return { status: false, data: null };
  } catch (error) {
    console.log(error);
    const response = {
      data: [],
      status: false,
      messages: error?.message,
    };
    return response;
  }
};

export const updateReadReceipt = async (roomId, userId, userName, message) => {
  try {
    const data = {
      roomId: roomId,
      userId: userId,
      userName: userName,
      message: message,
      readBy: [userName],
    };
    const result = await messageModel.insert(data);
    // console.log('message added', result)
    if (result) {
      return { status: true, data: data };
    }
    return { status: false, data: null };
  } catch (error) {
    console.log(error);
    const response = {
      data: [],
      status: false,
      messages: error?.message,
    };
    return response;
  }
};
