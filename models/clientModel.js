const pool = require('../config/db');

const getAllClients = async () => {
    const query = 'SELECT * FROM clients ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
};

const getClientById = async (id) => {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createClient = async (client) => {
    const { last_name, first_name, middle_name, birth_date, address, email, photo_url } = client;
    const query = `
    INSERT INTO clients (last_name, first_name, middle_name, birth_date, address, email, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
    const values = [last_name, first_name, middle_name, birth_date, address, email, photo_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateClient = async (id, client) => {
    const { last_name, first_name, middle_name, birth_date, address, email, photo_url } = client;
    const query = `
    UPDATE clients SET last_name = $1, first_name = $2, middle_name = $3, birth_date = $4,
    address = $5, email = $6, photo_url = $7 WHERE id = $8 RETURNING *;
  `;
    const values = [last_name, first_name, middle_name, birth_date, address, email, photo_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteClient = async (id) => {
    const query = 'DELETE FROM clients WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient };
