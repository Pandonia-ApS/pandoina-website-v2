// SEO regression for the prerendered site: node _seo.cjs [base]   (default http://localhost:4190/)
// Per page and language: title/description from site-src/routes.json, self canonical, reciprocal hreflang,
// one H1 (raw and rendered), valid JSON-LD with filled prices, Danish raw text on /da/, no JS errors,
// every internal link in the raw HTML answers 200. Plus: old #/ links, language switch, a nav click.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const B = (process.argv[2] || 'http://localhost:4190/').replace(/\/?$/, '/');
const SITE = 'https://www.pandonia.com/';
const { pages } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'site-src', 'routes.json'), 'utf8'));
const fails = []; let checks = 0;
const ok = (c, msg) => { checks++; if (!c) fails.push(msg); };
const unesc = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', r => (r.request().url().startsWith(B) ? r.continue() : r.abort()));
  const links = new Set();
  for (const r of pages) for (const l of ['en', 'da']) {
    const url = B + r[l].path, tag = `${l} /${r[l].path}`;
    const raw = await (await ctx.request.get(url)).text(), markup = raw.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    ok(unesc((/<title>([^<]*)<\/title>/.exec(raw) || [])[1] || '') === r[l].title, tag + ': title');
    ok(unesc((/<meta name="description" content="([^"]*)"/.exec(raw) || [])[1] || '') === r[l].description, tag + ': description');
    ok(raw.includes(`<link rel="canonical" href="${SITE}${r[l].path}">`), tag + ': canonical');
    ok(raw.includes(`hreflang="en" href="${SITE}${r.en.path}"`) && raw.includes(`hreflang="da-DK" href="${SITE}${r.da.path}"`) && raw.includes(`hreflang="x-default" href="${SITE}${r.en.path}"`), tag + ': hreflang');
    ok(raw.includes(r.index ? 'content="index,follow"' : 'content="noindex,follow"'), tag + ': robots');
    ok((markup.match(/<h1\b/g) || []).length === 1, tag + ': raw H1 count');
    for (const m of raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { const j = JSON.parse(m[1]); ok(!/__PRICE_/.test(m[1]), tag + ': JSON-LD price filled'); ok(Array.isArray(j['@graph']), tag + ': JSON-LD graph'); } catch (e) { ok(false, tag + ': JSON-LD parses'); } }
    if (l === 'da') for (const m of markup.matchAll(/data-da="([^"]*)" data-en="([^"]*)"[^>]*>([^<]+)</g)) if (m[1] !== m[2] && m[3].trim()) ok(m[3] === m[1], `${tag}: English text in raw HTML "${m[3].slice(0, 40)}"`);
    for (const m of markup.matchAll(/<a\b[^>]*href="(\/[^"#]*)/g)) links.add(m[1]);
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(150);
    ok(!errs.length, `${tag}: JS errors ${errs.join(' | ')}`);
    ok(await p.locator('h1:visible').count() === 1, tag + ': one visible H1');
    ok(await p.title() === r[l].title, tag + ': title after scripts');
    await p.close();
  }
  // sitemap.xml: well-formed, exactly the indexable pages, each answering 200; robots.txt points to it
  const sm = await (await ctx.request.get(B + 'sitemap.xml')).text(), sp = await ctx.newPage();
  const parsed = await sp.evaluate(x => { const d = new DOMParser().parseFromString(x, 'application/xml'); return d.querySelector('parsererror') ? null : [...d.getElementsByTagName('loc')].map(e => e.textContent); }, sm);
  await sp.close();
  ok(parsed !== null, 'sitemap.xml is well-formed XML');
  const want = pages.filter(r => r.index).flatMap(r => [SITE + r.en.path, SITE + r.da.path]).sort();
  ok(parsed && JSON.stringify(parsed.slice().sort()) === JSON.stringify(want), `sitemap lists exactly the ${want.length} indexable pages (has ${parsed && parsed.length})`);
  for (const u of parsed || []) { const res = await ctx.request.get(B + u.slice(SITE.length)); ok(res.status() === 200, `sitemap ${u}: ${res.status()}`); }
  const rb = await (await ctx.request.get(B + 'robots.txt')).text();
  ok(/User-agent: \*\nAllow: \//.test(rb) && rb.includes(`Sitemap: ${SITE}sitemap.xml`), 'robots.txt allows crawling and points to the sitemap');
  for (const href of links) { const res = await ctx.request.get(B + href.replace(/^\//, '')); ok(res.status() === 200, `link ${href}: ${res.status()}`); }
  const p = await ctx.newPage();
  for (const [from, to] of [['#/test/hcfh', 'test/health-test-female-hormones/'], ['da/#/book/pr-general', 'da/priser/#pr-general'], ['da/#/test/dv', 'da/privatpersoner/'], ['#/health/glucose', 'test/glucose-monitoring/'], ['da/#/biomarkers', 'da/biomarkoerer/']]) {
    await p.goto(B + from); await p.waitForTimeout(400); ok(p.url() === B + to, `old link ${from} -> ${p.url()}`);
  }
  await p.goto(B + 'da/test/health-test/'); await p.click('#btnEn'); await p.waitForLoadState('load'); ok(p.url() === B + 'test/health-test/', 'language switch DA->EN: ' + p.url());
  await p.click('#btnDa'); await p.waitForLoadState('load'); ok(p.url() === B + 'da/test/health-test/', 'language switch EN->DA: ' + p.url());
  await p.goto(B + 'da/'); await p.locator('.navlinks a[data-nav="clinics"]').first().click(); await p.waitForLoadState('load'); ok(p.url() === B + 'da/klinikker/', 'nav click: ' + p.url());
  await br.close();
  console.log(`${checks} checks · ${links.size} internal links · ${fails.length ? fails.length + ' FAILED' : 'all passed'}`);
  fails.slice(0, 40).forEach(f => console.log('  ' + f));
  process.exit(fails.length ? 1 : 0);
})();
