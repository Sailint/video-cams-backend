const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const logsDir = path.join(__dirname, '..', 'logs');

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Формат для файлов: структурированный JSON со стек-трейсом ошибок
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Формат для консоли: цветной, человекочитаемый
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${stack || message}${rest}`;
    })
);

// Общий лог (все уровни) с ротацией по дням
const combinedFileTransport = new winston.transports.DailyRotateFile({
    dirname: logsDir,
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
});

// Отдельный лог только для ошибок
const errorFileTransport = new winston.transports.DailyRotateFile({
    dirname: logsDir,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    format: fileFormat,
});

const logger = winston.createLogger({
    level,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        combinedFileTransport,
        errorFileTransport,
    ],
    exitOnError: false,
});

// Поток для morgan, чтобы HTTP-логи шли через winston
logger.stream = {
    write: (message) => logger.http(message.trim()),
};

module.exports = logger;
