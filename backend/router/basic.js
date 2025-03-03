'use strict';
const errorMsg = require('./error-msg');
/* ************ */
const basic = {};

// 1、格式化返回值
basic.display = async function (req, res, next) {
    res.display = async (result = {}) => {
        const code = result.code || 200;
        let msg = errorMsg['en-US'][code] || (code === 200 ? '' : 'error undefined');
        const resp = {
            code,
            msg,
            data: result.data || {}
        };
        return res.send(resp);
    };
    next();
};

module.exports = basic;
