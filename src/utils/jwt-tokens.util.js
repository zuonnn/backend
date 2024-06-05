const jwt = require('jsonwebtoken');

// Generate a token and set it in a cookie
const generateTokenAndSetCookie = (userId, res) => {
    // Generate a token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '15d' });
    // Set the token in a cookie
    res.cookie('token', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // The cookie is not accessible via JavaScript
        sameSite: 'strict', // The cookie is sent only to the same site
        secure: process.env.NODE_ENV === 'development' ? false : true // The cookie is sent only via HTTPS
    });
}

// Verify a token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateTokenAndSetCookie,
    verifyToken
}