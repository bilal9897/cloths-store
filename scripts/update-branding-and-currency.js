const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update public/assets/hale-engine.js
const enginePath = path.join(rootDir, 'public', 'assets', 'hale-engine.js');
if (fs.existsSync(enginePath)) {
  let engine = fs.readFileSync(enginePath, 'utf8');

  // Update prices in PRODUCTS array
  engine = engine.replace(/price:\s*120/, 'price: 37');
  engine = engine.replace(/price:\s*145/, 'price: 45');
  engine = engine.replace(/price:\s*110/, 'price: 34');
  engine = engine.replace(/price:\s*185/, 'price: 57');
  engine = engine.replace(/price:\s*420/, 'price: 129');
  engine = engine.replace(/price:\s*165/, 'price: 51');
  engine = engine.replace(/price:\s*160/, 'price: 49');
  engine = engine.replace(/price:\s*210/, 'price: 65');

  // Update price formatting in DOM updates
  engine = engine.replace('priceEl.innerHTML = "$" + p.price', 'priceEl.innerHTML = "KD " + p.price');
  engine = engine.replace('priceEl.textContent = "$" + pr.price', 'priceEl.textContent = "KD " + pr.price');
  engine = engine.replace('<p style="font-size:24px;font-weight:500;margin:0 0 20px 0;">$\' + p.price + \'</p>\'', '<p style="font-size:24px;font-weight:500;margin:0 0 20px 0;">KD \' + p.price + \'</p>\'');
  engine = engine.replace('Add to Bag — $\' + p.price', 'Add to Bag — KD \' + p.price');
  engine = engine.replace('$\' + item.price + \' × \' + item.qty', 'KD \' + item.price + \' × \' + item.qty');
  engine = engine.replace('<span>$\' + total + \'</span>', '<span>KD \' + total + \'</span>');
  engine = engine.replace('Total order is $\' + total', 'Total order is KD \' + total');

  // Update log
  engine = engine.replace('[HALE FULL ENGINE]', '[CentrePoint FULL ENGINE]');

  fs.writeFileSync(enginePath, engine, 'utf8');
  console.log('[OK] Updated public/assets/hale-engine.js');
}

// 2. Update HTML templates: public/demo/hale/index.html and public/site.html
const htmlFiles = [
  path.join(rootDir, 'public', 'demo', 'hale', 'index.html'),
  path.join(rootDir, 'public', 'site.html')
];

htmlFiles.forEach(htmlPath => {
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Branding replacements
    html = html.replace(/<title>HALE — The Autumn Rail<\/title>/g, '<title>CentrePoint — The Autumn Rail</title>');
    html = html.replace(/class="hd-mark" href="#rail">HALE<\/a>/g, 'class="hd-mark" href="#rail">CentrePoint</a>');
    html = html.replace(/class="hd-mark" href="#top">HALE<\/a>/g, 'class="hd-mark" href="#top">CentrePoint</a>');
    html = html.replace(/class="zm-word">HALE<\/text>/g, 'class="zm-word">CENTREPOINT</text>');
    html = html.replace(/aria-hidden="true">HALE<\/div>/g, 'aria-hidden="true">CentrePoint</div>');
    html = html.replace(/© 2026 <!-- -->HALE<!-- --> Studio/g, '© 2026 <!-- -->CentrePoint<!-- --> Studio');
    html = html.replace(/© 2026 HALE Studio/g, '© 2026 CentrePoint Studio');
    html = html.replace(/HALE is a demo brand/g, 'CentrePoint is a demo brand');

    // Price replacements (USD -> KD)
    const priceMap = [
      { from: 'Hoodie in Oat, $120', to: 'Hoodie in Oat, KD 37' },
      { from: 'Overshirt in Bone, $145', to: 'Overshirt in Bone, KD 45' },
      { from: 'Camp Shirt in Stone, $110', to: 'Camp Shirt in Stone, KD 34' },
      { from: 'Chore Jacket in Olive, $185', to: 'Chore Jacket in Olive, KD 57' },
      { from: 'Overcoat in Charcoal, $420', to: 'Overcoat in Charcoal, KD 129' },
      { from: 'Cable Knit in Navy, $165', to: 'Cable Knit in Navy, KD 51' },
      { from: 'Shirt Jacket in Rust, $160', to: 'Shirt Jacket in Rust, KD 49' },
      { from: 'Bomber in Black, $210', to: 'Bomber in Black, KD 65' },
      { from: '$<!-- -->120', to: 'KD <!-- -->37' },
      { from: '<span data-price="true">$120</span>', to: '<span data-price="true">KD 37</span>' },
      { from: '<b>$420</b>', to: '<b>KD 129</b>' },
      { from: 'Chore Jacket<!-- --> — <!-- -->$185', to: 'Chore Jacket<!-- --> — <!-- -->KD 57' },
      { from: '$185<!-- --> <u>View</u>', to: 'KD 57<!-- --> <u>View</u>' },
      { from: 'Rust<!-- --> · <!-- -->$160', to: 'Rust<!-- --> · <!-- -->KD 49' },
      { from: 'Navy<!-- --> · <!-- -->$165', to: 'Navy<!-- --> · <!-- -->KD 51' },
      { from: 'Oat<!-- --> · <!-- -->$120', to: 'Oat<!-- --> · <!-- -->KD 37' },
      { from: 'Black<!-- --> · <!-- -->$210', to: 'Black<!-- --> · <!-- -->KD 65' },
      { from: 'Stone<!-- --> · <!-- -->$110', to: 'Stone<!-- --> · <!-- -->KD 34' },
      { from: '<b>Hoodie</b> <!-- -->$<!-- -->120', to: '<b>Hoodie</b> <!-- -->KD <!-- -->37' },
      { from: '<b>Overshirt</b> <!-- -->$<!-- -->145', to: '<b>Overshirt</b> <!-- -->KD <!-- -->45' },
      { from: '<b>Camp Shirt</b> <!-- -->$<!-- -->110', to: '<b>Camp Shirt</b> <!-- -->KD <!-- -->34' },
      { from: '<b>Chore Jacket</b> <!-- -->$<!-- -->185', to: '<b>Chore Jacket</b> <!-- -->KD <!-- -->57' },
      { from: '<b>Overcoat</b> <!-- -->$<!-- -->420', to: '<b>Overcoat</b> <!-- -->KD <!-- -->129' },
      { from: '<b>Cable Knit</b> <!-- -->$<!-- -->165', to: '<b>Cable Knit</b> <!-- -->KD <!-- -->51' },
      { from: '<b>Shirt Jacket</b> <!-- -->$<!-- -->160', to: '<b>Shirt Jacket</b> <!-- -->KD <!-- -->49' },
      { from: '<b>Bomber</b> <!-- -->$<!-- -->210', to: '<b>Bomber</b> <!-- -->KD <!-- -->65' },
      { from: 'You are <!-- -->$250<!-- --> away from free shipping', to: 'You are <!-- -->KD 75<!-- --> away from free shipping' },
      { from: '<span>Subtotal</span><b>$0</b>', to: '<span>Subtotal</span><b>KD 0</b>' }
    ];

    priceMap.forEach(({ from, to }) => {
      html = html.split(from).join(to);
    });

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('[OK] Updated ' + htmlPath);
  }
});

