const express = require('express');
const { getCameras, getCamera, addCamera, editCamera, removeCamera } = require('../controllers/cameraController');
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes - anyone can view
router.get('/', getCameras);
router.get('/:id', getCamera);

// Admin only routes
router.post('/', verifyToken, isAdmin, upload.single('image'), addCamera);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), editCamera);
router.delete('/:id', verifyToken, isAdmin, removeCamera);

module.exports = router;