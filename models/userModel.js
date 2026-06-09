const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (username, email, password, role = 'user') => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, created_at;
  `;
    const values = [username, email, hashedPassword, role];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            throw new Error('Пользователь с таким username или email уже существует');
        }
        throw err;
    }
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const verifyPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = { createUser, findUserByEmail, verifyPassword };