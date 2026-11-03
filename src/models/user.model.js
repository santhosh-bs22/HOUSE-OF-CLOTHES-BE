const mongoose = require("mongoose");
const { Roles, ROLES_LIST } = require("../constants/roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ROLES_LIST,
      },
      default: Roles.CUSTOMER,
      required: [true, "Role is Required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
