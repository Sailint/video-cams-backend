const { createOrderFromCart, getOrdersByUser } = require('../models/orderModel');

const createOrder = async (req, res) => {
    try {
        const { customer_name, phone, address, comment } = req.body;

        if (!customer_name || !phone || !address) {
            return res.status(400).json({ message: 'Поля имя, телефон и адрес обязательны' });
        }

        const order = await createOrderFromCart(req.user.id, { customer_name, phone, address, comment });
        res.status(201).json(order);
    } catch (err) {
        if (err.message === 'Корзина пуста') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Ошибка оформления заказа', error: err.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await getOrdersByUser(req.user.id);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения заказов', error: err.message });
    }
};

module.exports = { createOrder, getMyOrders };
