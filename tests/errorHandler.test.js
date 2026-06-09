jest.mock('../config/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
    debug: jest.fn(),
}));

const logger = require('../config/logger');
const { notFound, errorHandler } = require('../middleware/errorHandler');

const makeRes = () => {
    const res = { locals: {} };
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('notFound', () => {
    test('отвечает 404 и логирует предупреждение', () => {
        const req = { method: 'GET', originalUrl: '/api/missing', ip: '127.0.0.1' };
        const res = makeRes();

        notFound(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ресурс не найден' });
        expect(logger.warn).toHaveBeenCalled();
    });
});

describe('errorHandler', () => {
    test('по умолчанию отвечает 500 и скрывает детали ошибки', () => {
        const err = new Error('подробности утечки БД');
        const req = { method: 'POST', originalUrl: '/api/cameras', ip: '127.0.0.1' };
        const res = makeRes();

        errorHandler(err, req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Внутренняя ошибка сервера' });
        expect(logger.error).toHaveBeenCalled();
    });

    test('сохраняет статус и сообщение для клиентских ошибок (4xx)', () => {
        const err = new Error('Неверные данные');
        err.status = 400;
        const req = { method: 'POST', originalUrl: '/api/orders', ip: '127.0.0.1' };
        const res = makeRes();

        errorHandler(err, req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Неверные данные' });
    });

    test('логирует контекст запроса, включая userId', () => {
        const err = new Error('boom');
        const req = { method: 'GET', originalUrl: '/api/cart', ip: '10.0.0.1', user: { id: 42 } };
        const res = makeRes();

        errorHandler(err, req, res, jest.fn());

        expect(logger.error).toHaveBeenCalledWith(
            'boom',
            expect.objectContaining({ method: 'GET', url: '/api/cart', userId: 42 })
        );
    });
});
