const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    user: { type: String, required: true },
    orderId: { type: String, required: true },
    read: { type: Boolean, default: false }, // New field to track read status
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 172800 
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
