import { roomModel } from "../models/roomModel.js";

export const insertRoom = async (data) => {
  try {
    const data1 = {
      roomName: data.roomName,
      roomTitle: data.roomTitle,
      roomType: data.roomType,
      users: data.users,
      admins: data.admins,
    };

    const roomExists = await findRoom(data.roomName);

    if (roomExists.status) {
      return {
        status: true,
        data: roomExists.data,
        message: "room alredy exists, here's the data tho",
      };
    } else {
      const roomData = new roomModel(data1);
      const result = await roomData.save();

      console.log("room added", result);
      if (result) {
        return { status: true, data: result };
      }
      return { status: false, data: null };
    }
  } catch (error) {
    const response = {
      data: [],
      status: false,
      messages: error?.message,
    };
    return response;
  }
};

export const findRoom = async (roomName) => {
    try {
        const result = await roomModel.find({ roomName: roomName });
        // console.log(result)
        if(result.length > 0) {
            return {status: true, data: result}
        } else {
            return {status: false }
        }
    } catch (err) {
        console.error(err)
    }
  
}