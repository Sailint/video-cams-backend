const fs = require('fs');
const path = require('path');
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
            cameraData.image_url = `/uploads/${req.file.filename}`;
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

        // Delete image file if exists
        if (camera.image_url && camera.image_url.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', camera.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await deleteCamera(req.params.id);
        res.status(200).json({ message: 'Камера удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления камеры', error: err.message });
    }
};

module.exports = { getCameras, getCamera, addCamera, editCamera, removeCamera };
