#!/usr/bin/env node
// Builds site/ from site-src/: one static page per route and language, with its content in the raw HTML.
//
//   node scripts/prerender.mjs                 site-src/en.html + da.html + routes.json  ->  site/**/index.html
//   node scripts/prerender.mjs --passthrough   copies the two templates unchanged (proves the source is production)
//
// Runs locally (needs Playwright: tools/playwright). The output is committed; the deploy workflow is unchanged and
// still fills __SITE_URL__ / __BASE_PATH__ / __ROBOTS__ (assemble-site) and the __PRICE_…__ tokens (price-sync).
// Each page keeps the full page script, so booking links, prices, the test guide and consent gating work as before.
// Prices: the templates are rendered with placeholder numbers that are turned back into the price tokens, so
// price-sync/prices/prices.json stays the only source. Amounts excl. VAT are left to the script at runtime.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = k => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : undefined; };
const SRC = path.resolve(arg('--src') || path.join(ROOT, 'site-src'));
const OUT = path.resolve(arg('--out') || path.join(ROOT, 'site'));
const LANGS = ['en', 'da'];
const tpl = Object.fromEntries(LANGS.map(l => [l, fs.readFileSync(path.join(SRC, l + '.html'), 'utf8')]));
const write = (rel, s) => { const f = path.join(OUT, rel, 'index.html'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

if (process.argv.includes('--passthrough')) { write('', tpl.en); write('da', tpl.da); console.log('passthrough: site/index.html, site/da/index.html'); process.exit(0); }

const { pages } = JSON.parse(fs.readFileSync(path.join(SRC, 'routes.json'), 'utf8'));
const key = (p, a) => ((p === 'test' || p === 'health') && a ? p + '/' + a : p);
const URLS = { da: {}, en: {} };
for (const r of pages) for (const l of LANGS) URLS[l][key(r.page, r.anchor)] = r[l].path;
for (const l of LANGS) { // the page script carries the same address table
  const line = 'var URLS=' + JSON.stringify(URLS) + ';';
  if (!tpl[l].includes(line)) tpl[l] = tpl[l].replace(/var URLS=\{.*?\};/, () => line);
  if (!tpl[l].includes(line)) throw new Error(l + ': var URLS not found in the template');
}
const script = tpl.en.match(/<script>([\s\S]*?)<\/script>/g).sort((a, b) => b.length - a.length)[0];
const ANCHOR_PAGE = Function('return ' + /var ANCHOR_PAGE=(\{[^;]*\});/.exec(script)[1])();
const BOOK = Function('return ' + /var BOOK=(\{[\s\S]*?\});/.exec(script)[1])();
const svcName = (id, l) => { const m = new RegExp(`\\{id:'${id}',[^}]*?da:'([^']*)',en:'([^']*)'`).exec(script); return m[l === 'da' ? 1 : 2]; };

// same mapping as urlFor() in the page script
function urlFor(h, l) {
  const m = /^#\/([a-z]+)(?:\/([A-Za-z0-9_-]+))?/.exec(h || ''); if (!m) return null;
  let p = m[1], a = m[2] || null; const u = URLS[l];
  if (p === 'test' && ['dv', 'ms', 'bk'].includes(a)) { p = 'individuals'; a = null; }
  if (p === 'health' && a === 'glucose') { p = 'test'; a = 'gm'; }
  const k = key(p, a); let to = u[k]; if (to === undefined) { to = u.home; a = null; }
  return '__BASE_PATH__' + to + (a && k === p ? '#' + a : '');
}

// ── prices: placeholder numbers in, tokens out
const prices = JSON.parse(fs.readFileSync(path.join(ROOT, 'price-sync', 'prices', 'prices.json'), 'utf8')).prices;
const fmt = { da: n => new Intl.NumberFormat('da-DK').format(n), en: n => new Intl.NumberFormat('en-GB').format(n) };
const SENT = Object.fromEntries(Object.keys(prices).map((id, i) => [id, 90000 + i * 1250]));
const toSentinels = s => s.replace(/__PRICE_([a-z]+)_(raw|da|en)__/g, (_, id, f) => (f === 'raw' ? String(SENT[id]) : fmt[f](SENT[id])));
const fromSentinels = s => { for (const [id, n] of Object.entries(SENT)) s = s.split(fmt.da(n)).join(`__PRICE_${id}_da__`).split(fmt.en(n)).join(`__PRICE_${id}_en__`).split(String(n)).join(`__PRICE_${id}_raw__`); return s; };
const EXCL = Object.values(SENT).flatMap(n => [fmt.da(Math.round(n / 1.25)), fmt.en(Math.round(n / 1.25))]);
for (const l of LANGS) if (/\b9\d[.,]?\d{3}\b/.test(tpl[l].replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ''))) throw new Error(l + ': template markup already holds a number in the placeholder range');

// ── markup helpers: work only outside <script>/<style>
const seg = h => { const o = [], re = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi; let i = 0, m; while ((m = re.exec(h))) { o.push([h.slice(i, m.index), 0], [m[0], 1]); i = re.lastIndex; } o.push([h.slice(i), 0]); return o; };
const onMarkup = (h, f) => seg(h).map(([t, code]) => (code ? t : f(t))).join('');
function elementEnd(s, i) { // index after the element whose opening tag starts at i
  const tag = /^<([a-z0-9]+)/i.exec(s.slice(i))[1]; const re = new RegExp(`<${tag}\\b|</${tag}>`, 'gi'); re.lastIndex = i; let d = 0, m;
  while ((m = re.exec(s))) { d += m[0][1] === '/' ? -1 : 1; if (!d) return re.lastIndex; } throw new Error('unbalanced <' + tag + '>');
}
const EMPTY = /<([a-z0-9]+)\b([^>]*\sid="([^"]+)"[^>]*)>(\s*)<\/\1>/g;
const emptyIds = Object.fromEntries(LANGS.map(l => [l, [...new Set(seg(tpl[l]).filter(x => !x[1]).flatMap(([t]) => [...t.matchAll(EMPTY)].map(m => m[3])))].filter(id => id !== 'mMaalerSlot')]));

