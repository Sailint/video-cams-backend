const pool = require('../config/db');

// Импортируем миграции
const usersMigration = require('./migrations/001_create_users_table');
const camerasMigration = require('./migrations/002_create_cameras_table');
const cctvCamerasMigration = require('./migrations/003_create_cctv_cameras_table');
const employeesMigration = require('./migrations/004_create_employees_table');
const clientsMigration = require('./migrations/005_create_clients_table');
const cartItemsMigration = require('./migrations/006_create_cart_items_table');
const ordersMigration = require('./migrations/007_create_orders_table');
const orderItemsMigration = require('./migrations/008_create_order_items_table');

// Импортируем сидеры
const userSeeder = require('./seeders/userSeeder');
const cameraSeeder = require('./seeders/cameraSeeder');
const cctvCameraSeeder = require('./seeders/cctvCameraSeeder');
const employeeSeeder = require('./seeders/employeeSeeder');
const clientSeeder = require('./seeders/clientSeeder');

const migrations = [
    { name: '001_create_users_table', migration: usersMigration },
    { name: '002_create_cameras_table', migration: camerasMigration },
    { name: '003_create_cctv_cameras_table', migration: cctvCamerasMigration },
    { name: '004_create_employees_table', migration: employeesMigration },
    { name: '005_create_clients_table', migration: clientsMigration },
    { name: '006_create_cart_items_table', migration: cartItemsMigration },
    { name: '007_create_orders_table', migration: ordersMigration },
    { name: '008_create_order_items_table', migration: orderItemsMigration }
];

const runMigrations = async () => {
    console.log('\n📦 Запуск миграций...\n');

    for (const { name, migration } of migrations) {
        console.log(`▶️  Выполняется: ${name}`);
        await migration.up();
    }

    console.log('\n✅ Все миграции выполнены успешно!\n');
};

const rollbackMigrations = async () => {
    console.log('\n🔄 Откат миграций...\n');

    // Откатываем в обратном порядке
    for (const { name, migration } of [...migrations].reverse()) {
        console.log(`▶️  Откат: ${name}`);
        await migration.down();
    }

    console.log('\n✅ Все миграции откачены!\n');
};

const seedDatabase = async () => {
    console.log('\n🌱 Заполнение базы данных...\n');

    await userSeeder.seed();
    await cameraSeeder.seed();
    await cctvCameraSeeder.seed();
    await employeeSeeder.seed();
    await clientSeeder.seed();

    console.log('\n✅ База данных заполнена!\n');
};

const freshDatabase = async () => {
    console.log('\n🔥 Полная пересоздание базы данных...\n');

    await rollbackMigrations();
    await runMigrations();
    await seedDatabase();

    console.log('\n✅ База данных полностью пересоздана и заполнена!\n');
};

const main = async () => {
    const command = process.argv[2];

    try {
        switch (command) {
            case 'migrate':
                await runMigrations();
                break;
            case 'rollback':
                await rollbackMigrations();
                break;
            case 'seed':
                await seedDatabase();
                break;
            case 'fresh':
                await freshDatabase();
                break;
            default:
                console.log(`
📋 Доступные команды:

  node database/migrate.js migrate   - Запустить все миграции
  node database/migrate.js rollback  - Откатить все миграции
  node database/migrate.js seed      - Заполнить базу данных тестовыми данными
  node database/migrate.js fresh     - Пересоздать БД и заполнить данными
                `);
        }
    } catch (error) {
        console.error('\n❌ Ошибка:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

main();
