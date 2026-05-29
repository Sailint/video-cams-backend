jest.mock('../config/db', () => ({ query: jest.fn() }));

const pool = require('../config/db');
const {
    getAllCameras,
    getCameraById,
    createCamera,
    updateCamera,
    deleteCamera,
} = require('../models/cameraModel');

const sampleCamera = {
    name: 'Sony A7',
    price: 1500,
    description: 'desc',
    resolution: '4K',
    zoom: 10,
    weight: 0.65,
    release_date: '2023-01-01',
    in_stock: true,
    image_url: '/uploads/a.jpg',
};

describe('getAllCameras', () => {
    test('возвращает все строки', async () => {
        const rows = [{ id: 1 }, { id: 2 }];
        pool.query.mockResolvedValueOnce({ rows });

        const result = await getAllCameras();

        expect(result).toEqual(rows);
    });
});

describe('getCameraById', () => {
    test('запрашивает по id и возвращает одну камеру', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 5 }] });

        const result = await getCameraById(5);

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [5]);
        expect(result).toEqual({ id: 5 });
    });
});

describe('createCamera', () => {
    test('передаёт поля в правильном порядке и возвращает созданную запись', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 9, ...sampleCamera }] });

        const result = await createCamera(sampleCamera);

        const values = pool.query.mock.calls[0][1];
        expect(values).toEqual([
            'Sony A7', 1500, 'desc', '4K', 10, 0.65, '2023-01-01', true, '/uploads/a.jpg',
        ]);
        expect(result).toMatchObject({ id: 9 });
    });
});

describe('updateCamera', () => {
    test('добавляет id последним параметром', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 3 }] });

        await updateCamera(3, sampleCamera);

        const values = pool.query.mock.calls[0][1];
        expect(values[values.length - 1]).toBe(3);
        expect(pool.query.mock.calls[0][0]).toContain('UPDATE cameras');
    });
});

describe('deleteCamera', () => {
    test('удаляет по id и возвращает удалённую строку', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 4 }] });

        const result = await deleteCamera(4);

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM cameras'), [4]);
        expect(result).toEqual({ id: 4 });
    });
});
