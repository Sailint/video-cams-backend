const pool = require('../../config/db');

const cctvCameraFactory = {
    brands: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 'Vivotek', 'Uniview', 'Pelco', 'IDIS', 'Tiandy'],

    models: {
        'Hikvision': ['DS-2CD2143G2-I', 'DS-2CD2346G2-I', 'DS-2CD2T47G2-L', 'DS-2DE4425IW-DE', 'DS-2CD2185FWD-I', 'DS-2CD2743G2-IZS', 'DS-2CD2686G2-IZS', 'DS-2CD2T86G2-4I', 'DS-2CD2387G2-LU', 'DS-2CD2547G2-LS'],
        'Dahua': ['IPC-HDBW5442E-ZE', 'IPC-HDW5831R-ZE', 'DH-IPC-HFW4431E-SE', 'IPC-PDBW8840-A180', 'SD6AL245U-HNI', 'IPC-HFW2831T-ZAS', 'IPC-HDW2531T-AS', 'IPC-HFW5442T-ASE', 'IPC-HDBW3441E-AS', 'DH-SD49425XB-HNR'],
        'Axis': ['P3245-V', 'M3106-L Mk II', 'Q6135-LE', 'P1448-LE', 'M2026-LE Mk II', 'P3255-LVE', 'M3115-LVE', 'Q1656', 'P3267-LV', 'M4308-PLE'],
        'Bosch': ['FLEXIDOME IP 8000i', 'DINION IP 7000 HD', 'AUTODOME IP 5000i', 'MIC IP fusion 9000i', 'NBN-80052', 'NDE-8504-R', 'NTV-3503-F02L', 'NDV-3503-F02', 'NBE-7604-AL', 'NDE-8512-R'],
        'Hanwha': ['XNV-8080R', 'PNM-9320VQP', 'XNP-6400RW', 'XNO-8080R', 'PNV-A9081R', 'XND-8080RV', 'QNV-8080R', 'XNF-8010RV', 'PNO-A9081R', 'XNB-8000'],
        'Vivotek': ['FD9387-HTV-A', 'IB9387-HT-A', 'MS9390-HV', 'FD9391-EHTV', 'IB9391-EHT', 'FD9389-EHTV', 'IB9389-EHT', 'MD9560-HF2', 'FD9187-HT', 'IB9367-EHT'],
        'Uniview': ['IPC3614SR3-DPF28', 'IPC324LR3-VSPF28-D', 'IPC3632ER3-DPZ28-C', 'IPC3614LB-SF28K-G', 'IPC2324LBR3-SPZ28-D', 'IPC3634SB-ADZK-I0', 'IPC3615SB-ADF28KM-I0', 'IPC354SR3-ADNPF28-F', 'IPC3232ER3-DUVZ', 'IPC6312LR-AX4-VG'],
        'Pelco': ['IME329-1ES', 'Spectra Pro 2', 'Sarix Pro 4', 'IXE83', 'IME338-1ES', 'IME532-1ES', 'IBE338-1R', 'IFV529-1RS', 'IME229-1IS', 'IME222-1RS'],
        'IDIS': ['DC-D4233WRX', 'DC-Y6513RX', 'DC-T4233HRX', 'DC-D3233RX', 'DC-E4213WRX', 'DC-D4233HRXS', 'DC-Y8C13RX', 'DC-T4533HRX', 'DC-D4833HRX', 'DC-S4233WRX'],
        'Tiandy': ['TC-C32QN', 'TC-C34LP', 'TC-C35MS', 'TC-C38KS', 'TC-C32GP', 'TC-C34UN', 'TC-C35WS', 'TC-C32WN', 'TC-C34GN', 'TC-C38LS']
    },

    connectionTypes: ['Wi-Fi', 'Ethernet', 'PoE', 'PoE+', 'Wi-Fi + Ethernet', 'PoE + Wi-Fi', '4G LTE', 'Коаксиальный'],

    descriptions: [
        'IP-камера видеонаблюдения с высоким разрешением и продвинутой аналитикой.',
        'Купольная камера с защитой от вандалов и антикоррозийным покрытием.',
        'PTZ камера с 25x оптическим зумом и автоматическим отслеживанием.',
        'Компактная камера для внутренней установки с двусторонней аудиосвязью.',
        'Уличная камера с инфракрасной подсветкой до 80 метров.',
        'Панорамная камера 360 градусов с деварпингом изображения.',
        'Камера с распознаванием лиц и интеграцией с СКУД.',
        'Тепловизионная камера для периметральной защиты.',
        'Взрывозащищенная камера для промышленных объектов.',
        'Мини-камера для скрытой установки в офисных помещениях.',
        'Камера с встроенным микрофоном и динамиком для двусторонней связи.',
        'Всепогодная камера с рабочим диапазоном от -40 до +60 градусов.',
        'Камера с поддержкой H.265+ для экономии дискового пространства.',
        'Smart-камера с детекцией пересечения линии и вторжения в зону.',
        'Камера с WDR 140dB для сложных условий освещения.'
    ],

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomPrice() {
        // Цены от 5000 до 150000 рублей
        return Math.floor(Math.random() * 145000 + 5000);
    },

    getRandomBoolean(probability = 0.5) {
        return Math.random() < probability;
    },

    generate() {
        const brand = this.getRandomElement(this.brands);
        const model = this.getRandomElement(this.models[brand]);

        return {
            name: `${brand} ${model}`,
            price: this.getRandomPrice(),
            description: this.getRandomElement(this.descriptions),
            in_stock: this.getRandomBoolean(0.7),
            night_vision: this.getRandomBoolean(0.8),
            connection_type: this.getRandomElement(this.connectionTypes),
            image_url: null
        };
    }
};

const seed = async () => {
    const cameras = [];
    const usedNames = new Set();

    // Генерируем 50 уникальных камер видеонаблюдения
    while (cameras.length < 50) {
        const camera = cctvCameraFactory.generate();

        if (!usedNames.has(camera.name)) {
            usedNames.add(camera.name);
            cameras.push(camera);
        }
    }

    const query = `
        INSERT INTO cctv_cameras (name, price, description, in_stock, night_vision, connection_type, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
        console.log('Начинаем заполнение таблицы cctv_cameras...');

        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            await pool.query(query, [
                camera.name,
                camera.price,
                camera.description,
                camera.in_stock,
                camera.night_vision,
                camera.connection_type,
                camera.image_url
            ]);

            if ((i + 1) % 10 === 0) {
                console.log(`   Добавлено ${i + 1} из 50 камер...`);
            }
        }

        console.log('Успешно добавлено 50 камер видеонаблюдения в базу данных');
    } catch (error) {
        console.error('Ошибка при заполнении таблицы cctv_cameras:', error.message);
        throw error;
    }
};

const clear = async () => {
    const query = `DELETE FROM cctv_cameras;`;

    try {
        await pool.query(query);
        console.log('Таблица cctv_cameras очищена');
    } catch (error) {
        console.error('Ошибка при очистке таблицы cctv_cameras:', error.message);
        throw error;
    }
};

module.exports = { seed, clear, cctvCameraFactory };
