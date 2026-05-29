const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS clients (
            id SERIAL PRIMARY KEY,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100),
            birth_date DATE,
            address TEXT,
            email VARCHAR(255),
            photo_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица clients успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы clients:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS clients CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица clients успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы clients:', error.message);
        throw error;
    }
};

module.exports = { up, down };
