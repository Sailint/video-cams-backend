const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100),
            birth_date DATE,
            address TEXT,
            position VARCHAR(150),
            email VARCHAR(255),
            experience INTEGER DEFAULT 0,
            photo_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица employees успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы employees:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS employees CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица employees успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы employees:', error.message);
        throw error;
    }
};

module.exports = { up, down };
