const fs = require('fs');
const path = require('path');

// Функция для минификации HTML
function minifyHTML(htmlContent) {
    return htmlContent
        // Убираем комментарии (кроме критических)
        .replace(/<!--(?!\s*(?:Критический|Preload))[^]*?-->/g, '')
        // Убираем лишние пробелы и переносы строк
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        // Убираем пробелы в атрибутах
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*>\s*/g, '>')
        // Убираем лишние пробелы в конце
        .trim();
}

// Функция для обработки HTML файла
function processHTMLFile() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const originalContent = fs.readFileSync(htmlPath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent, 'utf8');

    const minifiedContent = minifyHTML(originalContent);
    const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');

    const saved = originalSize - minifiedSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);

    console.log(`index.html: ${originalSize} → ${minifiedSize} bytes (${savedPercent}% saved)`);

    // Создаем резервную копию
    const backupPath = htmlPath + '.backup';
    if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, originalContent);
    }

    // Записываем минифицированную версию
    fs.writeFileSync(htmlPath, minifiedContent);

    console.log(`\nОбщая экономия: ${saved} bytes`);
}

// Запускаем минификацию
processHTMLFile();