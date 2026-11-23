// walks every path of the test guide and records the suggestion and its "Book this test" link (node _tgaudit.cjs [base])
const { chromium } = require('playwright');
const B = (process.argv[2] || 'http://localhost:4190/').replace(/\/?$/, '/');
(async () => {
  const b = await chromium.launch(), out = [];
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.route(/cookiebot|googletagmanager|google-analytics|facebook.(net|com)/i, (r) => r.abort()); // live site: no tracker visits, no consent banner
    const run = async path => {
      await p.goto('about:blank'); await p.goto(B + '#/testguide', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
      const st = p.locator('[data-tg="start"]:visible'); if (await st.count()) { await st.first().click(); await p.waitForTimeout(450); }
      for (const i of path) { await p.locator('[data-tg="pick"][data-i="' + i + '"]:visible').first().click(); await p.waitForTimeout(450); }
      return p.evaluate(() => ({ picks: [...document.querySelectorAll('[data-tg="pick"]')].filter(e => e.offsetParent).length, res: (document.querySelector('.tgRes') || {}).textContent, href: (document.querySelector('.tgCta[href]') || {}).href }));
    };
    const walk = async path => {
      const r = await run(path);
      if (r.picks) { for (let i = 0; i < r.picks; i++) await walk(path.concat(i)); return; }
      const rec = async tag => { const x = await p.evaluate(() => ({ res: document.querySelector('.tgRes').textContent, href: document.querySelector('.tgCta[href]').href })); out.push([w, path.join('-'), tag, x.res, x.href]); };
      await rec('');
      for (const k of ['thy', 'cons']) {
        await run(path); const box = p.locator('[data-tg="' + k + '"]:visible');
        if (await box.count()) { await box.first().check(); await p.waitForTimeout(150); await rec('+' + k); }
      }
    };
    await walk([]); await p.close();
  }
  const seen = new Set();
  for (const r of out) { const k = r.slice(2).join('|'); if (seen.has(k)) continue; seen.add(k); console.log(r[1].padEnd(6), (r[2] || '').padEnd(6), String(r[3]).padEnd(52), r[4]); }
  console.log('paths x widths', out.length);
  await b.close();
})();
