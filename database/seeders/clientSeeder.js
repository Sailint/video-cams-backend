const pool = require('../../config/db');

const clientFactory = {
    lastNames: ['Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Соколов', 'Лебедев', 'Кузнецов',
                'Попов', 'Смирнов', 'Васильев', 'Павлов', 'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров',
                'Михайлов', 'Беляев', 'Тарасов', 'Белов', 'Комаров', 'Орлов', 'Киселев', 'Макаров', 'Андреев', 'Ковалев'],

    firstNamesMale: ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья', 'Кирилл', 'Михаил',
                     'Никита', 'Егор', 'Иван', 'Даниил', 'Роман', 'Владимир', 'Павел', 'Николай', 'Денис', 'Олег'],

    firstNamesFemale: ['Анна', 'Мария', 'Елена', 'Ольга', 'Наталья', 'Ирина', 'Татьяна', 'Светлана', 'Екатерина', 'Юлия',
                       'Дарья', 'Алина', 'Виктория', 'Полина', 'Анастасия', 'Ксения', 'Валерия', 'София', 'Марина', 'Людмила'],

    middleNamesMale: ['Александрович', 'Дмитриевич', 'Максимович', 'Сергеевич', 'Андреевич', 'Алексеевич', 'Артемович',
                      'Ильич', 'Кириллович', 'Михайлович', 'Никитич', 'Егорович', 'Иванович', 'Романович', 'Владимирович'],

    middleNamesFemale: ['Александровна', 'Дмитриевна', 'Максимовна', 'Сергеевна', 'Андреевна', 'Алексеевна', 'Артемовна',
                        'Ильинична', 'Кирилловна', 'Михайловна', 'Никитична', 'Егоровна', 'Ивановна', 'Романовна', 'Владимировна'],

    streets: ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская', 'Победы', 'Молодежная', 'Садовая', 'Центральная',
              'Школьная', 'Лесная', 'Парковая', 'Набережная', 'Заводская', 'Строителей', 'Кирова', 'Комсомольская',
              'Октябрьская', 'Первомайская', 'Трудовая'],

    cities: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск',
             'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'],

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomDate(startYear, endYear) {
        const year = this.getRandomInt(startYear, endYear);
        const month = this.getRandomInt(1, 12);
        const day = this.getRandomInt(1, 28);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },

    getRandomEmail(firstName, lastName) {
        const domains = ['mail.ru', 'yandex.ru', 'gmail.com', 'outlook.com', 'rambler.ru', 'inbox.ru'];
        const translitFirst = this.transliterate(firstName).toLowerCase();
        const translitLast = this.transliterate(lastName).toLowerCase();
        const domain = this.getRandomElement(domains);
        const variant = this.getRandomInt(1, 4);

        switch (variant) {
            case 1: return `${translitFirst}.${translitLast}@${domain}`;
            case 2: return `${translitFirst}${this.getRandomInt(1, 999)}@${domain}`;
            case 3: return `${translitLast}.${translitFirst[0]}@${domain}`;
            default: return `${translitFirst}_${translitLast}${this.getRandomInt(1, 99)}@${domain}`;
        }
    },

    transliterate(text) {
        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return text.split('').map(char => map[char.toLowerCase()] || char).join('');
    },

    generate() {
        const isMale = Math.random() > 0.5;
        const lastName = this.getRandomElement(this.lastNames) + (isMale ? '' : 'а');
        const firstName = this.getRandomElement(isMale ? this.firstNamesMale : this.firstNamesFemale);
        const middleName = this.getRandomElement(isMale ? this.middleNamesMale : this.middleNamesFemale);

        const city = this.getRandomElement(this.cities);
        const street = this.getRandomElement(this.streets);
        const house = this.getRandomInt(1, 150);
        const apartment = this.getRandomInt(1, 200);

        return {
            last_name: lastName,
            first_name: firstName,
            middle_name: middleName,
            birth_date: this.getRandomDate(1960, 2005),
            address: `г. ${city}, ул. ${street}, д. ${house}, кв. ${apartment}`,
            email: this.getRandomEmail(firstName, lastName),
            photo_url: null
        };
    }
};

const seed = async () => {
    const clients = [];

    // Генерируем 100 клиентов
    for (let i = 0; i < 100; i++) {
        clients.push(clientFactory.generate());
    }

    const query = `
        INSERT INTO clients (last_name, first_name, middle_name, birth_date, address, email, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
        console.log('Начинаем заполнение таблицы clients...');

        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            await pool.query(query, [
                client.last_name,
                client.first_name,
                client.middle_name,
                client.birth_date,
                client.address,
                client.email,
                client.photo_url
            ]);

            if ((i + 1) % 10 === 0) {
                console.log(`   Добавлено ${i + 1} из 100 клиентов...`);
            }
        }

        console.log('Успешно добавлено 100 клиентов в базу данных');
    } catch (error) {
        console.error('Ошибка при заполнении таблицы clients:', error.message);
        throw error;
    }
};

const clear = async () => {
    const query = `DELETE FROM clients;`;

    try {
        await pool.query(query);
        console.log('Таблица clients очищена');
    } catch (error) {
        console.error('Ошибка при очистке таблицы clients:', error.message);
        throw error;
    }
};

module.exports = { seed, clear, clientFactory };
