'use strict';
// const sha256 = require('js-sha256');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const uuid = require('uuid');
const service = require('../service');
const cache = require('../mongodb/cache');
//
const privateKey = fs.readFileSync(path.join(__dirname, '../config/accessKey/jwt-private-key'), 'utf8');
const manager = {};

/** ************************************login*********************************************/
manager.login = async (req, res) => {
    const { managerNo, password } = req.body;
    //
    const manager = await service.manager.getOneBy({ $or: [{ managerName: managerNo }, { managerNo }] });

    if (!manager) {
        return res.display({ code: 3000 });
    }
    //
    const _p = crypto.createHmac('sha256', privateKey).update(password).digest('hex').toUpperCase();
    if (_p !== manager.password) {
        return res.display({ code: 3001 });
    }
    //
    manager.token = uuid.v4();
    const data = service.manager.format(manager);
    //
    cache.put(manager.token, data);
    return res.display({ data });
};


manager.my = async (req, res) => {
    return res.display({ data: req.manager });
};

manager.reservationList = async (req, res) => {
    let { keyword, status } = req.query;
    let condition = {};
    if (keyword) {
        condition = { $or: [{ email: keyword }, { phone: keyword }] };
    }
    if (status !== null && status !== 'null' && status !== undefined) {
        condition.status = status;
    }
    let data = await service.reservation.list(condition);
    data = data.map(item => {
        item.arrivalTime = moment(item.arrivalTime).format('YYYY-MM-DD');
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss');
        item.updatedTime = moment(item.updatedTime).format('YYYY-MM-DD HH:mm:ss');
        return item;
    });
    return res.display({ data });
};

manager.updateReservation = async (req, res) => {
    const { reservationId, tableSize, arrivalTime, status } = req.body;
    if (!reservationId) {
        return res.display({ code: 3003 });
    }
    await service.reservation.updateBy(reservationId, { tableSize, arrivalTime, status });
    return res.display({});
};

manager.guestList = async (req, res) => {
    let { keyword } = req.query;
    let condition = {};
    if (keyword) {
        condition = { $or: [{ guestName: keyword }, { email: keyword }, { phone: keyword }] };
    }
    let data = await service.guest.list(condition);
    data = data.map(item => {
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss');
        item.updatedTime = moment(item.updatedTime).format('YYYY-MM-DD HH:mm:ss');
        return item;
    });
    return res.display({ data });
};

module.exports = manager;
