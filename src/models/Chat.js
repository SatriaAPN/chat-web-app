const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    text: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    receiverId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Chat', chatSchema);