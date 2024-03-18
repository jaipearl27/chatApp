// ----------------------------------------------Imports------------------------------------------
import mongoose from "mongoose";

// ------------------------------------------------------------------------------------------------
const { Schema } = mongoose;

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      required: [true, "User Name is a required field"],
      min: [6, "User Name must be of minimum 6 characters"],
      max: [30, "User Name must be of maximum 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    residentialAddress: {
      country: String,
      state: String,
      city: String,
    },
    permanentAddress: {
      country: String,
      state: String,
      city: String,
    },
    accountHolderName: {
      type: String,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: Number,
      //   required: true,
    },
    ifsc: {
      type: String,
    },
    branchCode: {
      type: String,
    },
    aadhaarNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    uanNumber: {
      type: String,
    },
    esiNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["0", "1", "2"],
      default: "2",
    },
    subRole: {
      type: String,
      enum: ["0", "1", "2", "3", "4", "5"],
    },
    doj: {
      type: Date,
      // required: true,
      default: Date.now(),
    },
    assignedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: function () {
          if (this.role === "2") {
            if (this.subRole === "3" || this.subRole === "0") {
              return "coderTask";
            } else if (this.subRole === "4" || this.subRole === "1") {
              return "noteTakerTask";
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
      },
    ],
    bucket: [
      {
        type: Schema.Types.ObjectId,
        ref: function () {
          if (this.role === "2") {
            if (this.subRole === "3" || this.subRole === "0") {
              return "coderTask";
            } else if (this.subRole === "4" || this.subRole === "1") {
              return "noteTakerTask";
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
      },
    ],

    // --------------------------
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    dob: {
      type: Date,
      // required: true,
    },

    ctc: {
      // required: true,
      type: Number,
    },
    processManager: {
      type: String,
      // required: true,
      trim: true,
    },
    reportingManager: {
      type: String,
      // required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://i.ibb.co/QN7GHWC/default-Avatar.jpg",
    },
    isAllDocumentsVerified: {
      // required: true,
      type: Boolean,
      default: false,
    },
    department: {
      // required: true,
      type: String,
      trim: true,
    },

    employeeCode: {
      // required: true,
      type: String,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const employeeModel = mongoose.model(
  "employee",
  employeeSchema,
);
