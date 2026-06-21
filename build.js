const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC = __dirname;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function minifyCSS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-<>!&|?:])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\n/g, '')
    .trim();
}

function copyAndMinify(srcFile, destFile) {
  const ext = path.extname(srcFile);
  const content = fs.readFileSync(srcFile, 'utf8');
  let result;

  if (ext === '.css') {
    result = minifyCSS(content);
  } else if (ext === '.js') {
    result = minifyJS(content);
  } else {
    fs.copyFileSync(srcFile, destFile);
    return;
  }

  const originalSize = Buffer.byteLength(content);
  const minifiedSize = Buffer.byteLength(result);
  const saved = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
  console.log(`  ${path.basename(srcFile)}: ${originalSize} → ${minifiedSize} bytes (-${saved}%)`);

  fs.writeFileSync(destFile, result);
}

console.log('Building ttmebel...\n');

ensureDir(DIST);
ensureDir(path.join(DIST, 'css'));
ensureDir(path.join(DIST, 'js'));
ensureDir(path.join(DIST, 'data'));
ensureDir(path.join(DIST, 'images'));

const cssFiles = ['style.css', 'admin.css'];
const jsFiles = ['main.js', 'catalog.js', 'admin.js', 'notify.js', 'site-render.js', 'analytics.js', 'cart.js', 'chat.js'];
const htmlFiles = ['index.html', 'catalog.html', 'about.html', 'delivery.html', 'reviews.html', 'contacts.html', 'admin.html', 'login.html', 'register.html', 'profile.html'];
const dataFiles = ['products.json', 'site.json', 'config.json'];

console.log('CSS:');
cssFiles.forEach(f => {
  const src = path.join(SRC, 'css', f);
  if (fs.existsSync(src)) copyAndMinify(src, path.join(DIST, 'css', f));
});

console.log('\nJS:');
jsFiles.forEach(f => {
  const src = path.join(SRC, 'js', f);
  if (fs.existsSync(src)) copyAndMinify(src, path.join(DIST, 'js', f));
});

console.log('\nHTML:');
htmlFiles.forEach(f => {
  const src = path.join(SRC, f);
  if (fs.existsSync(src)) {
    let html = fs.readFileSync(src, 'utf8');
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/>\s+</g, '><');
    const origSize = fs.statSync(src).size;
    const newSize = Buffer.byteLength(html);
    const saved = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`  ${f}: ${origSize} → ${newSize} bytes (-${saved}%)`);
    fs.writeFileSync(path.join(DIST, f), html.trim());
  }
});

console.log('\nData:');
dataFiles.forEach(f => {
  const src = path.join(SRC, 'data', f);
  if (fs.existsSync(src)) {
    const data = JSON.parse(fs.readFileSync(src, 'utf8'));
    fs.writeFileSync(path.join(DIST, 'data', f), JSON.stringify(data));
    console.log(`  ${f}: minified`);
  }
});

const staticFiles = ['robots.txt', 'sitemap.xml', 'manifest.json', 'sw.js'];
staticFiles.forEach(f => {
  const src = path.join(SRC, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, f));
});

if (fs.existsSync(path.join(SRC, 'images'))) {
  const images = fs.readdirSync(path.join(SRC, 'images'));
  images.forEach(f => {
    const src = path.join(SRC, 'images', f);
    const dest = path.join(DIST, 'images', f);
    if (fs.statSync(src).isDirectory()) {
      ensureDir(dest);
      fs.readdirSync(src).forEach(sf => {
        fs.copyFileSync(path.join(src, sf), path.join(dest, sf));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  });
}

const totalDist = fs.readdirSync(DIST, { withFileTypes: true }).length;
console.log(`\nDone! ${totalDist} items in /dist`);
