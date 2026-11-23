// Checks a preview build (local or the published one): node qa/check-preview.cjs <preview base URL>
// e.g. https://sebastianbf1.github.io/pandonia-preview/
// Every page: HTTP 200, noindex, no canonical, one H1, the PREVIEW label, no JavaScript errors, no tracker
// request or cookie; every internal link stays inside the preview and answers 200; old #/ addresses, the
// language switch and navigation work; the laboratory page exists.
const { chromium } = require('playwright');
const { routes } = require('./lib.cjs');
const B = (process.argv[2] || 'https://sebastianbf1.github.io/pandonia-preview/').replace(/\/?$/, '/');
const BASE = new URL(B).pathname;
const TRACK = /cookiebot|googletagmanager|google-analytics|facebook\.(com|net)|doubleclick/i;
const fails = []; let checks = 0; const ok = (c, m) => { checks++; if (!c) fails.push(m); };

(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
  const tracker = []; ctx.on('request', q => { if (TRACK.test(q.url())) tracker.push(q.url().slice(0, 90)); });
  const links = new Set();
  for (const r of routes()) for (const l of ['en', 'da']) {
    const url = B + r[l].path, tag = `${l} ${BASE}${r[l].path}`;
    const res = await ctx.request.get(url); const raw = await res.text(); const markup = raw.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    ok(res.status() === 200, `${tag}: HTTP ${res.status()}`);
    ok(raw.includes('<meta name="robots" content="noindex,nofollow,noarchive">'), tag + ': noindex');
    ok(!/rel="canonical"|hreflang=/.test(raw), tag + ': canonical/hreflang removed');
    ok((markup.match(/<h1\b/g) || []).length === 1, tag + ': one H1');
    ok(raw.includes('PREVIEW · NOT LIVE'), tag + ': preview label');
    for (const m of markup.matchAll(/<a\b[^>]*href="([^"#]+)"/g)) { const h = m[1]; if (/^(https?:|mailto:)/.test(h)) continue; ok(h.startsWith(BASE), `${tag}: link leaves the preview: ${h}`); links.add(h); }
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(200);
    ok(!errs.length, `${tag}: JS errors ${errs.join(' | ')}`);
    ok((await p.title()).startsWith('PREVIEW · ' + r[l].title), `${tag}: title "${await p.title()}"`);
    ok(await p.locator('h1:visible').count() === 1, tag + ': one visible H1');
    await p.close();
  }
  const origin = new URL(B).origin;
  for (const h of links) { const res = await ctx.request.get(origin + h); ok(res.status() === 200, `link ${h}: ${res.status()}`); }
  const p = await ctx.newPage();
  for (const [from, to] of [['#/test/hcfh', 'test/health-test-female-hormones/'], ['da/#/book/pr-general', 'da/priser/#pr-general'], ['da/#/test/dv', 'da/privatpersoner/'], ['da/#/laboratory', 'da/laboratorium/']]) {
    await p.goto(B + from); await p.waitForTimeout(600); ok(p.url() === B + to, `old link ${from} -> ${p.url()}`);
  }
  await p.goto(B + 'da/test/health-test/'); await p.click('#btnEn'); await p.waitForLoadState('load'); ok(p.url() === B + 'test/health-test/', 'language switch DA->EN: ' + p.url());
  await p.click('#btnDa'); await p.waitForLoadState('load'); ok(p.url() === B + 'da/test/health-test/', 'language switch EN->DA: ' + p.url());
  await p.goto(B + 'da/'); await p.locator('.navlinks a[data-nav="clinics"]').first().click(); await p.waitForLoadState('load'); ok(p.url() === B + 'da/klinikker/', 'nav click: ' + p.url());
  await p.goto(B + 'da/'); await p.locator('a[href$="/da/laboratorium/"]').first().click(); await p.waitForLoadState('load'); ok(p.url() === B + 'da/laboratorium/', 'homepage link to the laboratory: ' + p.url());
  const cookies = (await ctx.cookies()).map(c => c.name).filter(n => /^_ga|^_fbp|^_gid|^CookieConsent/.test(n));
  ok(!tracker.length, 'tracker requests: ' + tracker.slice(0, 3).join(' | '));
  ok(!cookies.length, 'tracking cookies: ' + cookies.join(','));
  for (const f of ['robots.txt']) { const t = await (await ctx.request.get(B + f)).text(); ok(/Disallow: \//.test(t), 'robots.txt disallows all'); }
  ok((await ctx.request.get(B + 'sitemap.xml')).status() === 404, 'no sitemap on the preview');
  await br.close();
  console.log(`${checks} checks · ${links.size} internal links · ${fails.length ? fails.length + ' FAILED' : 'all passed'}`);
  fails.slice(0, 40).forEach(f => console.log('  ' + f)); process.exit(fails.length ? 1 : 0);
})();
