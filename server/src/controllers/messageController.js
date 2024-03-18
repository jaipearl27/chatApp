import { messageModel } from "../models/messageModel.js";

// // get all jobs data for the type
export const getAllMessages = async (roomId) => {
  try {
    if (!roomId) res.status(400).json({ message: "id not found" });
    const messages = await jobModel.find({ roomId: roomId });
    if (messages.length > 0) {
      res.status(200).json({
        data: messages,
        status: true,
        message: `Messages found successfully`,
      });
    } else {
      res.status(200).json({
        data: messages,
        status: false,
        message: `No messages for this room found`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      data: [],
      status: false,
      message: error?.message
    });
  }
};


export const addMessage = async (roomId) => {
    try {
        
        if(!roomId) res.status(400).json({message:"incorrect parameters"})
        const {message} = req.body
    } catch (error) {
        console.log(error)        
        res.status(400).json({
            data: [],
            status: false,
            messages: error?.message
        })
    }
}