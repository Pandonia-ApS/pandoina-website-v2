// Cookie consent: node _consent.cjs [base]   (default http://localhost:4190/)
// Before any consent answer, no page may load Meta or Google tracking or set their cookies.
// Real network (Cookiebot loads), no clicks on the banner. Page list: site-src/routes.json (or / and /da/ if absent).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const B = (process.argv[2] || 'http://localhost:4190/').replace(/\/?$/, '/');
const rj = path.join(__dirname, '..', 'site-src', 'routes.json');
const urls = fs.existsSync(rj) && !process.argv.includes('--home') ? JSON.parse(fs.readFileSync(rj, 'utf8')).pages.flatMap(r => [r.en.path, r.da.path]) : ['', 'da/'];
const TRACK = /facebook\.(com|net)|google-analytics\.com|googletagmanager\.com|doubleclick\.net/;
(async () => {
  const br = await chromium.launch(); const bad = [];
  for (const u of urls) {
    const ctx = await br.newContext(); const p = await ctx.newPage(), hits = [];
    p.on('request', q => { if (TRACK.test(q.url())) hits.push(q.url().slice(0, 80)); });
    await p.goto(B + u, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const cookies = (await ctx.cookies()).map(c => c.name).filter(n => /^_ga|^_fbp|^_gid|^_gcl/.test(n));
    const fbq = await p.evaluate(() => typeof window.fbq);
    if (hits.length || cookies.length || fbq !== 'undefined') bad.push(`/${u}: ${hits.length} tracker requests, cookies [${cookies}], fbq ${fbq}`);
    await ctx.close();
  }
  await br.close();
  console.log(`${urls.length} pages · ${bad.length ? bad.length + ' FAILED' : 'no tracking before consent on any page'}`);
  bad.forEach(b => console.log('  ' + b)); process.exit(bad.length ? 1 : 0);
})();
