const jwt = require("jsonwebtoken")
require("dotenv").config();

const secretkey = process.env.JWT_SECRET

class TokenServices {
    generateToken(payload) {
        return jwt.sign(payload, secretkey, { expiresIn: "10h" })
    }
    
}

module.exports = new TokenServices();