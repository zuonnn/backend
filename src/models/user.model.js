const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a name']
    },
    username: {
        type: String,
        required: [true, 'Please provide an username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    profilePic: {
        type: String,
        default: 'default.jpg'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);    

module.exports = User;