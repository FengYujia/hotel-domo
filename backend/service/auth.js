'use strict';

const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../../../config/config').jwt;
const jwtKey = require('../../../config/config').jwtKey;
const adminService = require('./admin');

const redis = require('../../../../databases').mainRedis;
const constant = require('../../../constant');
const auth = {};

auth.encode = async function (adminId, data = {}, longTime = false) {
    const privateKey = jwtKey.private;
    const token = crypto.createHash('md5').update(adminId.toString()).digest('hex');
    data.uuid = uuid.v4();
    const payload = {
        longTime: longTime,
        token: token,
        uuid: data.uuid
    };
    const signOptions = {};
    signOptions.issuer = config.issuer;
    signOptions.subject = config.subject;
    signOptions.audience = config.audience;
    if (!longTime) {
        signOptions.expiresIn = config.expiresIn;
    }
    signOptions.algorithm = config.algorithm;
    const jwtToken = jwt.sign(payload, privateKey, signOptions);
    // redis
    await adminService.setToken(adminId, token, longTime);
    data = JSON.parse(JSON.stringify(data));
    // await redis.hmset(constant.admin.REDIS_KEY.token + token, data);
    await adminService.setCache(token, data, longTime);
    //
    return jwtToken;
};


auth.decode = async function (jwtToken) {
    const publicKey = jwtKey.public;
    const verifyOptions = {};
    verifyOptions.issuer = config.issuer;
    verifyOptions.subject = config.subject;
    verifyOptions.audience = config.audience;
    verifyOptions.expiresIn = config.expiresIn;
    verifyOptions.algorithm = ['RS256'];
    const reply = {};
    reply.decode = jwt.verify(jwtToken, publicKey, verifyOptions);
    const longTime = reply.decode.longTime;
    if (longTime === false) {
        reply.tokenInfo = await redis.hgetall(constant.admin.REDIS_KEY.token + reply.decode.token);
        reply.socket_id = await redis.hget(constant.admin.REDIS_KEY.token + reply.decode.token, 'socket_id');
    } else {
        reply.tokenInfo = await redis.hgetall(constant.admin.REDIS_KEY.token + 'longTime:' + reply.decode.token);
        reply.socket_id = await redis.hget(constant.admin.REDIS_KEY.token + 'longTime:' + reply.decode.token, 'socket_id');
    }

    return reply;
};

module.exports = auth;