// ── local server: templates under /bp/ with this page's route on <html>
const BP = '/bp/';
const byPath = {}; for (const r of pages) for (const l of LANGS) byPath[r[l].path] = { r, l };
const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
let ORIGIN;
const served = (r, l) => toSentinels(tpl[l]).split('__SITE_URL__').join(ORIGIN + BP).split('__BASE_PATH__').join(BP).split('__ROBOTS__').join('noindex')
  .replace('<html ', `<html data-page-route="${r.page}"${r.anchor ? ` data-page-anchor="${r.anchor}"` : ''} `);
const server = http.createServer((q, s) => {
  const p = decodeURIComponent(q.url.split('?')[0]);
  if (!p.startsWith(BP)) { s.writeHead(404); return s.end(); }
  const rel = p.slice(BP.length), file = rel.startsWith('images/') ? path.join(ROOT, 'public', rel) : path.join(ROOT, 'site', rel);
  if (byPath[rel]) { s.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return s.end(served(byPath[rel].r, byPath[rel].l)); }
  if (rel && fs.existsSync(file) && fs.statSync(file).isFile()) { s.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); return fs.createReadStream(file).pipe(s); }
  s.writeHead(404); s.end();
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
ORIGIN = `http://127.0.0.1:${server.address().port}`;

// ── page head and structured data
const ORG = {
  '@type': ['MedicalBusiness', 'DiagnosticLab'], '@id': '__SITE_URL__#org', name: 'Pandonia', legalName: 'Pandonia ApS',
  identifier: { '@type': 'PropertyValue', propertyID: 'CVR', value: '41588764' }, url: '__SITE_URL__',
  logo: '__SITE_URL__apple-touch-icon.png', image: '__SITE_URL__og-image.png', email: 'labs@pandonia.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Langebrogade 3B', postalCode: '1411', addressLocality: 'København K', addressCountry: 'DK' },
  areaServed: ['København K', 'København N', 'København NV', 'København V', 'København S', 'København SV', 'København Ø', 'Frederiksberg', 'Hellerup'],
};
const DOCTOR = { '@type': 'Person', '@id': '__SITE_URL__laboratory/#medical-director', name: 'Benedikte Møhl Halle', jobTitle: 'Medical Director', alumniOf: { '@type': 'CollegeOrUniversity', name: 'Københavns Universitet' }, worksFor: { '@id': '__SITE_URL__#org' } };
const find = (p, a) => pages.find(x => x.page === p && (x.anchor || null) === (a || null));
const crumb = (l, list) => ({ '@type': 'BreadcrumbList', itemListElement: list.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? 'Pandonia' : r[l].title.split(' | ')[0].split(':')[0], item: '__SITE_URL__' + r[l].path })) });
function jsonld(r, l) {
  const g = [{ ...ORG, ...(r.page === 'laboratory' || r.page === 'about' ? { employee: { '@id': DOCTOR['@id'] } } : {}) },
    { '@type': 'WebSite', '@id': '__SITE_URL__#website', url: '__SITE_URL__', name: 'Pandonia', inLanguage: ['en', 'da-DK'], publisher: { '@id': '__SITE_URL__#org' } }];
  if (r.page === 'laboratory' || r.page === 'about') g.push(DOCTOR);
  const home = find('home');
  if (r.page === 'test') {
    const b = BOOK[r.anchor];
    g.push({ '@type': 'Service', '@id': '__SITE_URL__' + r[l].path + '#service', name: svcName(r.anchor, l), serviceType: l === 'da' ? 'Blodprøve' : 'Blood test', provider: { '@id': '__SITE_URL__#org' },
      offers: { '@type': 'Offer', price: `__PRICE_${r.anchor}_raw__`, priceCurrency: 'DKK', url: 'https://system.easypractice.net/book/pandonia?service=' + b.svc + (b.hash || '') } });
    g.push(crumb(l, [home, find('book'), r]));
  } else if (r.page === 'health') g.push(crumb(l, [home, find('individuals'), r]));
  else if (r.page !== 'home') g.push(crumb(l, [home, r]));
  return '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': g }).replace(/</g, '\\u003c') + '</script>\n';
}
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function head(s, r, l) {
  const other = l === 'da' ? 'en' : 'da', set = (re, v) => { if (!re.test(s)) throw new Error('head: ' + re); s = s.replace(re, () => v); };
  set(/<title>[^<]*<\/title>/, `<title>${esc(r[l].title)}</title>`);
  set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(r[l].description)}">`);
  set(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${r.index ? '__ROBOTS__' : 'noindex,follow'}">`);
  set(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="__SITE_URL__${r[l].path}">`);
  set(/<link rel="alternate" hreflang="en" href="[^"]*">\n<link rel="alternate" hreflang="da-DK" href="[^"]*">\n<link rel="alternate" hreflang="x-default" href="[^"]*">/,
    `<link rel="alternate" hreflang="en" href="__SITE_URL__${r.en.path}">\n<link rel="alternate" hreflang="da-DK" href="__SITE_URL__${r.da.path}">\n<link rel="alternate" hreflang="x-default" href="__SITE_URL__${r.en.path}">`);
  set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(r[l].title)}">`);
  set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(r[l].description)}">`);
  set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="__SITE_URL__${r[l].path}">`);
  set(/<\/head>/, jsonld(r, l) + '</head>');
  set(/<html /, `<html data-page-route="${r.page}"${r.anchor ? ` data-page-anchor="${r.anchor}"` : ''} `);
  void other; return s;
}

function compose(r, l, injected) {
  const keep = new Set([r.page, ...(r.page === 'home' ? ['maaler'] : [])]);
  let s = onMarkup(tpl[l], t => {
    // 1. only this page's route sections
    const opens = [...t.matchAll(/<([a-z]+)\b[^>]*\bdata-page="([a-z]+)"[^>]*>/g)];
    for (const m of opens.reverse()) {
      if (!keep.has(m[2])) { const end = elementEnd(t, m.index); t = t.slice(0, m.index) + t.slice(t[end] === '\n' ? end + 1 : end); }
      else if (m[2] === r.page) t = t.slice(0, m.index) + m[0].replace(/ hidden(?=[\s>])/, '') + t.slice(m.index + m[0].length);
    }
    // 2. what the script renders into empty containers
    t = t.replace(EMPTY, (all, tag, attrs, id) => (injected[id] !== undefined ? `<${tag}${attrs}>${injected[id]}</${tag}>` : all));
    // 3. the page's language in the raw text
    t = t.replace(/<([a-z0-9]+)\b([^>]*\bdata-da="([^"]*)"[^>]*\bdata-en="([^"]*)"[^>]*)>([^<]*)<\/\1>/g,
      (all, tag, attrs, da, en, inner) => (inner.trim() && inner !== (l === 'da' ? da : en) ? `<${tag}${attrs}>${l === 'da' ? da : en}</${tag}>` : all));
    // 4. real addresses on every internal link
    t = t.replace(/<a\b([^>]*)>/g, (all, attrs) => {
      const href = /\bhref="([^"]*)"/.exec(attrs)?.[1], get = n => new RegExp(`\\b${n}="([^"]*)"`).exec(attrs)?.[1];
      let h = href && href.startsWith('#/') ? href : null;
      if (!href && (get('data-route') || get('data-nav') || get('data-anchor'))) { const a = get('data-anchor'), p = (a && ANCHOR_PAGE[a]) || get('data-route') || get('data-nav'); h = '#/' + p + (a ? '/' + a : ''); }
      if (!h) return all;
      const u = urlFor(h, l); return href ? all.replace(`href="${href}"`, `href="${u}"`) : `<a href="${u}"${attrs}>`;
    });
    return t;
  });
  // 5. one H1: promote the first H2 of the page when it has none
  const markupOnly = x => seg(x).filter(p => !p[1]).map(p => p[0]).join('');
  if (!/<h1\b/.test(markupOnly(s))) {
    const at = s.search(new RegExp(`<[a-z]+\\b[^>]*\\bdata-page="${r.page}"`)), i = s.indexOf('<h2', at), j = s.indexOf('</h2>', i);
    if (at < 0 || i < 0) throw new Error(`${l} ${r[l].path}: no H1 and no H2 to promote`);
    s = s.slice(0, i) + '<h1' + s.slice(i + 3, j) + '</h1>' + s.slice(j + 5);
  }
  s = head(s, r, l);
  s = fromSentinels(s);
  const markup = markupOnly(s);
  const n1 = (markup.match(/<h1\b/g) || []).length;
  if (n1 !== 1) throw new Error(`${l} ${r[l].path}: ${n1} H1 elements`);
  if (/\b9\d[.,]\d{3}\b|\b9\d{4}\b/.test(markup) || EXCL.some(x => markup.includes(x))) throw new Error(`${l} ${r[l].path}: a placeholder price was left in the markup`);
  return s;
}

