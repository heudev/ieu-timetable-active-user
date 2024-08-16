const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
    maxActiveUserCount: { type: Number, required: true },
    maxActiveUserTime: { type: String, required: true },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('ActiveUser', ActiveUserSchema);

