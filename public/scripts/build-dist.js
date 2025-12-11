import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';

const projectRoot = path.resolve('.');
const publicDir = path.join(projectRoot, 'public');
const outDir = path.join(publicDir, 'dist');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function buildSite() {
  console.log('Starting esbuild bundling...');

  // Run esbuild
  const result = await build({
    entryPoints: [path.join(publicDir, 'js', 'app.js')],
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    format: 'esm',
    outdir: outDir,
    entryNames: 'bundle-[hash]',
    chunkNames: 'chunk-[hash]',
    assetNames: 'assets/[name]-[hash]',
    metafile: true,
    write: true,
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file',
      '.css': 'css'
    }
  });

  // Save metafile
  const metaPath = path.join(outDir, 'meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(result.metafile, null, 2));
  console.log('Wrote metafile to', metaPath);

  // Find generated files
  const files = fs.readdirSync(outDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  // Read original index.html
  const indexSrc = path.join(publicDir, 'index.html');
  if (!fs.existsSync(indexSrc)) {
    console.warn('public/index.html not found — skipping HTML processing');
    return;
  }

  let html = fs.readFileSync(indexSrc, 'utf8');

  // Remove original CSS and JS references to base assets
  html = html.replace(/<link[^>]*href="[^"]*css\/tokens\.css"[^>]*>/g, '');
  html = html.replace(/<link[^>]*href="[^"]*css\/base\.css"[^>]*>/g, '');
  html = html.replace(/<script[^>]*src="[^"]*js\/app\.js"[^>]*><\/script>/g, '');

  // Inject generated CSS and JS tags (use first CSS and include all JS chunks)
  const cssTag = cssFiles.length ? `<link rel="stylesheet" href="${cssFiles[0]}">` : '';
  // collect all .js files and create module script tags
  const jsTags = jsFiles.map(f => `<script type="module" src="${f}"></script>`).join('\n  ');

  html = html.replace('</head>', `  ${cssTag}\n</head>`);
  html = html.replace('</body>', `  ${jsTags}\n</body>`);

  // Minify HTML
  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });

  const outIndex = path.join(outDir, 'index.html');
  fs.writeFileSync(outIndex, minified, 'utf8');

  console.log('Build complete. Dist files in', outDir);
}

buildSite().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
