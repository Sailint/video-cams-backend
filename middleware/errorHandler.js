const logger = require('../config/logger');

// Логирует неуспешные ответы (status >= 400), которые контроллеры формируют сами через res.json.
// Без этого ошибки, пойманные внутри контроллеров (try/catch), не попадают ни в консоль, ни в файлы логов.
const responseErrorLogger = (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        res.locals.responseBody = body;
        return originalJson(body);
    };

    res.on('finish', () => {
        // Пропускаем успешные ответы и те, что уже залогированы notFound/errorHandler
        if (res.statusCode < 400 || res.locals.errorLogged) return;

        const body = res.locals.responseBody || {};
        const detail = body.error || body.message || '';
        const meta = {
            status: res.statusCode,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userId: req.user ? req.user.id : null,
        };
        const message = `${req.method} ${req.originalUrl} ${res.statusCode}${detail ? ` — ${detail}` : ''}`;

        if (res.statusCode >= 500) {
            logger.error(message, meta);
        } else {
            logger.warn(message, meta);
        }
    });

    next();
};

// 404 — маршрут не найден
const notFound = (req, res) => {
    res.locals.errorLogged = true;
    logger.warn(`404 Не найдено: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
    });
    res.status(404).json({ message: 'Ресурс не найден' });
};

// Централизованная обработка ошибок: логируем стек и контекст запроса
const errorHandler = (err, req, res, next) => {
    res.locals.errorLogged = true;
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

module.exports = { responseErrorLogger, notFound, errorHandler };
