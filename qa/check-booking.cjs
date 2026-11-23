// every visible booking button on a product: which test it belongs to, and where it goes (node _epaudit.cjs [base])
const { chromium } = require('playwright');
const B = (process.argv[2] || 'http://localhost:4190/').replace(/\/?$/, '/');
const P='https://system.easypractice.net/book/pandonia';
// the 10 active tests; the discontinued Vitamin D (dv, 246133), Basic Metabolic (ms) and Digestion (bk) must not be bookable anywhere
const EXP = { htc:P+'?service=229722', ht:P+'?service=228252#choose-time', fh:P+'?service=298849', mh:P+'?service=328461', hcfh:P+'?service=298848', hcfht:P+'?service=300271', gm:P+'?service=246132', th:P+'?service=246129', hcmh:P+'?service=328459', hcmht:P+'?service=328460', _:P+'#choose-service' };
// real addresses (Nov 2026): test slug -> id, from site-src/routes.json when present
const SLUG = {}; try { for (const r of JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'site-src', 'routes.json'), 'utf8')).pages) if (r.page === 'test') for (const l of ['en', 'da']) SLUG[r[l].path.split('/').slice(-2)[0]] = r.anchor; } catch (e) {}
const IDS = ['htc','ht','fh','mh','hcfh','hcfht','gm','dv','th','hcmh','hcmht','ms','bk'];
(async () => {
  const b = await chromium.launch(); const rows = new Map(); let bad = 0, errs = [];
  for (const w of [1440, 390]) for (const pre of ['', 'da/']) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
    const routes = ['home', 'individuals', 'book', 'health/general', 'health/hormonal', 'health/comprehensive', 'health/glucose', ...IDS.map(i => 'test/' + i)];
    for (const r of routes) {
      await p.goto(B + pre + '#/' + r, { waitUntil: 'networkidle' }); await p.waitForTimeout(250);
      const got = await p.evaluate(([EXP, SLUG]) => {
                return [...document.querySelectorAll('a[href*="easypractice"]')].filter(a => a.offsetParent).map(a => {
          const card = a.closest('.nxPk,.nxMr,.mtR,.tHead,.tEnd');
          if (!card) return null;
          // the test a card belongs to: its "read more" link, or the page itself (old #/test/<id> or real /test/<slug>/ addresses)
          const more = card.querySelector('a[href^="#/test/"],a[href*="/test/"]'), h = more ? more.getAttribute('href') : location.hash || location.pathname;
          const id = h.startsWith('#/test/') ? h.slice(7) : SLUG[(/\/test\/([a-z0-9-]+)\//.exec(h) || [])[1]];
          return { id, name: (card.querySelector('.nxPkN,.nxMrN,.mtN,.tName,.tEndN') || {}).textContent, label: a.textContent.trim(), href: a.href, exp: (EXP[id] || EXP._), where: card.className.split(' ')[0] };
        }).filter(Boolean);
      }, [EXP, SLUG]);
      const vd = await p.evaluate(() => [...document.querySelectorAll('a[href*="246133"]')].length);
      if (vd) { bad++; console.log('VITAMIN D BOOKABLE', w, pre, r, vd); }
      for (const g of got) {
        const ok = g.href === g.exp; if (!ok) bad++;
        const k = g.id; const e = rows.get(k) || { name: g.name, href: g.href, ok: true, places: new Set(), n: 0 };
        e.ok = e.ok && ok && e.href === g.href; e.n++; e.places.add((pre || 'en/') + w + ':' + r + '(' + g.where + ')'); rows.set(k, e);
        if (!ok) console.log('WRONG', w, pre, r, g.id, g.href, 'expected', g.exp);
      }
    }
    await p.close();
  }
  for (const [k, e] of rows) console.log((e.ok ? 'OK ' : 'BAD') + ' ' + k.padEnd(6) + ' ' + String(e.name).padEnd(46) + ' ' + e.href + '  (' + e.n + ' buttons)');
  const missing = Object.keys(EXP).filter((k) => k !== '_' && !rows.has(k));
  if (missing.length) { bad++; console.log('NOT BOOKABLE ANYWHERE:', missing.join(', ')); }
  // discontinued standalone tests must not be bookable anywhere
  for (const k of ['dv', 'ms', 'bk']) if (rows.has(k)) { bad++; console.log('DISCONTINUED BUT BOOKABLE:', k); }
  console.log('wrong buttons', bad, '| page errors', errs.length, errs.slice(0, 2).join(' | '));
  await b.close();
})();
