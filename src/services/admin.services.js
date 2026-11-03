const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtservices = require("../jwt/jwt.services.js");
const { Roles } = require("../constants/roles.js");

class AdminServices {
  async initialSetup(name, email, password) {
    const existingAdmin = await User.findOne({ role: Roles.ADMIN });
    if (existingAdmin) {
      throw new Error(
        "Initial admin already exists! Setup can only be run once.",
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: Roles.ADMIN,
    });

    const adminObj = admin.toObject();
    delete adminObj.password;
    return adminObj;
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.role !== Roles.ADMIN) {
      throw new Error("Access denied: Not an Admin account");
    }

    if (!user.isActive) {
      throw new Error("Admin account is deactivated");
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
}

module.exports = new AdminServices();
