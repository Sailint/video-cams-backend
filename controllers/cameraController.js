const { uploadImage, deleteImage } = require('../config/cloudinary');
const { getAllCameras, getCameraById, createCamera, updateCamera, deleteCamera } = require('../models/cameraModel');

const getCameras = async (req, res) => {
    try {
        const cameras = await getAllCameras();
        res.status(200).json(cameras);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения камер', error: err.message });
    }
};

const getCamera = async (req, res) => {
    try {
        const camera = await getCameraById(req.params.id);
        if (!camera) return res.status(404).json({ message: 'Камера не найдена' });
        res.status(200).json(camera);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения камеры', error: err.message });
    }
};

const addCamera = async (req, res) => {
    try {
        const cameraData = { ...req.body };

        if (req.file) {
            const result = await uploadImage(req.file.buffer);
            cameraData.image_url = result.secure_url;
        }

        const newCamera = await createCamera(cameraData);
        res.status(201).json(newCamera);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка создания камеры', error: err.message });
    }
};

const editCamera = async (req, res) => {
    try {
        const oldCamera = await getCameraById(req.params.id);
        if (!oldCamera) return res.status(404).json({ message: 'Камера не найдена' });

        const cameraData = { ...req.body };

        if (req.file) {
            // Удаляем старое изображение из Cloudinary, если было
            if (oldCamera.image_url) {
                await deleteImage(oldCamera.image_url);
            }
            const result = await uploadImage(req.file.buffer);
            cameraData.image_url = result.secure_url;
        } else {
            // Keep existing image if no new file uploaded
            cameraData.image_url = oldCamera.image_url;
        }

        const updatedCamera = await updateCamera(req.params.id, cameraData);
        res.status(200).json(updatedCamera);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления камеры', error: err.message });
    }
};

const removeCamera = async (req, res) => {
    try {
        const camera = await getCameraById(req.params.id);
        if (!camera) return res.status(404).json({ message: 'Камера не найдена' });

        // Удаляем изображение из Cloudinary, если было
        if (camera.image_url) {
            await deleteImage(camera.image_url);
        }

        await deleteCamera(req.params.id);
        res.status(200).json({ message: 'Камера удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления камеры', error: err.message });
    }
};

module.exports = { getCameras, getCamera, addCamera, editCamera, removeCamera };
