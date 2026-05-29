const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('✅ Таблица users успешно создана');
    } catch (error) {
        console.error('❌ Ошибка при создании таблицы users:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS users CASCADE;`;

    try {
        await pool.query(query);
        console.log('✅ Таблица users успешно удалена');
    } catch (error) {
        console.error('❌ Ошибка при удалении таблицы users:', error.message);
        throw error;
    }
};

module.exports = { up, down };
