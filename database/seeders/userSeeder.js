const pool = require('../../config/db');
const { createUser } = require('../../models/userModel');

const ADMIN = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'admin'
};

const seed = async () => {
    try {
        console.log('Создаём администратора по умолчанию...');
        await createUser(ADMIN.username, ADMIN.email, ADMIN.password, ADMIN.role);
        console.log(`Администратор создан: ${ADMIN.email} (пароль: ${ADMIN.password})`);
    } catch (error) {
        if (/уже существует/.test(error.message)) {
            console.log(`Администратор ${ADMIN.email} уже существует — пропускаем`);
        } else {
            console.error('Ошибка при создании администратора:', error.message);
            throw error;
        }
    }
};

const clear = async () => {
    const query = `DELETE FROM users WHERE email = $1;`;

    try {
        await pool.query(query, [ADMIN.email]);
        console.log('Администратор по умолчанию удалён');
    } catch (error) {
        console.error('Ошибка при удалении администратора:', error.message);
        throw error;
    }
};

module.exports = { seed, clear, ADMIN };
