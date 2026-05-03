import sharp from 'sharp';
import { writeFileSync } from 'fs';

const ICONS_DIR = 'public/icons';

// Purple circle with "E" letter — simple brand mark
async function generateIcon(size) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.225}" fill="#7c3aed"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
      font-family="Inter, system-ui, sans-serif" font-weight="700"
      font-size="${size * 0.5}px" fill="white">E</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function generateSplash(bgColor) {
  const svg = `<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
    <rect width="1284" height="2778" fill="${bgColor}"/>
    <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle"
      font-family="Inter, system-ui, sans-serif" font-weight="700"
      font-size="200px" fill="white" opacity="0.9">E</text>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
      font-family="Inter, system-ui, sans-serif" font-weight="400"
      font-size="48px" fill="white" opacity="0.6">EquilibraMente</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

const SIZES = [192, 512, 180];

for (const size of SIZES) {
  const buf = await generateIcon(size);
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
  writeFileSync(`${ICONS_DIR}/${name}`, buf);
  console.log(`  ${name} (${buf.length} bytes)`);
}

const splash = await generateSplash('#7c3aed');
writeFileSync(`${ICONS_DIR}/splash.png`, splash);
console.log(`  splash.png (${splash.length} bytes)`);
console.log('Done.');
