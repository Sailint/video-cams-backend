const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('camera', 'cctv_camera')),
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, product_type, product_id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица cart_items успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы cart_items:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS cart_items CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица cart_items успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы cart_items:', error.message);
        throw error;
    }
};

module.exports = { up, down };
