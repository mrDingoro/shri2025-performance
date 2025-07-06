const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Функция для извлечения критических стилей
function extractCriticalCSS() {
    try {
        console.log('🎯 Извлекаем критические стили...');

        // Сначала создаем временный HTML с обычными CSS файлами
        const tempHTML = `<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Яндекс.Дом</title>
    <link rel="stylesheet" type="text/css" href="reset.css">
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <div id="app"></div>
    <footer class="footer">
        <ul class="footer__list">
            <li class="footer__item"><a class="footer__link" href="/">Помощь</a></li>
            <li class="footer__item"><a class="footer__link" href="/">Обратная связь</a></li>
            <li class="footer__item"><a class="footer__link" href="/">Разработчикам</a></li>
            <li class="footer__item"><a class="footer__link" href="/">Условия использования</a></li>
        </ul>
        <div class="footer__copyright">© 1997–2023 ООО «Яндекс»</div>
    </footer>
    <script src="dist/bundle.js" defer></script>
</body>
</html>`;

        fs.writeFileSync('temp.html', tempHTML);

        // Запускаем critical для извлечения критических стилей
        execSync('npx critical temp.html --inline --base . --target critical.css --width 1200 --height 900', { stdio: 'inherit' });

        // Читаем извлеченные критические стили
        const criticalCSS = fs.readFileSync('critical.css', 'utf8');

        // Обновляем HTML с инлайн критическими стилями
        updateHTMLWithCriticalCSS(criticalCSS);

        // Удаляем временные файлы
        fs.unlinkSync('critical.css');
        fs.unlinkSync('temp.html');

        console.log('✅ Критические стили успешно извлечены и добавлены в HTML');

    } catch (error) {
        console.error('❌ Ошибка при извлечении критических стилей:', error.message);
    }
}

// Функция для обновления HTML с критическими стилями
function updateHTMLWithCriticalCSS(criticalCSS) {
    try {
        const htmlPath = 'index.html';
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Удаляем старые инлайн стили если есть
        html = html.replace(/<style>[\s\S]*?<\/style>/, '');

        // Добавляем новые критические стили
        const criticalStyleTag = `<style>${criticalCSS}</style>`;

        // Вставляем после title
        html = html.replace(
            /(<title>.*?<\/title>)/,
            `$1\n    ${criticalStyleTag}`
        );

        fs.writeFileSync(htmlPath, html);
        console.log('✅ HTML обновлен с критическими стилями');

    } catch (error) {
        console.error('❌ Ошибка при обновлении HTML:', error.message);
    }
}

// Функция для сборки некритических стилей
function buildNonCriticalCSS() {
    try {
        console.log('📦 Собираем некритические стили...');

        // Создаем файл с некритическими стилями
        const nonCriticalCSS = `
/* Некритические стили */
@import 'reset.css';
@import 'styles.css';
        `.trim();

        fs.writeFileSync('non-critical.css', nonCriticalCSS);

        // Минифицируем некритические стили
        execSync('npx postcss non-critical.css -o styles.min.css', { stdio: 'inherit' });

        // Удаляем временный файл
        fs.unlinkSync('non-critical.css');

        console.log('✅ Некритические стили собраны в styles.min.css');

    } catch (error) {
        console.error('❌ Ошибка при сборке некритических стилей:', error.message);
    }
}

// Основная функция
function main() {
    console.log('🚀 Начинаем сборку с критическими стилями...\n');

    try {
        // 0. Сначала создаем минифицированные версии CSS
        console.log('📦 Создаем минифицированные версии CSS...');
        execSync('npm run minify-css', { stdio: 'inherit' });

        // 1. Извлекаем критические стили и обновляем HTML
        extractCriticalCSS();

        // 2. Собираем некритические стили
        buildNonCriticalCSS();

        console.log('\n✨ Сборка завершена!');
        console.log('📄 HTML содержит критические стили инлайн');
        console.log('📄 styles.min.css содержит остальные стили');

    } catch (error) {
        console.error('❌ Ошибка при сборке:', error.message);
    }
}

// Запускаем если скрипт вызван напрямую
if (require.main === module) {
    main();
}

module.exports = { extractCriticalCSS, buildNonCriticalCSS };