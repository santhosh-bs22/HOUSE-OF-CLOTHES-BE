const authServices = require("../services/auth.services");

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password, phone, address } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required"
        });
      }

      const result = await authServices.signup(name, email, password, phone, address);
      return res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required"
        });
      }

      const result = await authServices.login(email, password);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await authServices.getMe(req.user.id);
      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
      });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();

