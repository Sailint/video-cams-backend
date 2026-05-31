const pool = require('../../config/db');

// Фабрика для генерации случайных данных камеры
const cameraFactory = {
    brands: ['Canon', 'Sony', 'Nikon', 'Panasonic', 'Fujifilm', 'Olympus', 'GoPro', 'DJI', 'Blackmagic', 'RED'],

    models: {
        'Canon': ['EOS R5', 'EOS R6', 'EOS R3', 'EOS 5D Mark IV', 'EOS 90D', 'XA55', 'XF405', 'C70', 'C300 Mark III', 'XC15'],
        'Sony': ['A7S III', 'A7 IV', 'FX3', 'FX6', 'ZV-E10', 'A6600', 'A1', 'FX9', 'FS5 II', 'HXR-NX80'],
        'Nikon': ['Z6 III', 'Z8', 'Z9', 'D850', 'Z5', 'Z30', 'Z50', 'D780', 'Z fc', 'D7500'],
        'Panasonic': ['GH6', 'S5 II', 'S1H', 'BGH1', 'G9 II', 'GH5 II', 'S5 IIX', 'BS1H', 'AU-EVA1', 'HC-X2000'],
        'Fujifilm': ['X-H2S', 'X-T5', 'X-S20', 'GFX 100 II', 'X100VI', 'X-T50', 'X-H2', 'GFX 50S II', 'X-Pro3', 'X-E4'],
        'Olympus': ['OM-1', 'OM-5', 'E-M1 Mark III', 'E-M5 Mark III', 'E-M10 IV', 'PEN E-P7', 'E-M1X', 'TG-6', 'E-PL10', 'TG-7'],
        'GoPro': ['Hero 12 Black', 'Hero 11 Black', 'Hero 10 Black', 'Max', 'Hero 11 Mini', 'Hero 9 Black', 'Hero 8 Black', 'Fusion', 'Hero 7 Black', 'Session 5'],
        'DJI': ['Osmo Pocket 3', 'Osmo Action 4', 'Pocket 2', 'Action 3', 'Ronin 4D', 'Inspire 3', 'Mavic 3 Pro', 'Mini 4 Pro', 'Air 3', 'Avata 2'],
        'Blackmagic': ['Pocket 6K Pro', 'Pocket 4K', 'URSA Mini Pro 12K', 'URSA Broadcast G2', 'Micro Studio 4K', 'Studio Camera 4K Plus', 'Pocket 6K G2', 'PYXIS 6K', 'Cinema Camera 6K', 'URSA Cine 12K'],
        'RED': ['V-Raptor XL', 'Komodo 6K', 'Komodo-X', 'V-Raptor', 'Ranger', 'DSMC3', 'Raven', 'Scarlet-W', 'Epic-W', 'Weapon 8K']
    },

    resolutions: ['1080p 60fps', '1080p 120fps', '4K 30fps', '4K 60fps', '4K 120fps', '6K 30fps', '6K 60fps', '8K 30fps', '8K 60fps', '12K 60fps'],

    descriptions: [
        'Профессиональная видеокамера с отличной стабилизацией изображения и высоким динамическим диапазоном.',
        'Компактная камера для видеоблогеров с поворотным экраном и встроенным микрофоном.',
        'Кинематографическая камера для съёмки фильмов и рекламных роликов с RAW записью.',
        'Универсальная камера для фото и видео с быстрым автофокусом и серийной съёмкой.',
        'Экшн-камера с водонепроницаемым корпусом для экстремальных съёмок.',
        'Студийная камера для прямых трансляций с множеством разъёмов и функций.',
        'Беззеркальная камера с полнокадровой матрицей для профессиональной съёмки.',
        'Документальная камера с длительным временем автономной работы и надёжным корпусом.',
        'Камера для свадебной съёмки с отличной работой в условиях низкой освещённости.',
        'Спортивная камера с высокой частотой кадров для замедленной съёмки.',
        'Камера для путешествий с компактными размерами и широким углом обзора.',
        'Профессиональная PTZ камера для конференц-залов и студий.',
        'Модульная камера с возможностью расширения функционала.',
        'Камера с продвинутой системой охлаждения для длительной записи.',
        'Видеокамера с улучшенной эргономикой и удобным управлением.'
    ],

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomPrice() {
        // Цены от 15000 до 200000 рублей
        return Math.floor(Math.random() * 185000 + 15000);
    },

    getRandomZoom() {
        // Зум от 1x до 50x
        return Math.floor(Math.random() * 50 + 1);
    },

    getRandomWeight() {
        // Вес от 0.15 до 5.5 кг
        return (Math.random() * 5.35 + 0.15).toFixed(2);
    },

    getRandomDate() {
        // Дата выхода от 2018 до 2024
        const year = Math.floor(Math.random() * 7 + 2018);
        const month = Math.floor(Math.random() * 12 + 1);
        const day = Math.floor(Math.random() * 28 + 1);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },

    getRandomInStock() {
        return Math.random() > 0.3; // 70% вероятность что в наличии
    },

    generate() {
        const brand = this.getRandomElement(this.brands);
        const model = this.getRandomElement(this.models[brand]);

        return {
            name: `${brand} ${model}`,
            price: this.getRandomPrice(),
            description: this.getRandomElement(this.descriptions),
            resolution: this.getRandomElement(this.resolutions),
            zoom: this.getRandomZoom(),
            weight: this.getRandomWeight(),
            release_date: this.getRandomDate(),
            in_stock: this.getRandomInStock(),
            image_url: null
        };
    }
};

const seed = async () => {
    const cameras = [];
    const usedNames = new Set();

    // Генерируем 100 уникальных камер
    while (cameras.length < 100) {
        const camera = cameraFactory.generate();

        // Проверяем уникальность имени
        if (!usedNames.has(camera.name)) {
            usedNames.add(camera.name);
            cameras.push(camera);
        }
    }

    const query = `
        INSERT INTO cameras (name, price, description, resolution, zoom, weight, release_date, in_stock, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    try {
        console.log('🌱 Начинаем заполнение таблицы cameras...');

        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            await pool.query(query, [
                camera.name,
                camera.price,
                camera.description,
                camera.resolution,
                camera.zoom,
                camera.weight,
                camera.release_date,
                camera.in_stock,
                camera.image_url
            ]);

            if ((i + 1) % 20 === 0) {
                console.log(`   Добавлено ${i + 1} из 100 камер...`);
            }
        }

        console.log('✅ Успешно добавлено 100 камер в базу данных');
    } catch (error) {
        console.error('❌ Ошибка при заполнении таблицы cameras:', error.message);
        throw error;
    }
};

const clear = async () => {
    const query = `DELETE FROM cameras;`;

    try {
        await pool.query(query);
        console.log('✅ Таблица cameras очищена');
    } catch (error) {
        console.error('❌ Ошибка при очистке таблицы cameras:', error.message);
        throw error;
    }
};

module.exports = { seed, clear, cameraFactory };
