import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { brotliCompressSync } from 'zlib';

const distDir = path.join('public', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory missing. Run build first: npm run build:dist');
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter(f => /\.(js|css|html|svg|json)$/.test(f));

files.forEach(f => {
  const full = path.join(distDir, f);
  const data = fs.readFileSync(full);

  // gzip
  const gz = zlib.gzipSync(data, { level: 9 });
  fs.writeFileSync(`${full}.gz`, gz);
  // brotli
  const br = brotliCompressSync(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11
    }
  });
  fs.writeFileSync(`${full}.br`, br);

  console.log(`Compressed ${f}: .gz ${gz.length} bytes, .br ${br.length} bytes`);
});

console.log('Precompression complete.');
