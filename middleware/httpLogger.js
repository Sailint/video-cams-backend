const morgan = require('morgan');
const logger = require('../config/logger');

// Реальный IP клиента (учитывает прокси через X-Forwarded-For)
morgan.token('client-ip', (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0].trim() : req.ip;
});

const format = ':client-ip :method :url :status :res[content-length]b :response-time ms';

const httpLogger = morgan(format, {
    stream: logger.stream,
});

module.exports = httpLogger;
