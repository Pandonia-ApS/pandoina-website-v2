// Lab performance, baseline vs new: node check-performance.cjs <baseline base> <new base>
// Chromium with mobile throttling (4× CPU, ~10 Mbit/s, 40 ms) and desktop without; median of 5 loads each, live and new alternating.
// LCP and CLS from the browser's own PerformanceObserver; bytes from the resource timings. A lab measurement on
// this machine, not Google's field data.
const { chromium } = require('playwright');
const { THIRD_PARTY } = require('./lib.cjs');
const [BASE, NEW] = process.argv.slice(2).map(x => x.replace(/\/?$/, '/'));
const PAGES = [['da/', 'da/', 'Forside DA'], ['', '', 'Home EN'], ['da/#/test/ht', 'da/test/health-test/', 'Testside DA'], ['da/#/book', 'da/priser/', 'Priser DA'], ['da/#/biomarkers', 'da/biomarkoerer/', 'Biomarkører DA']];
const median = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function measure(br, url, mobile) {
  const ctx = await br.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 } : { viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', r => (THIRD_PARTY.test(r.request().url()) ? r.abort() : r.continue()));
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  if (mobile) { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 10e6 / 8, uploadThroughput: 5e6 / 8 }); }
  await p.addInitScript(() => { window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const m = await p.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls, bytes: performance.getEntriesByType('navigation')[0].transferSize + performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || 0), 0) }));
  await ctx.close(); return m;
}

(async () => {
  const br = await chromium.launch(); const rows = [];
  for (const [b, n, label] of PAGES) for (const mobile of [true, false]) {
    // live and new loads alternate (live, new, live, new …), so a change in machine load hits both sides equally
    // the same address on both sides when the baseline has it; the old #/ address only for a baseline without real
    // addresses (it redirects, so its page would load a second time with a warm cache and look faster)
    const bUrl = (await fetch(BASE + n)).status === 200 ? BASE + n : BASE + b;
    const a = [], z = [];
    for (let i = 0; i < 5; i++) { a.push(await measure(br, bUrl, mobile)); z.push(await measure(br, NEW + n, mobile)); }
    const med = r => ({ lcp: median(r.map(x => x.lcp)), cls: median(r.map(x => x.cls)), bytes: median(r.map(x => x.bytes)) });
    const before = med(a), after = med(z);
    rows.push({ label, device: mobile ? 'mobile' : 'desktop', before, after });
  }
  await br.close();
  console.log('| Page | Device | LCP before → after (ms) | CLS before → after | Transfer before → after (KB) |\n|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.label} | ${r.device} | ${Math.round(r.before.lcp)} → ${Math.round(r.after.lcp)} | ${r.before.cls.toFixed(3)} → ${r.after.cls.toFixed(3)} | ${Math.round(r.before.bytes / 1024)} → ${Math.round(r.after.bytes / 1024)} |`);
  const worse = rows.filter(r => r.after.lcp > r.before.lcp * 1.15 + 100 || r.after.cls > Math.max(0.1, r.before.cls + 0.02));
  console.log(worse.length ? `${worse.length} measurements clearly worse` : 'no page clearly slower or less stable than before');
  process.exit(worse.length ? 1 : 0);
})();
