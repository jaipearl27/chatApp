import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
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
    userId: {
      type: String,
      required: [true, "userId is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "userName is required"],
      trim: true,
    },
    users: {
      type: [String],
      required: [true, "users is required"],
    },
    // user: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "employee",
    //   required: [true, "user id is required"],
    //   trim: true,
    // },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true,
    },
    reactions: [
      {
        userId: {
          type: String,
          required: [true, "userId is required"],
          trim: true,
        },
        userName: {
          type: String,
          required: [true, "userName is required"],
          trim: true,
        },
        reaction: {
          type: String,
          required: [true, "reaction is required"],
          trim: true,
        },
      },
    ],
    replies: [
     
      
          {
            userId: {
              type: mongoose.Types.ObjectId,
              ref: "employees",
              required: [true, "userId is required"],
              trim: true,
            },
            userName: {
              type: String,
              required: [true, "userName is required"],
              trim: true,
            },
            reaction: {
              type: String,
              required: [true, "reaction is required"],
              trim: true,
            },
            required: [false],
          },
        ],
      },
    ],
    readBy: [
      {
        userId: {
          type: String,
          required: [true, "userId is required"],
          trim: true,
        },
        userName: {
          type: String,
          required: [true, "userName is required"],
          trim: true,
        },
      },
    ],
    timestamp: {
      type: String,
      required: [true, "timestamp for message is required"],
      trim: true,
    },
  },
  { 0: true }
);
export const messageModel = mongoose.model(
  "messages",
  messageSchema,
  "messages"
);
