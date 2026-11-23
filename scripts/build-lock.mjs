// Ties site/ to site-src/: scripts/prerender.mjs writes site-src/build.lock.json, and scripts/assemble-site.mjs
// (run by the deploy) checks it. A change to site-src/ without a rebuild, or a hand edit to a generated page,
// stops the deploy with a message saying what to run.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK = path.join(ROOT, 'site-src', 'build.lock.json');
const hash = files => { const h = crypto.createHash('sha256'); for (const f of files) h.update(f + '\0' + fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n') + '\0'); return h.digest('hex'); };
const SOURCES = ['site-src/en.html', 'site-src/da.html', 'site-src/routes.json', 'scripts/prerender.mjs'];
const outputs = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'site-src', 'routes.json'), 'utf8')).pages
  .flatMap(r => [r.en.path, r.da.path]).map(p => `site/${p}index.html`).sort();

export function writeLock() { fs.writeFileSync(LOCK, JSON.stringify({ $comment: 'Written by scripts/prerender.mjs. Do not edit.', sources: hash(SOURCES), pages: hash(outputs()) }, null, 1) + '\n'); }

export function checkLock() {
  if (!fs.existsSync(LOCK)) return ['site-src/build.lock.json is missing: run node scripts/prerender.mjs'];
  const lock = JSON.parse(fs.readFileSync(LOCK, 'utf8')), out = [];
  if (lock.sources !== hash(SOURCES)) out.push('site-src/ changed since the pages were built: run node scripts/prerender.mjs and commit site/');
  else if (lock.pages !== hash(outputs())) out.push('a generated page in site/ was edited by hand: make the change in site-src/ and run node scripts/prerender.mjs');
  return out;
}
