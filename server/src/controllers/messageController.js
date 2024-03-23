import { messageModel } from "../models/messageModel.js";

// // get all jobs data for the room/chat
export const getAllMessages = async (roomId) => {
  try {
    if (!roomId) res.status(400).json({ message: "id not found" });
    const messages = await jobModel.find({ roomId: roomId });
    if (messages.length > 0) {
      const response = {
        data: messages,
        status: true,
        message: `Messages found successfully`,
      };
      return response;
    } else {
      const response = {
        data: messages,
        status: false,
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
      }
    return response;
  }
};

export const addMessage = async (roomName, userId, userName, message) => {
  try {
    const data = {
      roomName: roomName,
      userId: userId,
      userName: userName,
      message: message,
      readBy: [userName]
    }
    const result = await messageModel.insert(data);
    console.log('message added', result)
    if(result){
      return {status: true, data: data}
    } 
    return {status: false, data: null}

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
      readBy: [userName]
    }
    const result = await messageModel.insert(data);
    console.log('message added', result)
    if(result){
      return {status: true, data: data}
    } 
    return {status: false, data: null}

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