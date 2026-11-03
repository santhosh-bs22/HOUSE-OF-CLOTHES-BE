const userServices = require("../services/user.services");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await userServices.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const updatedUser = await userServices.updateProfile(req.user.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();

