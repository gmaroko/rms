import fs from 'fs';
import path from 'path';

const metaPath = path.join('public', 'dist', 'meta.json');

if (!fs.existsSync(metaPath)) {
  console.error('Metafile not found. Run "npm run build:dist" first.');
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const outputs = meta.outputs || {};

const outRows = Object.entries(outputs).map(([file, info]) => {
  const bytes = info.bytes || 0;
  return { file, bytes, kb: (bytes / 1024).toFixed(2) };
}).sort((a, b) => b.bytes - a.bytes);

console.log('Bundle size report (largest first):');
outRows.forEach(r => {
  console.log(`${r.file} — ${r.kb} KB`);
});

// Print total bytes
const total = outRows.reduce((s, r) => s + r.bytes, 0);
console.log(`Total size: ${(total / 1024).toFixed(2)} KB`);
