const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Функция для получения хеша файла
function getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

// Функция для добавления версионирования к URL
function addVersionToUrl(url, version) {
    const ext = path.extname(url);
    const base = url.replace(ext, '');
    return `${base}.${version}${ext}`;
}

// Читаем HTML файл
const htmlPath = path.join(__dirname, '..', 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Получаем хеши файлов
const cssFiles = ['reset.css', 'styles.css'];
const jsFiles = ['dist/bundle.js'];

// Добавляем версионирование к CSS файлам
cssFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        const hash = getFileHash(filePath);
        const originalUrl = file;
        const versionedUrl = addVersionToUrl(originalUrl, hash);

        // Заменяем в preload
        htmlContent = htmlContent.replace(
            new RegExp(`href="${originalUrl}"`, 'g'),
            `href="${versionedUrl}"`
        );

        // Заменяем в link rel="stylesheet"
        htmlContent = htmlContent.replace(
            new RegExp(`href="${originalUrl}"`, 'g'),
            `href="${versionedUrl}"`
        );
    }
});

// Добавляем версионирование к JS файлам
jsFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        const hash = getFileHash(filePath);
        const originalUrl = file;
        const versionedUrl = addVersionToUrl(originalUrl, hash);

        // Заменяем в preload
        htmlContent = htmlContent.replace(
            new RegExp(`href="${originalUrl}"`, 'g'),
            `href="${versionedUrl}"`
        );

        // Заменяем в script src
        htmlContent = htmlContent.replace(
            new RegExp(`src="${originalUrl}"`, 'g'),
            `src="${versionedUrl}"`
        );
    }
});

// Записываем обновленный HTML
fs.writeFileSync(htmlPath, htmlContent);

console.log('Версионирование добавлено к статическим ресурсам');