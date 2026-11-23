# Pandonia website: rules for Claude Code

The public site www.pandonia.com is built from `site-src/` into `site/` and deployed by GitHub Pages on every push to
`main`. Read MAINTENANCE.md for the full picture. These rules are binding.

## Where to make a change

- Page content, design, scripts: `site-src/en.html` AND `site-src/da.html`. Both files hold both languages
  (`data-da` / `data-en` attributes and the data in the page script); every change goes into both, identically,
  except the visible text that is already language-specific in each file.
- Addresses, SEO titles, meta descriptions, which pages exist: `site-src/routes.json`.
- Structured data (JSON-LD) and the page heads: `scripts/prerender.mjs`.
- Never edit the generated pages `site/**/index.html` by hand. After any change in `site-src/` or
  `scripts/prerender.mjs`, run `node scripts/prerender.mjs`; it rebuilds all 50 pages. The deploy refuses a `site/`
  that does not match `site-src/` (site-src/build.lock.json).
- Hand-maintained, not generated: `site/404.html`, `site/en/index.html`, `site/cookiepolitik/`, `site/persondatapolitik/`.

## Never

- Hard-code a price. Prices are `__PRICE_<id>_<raw|da|en>__` tokens filled at deploy from
  `price-sync/prices/prices.json`, the only source. A price change is a change to that file, then a deploy.
- Change `price-sync/`, the EasyPractice service ids or booking links (`var BOOK` in the page script), the
  consultation add-on, the test guide logic, or the cookie-consent gating, unless the user explicitly asks.
- Restore the discontinued tests (Vitamin D, Basic Metabolic, Digestion).
- Change approved design or copy as a side effect. Visible changes are made only when asked, and shown first.
- State facts Pandonia has not confirmed (accreditation, phone, opening hours, partner clinics, reviews).

## Deploying: only on the user's explicit words

Nothing is committed, pushed or deployed until the user says "Push to live" (or "Commit and push to live") for the
change in question. Then, in this order:

1. `node qa/run.cjs` builds everything and runs every check against the new build and the live version
   (origin/main): SEO, links and old addresses, cookie consent, booking links, consultation, a simulated price
   change, the test guide, visual comparison, lab performance. Report: `qa-report/<date>/summary.md`.
2. If any check FAILS: stop, report, fix. Do not deploy.
3. Show the user every screen the visual comparison marks CHANGED (before/after/diff images in
   `qa-report/<date>/visual/`). Deploy only changes the user approved.
4. Commit only the intended files (site-src/, site/, scripts/, qa/, docs) on a branch, then push to `main`
   (`git push origin <branch>:main`); the GitHub Actions workflow deploys. Watch it with `gh run watch`.
5. After the deploy: `node qa/check-live.cjs`. Every live page must be byte-identical to the local build, and the
   SEO, consent and booking checks must pass on www.pandonia.com. Report the result.

## Preview: only on "Push to preview"

The shareable preview is a separate repository, `SebastianBF1/pandonia-preview` (GitHub Pages:
https://sebastianbf1.github.io/pandonia-preview/). On "Push to preview": run `node qa/run.cjs` (stop on any FAIL),
then `node qa/publish-preview.cjs "<message>"`, then `node qa/check-preview.cjs`,
`node qa/check-booking.cjs <preview url>` and `node qa/check-consult.cjs <preview url>` against the published
preview. The preview has no trackers, is noindexed and carries a "PREVIEW · NOT LIVE" label. Publishing to the
preview never commits to this repository and never touches www.pandonia.com.

Local preview at any time: `node qa/preview.cjs` (serves the deployable build on http://127.0.0.1:4180/).
First use on a machine: `cd qa && npm install` (Playwright; browsers via `npx playwright install chromium`).
