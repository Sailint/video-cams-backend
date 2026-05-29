process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');

const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

describe('verifyToken', () => {
    test('отклоняет запрос без заголовка Authorization', () => {
        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('отклоняет заголовок без схемы Bearer', () => {
        const req = { headers: { authorization: 'Token abc' } };
        const res = makeRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('пропускает запрос с валидным токеном и кладёт payload в req.user', () => {
        const token = sign({ id: 7, username: 'ivan', role: 'user' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = makeRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject({ id: 7, username: 'ivan', role: 'user' });
        expect(res.status).not.toHaveBeenCalled();
    });

    test('отклоняет недействительный токен', () => {
        const req = { headers: { authorization: 'Bearer not-a-real-token' } };
        const res = makeRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('isAdmin', () => {
    test('пропускает администратора', () => {
        const req = { user: { role: 'admin' } };
        const res = makeRes();
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('блокирует обычного пользователя с кодом 403', () => {
        const req = { user: { role: 'user' } };
        const res = makeRes();
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test('блокирует запрос без req.user', () => {
        const req = {};
        const res = makeRes();
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});

describe('optionalAuth', () => {
    test('без токена ставит req.user = null и продолжает', () => {
        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();

        optionalAuth(req, res, next);

        expect(req.user).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('с валидным токеном заполняет req.user', () => {
        const token = sign({ id: 1, role: 'user' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = makeRes();
        const next = jest.fn();

        optionalAuth(req, res, next);

        expect(req.user).toMatchObject({ id: 1 });
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('с недействительным токеном ставит req.user = null, но продолжает', () => {
        const req = { headers: { authorization: 'Bearer broken' } };
        const res = makeRes();
        const next = jest.fn();

        optionalAuth(req, res, next);

        expect(req.user).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
