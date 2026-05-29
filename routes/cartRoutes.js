const express = require('express');
const { getCart, addItem, updateItem, removeItem, clear } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', removeItem);
router.delete('/', clear);

module.exports = router;
