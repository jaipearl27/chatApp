import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Position name is required"],
      trim: true,
      minLength: [2, "Position must contain at least 2 characters"],
      maxLength: [40, "Position should contain maximum 40 characters"],
    }
  },
  { timestamps: true }
);
export const jobModel = mongoose.model("messages", jobSchema, "job");
