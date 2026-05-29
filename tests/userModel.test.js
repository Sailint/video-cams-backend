jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn(),
}));

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, verifyPassword } = require('../models/userModel');

describe('createUser', () => {
    test('хеширует пароль и возвращает созданного пользователя', async () => {
        const created = { id: 1, username: 'ivan', email: 'ivan@mail.com', role: 'user' };
        pool.query.mockResolvedValueOnce({ rows: [created] });

        const result = await createUser('ivan', 'ivan@mail.com', 'plain');

        expect(bcrypt.hash).toHaveBeenCalledWith('plain', 'salt');
        // В БД должен уходить хеш, а не открытый пароль
        const values = pool.query.mock.calls[0][1];
        expect(values).toEqual(['ivan', 'ivan@mail.com', 'hashed-password', 'user']);
        expect(result).toEqual(created);
    });

    test('бросает понятную ошибку при нарушении уникальности (код 23505)', async () => {
        const dbErr = new Error('duplicate');
        dbErr.code = '23505';
        pool.query.mockRejectedValueOnce(dbErr);

        await expect(createUser('ivan', 'ivan@mail.com', 'plain'))
            .rejects.toThrow('Пользователь с таким username или email уже существует');
    });

    test('пробрасывает прочие ошибки БД как есть', async () => {
        pool.query.mockRejectedValueOnce(new Error('connection lost'));

        await expect(createUser('ivan', 'ivan@mail.com', 'plain'))
            .rejects.toThrow('connection lost');
    });
});

describe('findUserByEmail', () => {
    test('возвращает первую найденную строку', async () => {
        const user = { id: 2, email: 'a@b.com' };
        pool.query.mockResolvedValueOnce({ rows: [user] });

        const result = await findUserByEmail('a@b.com');

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), ['a@b.com']);
        expect(result).toEqual(user);
    });

    test('возвращает undefined, если пользователь не найден', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const result = await findUserByEmail('none@b.com');

        expect(result).toBeUndefined();
    });
});

describe('verifyPassword', () => {
    test('делегирует сравнение bcrypt.compare', async () => {
        bcrypt.compare.mockResolvedValueOnce(true);

        const ok = await verifyPassword('plain', 'hashed');

        expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
        expect(ok).toBe(true);
    });
});
