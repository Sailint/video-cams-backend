const logger = require('../config/logger');

// 404 — маршрут не найден
const notFound = (req, res, next) => {
    logger.warn(`404 Не найдено: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
    });
    res.status(404).json({ message: 'Ресурс не найден' });
};

// Централизованная обработка ошибок: логируем стек и контекст запроса
const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    logger.error(err.message, {
        status,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user ? req.user.id : null,
        stack: err.stack,
    });

    res.status(status).json({
        message: status >= 500 ? 'Внутренняя ошибка сервера' : err.message,
    });
};

module.exports = { notFound, errorHandler };
