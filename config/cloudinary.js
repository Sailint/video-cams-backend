const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'video-cams-shop';

// Загрузка файла из буфера (multer.memoryStorage) в Cloudinary.
// Возвращает результат загрузки; нас интересует result.secure_url.
const uploadImage = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: FOLDER },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });

// Извлекает public_id из URL Cloudinary.
// Пример: https://res.cloudinary.com/<cloud>/image/upload/v123/video-cams-shop/abc.jpg
//   → video-cams-shop/abc
// Для старых локальных путей вида /uploads/... вернёт null.
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
};

// Удаляет файл из Cloudinary, если это его URL. Иначе — ничего не делает.
const deleteImage = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};

module.exports = { cloudinary, uploadImage, getPublicIdFromUrl, deleteImage };
