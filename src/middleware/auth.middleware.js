const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    const [Schema, token] = authorization ? authorization.split(" ") : [];
    if (Schema !== 'Bearer' || !token) {
        return res.status(401).json({ success: false, message: "Authorization token is required" });
    }
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        return next(new Error("JWT_SECRET is not defined"));
    }
    try {
        req.user = jwt.verify(token, secretKey);
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Your token has expired or is invalid" });
    }
}

module.exports = authMiddleware;

