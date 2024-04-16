import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: [true, "roomName is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "user id is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "user id is required"],
      trim: true,
    },
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
          type: String,
          required: [true, "userId is required"],
          trim: true,
        },
        userName: {
          type: String,
          required: [true, "userName is required"],
          trim: true,
        },
        message: {
          type: String,
          required: [true, "reaction is required"],
          trim: true,
        },
        reactions: [
          { 
            userId: {
              type: mongoose.Types.ObjectId,
              ref: 'employees',
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
            required: [false]
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
        }
      },
    ],
    timestamp: {
      type: String,
      required: [true, "timestamp for message is required"],
      trim: true,
    }
  },
  { timestamps: true }
);
export const messageModel = mongoose.model("messages", messageSchema, "messages");
