const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const outputDir = path.join(__dirname, '../../ui.apps/src/main/content/jcr_root/apps/hiero-ecom/clientlibs/clientlib-header-footer');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const jsFile = path.join(distDir, 'header-footer.js');
const cssFile = path.join(distDir, 'css', 'header-footer.css');

if (fs.existsSync(jsFile)) {
  fs.copyFileSync(jsFile, path.join(outputDir, 'js', 'header-footer.js'));
}

if (fs.existsSync(cssFile)) {
  fs.copyFileSync(cssFile, path.join(outputDir, 'css', 'header-footer.css'));
}

console.log('Build output copied to ui.apps clientlib');
