const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Branding: HALE -> CentrePoint
  content = content.replace(/let aA="HALE"/g, 'let aA="CentrePoint"');
  content = content.replace(/aA="HALE"/g, 'aA="CentrePoint"');
  content = content.replace(/"HALE"/g, '"CentrePoint"');
  content = content.replace(/'HALE'/g, "'CentrePoint'");
  content = content.replace(/HALE — The Autumn Rail/g, 'CentrePoint — The Autumn Rail');
  content = content.replace(/© 2026 <!-- -->HALE<!-- --> Studio/g, '© 2026 <!-- -->CentrePoint<!-- --> Studio');
  content = content.replace(/© 2026 HALE Studio/g, '© 2026 CentrePoint Studio');
  content = content.replace(/HALE is a demo brand/g, 'CentrePoint is a demo brand');

  // 2. Formatters
  content = content.replace(/a5=t=>`\$(\d|\$|\{)/g, 'a5=t=>`KD $1');
  content = content.replace(/a5=t=>`\$\{t\}`/g, 'a5=t=>`KD ${t}`');
  content = content.replace(/or=t=>`\$\{t\.toLocaleString/g, 'or=t=>`KD ${t.toLocaleString');
  content = content.replace(/or=t=>`\$\$\{t/g, 'or=t=>`KD ${t');

  // 3. Prices in arrays / objects
  content = content.replace(/price:120/g, 'price:37');
  content = content.replace(/price:\s*120/g, 'price: 37');
  content = content.replace(/price:145/g, 'price:45');
  content = content.replace(/price:\s*145/g, 'price: 45');
  content = content.replace(/price:110/g, 'price:34');
  content = content.replace(/price:\s*110/g, 'price: 34');
  content = content.replace(/price:185/g, 'price:57');
  content = content.replace(/price:\s*185/g, 'price: 57');
  content = content.replace(/price:420/g, 'price:129');
  content = content.replace(/price:\s*420/g, 'price: 129');
  content = content.replace(/price:165/g, 'price:51');
  content = content.replace(/price:\s*165/g, 'price: 51');
  content = content.replace(/price:160/g, 'price:49');
  content = content.replace(/price:\s*160/g, 'price: 49');
  content = content.replace(/price:210/g, 'price:65');
  content = content.replace(/price:\s*210/g, 'price: 65');

  // 4. Aria labels and inline strings
  content = content.replace(/,\s*\$\{r\.price\}/g, ', KD ${r.price}');
  content = content.replace(/,\s*\$\$\{r\.price\}/g, ', KD ${r.price}');
  content = content.replace(/,\s*\$\{p\.price\}/g, ', KD ${p.price}');
  content = content.replace(/,\s*\$\$\{p\.price\}/g, ', KD ${p.price}');
  content = content.replace(/,\s*\$120/g, ', KD 37');
  content = content.replace(/,\s*\$145/g, ', KD 45');
  content = content.replace(/,\s*\$110/g, ', KD 34');
  content = content.replace(/,\s*\$185/g, ', KD 57');
  content = content.replace(/,\s*\$420/g, ', KD 129');
  content = content.replace(/,\s*\$165/g, ', KD 51');
  content = content.replace(/,\s*\$160/g, ', KD 49');
  content = content.replace(/,\s*\$210/g, ', KD 65');

  // 5. Free shipping threshold: 250 -> 75
  content = content.replace(/250-h/g, '75-h');
  content = content.replace(/h\/250/g, 'h/75');
  content = content.replace(/Free shipping over ","KD ",250/g, 'Free shipping over ","KD ",75');
  content = content.replace(/Free shipping over \$250/g, 'Free shipping over KD 75');
  content = content.replace(/Free shipping over KD 250/g, 'Free shipping over KD 75');

  // 6. Hale engine specific
  content = content.replace(/priceEl\.innerHTML = "\$" \+ p\.price/g, 'priceEl.innerHTML = "KD " + p.price');
  content = content.replace(/priceEl\.textContent = "\$" \+ pr\.price/g, 'priceEl.textContent = "KD " + pr.price');
  content = content.replace(/\>\\\$' \+ p\.price/g, '>KD \' + p.price');
  content = content.replace(/\>\$' \+ p\.price/g, '>KD \' + p.price');
  content = content.replace(/Add to Bag — \$' \+ p\.price/g, 'Add to Bag — KD \' + p.price');
  content = content.replace(/\$' \+ item\.price/g, 'KD \' + item.price');
  content = content.replace(/\$' \+ total/g, 'KD \' + total');
  content = content.replace(/Total order is \$' \+ total/g, 'Total order is KD \' + total');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[PATCHED]', filePath);
  } else {
    console.log('[NO CHANGE]', filePath);
  }
}

// Find all js and html files in public and dist
function scanAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      scanAndPatch(full);
    } else if (full.endsWith('.js') || full.endsWith('.html')) {
      patchFile(full);
    }
  }
}

console.log('Scanning and patching public/...');
scanAndPatch(path.join(rootDir, 'public'));

console.log('Scanning and patching dist/...');
scanAndPatch(path.join(rootDir, 'dist'));

console.log('Done patching.');
