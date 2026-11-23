// Simulated price change: node check-prices.cjs [report dir]
// Builds the site with every price raised by DKK 500 (a copy of the price file, never the real one), then checks
// the new price on every test page and pricing page in both languages, the VAT line, the structured data, and
// that the old price is gone from those places.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { chromium } = require('playwright');
const { ROOT, build, serve, THIRD_PARTY, routes } = require('./lib.cjs');

(async () => {
  const real = JSON.parse(fs.readFileSync(path.join(ROOT, 'price-sync', 'prices', 'prices.json'), 'utf8'));
  const sim = JSON.parse(JSON.stringify(real));
  for (const p of Object.values(sim.prices)) { p.incl += 500; p.excl += 400; } // keeps incl = excl × 1.25
  // a throwaway copy of price-sync/ with the simulated file; apply-prices runs unchanged against it
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pandonia-pricesim-'));
  fs.cpSync(path.join(ROOT, 'price-sync'), path.join(tmp, 'price-sync'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'price-sync', 'prices', 'prices.json'), JSON.stringify(sim, null, 2));
  const site = build(path.join(tmp, 'site'), { prices: false });
  const { applyDir } = await import('file://' + path.join(tmp, 'price-sync', 'scripts', 'apply-prices.mjs').replace(/\\/g, '/'));
  const n = applyDir(site, { dir: path.join(tmp, 'price-sync') });
  const srv = await serve(site);
  const fmt = { da: v => v.toLocaleString('da-DK') + ' kr.', en: v => 'DKK ' + v.toLocaleString('en-GB') };
  const vat = { da: v => 'inkl. moms · ' + Math.round(v / 1.25).toLocaleString('da-DK') + ' ekskl.', en: v => 'incl. VAT · ' + Math.round(v / 1.25).toLocaleString('en-GB') + ' excl.' };
  const fails = []; let checks = 0; const ok = (c, m) => { checks++; if (!c) fails.push(m); };
  const br = await chromium.launch(); const ctx = await br.newContext();
  await ctx.route('**/*', r => (THIRD_PARTY.test(r.request().url()) ? r.abort() : r.continue()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  for (const r of routes()) for (const l of ['da', 'en']) {
    if (r.page !== 'test' && r.page !== 'book' && r.page !== 'health') continue;
    const url = srv.url + r[l].path, raw = fs.readFileSync(path.join(site, r[l].path, 'index.html'), 'utf8');
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(150);
    if (r.page === 'test') {
      const id = r.anchor, now = sim.prices[id].incl, old = real.prices[id].incl;
      const shown = await p.evaluate(() => ({ price: [...document.querySelectorAll('.tPrice')].map(e => e.textContent.trim()), vat: [...document.querySelectorAll('#tDetail .lab')].map(e => e.textContent.trim()).filter(t => /moms|VAT/.test(t)) }));
      ok(shown.price.length && shown.price.every(x => x === fmt[l](now)), `${l} /${r[l].path}: shown ${shown.price.join(', ')} (want ${fmt[l](now)})`);
      ok(shown.vat.length && shown.vat.every(x => x.toLowerCase() === vat[l](now).toLowerCase()), `${l} /${r[l].path}: VAT line ${shown.vat.join(', ')}`);
      const ld = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1])['@graph']).find(x => x['@type'] === 'Service');
      ok(ld && ld.offers.price === String(now), `${l} /${r[l].path}: structured data price ${ld && ld.offers.price} (want ${now})`);
      ok(!raw.includes(`<p class="tPrice">${fmt[l](old)}</p>`), `${l} /${r[l].path}: old price ${fmt[l](old)} still in the raw HTML`);
    } else {
      // pricing and health-area pages: every product card shows its new price
      const cards = await p.evaluate(() => [...document.querySelectorAll('.price,.nxPkP,.tPrice')].filter(e => e.getClientRects().length).map(e => e.textContent.trim()));
      const wants = Object.values(sim.prices).map(x => fmt[l](x.incl)), olds = Object.entries(real.prices).filter(([k, x]) => !Object.values(sim.prices).some(y => y.incl === x.incl)).map(([, x]) => fmt[l](x.incl));
      ok(cards.length > 0, `${l} /${r[l].path}: no prices found`);
      ok(cards.every(c => !olds.some(o => c.includes(o)) || wants.some(w => c.includes(w))), `${l} /${r[l].path}: an old price is still shown: ${cards.filter(c => olds.some(o => c.includes(o))).join(' | ')}`);
    }
  }
  ok(!errs.length, 'JavaScript errors: ' + errs.join(' | '));
  await br.close(); srv.close();
  console.log(`price change simulated (+DKK 500 on all 10 tests, ${n} places filled) · ${checks} checks · ${fails.length ? fails.length + ' FAILED' : 'all passed'}`);
  fails.slice(0, 30).forEach(f => console.log('  ' + f));
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fails.length ? 1 : 0);
})();
