// The full pre-deploy check: node qa/run.cjs   (from the repo root, or `npm run check` in qa/)
//   1. builds site/ from site-src/ (scripts/prerender.mjs)
//   2. builds the new site and the live one (origin/main) exactly as the deploy does
//   3. runs every check against the new build, and the visual and test-guide comparisons against the live one
//   4. writes qa-report/<date>/summary.md (+ screenshots of every changed screen) and exits non-zero on a failure
// Visual changes do not fail the run; they are listed for a person to approve.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, build, buildRef, serve } = require('./lib.cjs');
const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
const REPORT = path.join(ROOT, 'qa-report', stamp);
// checks run as child processes WITHOUT blocking this process, which serves the two builds they test
const execFileP = require('util').promisify(require('child_process').execFile);
const node = async (args) => (await execFileP(process.execPath, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64e6 })).stdout;

(async () => {
  fs.mkdirSync(REPORT, { recursive: true });
  const lines = [`# Pre-deploy check ${stamp}`, '', `Branch: ${execFileSync('git', ['-C', ROOT, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim()} · baseline: origin/main ${execFileSync('git', ['-C', ROOT, 'rev-parse', '--short', 'origin/main'], { encoding: 'utf8' }).trim()}`, ''];
  const results = []; const log = (name, ok, text) => { results.push({ name, ok }); lines.push(`## ${ok ? 'PASS' : 'FAIL'} · ${name}`, '', '```', text.trim(), '```', ''); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${text.trim().split('\n').slice(-1)[0]}`); };
  const step = async (name, args) => { try { log(name, true, await node(args)); } catch (e) { log(name, false, (e.stdout || '') + (e.stderr || '') || e.message); } };

  await step('Build pages from site-src/ (prerender)', ['scripts/prerender.mjs']);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pandonia-qa-'));
  let NEW, BASE;
  try { NEW = await serve(build(path.join(tmp, 'new'))); log('Assemble + prices + build checks (as the deploy)', true, 'site checks passed, prices filled'); }
  catch (e) { log('Assemble + prices + build checks (as the deploy)', false, String(e.stderr || e.message)); return finish(); }
  try { BASE = await serve(buildRef(path.join(tmp, 'base'))); } catch (e) { log('Build of the live version (origin/main)', false, String(e.stderr || e.message)); }

  const q = f => path.join(__dirname, f);
  await step('SEO: titles, descriptions, canonical, hreflang, H1, structured data, links, old addresses, JS errors', [q('check-seo.cjs'), NEW.url]);
  await step('Cookie consent: no tracking before consent on any page', [q('check-consent.cjs'), NEW.url]);
  await step('Booking links: every test bookable, the right EasyPractice service, nothing discontinued', [q('check-booking.cjs'), NEW.url]);
  await step('Consultation: notes, add-on, test guide results with and without consultation', [q('check-consult.cjs'), NEW.url]);
  await step('Simulated price change reaches every page and the structured data', [q('check-prices.cjs')]);
  if (BASE) {
    try {
      const a = await node([q('check-testguide.cjs'), BASE.url]), b = await node([q('check-testguide.cjs'), NEW.url]);
      log('Test guide: every path gives the same suggestion and booking link as live', a === b, a === b ? b.trim().split('\n').length + ' lines identical to live' : 'differs from live:\n' + b);
    } catch (e) { log('Test guide', false, String(e.stdout || e.message)); }
    try { const v = await node([q('check-visual.cjs'), BASE.url, NEW.url, path.join(REPORT, 'visual')]); lines.push('## REVIEW · Visual comparison with live', '', 'Screens marked CHANGED differ from the live site; before, after and diff images are in visual/. Approve them or ask for a fix.', '', '```', v.trim(), '```', ''); console.log('REVIEW  visual: ' + v.trim().split('\n')[0]); }
    catch (e) { log('Visual comparison', false, String(e.stdout || e.message)); }
    try { const p = await node([q('check-performance.cjs'), BASE.url, NEW.url]); log('Performance (lab, this machine): not slower than live', true, p); }
    catch (e) { log('Performance (lab, this machine): not slower than live', false, String(e.stdout || e.message)); }
  }
  finish();

  function finish() {
    if (NEW) NEW.close(); if (BASE) BASE.close();
    const failed = results.filter(r => !r.ok);
    lines.splice(3, 0, failed.length ? `**${failed.length} check(s) FAILED: do not deploy.**` : '**All checks passed.** Review the visual comparison, then deploy.', '');
    fs.writeFileSync(path.join(REPORT, 'summary.md'), lines.join('\n'));
    console.log(`\nReport: ${path.relative(ROOT, path.join(REPORT, 'summary.md'))}`);
    process.exit(failed.length ? 1 : 0);
  }
})();
