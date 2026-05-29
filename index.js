const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cameraRoutes = require('./routes/cameraRoutes');
const cctvCameraRoutes = require('./routes/cctvCameraRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clientRoutes = require('./routes/clientRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const logger = require('./config/logger');
const httpLogger = require('./middleware/httpLogger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(httpLogger);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение маршрутов
app.use('/api/users', userRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/cctv-cameras', cctvCameraRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Backend для магазина видеокамер работает!');
});

// Обработка несуществующих маршрутов и централизованная обработка ошибок
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Сервер запущен на http://localhost:${port}`);
});

// Логирование необработанных ошибок процесса
process.on('unhandledRejection', (reason) => {
    logger.error('Необработанное отклонение промиса', { reason: reason instanceof Error ? reason.stack : reason });
});

process.on('uncaughtException', (err) => {
    logger.error('Необработанное исключение', { stack: err.stack });
});