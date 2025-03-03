const { Schema } = require('mongoose');

const reservationSchema = new Schema({
    guestName: String,
    email: String,
    phone: String,
    arrivalTime: Date,
    tableSize: Number,
    status: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

module.exports = reservationSchema;
