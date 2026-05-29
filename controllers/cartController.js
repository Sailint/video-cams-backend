const {
    getCartByUser,
    productExists,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
} = require('../models/cartModel');

const VALID_TYPES = ['camera', 'cctv_camera'];

const formatItems = (items) => items.map(item => ({
    ...item,
    price: Number(item.price),
    subtotal: Number(item.price) * item.quantity
}));

const getCart = async (req, res) => {
    try {
        const items = await getCartByUser(req.user.id);
        const formatted = formatItems(items);
        const total = formatted.reduce((sum, i) => sum + i.subtotal, 0);
        const totalQuantity = formatted.reduce((sum, i) => sum + i.quantity, 0);
        res.status(200).json({ items: formatted, total, totalQuantity });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения корзины', error: err.message });
    }
};

const addItem = async (req, res) => {
    try {
        const { product_type, product_id, quantity } = req.body;

        if (!VALID_TYPES.includes(product_type)) {
            return res.status(400).json({ message: 'Неверный тип товара' });
        }
        const qty = parseInt(quantity, 10) || 1;
        if (qty < 1) {
            return res.status(400).json({ message: 'Количество должно быть больше 0' });
        }

        const product = await productExists(product_type, product_id);
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }

        const item = await addToCart(req.user.id, product_type, product_id, qty);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка добавления в корзину', error: err.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const qty = parseInt(quantity, 10);
        if (!qty || qty < 1) {
            return res.status(400).json({ message: 'Количество должно быть больше 0' });
        }

        const updated = await updateQuantity(req.user.id, req.params.id, qty);
        if (!updated) {
            return res.status(404).json({ message: 'Позиция корзины не найдена' });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка обновления', error: err.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const removed = await removeFromCart(req.user.id, req.params.id);
        if (!removed) {
            return res.status(404).json({ message: 'Позиция корзины не найдена' });
        }
        res.status(200).json({ message: 'Удалено из корзины' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления', error: err.message });
    }
};

const clear = async (req, res) => {
    try {
        await clearCart(req.user.id);
        res.status(200).json({ message: 'Корзина очищена' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка очистки', error: err.message });
    }
};

module.exports = { getCart, addItem, updateItem, removeItem, clear };
