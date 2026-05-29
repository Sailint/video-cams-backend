const pool = require('../config/db');

const createOrderFromCart = async (userId, orderDetails) => {
    const { customer_name, phone, address, comment } = orderDetails;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cartQuery = `
            SELECT
                ci.product_type,
                ci.product_id,
                ci.quantity,
                CASE
                    WHEN ci.product_type = 'camera' THEN c.name
                    WHEN ci.product_type = 'cctv_camera' THEN cc.name
                END AS name,
                CASE
                    WHEN ci.product_type = 'camera' THEN c.price
                    WHEN ci.product_type = 'cctv_camera' THEN cc.price
                END AS price,
                CASE
                    WHEN ci.product_type = 'camera' THEN c.image_url
                    WHEN ci.product_type = 'cctv_camera' THEN cc.image_url
                END AS image_url
            FROM cart_items ci
            LEFT JOIN cameras c ON ci.product_type = 'camera' AND ci.product_id = c.id
            LEFT JOIN cctv_cameras cc ON ci.product_type = 'cctv_camera' AND ci.product_id = cc.id
            WHERE ci.user_id = $1
        `;
        const cartRes = await client.query(cartQuery, [userId]);
        const cartRows = cartRes.rows;

        if (cartRows.length === 0) {
            throw new Error('Корзина пуста');
        }

        const totalAmount = cartRows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

        const orderInsert = `
            INSERT INTO orders (user_id, customer_name, phone, address, comment, total_amount)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const orderRes = await client.query(orderInsert, [
            userId, customer_name, phone, address, comment || null, totalAmount
        ]);
        const order = orderRes.rows[0];

        for (const item of cartRows) {
            await client.query(
                `INSERT INTO order_items
                    (order_id, product_type, product_id, product_name, product_price, product_image, quantity)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [order.id, item.product_type, item.product_id, item.name, item.price, item.image_url, item.quantity]
            );
        }

        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT');
        return order;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const getOrdersByUser = async (userId) => {
    const query = `
        SELECT o.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', oi.id,
                        'product_type', oi.product_type,
                        'product_id', oi.product_id,
                        'product_name', oi.product_name,
                        'product_price', oi.product_price,
                        'product_image', oi.product_image,
                        'quantity', oi.quantity
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'::json
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

module.exports = {
    createOrderFromCart,
    getOrdersByUser
};
