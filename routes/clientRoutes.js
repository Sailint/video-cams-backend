const express = require('express');
const { getClients, getClient, addClient, editClient, removeClient } = require('../controllers/clientController');
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes - anyone can view
router.get('/', getClients);
router.get('/:id', getClient);

// Admin only routes
router.post('/', verifyToken, isAdmin, upload.single('photo'), addClient);
router.put('/:id', verifyToken, isAdmin, upload.single('photo'), editClient);
router.delete('/:id', verifyToken, isAdmin, removeClient);

module.exports = router;
