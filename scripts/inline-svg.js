const fs = require('fs');
const path = require('path');

// Функция для конвертации SVG в data URI
function svgToDataURI(svgContent) {
    const encoded = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${encoded}`;
}

// Функция для создания CSS с встроенными SVG
function createInlineSVGCSS() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const files = fs.readdirSync(assetsDir);

    let cssContent = '/* Inline SVG icons */\n';
    let totalSaved = 0;

    files.forEach(file => {
        if (file.endsWith('.svg')) {
            const filePath = path.join(assetsDir, file);
            const svgContent = fs.readFileSync(filePath, 'utf8');
            const dataURI = svgToDataURI(svgContent);

            // Создаем CSS класс для каждого SVG
            const className = file.replace('.svg', '').replace(/[^a-zA-Z0-9]/g, '_');
            cssContent += `.inline-${className} { background-image: url("${dataURI}"); }\n`;

            console.log(`Встроен ${file} как .inline-${className}`);
        }
    });

    // Записываем CSS файл
    const cssPath = path.join(__dirname, '..', 'inline-svg.css');
    fs.writeFileSync(cssPath, cssContent);

    console.log(`\nСоздан файл inline-svg.css с встроенными SVG`);
    console.log(`Добавьте <link rel="stylesheet" href="inline-svg.css"> в HTML для использования`);
}

// Запускаем создание встроенных SVG
createInlineSVGCSS();