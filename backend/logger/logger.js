const chalk = require('chalk');
const config = require('./logger-config');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

// 正常日志
const myNoramlFormat = printf(({ level, message }) => {
    let msg = `${message}`;
    if (level === 'error') {
        msg = `\x1b[44m[NEW ${level.toUpperCase()}]:\x1b[0m`;
    }
    return msg;
});
// 警告及以上级别日志
const myWarnFormat = printf(({ level, message, stack, timestamp }) => {
    let msg = `${message}`;
    if (level !== 'info') {
        msg = `[${level}][${timestamp}]: ${message}\n\x1b[33m${stack || ''}`;
    }
    return msg;
});

const logger = createLogger({});

logger.add(new transports.File({
    level: 'info',
    filename: config.files.info,
    format: combine(
        timestamp(),
        myNoramlFormat
    )
}));
logger.add(new transports.File({
    level: 'error',
    filename: config.files.error,
    format: combine(
        errors({ stack: true }),
        timestamp(),
        myWarnFormat
    )
}));

logger.add(new transports.Console({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        myNoramlFormat
    )
}));
logger.add(new transports.Console({
    level: 'warn',
    format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        timestamp(),
        myWarnFormat
    )
}));


logger.initToolsText = function () {
    require('figlet').text('4G SETTER', {
        font: 'Roman',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, (err, data) => {
        if (err) {
            return;
        }
        logger.info(chalk.cyanBright(data));
    });
};

module.exports = logger;
