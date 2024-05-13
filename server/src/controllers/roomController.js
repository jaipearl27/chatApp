import { roomModel } from "../models/roomModel.js";

export const insertRoom = async (data) => {
  try {
    const data = {
      roomName: data.roomName,
      roomTitle: data.roomTitle,
      roomType: data.roomType,
      user: data.userId,
      admins: data.admins,
    }

    const roomData = new roomModel(data);
    const result = await roomData.save();

    console.log("room added", result);
    if (result) {
      return { status: true, data: result };
    }
    return { status: false, data: null };
  } catch (error) {
    const response = {
      data: [],
      status: false,
      messages: error?.message,
    };
    return response;
  }
};

