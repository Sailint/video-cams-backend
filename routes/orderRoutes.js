const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.post('/', createOrder);
router.get('/my', getMyOrders);

module.exports = router;
