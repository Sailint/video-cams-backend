const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const VALID_LEVELS = ['error', 'warn', 'info', 'http', 'debug'];
const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 1000;

// Возвращает сегодняшнюю дату в формате YYYY-MM-DD (по местному времени сервера)
const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getLogs = async (req, res) => {
    try {
        const date = getTodayString();
        const filePath = path.join(logsDir, `combined-${date}.log`);

        let content;
        try {
            content = await fs.promises.readFile(filePath, 'utf-8');
        } catch (err) {
            // Файла за сегодня ещё нет — записей нет
            if (err.code === 'ENOENT') {
                return res.status(200).json({ date, entries: [] });
            }
            throw err;
        }

        // Парсим JSON-строки, пропуская пустые и битые
        let entries = content
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => {
                try {
                    return JSON.parse(line);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        // Фильтр по уровню
        const level = req.query.level;
        if (level && level !== 'all' && VALID_LEVELS.includes(level)) {
            entries = entries.filter((entry) => entry.level === level);
        }

        // Новые записи сверху
        entries.reverse();

        // Ограничение количества
        let limit = parseInt(req.query.limit, 10);
        if (Number.isNaN(limit) || limit <= 0) limit = DEFAULT_LIMIT;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;
        entries = entries.slice(0, limit);

        res.status(200).json({ date, entries });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка чтения логов', error: err.message });
    }
};

module.exports = { getLogs };
