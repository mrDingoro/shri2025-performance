const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

// Конфигурация SVGO (безопасная)
const svgoConfig = {
    plugins: [
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'cleanupAttrs',
        'mergeStyles',
        'inlineStyles',
        'minifyStyles',
        'cleanupIds',
        'removeRasterImages',
        'removeUselessDefs',
        'cleanupNumericValues',
        'convertColors',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'removeViewBox',
        'cleanupEnableBackground',
        'removeHiddenElems',
        'removeEmptyText',
        'convertShapeToPath',
        'convertEllipseToCircle',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        'convertPathData',
        'convertTransform',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'mergePaths',
        'removeUnusedNS',
        'sortDefsChildren',
        'removeTitle',
        'removeDesc'
    ]
};

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

            try {
                const result = optimize(originalContent, {
                    path: filePath,
                    ...svgoConfig
                });

                const minifiedContent = result.data;
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
            } catch (error) {
                console.error(`Ошибка при обработке ${file}:`, error.message);
            }
        }
    });

    console.log(`\nОбщая экономия: ${totalSaved} bytes`);
}

// Запускаем минификацию
processSVGFiles();