// ── render every page
const require = createRequire(path.join(ROOT, 'qa', 'package.json')); // Playwright: `npm install` in qa/
const { chromium } = require('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route('**/*', rt => (rt.request().url().startsWith(ORIGIN) ? rt.continue() : rt.abort()));
let n = 0;
try {
  for (const r of pages) for (const l of LANGS) {
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(ORIGIN + BP + r[l].path, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    if (errors.length) throw new Error(`${l} ${r[l].path}: ${errors.join(' | ')}`);
    const injected = await page.evaluate(({ ids, excl }) => {
      // amounts excl. VAT are computed by the script at runtime; drop them from the raw HTML
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), hit = [];
      while (w.nextNode()) if (excl.some(x => w.currentNode.nodeValue.includes(x))) hit.push(w.currentNode.parentElement);
      hit.forEach(e => e.remove());
      const o = {}; for (const id of ids) { const e = document.getElementById(id); if (e && e.innerHTML.trim()) o[id] = e.innerHTML; } return o;
    }, { ids: emptyIds[l], excl: EXCL });
    for (const id in injected) injected[id] = injected[id].split(ORIGIN + BP).join('__SITE_URL__').split(`"${BP}`).join('"__BASE_PATH__');
    write(r[l].path.replace(/\/$/, ''), compose(r, l, injected));
    await page.close(); n++;
  }
} finally { await browser.close(); server.close(); }
// the deploy refuses to publish site/ when it no longer matches site-src/ (see scripts/build-lock.mjs)
if (OUT === path.join(ROOT, 'site')) { const { writeLock } = await import('./build-lock.mjs'); writeLock(); }
console.log(`prerendered ${n} pages into ${path.relative(ROOT, OUT) || '.'}/`);
