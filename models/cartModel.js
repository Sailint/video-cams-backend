const pool = require('../config/db');

const PRODUCT_TABLE = {
    camera: 'cameras',
    cctv_camera: 'cctv_cameras'
};

const getCartByUser = async (userId) => {
    const query = `
        SELECT
            ci.id,
            ci.product_type,
            ci.product_id,
            ci.quantity,
            ci.created_at,
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
            END AS image_url,
            CASE
                WHEN ci.product_type = 'camera' THEN c.in_stock
                WHEN ci.product_type = 'cctv_camera' THEN cc.in_stock
            END AS in_stock
        FROM cart_items ci
        LEFT JOIN cameras c ON ci.product_type = 'camera' AND ci.product_id = c.id
        LEFT JOIN cctv_cameras cc ON ci.product_type = 'cctv_camera' AND ci.product_id = cc.id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const productExists = async (productType, productId) => {
    const table = PRODUCT_TABLE[productType];
    if (!table) return null;
    const result = await pool.query(`SELECT id FROM ${table} WHERE id = $1`, [productId]);
    return result.rows[0] || null;
};

const addToCart = async (userId, productType, productId, quantity = 1) => {
    const query = `
        INSERT INTO cart_items (user_id, product_type, product_id, quantity)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, product_type, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *;
    `;
    const result = await pool.query(query, [userId, productType, productId, quantity]);
    return result.rows[0];
};

const updateQuantity = async (userId, itemId, quantity) => {
    const query = `
        UPDATE cart_items SET quantity = $1
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const result = await pool.query(query, [quantity, itemId, userId]);
    return result.rows[0];
};

const removeFromCart = async (userId, itemId) => {
    const query = `
        DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *;
    `;
    const result = await pool.query(query, [itemId, userId]);
    return result.rows[0];
};

const clearCart = async (userId, client = pool) => {
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
};

module.exports = {
    PRODUCT_TABLE,
    getCartByUser,
    productExists,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
};