// 3. Update JS chunks in public/demo/hale/_next/static/chunks
const chunksDir = path.join(rootDir, 'public', 'demo', 'hale', '_next', 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  const chunkFiles = fs.readdirSync(chunksDir);
  chunkFiles.forEach(cf => {
    if (cf.endsWith('.js')) {
      const cPath = path.join(chunksDir, cf);
      let content = fs.readFileSync(cPath, 'utf8');
      let changed = false;

      // Replace brand name in strings
      if (content.includes('HALE — The Autumn Rail')) {
        content = content.replace(/HALE — The Autumn Rail/g, 'CentrePoint — The Autumn Rail');
        changed = true;
      }
      if (content.includes('© 2026 HALE Studio')) {
        content = content.replace(/© 2026 HALE Studio/g, '© 2026 CentrePoint Studio');
        changed = true;
      }
      if (content.includes('HALE is a demo brand')) {
        content = content.replace(/HALE is a demo brand/g, 'CentrePoint is a demo brand');
        changed = true;
      }
      // Replace prices and currencies in chunk strings if present
      const chunkReplacements = [
        ['"Hoodie in Oat, $120"', '"Hoodie in Oat, KD 37"'],
        ['"Overshirt in Bone, $145"', '"Overshirt in Bone, KD 45"'],
        ['"Camp Shirt in Stone, $110"', '"Camp Shirt in Stone, KD 34"'],
        ['"Chore Jacket in Olive, $185"', '"Chore Jacket in Olive, KD 57"'],
        ['"Overcoat in Charcoal, $420"', '"Overcoat in Charcoal, KD 129"'],
        ['"Cable Knit in Navy, $165"', '"Cable Knit in Navy, KD 51"'],
        ['"Shirt Jacket in Rust, $160"', '"Shirt Jacket in Rust, KD 49"'],
        ['"Bomber in Black, $210"', '"Bomber in Black, KD 65"'],
        ['"$120"', '"KD 37"'],
        ['"$145"', '"KD 45"'],
        ['"$110"', '"KD 34"'],
        ['"$185"', '"KD 57"'],
        ['"$420"', '"KD 129"'],
        ['"$165"', '"KD 51"'],
        ['"$160"', '"KD 49"'],
        ['"$210"', '"KD 65"'],
        ['"$"', '"KD "']
      ];

      chunkReplacements.forEach(([from, to]) => {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(cPath, content, 'utf8');
        console.log('[OK] Updated chunk: ' + cf);
      }
    }
  });
}

console.log('[DONE] All branding and currency updates applied.');
