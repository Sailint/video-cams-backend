const express = require('express');
const { getLogs } = require('../controllers/logController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Только админ может просматривать системные логи
router.get('/', verifyToken, isAdmin, getLogs);

module.exports = router;
