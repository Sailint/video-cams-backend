jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('../models/cameraModel');
jest.mock('../config/cloudinary', () => ({
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
}));

const { uploadImage, deleteImage } = require('../config/cloudinary');
const model = require('../models/cameraModel');
const {
    getCameras,
    getCamera,
    addCamera,
    editCamera,
    removeCamera,
} = require('../controllers/cameraController');

const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getCameras', () => {
    test('возвращает 200 и список камер', async () => {
        model.getAllCameras.mockResolvedValueOnce([{ id: 1 }]);
        const res = makeRes();

        await getCameras({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    test('возвращает 500 при ошибке модели', async () => {
        model.getAllCameras.mockRejectedValueOnce(new Error('db down'));
        const res = makeRes();

        await getCameras({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('getCamera', () => {
    test('возвращает 404, если камера не найдена', async () => {
        model.getCameraById.mockResolvedValueOnce(undefined);
        const res = makeRes();

        await getCamera({ params: { id: '99' } }, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('возвращает 200 и камеру, если найдена', async () => {
        model.getCameraById.mockResolvedValueOnce({ id: 2 });
        const res = makeRes();

        await getCamera({ params: { id: '2' } }, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });
});

describe('addCamera', () => {
    test('подставляет image_url из загруженного в Cloudinary файла и возвращает 201', async () => {
        uploadImage.mockResolvedValueOnce({ secure_url: 'https://res.cloudinary.com/demo/pic.jpg' });
        model.createCamera.mockResolvedValueOnce({ id: 10 });
        const req = { body: { name: 'Cam' }, file: { buffer: Buffer.from('img') } };
        const res = makeRes();

        await addCamera(req, res);

        expect(uploadImage).toHaveBeenCalledWith(req.file.buffer);
        expect(model.createCamera).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Cam', image_url: 'https://res.cloudinary.com/demo/pic.jpg' })
        );
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('возвращает 400 при ошибке создания', async () => {
        model.createCamera.mockRejectedValueOnce(new Error('bad'));
        const res = makeRes();

        await addCamera({ body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});

describe('editCamera', () => {
    test('сохраняет старое изображение, если новый файл не загружен', async () => {
        model.getCameraById.mockResolvedValueOnce({ id: 1, image_url: '/uploads/old.jpg' });
        model.updateCamera.mockResolvedValueOnce({ id: 1 });
        const req = { params: { id: '1' }, body: { name: 'New' } };
        const res = makeRes();

        await editCamera(req, res);

        expect(model.updateCamera).toHaveBeenCalledWith(
            '1',
            expect.objectContaining({ image_url: '/uploads/old.jpg' })
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('возвращает 404, если камера для обновления не найдена', async () => {
        model.getCameraById.mockResolvedValueOnce(undefined);
        const res = makeRes();

        await editCamera({ params: { id: '1' }, body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});

describe('removeCamera', () => {
    test('удаляет изображение из Cloudinary и возвращает 200', async () => {
        const imageUrl = 'https://res.cloudinary.com/demo/x.jpg';
        model.getCameraById.mockResolvedValueOnce({ id: 1, image_url: imageUrl });
        model.deleteCamera.mockResolvedValueOnce({ id: 1 });
        deleteImage.mockResolvedValueOnce(undefined);
        const res = makeRes();

        await removeCamera({ params: { id: '1' } }, res);

        expect(deleteImage).toHaveBeenCalledWith(imageUrl);
        expect(model.deleteCamera).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('возвращает 404, если камеры нет', async () => {
        model.getCameraById.mockResolvedValueOnce(undefined);
        const res = makeRes();

        await removeCamera({ params: { id: '1' } }, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});
