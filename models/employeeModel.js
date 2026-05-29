const pool = require('../config/db');

const getAllEmployees = async () => {
    const query = 'SELECT * FROM employees';
    const result = await pool.query(query);
    return result.rows;
};

const getEmployeeById = async (id) => {
    const query = 'SELECT * FROM employees WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createEmployee = async (employee) => {
    const { last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url } = employee;
    const query = `
    INSERT INTO employees (last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
    const values = [last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateEmployee = async (id, employee) => {
    const { last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url } = employee;
    const query = `
    UPDATE employees SET last_name = $1, first_name = $2, middle_name = $3, birth_date = $4,
    address = $5, position = $6, email = $7, experience = $8, photo_url = $9 WHERE id = $10 RETURNING *;
  `;
    const values = [last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteEmployee = async (id) => {
    const query = 'DELETE FROM employees WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
