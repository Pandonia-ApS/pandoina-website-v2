// Shared helpers for the QA checks: build a site folder exactly as the deploy does, serve it like GitHub Pages,
// and read the route table. Used by run.cjs and the check-*.cjs scripts.
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.pandonia.com/';

function routes(root = ROOT) {
  const f = path.join(root, 'site-src', 'routes.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).pages : null;
}

// the deploy's two steps (.github/workflows/pages.yml): assemble, then fill prices
function build(out, { root = ROOT, prices = true } = {}) {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'assemble-site.mjs'), '--site-url', SITE_URL, '--out', out], { cwd: root, stdio: 'pipe' });
  if (!prices) return out;
  const args = [path.join(root, 'price-sync', 'scripts', 'apply-prices.mjs'), out];
  execFileSync(process.execPath, args, { cwd: root, stdio: 'pipe' });
  return out;
}

// the same build from a git revision (default: what is live, origin/main)
function buildRef(out, ref = 'origin/main') {
  // the long form of the temp path: older assemble-site.mjs versions cannot read a short '~1' path
  const src = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), 'pandonia-ref-'));
  // relative names only: GNU tar on Windows reads 'C:' in a path as a remote host
  execFileSync('git', ['-C', ROOT, 'archive', '-o', path.join(src, 'ref.tar'), ref]);
  execFileSync('tar', ['-xf', 'ref.tar'], { cwd: src });
  return build(out, { root: src });
}

// a static server that behaves like GitHub Pages: folder → index.html, unknown path → 404.html with status 404
function serve(dir, port = 0) {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
  const root = path.resolve(dir);
  const srv = http.createServer((q, s) => {
    let p = decodeURIComponent(q.url.split('?')[0]); let f = path.join(root, p);
    if (!f.startsWith(root)) { s.writeHead(403); return s.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
      if (!p.endsWith('/')) { s.writeHead(301, { location: p + '/' }); return s.end(); }
      f = path.join(f, 'index.html');
    }
    if (!fs.existsSync(f)) { s.writeHead(404, { 'content-type': TYPES['.html'] }); return fs.createReadStream(path.join(root, '404.html')).pipe(s); }
    s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s);
  });
  return new Promise(r => srv.listen(port, '127.0.0.1', () => r({ url: `http://127.0.0.1:${srv.address().port}/`, close: () => srv.close() })));
}

// third-party requests a check should not make (trackers, consent banner); consent checks allow them on purpose
const THIRD_PARTY = /cookiebot|googletagmanager|google-analytics|facebook\.(net|com)|doubleclick/i;

module.exports = { ROOT, SITE_URL, routes, build, buildRef, serve, THIRD_PARTY };
