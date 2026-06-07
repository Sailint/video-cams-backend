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

// На бессерверных платформах (Vercel, AWS Lambda) файловая система только для чтения —
// запись логов в файлы падает с EROFS. В таком окружении логируем только в консоль
// (Vercel/хостинг сам собирает stdout). Можно принудительно отключить через DISABLE_FILE_LOGS=true.
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const fileLoggingEnabled = !isServerless && process.env.DISABLE_FILE_LOGS !== 'true';

const transports = [
    new winston.transports.Console({ format: consoleFormat }),
];

if (fileLoggingEnabled) {
    // Общий лог (все уровни) с ротацией по дням
    transports.push(new winston.transports.DailyRotateFile({
        dirname: logsDir,
        filename: 'combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
    }));

    // Отдельный лог только для ошибок
    transports.push(new winston.transports.DailyRotateFile({
        dirname: logsDir,
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
        format: fileFormat,
    }));
}

const logger = winston.createLogger({
    level,
    transports,
    exitOnError: false,
});

// Поток для morgan, чтобы HTTP-логи шли через winston
logger.stream = {
    write: (message) => logger.http(message.trim()),
};

module.exports = logger;
