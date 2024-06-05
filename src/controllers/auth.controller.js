const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateTokenAndSetCookie } = require("../utils/jwt-tokens.util");

const register = async (req, res) => {
    try {
        // Extract user data
        const { fullName, username, password, confirmPassword, gender } = req.body;
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Check if username already exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Profile picture
        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create a new user
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? maleProfilePic : femaleProfilePic
        });
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log('Error in register function - auth controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user?.password || '');
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Send user data
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log('Error in login function - auth controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 1 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout function - auth controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    logout
};
