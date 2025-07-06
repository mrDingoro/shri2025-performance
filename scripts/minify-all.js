const fs = require('fs');
const path = require('path');

// Функция для минификации CSS
function minifyCSS(cssContent) {
    return cssContent
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/;}/g, '}')
        .trim();
}

// Функция для минификации HTML
function minifyHTML(htmlContent) {
    return htmlContent
        .replace(/<!--(?!\s*(?:Критический|Preload))[^]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*>\s*/g, '>')
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

// Функция для полной минификации HTML
function fullMinifyHTML(htmlContent) {
    // Сначала минифицируем встроенный CSS
    let result = minifyInlineCSS(htmlContent);
    // Затем минифицируем сам HTML
    result = minifyHTML(result);
    return result;
}

// Функция для обработки всех файлов
function processAllFiles() {
    const projectDir = path.join(__dirname, '..');
    let totalSaved = 0;

    // Минифицируем HTML
    const htmlPath = path.join(projectDir, 'index.html');
    if (fs.existsSync(htmlPath)) {
        const originalContent = fs.readFileSync(htmlPath, 'utf8');
        const originalSize = Buffer.byteLength(originalContent, 'utf8');

        const minifiedContent = fullMinifyHTML(originalContent);
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

        totalSaved += saved;
    }

    // Минифицируем CSS файлы
    const cssFiles = ['styles.css', 'reset.css'];
    cssFiles.forEach(file => {
        const cssPath = path.join(projectDir, file);
        if (fs.existsSync(cssPath)) {
            const originalContent = fs.readFileSync(cssPath, 'utf8');
            const originalSize = Buffer.byteLength(originalContent, 'utf8');

            const minifiedContent = minifyCSS(originalContent);
            const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');

            const saved = originalSize - minifiedSize;
            const savedPercent = ((saved / originalSize) * 100).toFixed(1);

            console.log(`${file}: ${originalSize} → ${minifiedSize} bytes (${savedPercent}% saved)`);

            // Создаем резервную копию
            const backupPath = cssPath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, originalContent);
            }

            // Записываем минифицированную версию
            fs.writeFileSync(cssPath, minifiedContent);

            totalSaved += saved;
        }
    });

    console.log(`\nОбщая экономия: ${totalSaved} bytes`);
}

// Запускаем полную минификацию
processAllFiles();