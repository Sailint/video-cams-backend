const pool = require('../../config/db');

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('camera', 'cctv_camera')),
            product_id INTEGER NOT NULL,
            product_name VARCHAR(255) NOT NULL,
            product_price DECIMAL(10, 2) NOT NULL,
            product_image VARCHAR(500),
            quantity INTEGER NOT NULL CHECK (quantity > 0)
        );
    `;

    try {
        await pool.query(query);
        console.log('Таблица order_items успешно создана');
    } catch (error) {
        console.error('Ошибка при создании таблицы order_items:', error.message);
        throw error;
    }
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS order_items CASCADE;`;

    try {
        await pool.query(query);
        console.log('Таблица order_items успешно удалена');
    } catch (error) {
        console.error('Ошибка при удалении таблицы order_items:', error.message);
        throw error;
    }
};

module.exports = { up, down };
