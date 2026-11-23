# Maintaining www.pandonia.com

The site is a static site on GitHub Pages. Every page has its own address in Danish (under `/da/`) and English (at
the root), its own title, description, canonical and hreflang, one H1, structured data, and its content in the HTML
itself, so search engines and AI search can read it without running JavaScript. The page script still runs on every
page, so booking, prices, the test guide and cookie consent work exactly as before.

## How the site is built

```
site-src/en.html  ─┐
site-src/da.html  ─┼─ node scripts/prerender.mjs ──► site/**/index.html  (50 pages, committed)
site-src/routes.json┘        (local, Playwright)
                                                       │  git push to main
                                                       ▼
                 GitHub Actions (.github/workflows/pages.yml, unchanged):
                 scripts/assemble-site.mjs   fills the site address, writes sitemap.xml and robots.txt,
                                             runs the build checks (incl. build lock)
                 price-sync/scripts/apply-prices.mjs   fills every price from price-sync/prices/prices.json
                                                       │
                                                       ▼
                                               www.pandonia.com
```

- **`site-src/en.html`, `site-src/da.html`**: the two full page templates, one per language. Each holds every route
  (home, tests, prices, laboratory, clinics, …) as a `data-page` section, both languages' texts in `data-da` /
  `data-en` attributes, and the page script with the data (tests, FAQ, biomarkers, test guide).
- **`site-src/routes.json`**: one entry per page: the Danish and English address, title and meta description, and
  whether it is indexed. Adding a page = a `data-page` section in both templates + an entry here.
- **`scripts/prerender.mjs`**: opens every route in both languages in a headless browser, keeps only that page's
  content, writes its head and structured data, and saves it under `site/`. Prices stay tokens.
- **`site-src/build.lock.json`**: written by the prerender. The deploy fails if `site-src/` changed without a rebuild
  or a generated page was edited by hand, and says what to run.
- **Hand-maintained** (edit directly): `site/404.html`, `site/en/index.html` (old address → `/`),
  `site/cookiepolitik/`, `site/persondatapolitik/`, images in `public/images/`.

## Everyday changes (through Claude Code)

| You ask for | Where it is changed | Then |
|---|---|---|
| Text, layout or design on any page | `site-src/en.html` and `site-src/da.html` | `node scripts/prerender.mjs` rebuilds all pages |
| A page title or meta description | `site-src/routes.json` | same |
| Structured data | `scripts/prerender.mjs` (`ORG`, `jsonld()`) | same |
| A price | `price-sync/prices/prices.json` (or the price sync) | nothing to rebuild; the deploy fills every page |
| A policy text | `site/cookiepolitik/` or `site/persondatapolitik/` | none |

Old links keep working: `/#/test/ht`, `/da/#/book` and every other `#/` address from the earlier site are sent to
the new address by the page script.

## "Push to live"

Claude follows CLAUDE.md. In short:

1. `node qa/run.cjs`: builds and checks everything against the new build and the live version (origin/main):

   | Check | Script |
   |---|---|
   | SEO: title, description, canonical, hreflang, robots, one H1, JSON-LD, Danish raw text, every internal link, old `#/` addresses, language switch, navigation, JavaScript errors | `qa/check-seo.cjs` |
   | No Meta/Google request or cookie before consent, on every page | `qa/check-consent.cjs` |
   | Every booking button goes to the right EasyPractice service; discontinued tests not bookable | `qa/check-booking.cjs` |
   | Consultation notes and the test guide's consultation options and totals, both languages | `qa/check-consult.cjs` |
   | Simulated price change (+500 kr. on all tests) reaches test pages, prices pages, VAT lines and structured data in both languages | `qa/check-prices.cjs` |
   | Test guide: every path gives the same suggestion and booking link as live | `qa/check-testguide.cjs` |
   | Visual comparison with live: every page, both languages, 1440 and 390 px | `qa/check-visual.cjs` |
   | Lab performance (LCP, CLS, transfer) not worse than live | `qa/check-performance.cjs` |

   The report is `qa-report/<date>/summary.md`, with before/after/diff images of every changed screen.
2. Any FAIL stops the deploy. Visual changes are shown to you for approval.
3. Commit the approved change, push to `main`; GitHub Actions deploys in about a minute.
4. `node qa/check-live.cjs`: every live page must be identical to the local build, and SEO, consent and booking
   checks must pass on www.pandonia.com.

Local preview at any time: `node qa/preview.cjs` → http://127.0.0.1:4180/ (Danish: /da/).

## "Push to preview"

A shareable preview lives in the separate repository `SebastianBF1/pandonia-preview`, published by GitHub Pages at
https://sebastianbf1.github.io/pandonia-preview/. `node qa/publish-preview.cjs "<message>"` builds the same pages
as production (`qa/build-preview.cjs`), then makes them safe to share: served under `/pandonia-preview/`, Cookiebot,
Meta Pixel and Google Analytics removed (reviewing never counts as a visit), every page noindex, robots.txt
disallows all, no sitemap, canonical and hreflang removed, a "PREVIEW · NOT LIVE" label. It refuses any repository
other than the preview's. Check the result with `node qa/check-preview.cjs`, plus the booking and consultation
checks with the preview URL.

## Setup on a new machine

```bash
cd qa && npm install && npx playwright install chromium
```

Node 20 or newer. Nothing else; the deploy itself needs no install.

## Prices

`price-sync/prices/prices.json` is the only place prices live. Pages carry tokens such as `__PRICE_ht_da__`; the
deploy fills them on all pages and in the structured data, and fails if a token is unknown, left over, or the price
file is invalid. Amounts excluding VAT are computed by the page script from the price including VAT. A price change
needs no rebuild of `site/`: change the price file and deploy.
