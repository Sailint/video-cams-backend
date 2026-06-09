const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'video-cams-shop';

const uploadImage = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: FOLDER },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
};

const deleteImage = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};

module.exports = { cloudinary, uploadImage, getPublicIdFromUrl, deleteImage };
