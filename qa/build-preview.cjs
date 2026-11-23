// Builds the shareable PREVIEW of the current site for https://sebastianbf1.github.io/pandonia-preview/
//   node qa/build-preview.cjs <out dir>
// Same pages as production (site/ built from site-src/, prices filled), then made safe to share:
//  · served under /pandonia-preview/ (the build runs with the preview address, so every link and script path fits)
//  · Cookiebot, Meta Pixel and Google Analytics removed, so reviewing the preview never counts as a visit
//  · noindex on every page, robots.txt disallows all, no sitemap, no canonical/hreflang/og:url, no site verification
//  · a fixed "PREVIEW · NOT LIVE" label and a "PREVIEW · " title prefix
// Replaces the earlier tools/make-share.cjs + tools/strip-trackers.mjs. Production is never touched.
const fs = require('fs'); const os = require('os'); const path = require('path');
const { ROOT, build } = require('./lib.cjs');
const PREVIEW = 'https://sebastianbf1.github.io/pandonia-preview/', BASE = '/pandonia-preview/';
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'qa-report', 'preview-site'));

// a build copy whose site address is the preview's (site.config.json in the copy only)
const tmp = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), 'pandonia-preview-src-'));
for (const p of ['scripts', 'site', 'site-src', 'price-sync', 'site.config.json']) fs.cpSync(path.join(ROOT, p), path.join(tmp, p), { recursive: true });
fs.mkdirSync(path.join(tmp, 'public'), { recursive: true }); fs.cpSync(path.join(ROOT, 'public', 'images'), path.join(tmp, 'public', 'images'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'site.config.json'), JSON.stringify({ siteUrl: PREVIEW, allowIndexing: false }));
fs.rmSync(OUT, { recursive: true, force: true });
build(OUT, { root: tmp });
fs.rmSync(tmp, { recursive: true, force: true });

fs.rmSync(path.join(OUT, 'sitemap.xml'), { force: true });
fs.writeFileSync(path.join(OUT, 'robots.txt'), '# Temporary preview of the Pandonia website. Not for search engines. The real site is https://www.pandonia.com/\nUser-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
const LABEL = '<div role="note" style="position:fixed;z-index:2147483000;left:10px;bottom:10px;pointer-events:none;background:#F1EC7A;color:#0A0A0A;border:1px solid #0A0A0A;font:700 10px/1 Arimo,Helvetica,Arial,sans-serif;letter-spacing:.14em;padding:6px 8px">PREVIEW · NOT LIVE</div>\n' +
  '<script>(function(){var t=document.querySelector("title");if(!t)return;function f(){if(document.title.indexOf("PREVIEW · ")!==0)document.title="PREVIEW · "+document.title;}f();new MutationObserver(f).observe(t,{childList:true,characterData:true,subtree:true});})();</script>\n';
const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.html')) pages.push(p); } })(OUT);
for (const f of pages) {
  let h = fs.readFileSync(f, 'utf8');
  // trackers and the consent banner (attributes included: the gated scripts are type="text/plain")
  h = h.replace(/<script\b[^>]*\bsrc="[^"]*(?:cookiebot|googletagmanager|connect\.facebook)[^"]*"[^>]*><\/script>\s*/gi, '')
       .replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?\b(?:fbq|gtag)\s*\((?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi, '')
       .replace(/<noscript>(?:(?!<\/noscript>)[\s\S])*?facebook\.com\/tr(?:(?!<\/noscript>)[\s\S])*?<\/noscript>\s*/gi, '');
  h = h.replace(/<meta name="robots" content="[^"]*">/gi, '<meta name="robots" content="noindex,nofollow,noarchive">');
  if (!/<meta name="robots"/i.test(h)) h = h.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex,nofollow,noarchive">');
  h = h.replace(/<link rel="canonical"[^>]*>\s*/gi, '').replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, '')
       .replace(/<meta property="og:url"[^>]*>\s*/gi, '').replace(/<meta name="google-site-verification"[^>]*>\s*/gi, '');
  // the few root paths written without the base path (image paths in script data, a CSS url, the /en/ stub)
  h = h.replace(/\b(src|href|content)="\/(?!\/|pandonia-preview\/)/g, `$1="${BASE}`)
       .replace(/content="0; url=\/(?!pandonia-preview\/)/g, `content="0; url=${BASE}`)
       .replace(/location\.replace\('\/'/g, `location.replace('${BASE}'`)
       .replace(/(["'(])\/images\//g, `$1${BASE}images/`);
  h = h.replace(/<\/body>/i, LABEL + '</body>');
  // (the cookie policy's text may still name Cookiebot; only scripts count)
  if (/rel="canonical"|index,follow|<script\b[^>]*(cookiebot|googletagmanager|connect\.facebook)|fbq\(|gtag\(/i.test(h)) throw new Error(path.relative(OUT, f) + ': still indexable or carries a tracker');
  fs.writeFileSync(f, h);
}
console.log(`preview built: ${pages.length} pages in ${OUT}`);
