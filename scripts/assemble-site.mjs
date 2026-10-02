#!/usr/bin/env node
// Assembles the PUBLIC site for GitHub Pages (or any static host).
//
//   node scripts/assemble-site.mjs --site-url https://pandonia.dk/ --out _site
//
// The site address is the ONE configuration point for the domain:
//   1. site.config.json "siteUrl", if set, wins;
//   2. otherwise --site-url (the deploy workflow passes the GitHub Pages URL,
//      which becomes the custom domain automatically once one is connected).
// Everything host-specific is derived from it: canonical and hreflang links,
// Open Graph URLs, sitemap.xml, robots.txt, and the base path for assets.
// Search indexing is switched on only on a real domain (not *.github.io),
// unless site.config.json "allowIndexing" says otherwise.
//
// Copies site/ and public/images/ — nothing else. The booking demo and the
// review preview in preview/ are internal and never part of the public site.
import fs from 'node:fs';
import path from 'node:path';

const arg = k => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : undefined; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const raw = (cfg.siteUrl || arg('--site-url') || '').trim();
if (!/^https?:\/\//.test(raw)) { console.error('No site URL: set siteUrl in site.config.json or pass --site-url'); process.exit(1); }
const SITE_URL = raw.replace(/\/*$/, '/');
const u = new URL(SITE_URL);
const BASE_PATH = u.pathname.replace(/\/*$/, '/');
const INDEX = typeof cfg.allowIndexing === 'boolean' ? cfg.allowIndexing : !/\.github\.io$/i.test(u.hostname) && !/^(localhost|127\.0\.0\.1)$/.test(u.hostname);
const OUT = path.resolve(arg('--out') || '_site');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'images'), { recursive: true });
fs.cpSync(path.join(ROOT, 'site'), OUT, { recursive: true });

const fill = s => s.split('__SITE_URL__').join(SITE_URL).split('__BASE_PATH__').join(BASE_PATH).split('__ROBOTS__').join(INDEX ? 'index,follow' : 'noindex,nofollow');
const html = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(html|svg|xml|txt)$/.test(e.name)) html.push(p); } })(OUT);
for (const f of html) fs.writeFileSync(f, fill(fs.readFileSync(f, 'utf8')));
// only the photographs the pages actually use
const used = new Set();
for (const f of html) for (const part of fs.readFileSync(f, 'utf8').split(BASE_PATH + 'images/').slice(1)) { const n = /^[A-Za-z0-9._-]+/.exec(part); if (n) used.add(n[0]); }
for (const n of used) { const from = path.join(ROOT, 'public', 'images', n); if (fs.existsSync(from)) fs.copyFileSync(from, path.join(OUT, 'images', n)); }

fs.writeFileSync(path.join(OUT, 'robots.txt'), INDEX
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`
  : `# Not indexed until Pandonia's own domain is connected (see DOMAIN_SETUP.md).\nUser-agent: *\nDisallow: /\n`);
const today = new Date().toISOString().slice(0, 10);
const entry = loc => `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <xhtml:link rel="alternate" hreflang="da-DK" href="${SITE_URL}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}en/"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}"/>\n  </url>\n`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entry('')}${entry('en/')}</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// ── checks: fail the deploy rather than publish something broken or internal
const problems = [];
const pages = html.filter(f => f.endsWith('.html'));
for (const f of pages) {
  const t = fs.readFileSync(f, 'utf8'), rel = path.relative(OUT, f);
  if (/__(SITE_URL|BASE_PATH|ROBOTS)__/.test(t)) problems.push(rel + ': unfilled placeholder');
  const own = t.split(SITE_URL).join('');   // the site's own address may be a local one in a local test
  for (const bad of ['localhost', '127.0.0.1', 'booking.html', 'DEMOTIDER', 'DEMO AVAILABILITY', 'klikbar prototype', 'id="revToggle"', 'id="routebar"', '{{'])
    if (own.includes(bad)) problems.push(rel + ': contains "' + bad + '"');
  for (const m of t.matchAll(/(?:src|href)="([^"]+\.(?:jpe?g|png|webp|svg))"/g)) {
    const p = m[1]; if (/^https?:/.test(p)) continue;
    if (!p.startsWith(BASE_PATH)) { problems.push(rel + ': asset outside base path ' + p); continue; }
    if (!fs.existsSync(path.join(OUT, p.slice(BASE_PATH.length)))) problems.push(rel + ': missing ' + p);
  }
}
for (const need of ['index.html', 'en/index.html', '404.html', 'favicon.svg', 'og-image.png', 'robots.txt', 'sitemap.xml'])
  if (!fs.existsSync(path.join(OUT, need))) problems.push('missing ' + need);
if (problems.length) { console.error('Site checks failed:\n  ' + problems.join('\n  ')); process.exit(1); }

console.log(`site url:   ${SITE_URL}\nbase path:  ${BASE_PATH}\nindexing:   ${INDEX ? 'on' : 'off (noindex until the real domain)'}\nfiles:`);
(function list(d) { for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { const p = path.join(d, e.name); if (e.isDirectory()) list(p); else console.log('  ' + path.relative(OUT, p).replace(/\\/g, '/')); } })(OUT);
