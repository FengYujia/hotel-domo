'use strict';
const mongodb = require('../mongodb/connect');

const list = async function (condition = {}) {
    return await mongodb.Reservation.find(condition).sort({ createdTime: -1 });
};

const create = async function (condition = {}) {
    return await mongodb.Reservation.create(condition);
};

const updateBy = async function (reservationId, condition = {}) {
    return await mongodb.Reservation.updateOne(condition).where({ _id: reservationId });
};

module.exports = {
    list,
    create,
    updateBy
};
