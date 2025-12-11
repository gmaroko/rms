import fs from 'fs';
import path from 'path';

const metaPath = path.join('public', 'dist', 'meta.json');
if (!fs.existsSync(metaPath)) {
  console.error('Metafile not found. Run build first: npm run build:dist');
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const outputs = meta.outputs || {};

const rows = Object.entries(outputs).map(([file, info]) => {
  const bytes = info.bytes || 0;
  const kb = (bytes / 1024).toFixed(2);
  return { file, kb };
});

rows.sort((a, b) => b.kb - a.kb);

console.log('Bundle size report (largest first):');
rows.forEach(r => console.log(`${r.file} — ${r.kb} KB`));
