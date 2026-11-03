const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtservices = require("../jwt/jwt.services.js");
const { Roles } = require("../constants/roles.js");

class AuthServices {
  async signup(name, email, password, phone = "", address = {}) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: Roles.CUSTOMER,
    });

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
    const token = jwtservices.generateToken(payload);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
    const token = jwtservices.generateToken(payload);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async getMe(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }
}

module.exports = new AuthServices();

