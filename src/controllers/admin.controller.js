const adminServices = require("../services/admin.services.js");

class AdminController {
    /**
     * POST /api/admin/initial-setup
     * Initial one-time admin registration
     */
    async initialSetup(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required for initial admin setup."
                });
            }

            const admin = await adminServices.initialSetup(name, email, password);
            return res.status(201).json({
                success: true,
                message: "Initial overall Admin created successfully. You can now login.",
                data: admin
            });
        } catch (error) {
            console.error("Admin setup error:", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * POST /api/admin/login
     * Admin login
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const result = await adminServices.login(email, password);
            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                data: result
            });
        } catch (error) {
            console.error("Admin login error:", error.message);
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminController();

