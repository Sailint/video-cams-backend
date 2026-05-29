const pool = require('../config/db');

const getAllCameras = async () => {
    const query = 'SELECT * FROM cameras';
    const result = await pool.query(query);
    return result.rows;
};

const getCameraById = async (id) => {
    const query = 'SELECT * FROM cameras WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createCamera = async (camera) => {
    const { name, price, description, resolution, zoom, weight, release_date, in_stock, image_url } = camera;
    const query = `
    INSERT INTO cameras (name, price, description, resolution, zoom, weight, release_date, in_stock, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
    const values = [name, price, description, resolution, zoom, weight, release_date, in_stock, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateCamera = async (id, camera) => {
    const { name, price, description, resolution, zoom, weight, release_date, in_stock, image_url } = camera;
    const query = `
    UPDATE cameras SET name = $1, price = $2, description = $3, resolution = $4, zoom = $5, weight = $6, 
    release_date = $7, in_stock = $8, image_url = $9 WHERE id = $10 RETURNING *;
  `;
    const values = [name, price, description, resolution, zoom, weight, release_date, in_stock, image_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteCamera = async (id) => {
    const query = 'DELETE FROM cameras WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllCameras, getCameraById, createCamera, updateCamera, deleteCamera };