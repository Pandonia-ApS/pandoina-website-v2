#!/usr/bin/env node
// Fills the website's price tokens from prices/prices.json, in place, in an assembled site folder.
//   node scripts/apply-prices.mjs <site-dir>
// Fails (and changes nothing) if the price file is invalid, a token is unknown or left over, a product is
// never shown, or the Danish and English pages do not carry exactly the same prices.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkPriceFile, applyTokens, TOKEN } from './price-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function applyDir(siteDir, { dir = ROOT } = {}) {
  const mapping = JSON.parse(fs.readFileSync(path.join(dir, 'prices', 'mapping.json'), 'utf8'));
  const file = JSON.parse(fs.readFileSync(path.join(dir, 'prices', 'prices.json'), 'utf8'));
  const bad = checkPriceFile(file, mapping);
  if (bad.length) throw new Error(bad.join('\n'));

  const pages = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) pages.push(p); } };
  walk(siteDir);

  // which products each page shows, counted, so Danish and English can be compared
  const seen = {}, used = new Set();
  for (const p of pages) {
    const toks = [...fs.readFileSync(p, 'utf8').matchAll(TOKEN)].map((m) => m[1]).sort();
    toks.forEach((t) => used.add(t));
    seen[path.relative(siteDir, p).replace(/\\/g, '/')] = toks.join(',');
  }
  if (seen['index.html'] !== seen['da/index.html']) throw new Error('the Danish and English pages do not show the same set of prices');
  const missing = mapping.products.map((m) => m.site).filter((s) => !used.has(s));
  if (missing.length) throw new Error(`no price token on the site for: ${missing.join(', ')}`);

  // everything checked first, then written, so a failure leaves the folder untouched
  const out = pages.map((p) => [p, applyTokens(fs.readFileSync(p, 'utf8'), file.prices)]);
  let n = 0;
  for (const [p, r] of out) if (r.n) { fs.writeFileSync(p, r.out); n += r.n; }
  return n;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(`prices applied: ${applyDir(process.argv[2])} places`); }
  catch (e) { console.error(`apply-prices FAILED: ${e.message}`); process.exit(1); }
}
