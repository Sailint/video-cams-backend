const express = require('express');
const { getCctvCameras, getCctvCamera, addCctvCamera, editCctvCamera, removeCctvCamera } = require('../controllers/cctvCameraController');
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes - anyone can view
router.get('/', getCctvCameras);
router.get('/:id', getCctvCamera);

// Admin only routes
router.post('/', verifyToken, isAdmin, upload.single('image'), addCctvCamera);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), editCctvCamera);
router.delete('/:id', verifyToken, isAdmin, removeCctvCamera);

module.exports = router;
