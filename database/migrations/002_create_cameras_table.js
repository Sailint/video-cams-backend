const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cameras (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            description TEXT,
            resolution VARCHAR(255),
            zoom DECIMAL(5, 2),
            weight DECIMAL(5, 2),
            release_date DATE,
            in_stock BOOLEAN DEFAULT false,
            image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('✅ Таблица cameras успешно создана');
    } catch (error) {
        console.error('❌ Ошибка при создании таблицы cameras:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS cameras CASCADE;`;

    try {
        await pool.query(query);
        console.log('✅ Таблица cameras успешно удалена');
    } catch (error) {
        console.error('❌ Ошибка при удалении таблицы cameras:', error.message);
        throw error;
    }
};

module.exports = { up, down };
