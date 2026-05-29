const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cctv_cameras (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            description TEXT,
            image_url VARCHAR(500),
            in_stock BOOLEAN DEFAULT false,
            night_vision BOOLEAN DEFAULT false,
            connection_type VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица cctv_cameras успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы cctv_cameras:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS cctv_cameras CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица cctv_cameras успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы cctv_cameras:', error.message);
        throw error;
    }
};

module.exports = { up, down };
