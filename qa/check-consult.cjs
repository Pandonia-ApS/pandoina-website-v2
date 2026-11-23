// Consultation booking behaviour, every entry point (node _consult.cjs [base])
const { chromium } = require('playwright');
const B = (process.argv[2] || 'http://localhost:4190/').replace(/\/?$/, '/');
const P = 'https://system.easypractice.net/book/pandonia';
const SVC = { ht: 228252, htc: 229722, fh: 298849, mh: 328461, hcfh: 298848, hcfht: 300271, hcmh: 328459, hcmht: 328460, gm: 246132, th: 246129 };
const URL_ = (k) => k ? P + '?service=' + SVC[k] + (k === 'ht' ? '#choose-time' : '') : P + '#choose-service';
const ADDON = ['ht', 'hcfh', 'hcfht', 'hcmh', 'hcmht'];
// prices from the price file, so a price change never breaks this check
const PRICE = Object.fromEntries(Object.entries(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'price-sync', 'prices', 'prices.json'), 'utf8')).prices).map(([k, v]) => [k, v.incl]));
const kr = (n, lang = 'en') => (lang === 'da' ? n.toLocaleString('da-DK') + ' kr.' : 'DKK ' + n.toLocaleString('en-GB'));
const HOW = "Please select 'Konsultation' under additional services in EasyPractice to complete your booking.";
const BACK = "If the booking goes straight to date and time, click 'Tilbage' once to see the additional services.";
// the test guide in Danish (approved 12 Nov 2026)
const HOW_DA = "Vælg 'Konsultation' under tillægsydelser i EasyPractice for at gennemføre din booking.";
const BACK_DA = "Går bookingen direkte til dato og tid, så klik én gang på 'Tilbage' for at se tillægsydelserne.";
const NOTE_EN = 'Optional consultation with a doctor, 20 minutes: DKK 1,250, not included in the price. ' + HOW + ' ' + BACK;
const NOTE_DA = "Valgfri konsultation med en læge, 20 minutter: 1.250 kr., ikke med i prisen. Vælg 'Konsultation' under tillægsydelser i EasyPractice for at gennemføre din booking. Går bookingen direkte til dato og tid, så klik én gang på 'Tilbage' for at se tillægsydelserne.";
const HOR = {
  en: 'If you have questions or concerns, you can speak with your own doctor. The standalone hormone tests do not include a consultation with a Pandonia doctor; one can be added to the Health Test packages with hormones.',
  da: 'Har du spørgsmål eller bekymringer, kan du tale med din egen læge. De enkeltstående hormontests indeholder ikke en konsultation med en Pandonia-læge; den kan tilføjes til Health Test-pakkerne med hormoner.',
};
const HOST = { hcfht: 'Health Test + Female hormones + Thyroid panel', hcmht: 'Health Test + Male hormones + Thyroid panel' };
// test guide: answers per result, the services behind it, whether a consultation is offered and how
const TG = [
  ['R1', [0, 0], ['ht'], 'included'], ['R1', [4], ['ht'], 'included'],
  ['R2', [0, 1, 0], ['hcfht', 'gm'], 'addon'], ['R3', [0, 1, 1], ['hcmht', 'gm'], 'addon'],
  ['R4', [1, 0, 0], ['fh'], 'none'], ['R5', [1, 1, 0], ['mh'], 'none'],
  ['R6', [1, 0, 1], ['hcfh'], 'addon', 'hcfht'], ['R7', [1, 1, 1], ['hcmh'], 'addon', 'hcmht'],
  ['R8', [2], ['th'], 'none'], ['R9', [3], ['gm'], 'none'],
];
let fails = 0, checks = 0;
const ok = (c, what) => { checks++; if (!c) { fails++; console.log('FAIL', what); } };

