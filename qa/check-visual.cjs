// Visual regression: node check-visual.cjs <baseline base> <new base> <report dir>
// Every page in site-src/routes.json, Danish and English, at 1440 and 390 px, full page, animations reduced.
// The baseline is normally the build of what is live (origin/main); where a page has no address there yet,
// its old #/ address is used. Pixels are compared in the browser; a page with differences gets a diff image.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const { routes, THIRD_PARTY } = require('./lib.cjs');
const [BASE, NEW, OUT] = process.argv.slice(2).map((x, i) => (i < 2 ? x.replace(/\/?$/, '/') : x));
const oldHash = (r, l) => (l === 'da' ? 'da/' : '') + '#/' + r.page + (r.anchor ? '/' + r.anchor : '');
const THRESHOLD = 0.0005; // share of pixels that may differ (anti-aliasing noise) before a page is reported

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch(); const results = [];
  const shot = async (url, w) => {
    const ctx = await br.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => (THIRD_PARTY.test(r.request().url()) ? r.abort() : r.continue()));
    const p = await ctx.newPage(); const res = await p.goto(url, { waitUntil: 'load' });
    // load every image before the full-page capture (lazy images below the fold would otherwise be blank on one side)
    await p.evaluate(async () => {
      await (document.fonts && document.fonts.ready);
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      await Promise.all([...document.images].map(i => (i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); }))));
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(400);
    await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    const png = await p.screenshot({ fullPage: true }); const final = p.url();
    const pages = await p.evaluate(() => [...document.querySelectorAll('[data-page]')].map(e => e.getAttribute('data-page'))); await ctx.close();
    return { png, status: res && res.status(), final, pages };
  };
  const cmp = await (await br.newContext()).newPage();
  for (const r of routes()) for (const l of ['da', 'en']) for (const w of [1440, 390]) {
    const name = `${l}-${(r[l].path || 'home').replace(/\/$/, '').replace(/\//g, '_') || 'home'}-${w}`;
    const after = await shot(NEW + r[l].path, w);
    let before = await shot(BASE + r[l].path, w);
    if (before.status === 404) before = await shot(BASE + oldHash(r, l), w); // baseline without real addresses yet
    // the live site does not have this page yet
    if (before.status === 404 || !before.pages.includes(r.page)) { results.push({ name, status: 'new page' }); fs.writeFileSync(path.join(OUT, name + '-new.png'), after.png); continue; }
    const d = await cmp.evaluate(async ([a, b]) => {
      const load = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + src; });
      const [A, B] = await Promise.all([load(a), load(b)]); const W = Math.max(A.width, B.width), H = Math.max(A.height, B.height);
      const ca = new OffscreenCanvas(W, H), cb = new OffscreenCanvas(W, H), cd = new OffscreenCanvas(W, H);
      const xa = ca.getContext('2d'), xb = cb.getContext('2d'), xd = cd.getContext('2d');
      xa.drawImage(A, 0, 0); xb.drawImage(B, 0, 0); xd.drawImage(B, 0, 0); xd.fillStyle = 'rgba(255,255,255,.75)'; xd.fillRect(0, 0, W, H);
      const da = xa.getImageData(0, 0, W, H).data, db = xb.getImageData(0, 0, W, H).data; let n = 0, y0 = H, y1 = -1;
      xd.fillStyle = '#e0006a';
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 48) { n++; if (y < y0) y0 = y; y1 = y; xd.fillRect(x, y, 1, 1); } }
      let diff = null;
      if (n) { const blob = await cd.convertToBlob(); diff = await new Promise(ok => { const fr = new FileReader(); fr.onload = () => ok(fr.result.split(',')[1]); fr.readAsDataURL(blob); }); }
      return { n, total: W * H, y0, y1, ha: A.height, hb: B.height, diff };
    }, [before.png.toString('base64'), after.png.toString('base64')]).catch(e => ({ error: e.message }));
    if (d.error) { results.push({ name, status: 'error', error: d.error }); continue; }
    const share = d.n / d.total, changed = share > THRESHOLD || d.ha !== d.hb;
    if (changed) {
      fs.writeFileSync(path.join(OUT, name + '-before.png'), before.png); fs.writeFileSync(path.join(OUT, name + '-after.png'), after.png);
      if (d.diff) fs.writeFileSync(path.join(OUT, name + '-diff.png'), Buffer.from(d.diff, 'base64'));
    }
    results.push({ name, status: changed ? 'changed' : 'same', share: +(share * 100).toFixed(3), rows: d.n ? [d.y0, d.y1] : null, height: [d.ha, d.hb] });
  }
  await br.close();
  fs.writeFileSync(path.join(OUT, 'visual.json'), JSON.stringify(results, null, 1));
  const ch = results.filter(r => r.status === 'changed'), nw = results.filter(r => r.status === 'new page'), er = results.filter(r => r.status === 'error');
  console.log(`${results.length} screens · ${results.length - ch.length - nw.length - er.length} unchanged · ${ch.length} changed · ${nw.length} new · ${er.length} errors`);
  for (const c of ch) console.log(`  CHANGED ${c.name}: ${c.share}% of pixels, rows ${c.rows ? c.rows.join('–') : '-'}, height ${c.height.join('→')}`);
  for (const e of er) console.log('  ERROR ' + e.name + ': ' + e.error);
  process.exit(er.length ? 1 : 0);
})();
