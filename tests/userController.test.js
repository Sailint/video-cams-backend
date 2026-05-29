jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const model = require('../models/userModel');
const { registerUser, loginUser } = require('../controllers/userController');

const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('registerUser', () => {
    test('возвращает 400, если не заполнены обязательные поля', async () => {
        const res = makeRes();

        await registerUser({ body: { email: 'a@b.com' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(model.createUser).not.toHaveBeenCalled();
    });

    test('создаёт пользователя и возвращает 201', async () => {
        model.createUser.mockResolvedValueOnce({ id: 1, username: 'ivan' });
        const res = makeRes();

        await registerUser({ body: { username: 'ivan', email: 'a@b.com', password: 'p' } }, res);

        expect(model.createUser).toHaveBeenCalledWith('ivan', 'a@b.com', 'p');
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('возвращает 400, если модель бросает ошибку (например, дубликат)', async () => {
        model.createUser.mockRejectedValueOnce(new Error('уже существует'));
        const res = makeRes();

        await registerUser({ body: { username: 'ivan', email: 'a@b.com', password: 'p' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'уже существует' });
    });
});

describe('loginUser', () => {
    test('возвращает 400 без email или пароля', async () => {
        const res = makeRes();

        await loginUser({ body: { email: 'a@b.com' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('возвращает 401, если пользователь не найден', async () => {
        model.findUserByEmail.mockResolvedValueOnce(undefined);
        const res = makeRes();

        await loginUser({ body: { email: 'a@b.com', password: 'p' } }, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('возвращает 401 при неверном пароле', async () => {
        model.findUserByEmail.mockResolvedValueOnce({ id: 1, password: 'hash' });
        model.verifyPassword.mockResolvedValueOnce(false);
        const res = makeRes();

        await loginUser({ body: { email: 'a@b.com', password: 'wrong' } }, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('возвращает 200 и токен при успешном входе', async () => {
        model.findUserByEmail.mockResolvedValueOnce({ id: 1, username: 'ivan', password: 'hash', role: 'admin' });
        model.verifyPassword.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce('signed-token');
        const res = makeRes();

        await loginUser({ body: { email: 'a@b.com', password: 'p' } }, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ token: 'signed-token', role: 'admin' })
        );
    });

    test('возвращает 500 при неожиданной ошибке', async () => {
        model.findUserByEmail.mockRejectedValueOnce(new Error('db error'));
        const res = makeRes();

        await loginUser({ body: { email: 'a@b.com', password: 'p' } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
