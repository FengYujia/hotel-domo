'use strict';
const mongodb = require('../mongodb/connect');

const format = function (data = {}) {
    return {
        'managerId': data._id,
        'managerName': data.managerName,
        'managerNo': data.managerNo,
        'phone': data.phone,
        'status': data.status,
        'token': data.token
    };
};

const list = async function (condition = {}) {
    return await mongodb.Manager.find(condition);
};

const getOneBy = async function (condition = {}) {
    return await mongodb.Manager.findOne(condition);
};

module.exports = {
    format,
    list,
    getOneBy
};
