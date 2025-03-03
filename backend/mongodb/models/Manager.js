const { Schema } = require('mongoose');

const managerSchema = new Schema({
    managerName: String,
    managerNo: String,
    phone: String,
    password: String,
    status: Number
}, {
    timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
});

module.exports = managerSchema;
