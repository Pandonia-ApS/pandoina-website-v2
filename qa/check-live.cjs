// After a deploy: node check-live.cjs [site url]   (default https://www.pandonia.com/)
// 1. Every page on the live site is byte-identical to the local build of this checkout (so what was approved is live).
// 2. The SEO, consent and booking checks pass against the live site.
// Read-only: about 60 GET requests plus one browser visit per page.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const { build, routes } = require('./lib.cjs');
const LIVE = (process.argv[2] || 'https://www.pandonia.com/').replace(/\/?$/, '/');

(async () => {
  const local = build(fs.mkdtempSync(path.join(os.tmpdir(), 'pandonia-live-')));
  const files = ['robots.txt', ...routes().flatMap(r => [r.en.path, r.da.path]).map(p => p + 'index.html'), 'cookiepolitik/index.html', 'persondatapolitik/index.html', '404.html'];
  const diff = [];
  for (const f of files) {
    const res = await fetch(LIVE + f.replace(/index\.html$/, ''), { headers: { 'cache-control': 'no-cache' } });
    const live = await res.text(), want = fs.readFileSync(path.join(local, f), 'utf8');
    if (res.status !== 200 || live !== want) diff.push(`${f}: ${res.status !== 200 ? 'HTTP ' + res.status : 'differs from the local build'}`);
  }
  console.log(`live == local build: ${files.length - diff.length}/${files.length} files identical`);
  diff.forEach(d => console.log('  ' + d));
  let failed = diff.length > 0;
  for (const c of ['check-seo.cjs', 'check-consent.cjs', 'check-booking.cjs']) {
    try { const out = execFileSync(process.execPath, [path.join(__dirname, c), LIVE], { encoding: 'utf8', stdio: 'pipe' }); console.log(c + ': ' + out.trim().split('\n').slice(-1)[0]); }
    catch (e) { failed = true; console.log(c + ': FAILED\n' + String(e.stdout || e.message).trim().split('\n').slice(-8).join('\n')); }
  }
  process.exit(failed ? 1 : 0);
})();
