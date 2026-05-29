const { Pool } = require('pg');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config();

// Neon и большинство облачных хостингов требуют SSL-подключения
const useSSL = process.env.DB_SSL === 'true' || /\.neon\.tech$/.test(process.env.DB_HOST || '');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
    logger.debug('Установлено новое подключение к БД');
});

// Ошибки простаивающих клиентов пула не должны ронять процесс молча
pool.on('error', (err) => {
    logger.error('Ошибка пула подключений к БД', { stack: err.stack });
});

module.exports = pool;