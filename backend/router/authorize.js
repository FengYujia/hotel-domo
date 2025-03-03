const cache = require('../mongodb/cache');

const authorize = {};

authorize.commom = async (req, res, next) => {
    try {
        const { token } = req.headers;
        const manager = cache.get(token);
        if (!manager) {
            return res.display({ code: 401 });
        } else {
            req.manager = manager;
        }
        next();
    } catch (e) {
        return res.send({ code: 401, msg: res.errCode[401] });
    }
};
module.exports = authorize;
