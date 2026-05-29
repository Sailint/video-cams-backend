const fs = require('fs');
const path = require('path');
const { getAllCctvCameras, getCctvCameraById, createCctvCamera, updateCctvCamera, deleteCctvCamera } = require('../models/cctvCameraModel');

const getCctvCameras = async (req, res) => {
    try {
        const cameras = await getAllCctvCameras();
        res.status(200).json(cameras);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения камер видеонаблюдения', error: err.message });
    }
};

const getCctvCamera = async (req, res) => {
    try {
        const camera = await getCctvCameraById(req.params.id);
        if (!camera) return res.status(404).json({ message: 'Камера видеонаблюдения не найдена' });
        res.status(200).json(camera);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения камеры видеонаблюдения', error: err.message });
    }
};

const addCctvCamera = async (req, res) => {
    try {
        const cameraData = { ...req.body };

        if (req.file) {
            cameraData.image_url = `/uploads/${req.file.filename}`;
        }

        const newCamera = await createCctvCamera(cameraData);
        res.status(201).json(newCamera);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка создания камеры видеонаблюдения', error: err.message });
    }
};

const editCctvCamera = async (req, res) => {
    try {
        const oldCamera = await getCctvCameraById(req.params.id);
        if (!oldCamera) return res.status(404).json({ message: 'Камера видеонаблюдения не найдена' });

        const cameraData = { ...req.body };

        if (req.file) {
            // Delete old image if exists
            if (oldCamera.image_url && oldCamera.image_url.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', oldCamera.image_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            cameraData.image_url = `/uploads/${req.file.filename}`;
        } else {
            // Keep existing image if no new file uploaded
            cameraData.image_url = oldCamera.image_url;
        }

        const updatedCamera = await updateCctvCamera(req.params.id, cameraData);
        res.status(200).json(updatedCamera);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления камеры видеонаблюдения', error: err.message });
    }
};

const removeCctvCamera = async (req, res) => {
    try {
        const camera = await getCctvCameraById(req.params.id);
        if (!camera) return res.status(404).json({ message: 'Камера видеонаблюдения не найдена' });

        // Delete image file if exists
        if (camera.image_url && camera.image_url.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', camera.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await deleteCctvCamera(req.params.id);
        res.status(200).json({ message: 'Камера видеонаблюдения удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления камеры видеонаблюдения', error: err.message });
    }
};

module.exports = { getCctvCameras, getCctvCamera, addCctvCamera, editCctvCamera, removeCctvCamera };
