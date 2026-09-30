/** Creates a new optimized asset; never overwrites the supplied original. */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
const [input, output] = process.argv.slice(2);
if (!input || !output || path.resolve(input) === path.resolve(output) || !output.endsWith('.webp') || fs.existsSync(output)) {
  console.error('Usage: node scripts/prepare-image.mjs input.jpg new-output.webp (output must not exist)');
  process.exit(1);
}
const data = await sharp(input).rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, data.data, { flag: 'wx' });
console.log(JSON.stringify({ src: output, width: data.info.width, height: data.info.height, bytes: data.data.length }));
