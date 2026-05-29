const pool = require('../config/db');

const getAllCctvCameras = async () => {
    const query = 'SELECT * FROM cctv_cameras';
    const result = await pool.query(query);
    return result.rows;
};

const getCctvCameraById = async (id) => {
    const query = 'SELECT * FROM cctv_cameras WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createCctvCamera = async (camera) => {
    const { name, price, description, image_url, in_stock, night_vision, connection_type } = camera;
    const query = `
    INSERT INTO cctv_cameras (name, price, description, image_url, in_stock, night_vision, connection_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
    const values = [name, price, description, image_url, in_stock, night_vision, connection_type];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateCctvCamera = async (id, camera) => {
    const { name, price, description, image_url, in_stock, night_vision, connection_type } = camera;
    const query = `
    UPDATE cctv_cameras SET name = $1, price = $2, description = $3, image_url = $4,
    in_stock = $5, night_vision = $6, connection_type = $7 WHERE id = $8 RETURNING *;
  `;
    const values = [name, price, description, image_url, in_stock, night_vision, connection_type, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteCctvCamera = async (id) => {
    const query = 'DELETE FROM cctv_cameras WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllCctvCameras, getCctvCameraById, createCctvCamera, updateCctvCamera, deleteCctvCamera };
