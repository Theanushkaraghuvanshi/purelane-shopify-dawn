import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const assets = path.resolve('assets');
const outDir = path.resolve('seed/images');
fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(assets).filter((f) => f.startsWith('p-') && f.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(assets, file));
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 800 }, background: 'rgba(0,0,0,0)' }).render().asPng();
  const dest = path.join(outDir, file.replace('.svg', '.png'));
  fs.writeFileSync(dest, png);
  console.log(dest, png.length);
}
