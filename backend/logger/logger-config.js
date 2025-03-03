const path = require('path');

const config = {
    dev: {
        files: {
            info: path.resolve() + '/logs/info.log',
            error: path.resolve() + '/logs/error.log'
        }
    },
    production: {
        files: {
            info: path.resolve() + '/logs/info.log',
            error: path.resolve() + '/logs/error.log'
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports = config.production;
} else {
    module.exports = config.dev;
}
