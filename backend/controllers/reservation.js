'use strict';
const moment = require('moment');
const service = require('../service');
const { RESERVATION_STATUS } = require('../constant/key');
/** ************************************guest ctr*********************************************/
const list = async (req, res) => {
    let { keyword, status } = req.query;
    if (keyword === undefined) {
        return res.display({ code: 3004 });
    }
    if (status === undefined) {
        status = [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.COMPLETED];
    }
    let data = await service.reservation.list({ $or: [{ email: keyword }, { phone: keyword }], status });
    data = data.map(item => {
        item.arrivalTime = moment(item.arrivalTime).format('YYYY-MM-DD');
        return item;
    });
    return res.display({ data });
};

const create = async (req, res) => {
    const { guestName, email, phone, arrivalTime, tableSize } = req.body;
    if (!guestName || !email || !phone || !arrivalTime || !tableSize) {
        return res.display({ code: 3002 });
    }
    // Check if guest exists in database, create new if not exists
    const guest = await service.guest.getOneBy({ $or: [{ email }, { phone }] });
    if (!guest) {
        await service.guest.create({ guestName, email, phone });
    }
    // Make reservation
    await service.reservation.create({ guestName, email, phone, arrivalTime, tableSize });
    return res.display({});
};

const update = async (req, res) => {
    const { reservationId, arrivalTime, tableSize } = req.body;
    if (!reservationId) {
        return res.display({ code: 3003 });
    }
    await service.reservation.updateBy(reservationId, { arrivalTime, tableSize });
    return res.display({});
};

const cancel = async (req, res) => {
    const { reservationId } = req.body;
    if (!reservationId) {
        return res.display({ code: 3003 });
    }
    await service.reservation.updateBy(reservationId, { status: -1 });
    return res.display({});
};


module.exports = {
    list,
    create,
    update,
    cancel
};
