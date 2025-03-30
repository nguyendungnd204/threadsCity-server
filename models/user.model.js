const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: ""
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'facebook'],
        required: true
    },
    oauthId: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);