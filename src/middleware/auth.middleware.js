const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provider" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Set user in request object
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        // Send an error response
        console.log('Error in auth middleware: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authMiddleware;