const fs = require('fs');
const path = require('path');

// Функция для минификации SVG
function minifySVG(svgContent) {
    return svgContent
        // Убираем XML декларацию
        .replace(/<\?xml[^>]*\?>/g, '')
        // Убираем комментарии
        .replace(/<!--[\s\S]*?-->/g, '')
        // Убираем лишние пробелы и переносы строк
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        // Убираем ненужные атрибуты
        .replace(/xmlns:xlink="[^"]*"/g, '')
        .replace(/xlink:href="[^"]*"/g, '')
        // Убираем пустые defs
        .replace(/<defs><\/defs>/g, '')
        // Убираем ненужные группы и метаданные
        .replace(/<g[^>]*id="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*transform="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*stroke="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*fill="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*fill-rule="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*stroke-width="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*stroke-linecap="[^"]*"[^>]*>/g, '')
        .replace(/<g[^>]*stroke-linejoin="[^"]*"[^>]*>/g, '')
        // Убираем пустые группы
        .replace(/<g[^>]*><\/g>/g, '')
        // Убираем title и desc
        .replace(/<title>[^<]*<\/title>/g, '')
        .replace(/<desc>[^<]*<\/desc>/g, '')
        // Убираем лишние пробелы в конце
        .trim();
}

// Функция для обработки всех SVG файлов
function processSVGFiles() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const files = fs.readdirSync(assetsDir);

    let totalSaved = 0;

    files.forEach(file => {
        if (file.endsWith('.svg')) {
            const filePath = path.join(assetsDir, file);
            const originalContent = fs.readFileSync(filePath, 'utf8');
            const originalSize = Buffer.byteLength(originalContent, 'utf8');

            const minifiedContent = minifySVG(originalContent);
            const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');

            const saved = originalSize - minifiedSize;
            const savedPercent = ((saved / originalSize) * 100).toFixed(1);

            console.log(`${file}: ${originalSize} → ${minifiedSize} bytes (${savedPercent}% saved)`);

            // Создаем резервную копию
            const backupPath = filePath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, originalContent);
            }

            // Записываем минифицированную версию
            fs.writeFileSync(filePath, minifiedContent);

            totalSaved += saved;
        }
    });

    console.log(`\nОбщая экономия: ${totalSaved} bytes`);
}

// Запускаем минификацию
processSVGFiles();