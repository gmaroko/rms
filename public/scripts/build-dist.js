import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import crypto from 'crypto';

const projectRoot = path.resolve('.');
const publicDir = path.join(projectRoot, 'public');
const outDir = path.join(publicDir, 'dist');

// Ensure out folder exists
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function runBuild() {
  console.log('Starting esbuild...');

  // Build with esbuild
  const result = await build({
    entryPoints: [path.join(publicDir, 'js', 'app.js')],
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true, // allow code splitting for dynamic imports
    format: 'esm',
    outdir: outDir,
    entryNames: 'bundle',
    assetNames: 'assets/[name]-[hash]',
    metafile: true,
    write: true,
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file',
      '.css': 'css',
    }
  });

  // Save metafile for bundle analysis
  const metaPath = path.join(outDir, 'meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(result.metafile, null, 2));
  console.log('esbuild finished. Metafile written to', metaPath);

  // Determine generated JS & CSS files by scanning outDir
  const files = fs.readdirSync(outDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  const jsFile = jsFiles.length ? jsFiles[0] : null;
  const cssFile = cssFiles.length ? cssFiles[0] : null;

  console.log('Generated JS file:', jsFile);
  console.log('Generated CSS file:', cssFile);

  // Read original index.html
  const indexHtmlPath = path.join(publicDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('public/index.html not found — skipping HTML generation');
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // Replace CSS references: remove existing <link rel="stylesheet"...> for base.css/tokens.css
  html = html.replace(/<link[^>]*href="[^"]*css\/tokens\.css"[^>]*>/g, '');
  html = html.replace(/<link[^>]*href="[^"]*css\/base\.css"[^>]*>/g, '');

  // Remove existing script tag that references js/app.js
  html = html.replace(/<script[^>]*src="[^"]*js\/app\.js"[^>]*><\/script>/g, '');

  // Inject new CSS and JS references (with cache-busting based on filenames)
  const cssTag = cssFile ? `<link rel="stylesheet" href="${cssFile}">` : '';
  const jsTag = jsFile ? `<script type="module" src="${jsFile}"></script>` : '';

  // Inject before </head> and before </body>
  html = html.replace('</head>', `  ${cssTag}\n</head>`);
  html = html.replace('</body>', `  ${jsTag}\n</body>`);

  // Minify HTML
  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });

  // Write to public/dist/index.html
  const outIndex = path.join(outDir, 'index.html');
  fs.writeFileSync(outIndex, minified, 'utf8');
  console.log('Wrote optimized HTML to', outIndex);

  console.log('Build complete. Dist folder is:', outDir);
}

runBuild().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});