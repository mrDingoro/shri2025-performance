const fs = require('fs');
const path = require('path');

// Функция для минификации CSS
function minifyCSS(cssContent) {
    return cssContent
        // Убираем комментарии
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Убираем лишние пробелы и переносы строк
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        // Убираем последнюю точку с запятой в блоке
        .replace(/;}/g, '}')
        // Убираем лишние пробелы в конце
        .trim();
}

// Функция для минификации встроенного CSS в HTML
function minifyInlineCSS(htmlContent) {
    return htmlContent.replace(
        /<style>([\s\S]*?)<\/style>/g,
        (match, cssContent) => {
            const minifiedCSS = minifyCSS(cssContent);
            return `<style>${minifiedCSS}</style>`;
        }
    );
}

// Функция для обработки HTML файла
function processHTMLFile() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const originalContent = fs.readFileSync(htmlPath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent, 'utf8');

    const minifiedContent = minifyInlineCSS(originalContent);
    const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');

    const saved = originalSize - minifiedSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);

    console.log(`index.html (inline CSS): ${originalSize} → ${minifiedSize} bytes (${savedPercent}% saved)`);

    // Записываем минифицированную версию
    fs.writeFileSync(htmlPath, minifiedContent);

    console.log(`\nОбщая экономия: ${saved} bytes`);
}

// Запускаем минификацию
processHTMLFile();