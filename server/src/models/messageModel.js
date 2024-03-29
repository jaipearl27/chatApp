import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: [true, "roomName is required"],
      trim: true,
    },
    userid : {
      type: String,
      required: [true, "user id is required"],
      trim: true
    },
    username : {
      type: String,
      required: [true, "user id is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true
    }
  },
  { timestamps: true }
);
export const messageModel = mongoose.model("messages", messageSchema, "job");
