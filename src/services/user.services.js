const User = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserServices {
  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedFields = ["name", "phone", "address"];
    const updates = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }

    if (updateData.password) {
      updates.password = await bcrypt.hash(String(updateData.password), 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }
}

module.exports = new UserServices();
