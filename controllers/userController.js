const { createUser, findUserByEmail, verifyPassword } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('../config/logger');

dotenv.config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны: username, email, password' });
    }

    try {
        const newUser = await createUser(username, email, password);
        logger.info('Зарегистрирован новый пользователь', { username, email, ip: req.ip });
        res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и password обязательны' });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            logger.warn('Неудачная попытка входа', { email, ip: req.ip });
            return res.status(401).json({ message: 'Неверный email или password' });
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            logger.warn('Неудачная попытка входа', { email, ip: req.ip });
            return res.status(401).json({ message: 'Неверный email или password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info('Успешный вход', {
            userId: user.id,
            username: user.username,
            role: user.role || 'user',
            ip: req.ip,
        });

        res.status(200).json({ message: 'Вход выполнен', token, role: user.role || 'user' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

module.exports = { registerUser, loginUser };