const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            customer_name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            address TEXT NOT NULL,
            comment TEXT,
            total_amount DECIMAL(12, 2) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица orders успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы orders:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS orders CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица orders успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы orders:', error.message);
        throw error;
    }
};

module.exports = { up, down };
