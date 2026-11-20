const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Clean / create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'img'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets', 'chunks'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets', 'media'), { recursive: true });

// 2. Copy images
const imgSource = fs.existsSync(path.join(srcDir, 'demo', 'hale', 'img'))
  ? path.join(srcDir, 'demo', 'hale', 'img')
  : path.join(srcDir, 'img');
copyDirRecursive(imgSource, path.join(distDir, 'img'));

// 3. Copy fonts (media)
const mediaSource = fs.existsSync(path.join(srcDir, 'demo', 'hale', '_next', 'static', 'media'))
  ? path.join(srcDir, 'demo', 'hale', '_next', 'static', 'media')
  : path.join(srcDir, 'assets', 'media');
if (fs.existsSync(mediaSource)) {
  copyDirRecursive(mediaSource, path.join(distDir, 'assets', 'media'));
}

// 4. Copy chunks
const chunksSource = fs.existsSync(path.join(srcDir, 'demo', 'hale', '_next', 'static', 'chunks'))
  ? path.join(srcDir, 'demo', 'hale', '_next', 'static', 'chunks')
  : path.join(srcDir, 'assets', 'chunks');
if (fs.existsSync(chunksSource)) {
  copyDirRecursive(chunksSource, path.join(distDir, 'assets', 'chunks'));
}

// 5. Update engine.js
const engineSrc = path.join(srcDir, 'assets', 'hale-engine.js');
if (fs.existsSync(engineSrc)) {
  let engineCode = fs.readFileSync(engineSrc, 'utf8');
  engineCode = engineCode.replace(/\/demo\/hale\/img\//g, './img/');
  fs.writeFileSync(path.join(distDir, 'assets', 'hale-engine.js'), engineCode, 'utf8');
}

// 6. Build dist/index.html
const htmlSrc = path.join(srcDir, 'demo', 'hale', 'index.html');
if (fs.existsSync(htmlSrc)) {
  let html = fs.readFileSync(htmlSrc, 'utf8');
  html = html.replace(/\/demo\/hale\/_next\/static\/chunks\//g, './assets/chunks/');
  html = html.replace(/\/demo\/hale\/_next\/static\/media\//g, './assets/media/');
  html = html.replace(/\/demo\/hale\/img\//g, './img/');
  html = html.replace(/src="\/assets\//g, 'src="./assets/');
  html = html.replace(/href="\/assets\//g, 'href="./assets/');

  const cssOverrides = `<style>
  .rk-item { visibility: visible !important; }
  .to-fig { width: min(500px, 32vw); height: min(920px, 84svh); }
  .to-wear { object-fit: contain; width: 100%; height: 100%; }
</style>`;

  if (!html.includes('.rk-item { visibility: visible !important; }')) {
    html = html.replace('</head>', cssOverrides + '\n</head>');
  }

  html = html.replace(/<script[^>]*hale-engine\.js[^>]*><\/script>/g, '');
  html = html.replace('</body>', '<script src="./assets/hale-engine.js" defer></script>\n</body>');

  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
}

// 7. Patch CSS inside dist
const distCssPath = path.join(distDir, 'assets', 'chunks', '25qikuy2a0xnz.css');
if (fs.existsSync(distCssPath)) {
  let css = fs.readFileSync(distCssPath, 'utf8');
  css = css.replace(/visibility:\s*hidden;/g, 'visibility:visible;');
  css = css.replace(/\/demo\/hale\/_next\/static\/media\//g, '../media/');
  fs.writeFileSync(distCssPath, css, 'utf8');
}

console.log('[BUILD-DIST] Successfully built self-contained dist folder.');
