const pool = require('../../config/db');

const employeeFactory = {
    lastNames: ['Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Соколов', 'Лебедев', 'Кузнецов',
                'Попов', 'Смирнов', 'Васильев', 'Павлов', 'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров'],

    firstNamesMale: ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья', 'Кирилл', 'Михаил',
                     'Никита', 'Егор', 'Иван', 'Даниил', 'Роман', 'Владимир', 'Павел', 'Николай', 'Денис', 'Олег'],

    firstNamesFemale: ['Анна', 'Мария', 'Елена', 'Ольга', 'Наталья', 'Ирина', 'Татьяна', 'Светлана', 'Екатерина', 'Юлия',
                       'Дарья', 'Алина', 'Виктория', 'Полина', 'Анастасия', 'Ксения', 'Валерия', 'София', 'Марина', 'Людмила'],

    middleNamesMale: ['Александрович', 'Дмитриевич', 'Максимович', 'Сергеевич', 'Андреевич', 'Алексеевич', 'Артемович',
                      'Ильич', 'Кириллович', 'Михайлович', 'Никитич', 'Егорович', 'Иванович', 'Романович', 'Владимирович'],

    middleNamesFemale: ['Александровна', 'Дмитриевна', 'Максимовна', 'Сергеевна', 'Андреевна', 'Алексеевна', 'Артемовна',
                        'Ильинична', 'Кирилловна', 'Михайловна', 'Никитична', 'Егоровна', 'Ивановна', 'Романовна', 'Владимировна'],

    positions: ['Менеджер по продажам', 'Старший менеджер', 'Консультант', 'Кассир', 'Администратор', 'Директор магазина',
                'Заместитель директора', 'Товаровед', 'Кладовщик', 'Специалист по закупкам', 'Маркетолог', 'HR-менеджер',
                'Бухгалтер', 'Системный администратор', 'Специалист техподдержки'],

    streets: ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская', 'Победы', 'Молодежная', 'Садовая', 'Центральная',
              'Школьная', 'Лесная', 'Парковая', 'Набережная', 'Заводская', 'Строителей'],

    cities: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск',
             'Самара', 'Омск', 'Ростов-на-Дону'],

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
        const domains = ['mail.ru', 'yandex.ru', 'gmail.com', 'outlook.com', 'company.ru'];
        const translitFirst = this.transliterate(firstName).toLowerCase();
        const translitLast = this.transliterate(lastName).toLowerCase();
        const domain = this.getRandomElement(domains);
        const variant = this.getRandomInt(1, 3);

        switch (variant) {
            case 1: return `${translitFirst}.${translitLast}@${domain}`;
            case 2: return `${translitFirst}${this.getRandomInt(1, 99)}@${domain}`;
            default: return `${translitLast}.${translitFirst[0]}@${domain}`;
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
            birth_date: this.getRandomDate(1970, 2000),
            address: `г. ${city}, ул. ${street}, д. ${house}, кв. ${apartment}`,
            position: this.getRandomElement(this.positions),
            email: this.getRandomEmail(firstName, lastName),
            experience: this.getRandomInt(0, 25),
            photo_url: null
        };
    }
};

const seed = async () => {
    const employees = [];

    // Генерируем 100 сотрудников
    for (let i = 0; i < 100; i++) {
        employees.push(employeeFactory.generate());
    }

    const query = `
        INSERT INTO employees (last_name, first_name, middle_name, birth_date, address, position, email, experience, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    try {
        console.log('Начинаем заполнение таблицы employees...');

        for (let i = 0; i < employees.length; i++) {
            const emp = employees[i];
            await pool.query(query, [
                emp.last_name,
                emp.first_name,
                emp.middle_name,
                emp.birth_date,
                emp.address,
                emp.position,
                emp.email,
                emp.experience,
                emp.photo_url
            ]);

            if ((i + 1) % 10 === 0) {
                console.log(`   Добавлено ${i + 1} из 100 сотрудников...`);
            }
        }

        console.log('Успешно добавлено 100 сотрудников в базу данных');
    } catch (error) {
        console.error('Ошибка при заполнении таблицы employees:', error.message);
        throw error;
    }
};

const clear = async () => {
    const query = `DELETE FROM employees;`;

    try {
        await pool.query(query);
        console.log('Таблица employees очищена');
    } catch (error) {
        console.error('Ошибка при очистке таблицы employees:', error.message);
        throw error;
    }
};

module.exports = { seed, clear, employeeFactory };
