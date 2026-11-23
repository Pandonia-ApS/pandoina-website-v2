// Local preview of exactly what would be deployed: node qa/preview.cjs [port]
// Builds site/ from site-src/ (unless --no-build), assembles and fills prices like the deploy, and serves it.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, build, serve } = require('./lib.cjs');
(async () => {
  if (!process.argv.includes('--no-build')) execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'prerender.mjs')], { stdio: 'inherit' });
  const dir = build(fs.mkdtempSync(path.join(os.tmpdir(), 'pandonia-preview-')));
  const port = +(process.argv.find(a => /^\d+$/.test(a)) || 4180);
  const s = await serve(dir, port);
  console.log(`Preview: ${s.url} (Danish: ${s.url}da/) · Ctrl+C to stop`);
})();
