const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const engine = fs.readFileSync('dist/assets/hale-engine.js', 'utf8');

console.log('--- dist/index.html check ---');
console.log('Includes CentrePoint:', html.includes('CentrePoint'));
console.log('Includes KD 37:', html.includes('KD 37') || html.includes('KD <!-- -->37'));
console.log('Remaining HALE mark:', html.includes('class="hd-mark" href="#rail">HALE'));
console.log('Remaining dollar prices:', (html.match(/\$\d+/g) || []));

console.log('--- dist/assets/hale-engine.js check ---');
console.log('Product 02 price:', (engine.match(/id:\s*"02".*?price:\s*(\d+)/) || [])[1]);
console.log('KD in engine:', engine.includes('KD '));
console.log('Remaining dollar in modal:', engine.includes('Add to Bag — $'));

console.log('--- Next.js components check ---');
const header = fs.readFileSync('components/Header.tsx', 'utf8');
const cart = fs.readFileSync('components/CartDrawer.tsx', 'utf8');
const modal = fs.readFileSync('components/ProductModal.tsx', 'utf8');
const rail = fs.readFileSync('components/Rail3D.tsx', 'utf8');
const tryIt = fs.readFileSync('components/TryItOn.tsx', 'utf8');
const footer = fs.readFileSync('components/FooterRail.tsx', 'utf8');
const products = fs.readFileSync('data/products.ts', 'utf8');

console.log('Header has CentrePoint:', header.includes('CentrePoint'));
console.log('Cart has KD:', cart.includes('KD '));
console.log('Modal has KD:', modal.includes('KD '));
console.log('Rail has KD:', rail.includes('KD '));
console.log('TryItOn has KD:', tryIt.includes('KD '));
console.log('Footer has CentrePoint:', footer.includes('CentrePoint'));
console.log('Footer has KD:', footer.includes('KD '));
console.log('Products hoodie price:', (products.match(/name:\s*"Hoodie",[\s\S]*?price:\s*(\d+)/) || [])[1]);
