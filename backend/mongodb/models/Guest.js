const { Schema } = require('mongoose');

const guestSchema = new Schema({
    guestName: String,
    email: String,
    phone: String
}, {
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

module.exports = guestSchema;
