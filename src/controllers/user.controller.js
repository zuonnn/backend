const User = require('../models/user.model');

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('fullName');

        res.json(allUsers);
    } catch (error) {
        // Send an error response
        console.error('Error in getUsersForSidebar: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsersForSidebar
}