(async () => {
  const b = await chromium.launch();
  for (const [pre, lang] of [['', 'en'], ['da/', 'da']]) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); await p.route(/cookiebot|googletagmanager|google-analytics|facebook.(net|com)/i, (r) => r.abort()); // live site: no tracker visits, no consent banner
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    const at = `${lang} ${w}`;
    // 1. test detail pages: the note only on the five add-on services, in the page language; buttons unchanged
    for (const k of Object.keys(SVC)) {
      await p.goto('about:blank'); await p.goto(B + pre + '#/test/' + k); await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const n = [...document.querySelectorAll('#tDetail .tConsult')].filter((e) => e.getClientRects().length);
        return { notes: n.length, text: n[0] ? n[0].textContent : '', hrefs: [...document.querySelectorAll('#tDetail a[href*="easypractice"]')].filter((a) => a.getClientRects().length).map((a) => a.href) };
      });
      const want = ADDON.includes(k);
      ok(r.notes === (want ? 1 : 0), `${at} test/${k}: consultation note ${r.notes} (expected ${want ? 1 : 0})`);
      if (want) ok(r.text === (lang === 'da' ? NOTE_DA : NOTE_EN), `${at} test/${k}: note wording "${r.text}"`);
      ok(r.hrefs.length === 2 && r.hrefs.every((x) => x === URL_(k)), `${at} test/${k}: booking buttons → ${r.hrefs.join(', ')}`);
    }
    // 2. test guide: every result, consultation unticked and ticked (and with the thyroid panel where offered)
    for (const [rid, path, svcs, kind, thy] of TG) {
      for (const [cons, withThy] of [[false, false], [true, false], ...(thy ? [[false, true], [true, true]] : [])]) {
        await p.goto('about:blank'); await p.goto(B + pre + '#/testguide'); await p.waitForTimeout(500);
        await p.click('#tgRoot [data-tg="start"]');
        for (const i of path) { await p.click(`#tgRoot [data-tg="pick"][data-i="${i}"]`); await p.waitForTimeout(80); }
        const box = await p.$('#tgRoot input[data-tg="cons"]');
        if (cons && !box) { ok(kind === 'none', `${at} ${rid}: no consultation box`); continue; }
        if (!cons) ok(!!box === (kind !== 'none'), `${at} ${rid}: consultation offered = ${!!box} (expected ${kind !== 'none'})`);
        if (withThy) { await p.check('#tgRoot input[data-tg="thy"]'); await p.waitForTimeout(80); }
        if (cons) { await p.check('#tgRoot input[data-tg="cons"]'); await p.waitForTimeout(80); }
        const r = await p.evaluate(() => ({ href: document.querySelector('#tgRoot .tgCta').href, info: [...document.querySelectorAll('#tgRoot .tgCons')].map((e) => e.textContent).join(' | ') }));
        let list = withThy ? [thy] : svcs, href = list.length === 1 ? URL_(list[0]) : URL_(null);
        const tag = `${at} ${rid}${withThy ? '+thy' : ''}${cons ? '+cons' : ''}`;
        if (cons && kind === 'included') { href = URL_('htc'); ok(r.info === (lang === 'da' ? `Health Test + Consultation: ${kr(PRICE.htc, 'da')} Konsultationen på 20 minutter er inkluderet.` : `Health Test + Consultation: ${kr(PRICE.htc)}. The 20-minute consultation is included.`), `${tag}: info "${r.info}"`); }
        else if (cons) {
          const total = list.reduce((a, k) => a + PRICE[k], 0) + 1250;
          // two services (with CGM): the consultation is named as an add-on to the Health Test package, never to CGM;
          // the general booking page shows the add-on step itself, so no 'Tilbage' line there
          const hn = HOST[list.find((k) => ADDON.includes(k))];
          const want = lang === 'da'
            ? (list.length > 1
              ? `Konsultation, 20 minutter, med ${hn}: + 1.250 kr. · i alt ${kr(total, 'da')} | ${HOW_DA} Den er et tilvalg til ${hn}, ikke til glukosemonitorering.`
              : `Konsultation, 20 minutter: + 1.250 kr. · i alt ${kr(total, 'da')} | ${HOW_DA} | ${BACK_DA}`)
            : (list.length > 1
              ? `Consultation, 20 minutes, with ${hn}: + DKK 1,250 · total ${kr(total)} | ${HOW} It is an add-on to ${hn}, not to CGM.`
              : `Consultation, 20 minutes: + DKK 1,250 · total ${kr(total)} | ${HOW} | ${BACK}`);
          ok(r.info === want, `${tag}: info "${r.info}"`);
        } else ok(r.info === '', `${tag}: no consultation info when unticked`);
        ok(r.href === href, `${tag}: Book this test → ${r.href} (expected ${href})`);
      }
    }
    // 2b. Hormonal Health no longer implies a consultation for the standalone hormone tests; other areas unchanged
    for (const [c, want] of [['hormonal', HOR[lang]], ['general', null], ['comprehensive', null]]) {
      await p.goto('about:blank'); await p.goto(B + pre + '#/health/' + c); await p.waitForTimeout(500);
      const t = await p.evaluate(() => {
        const d = [...document.querySelectorAll('.nxCS dt,.nxCS dd')].filter((e) => e.getClientRects().length).map((e) => e.textContent.trim());
        return d[d.findIndex((x) => /^(Consultation|Konsultation)$/.test(x)) + 1];
      });
      ok(want ? t === want : /book a consultation with a Pandonia doctor|booke en konsultation med en Pandonia-læge/.test(t), `${at} health/${c}: consultation fact "${t}"`);
    }
    // 3. nothing anywhere can book a discontinued test, and no page claims a consultation is already booked
    for (const r of ['home', 'individuals', 'book', 'health/general', 'health/hormonal', 'health/comprehensive', 'health/glucose', 'faq', 'saadan']) {
      await p.goto('about:blank'); await p.goto(B + pre + '#/' + r); await p.waitForTimeout(400);
      const bad = await p.evaluate(() => [...document.querySelectorAll('a[href*="easypractice"]')].filter((a) => /service=(246133)/.test(a.href)).length);
      ok(bad === 0, `${at} #/${r}: discontinued booking links ${bad}`);
    }
    ok(errs.length === 0, `${at}: page errors ${errs.join(' | ')}`);
    await p.close();
  }
  console.log(`\n${checks} checks · ${fails ? fails + ' FAILED' : 'all passed'}`);
  await b.close();
  process.exitCode = fails ? 1 : 0;
})();
