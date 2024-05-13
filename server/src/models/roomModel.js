import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: [true, "roomName is required"],
      trim: true,
    },

    roomTitle: {
      type: [String],
      required: [true, "roomTitle is required"],
    },

    roomType: {
      type: String,
      required: [true, "roomType is required"],
      trim: true,
    },
    roomAvatar: {
      type: [String],
      required: [true, "roomAvatar is required"],
    },
    users: {
      type: [String],
      required: [true, "users are required"],
    },
    admins: {
      type: [String],
      required: [true, "admins are required"],
    },
  },
  { timestamps: true }
);
export const roomModel = mongoose.model("room", roomSchema);
