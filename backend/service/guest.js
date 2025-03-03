'use strict';
const mongodb = require('../mongodb/connect');

const list = async function (condition = {}) {
    return await mongodb.Guest.find(condition).sort({ createdTime: -1 });
};

const getOneBy = async function (condition = {}) {
    return await mongodb.Guest.findOne(condition);
};

const create = async function (data = {}) {
    return await mongodb.Guest.create(data);
};


module.exports = {
    list,
    getOneBy,
    create
};
