# Pandonia — public launch checklist

Public address: **https://pandonia-aps.github.io/pandoina-website-v2/** (Danish) ·
**…/en/** (English). Domain: not connected yet — see `DOMAIN_SETUP.md`.

Status as of 2 Oct 2026. ✅ done and verified · ⚠️ works, needs Pandonia's
attention · ⛔ blocker before connecting the real domain.

## CONTENT
- ✅ Current approved design, pages and copy (production build of the approved site; page content renders pixel-identical to the approved review build at 375 and 1440 px).
- ✅ No demo content: no demo booking times, no DEMO / NOT LIVE labels, no booking demo page (`/booking.html` → 404).
- ✅ No internal review notes, review layer, review toggle, prototype bar, source tags, "Stock" tags, placeholder toasts or localhost/development links. Review-only notes are removed from the public markup, and anything rendered later is removed on the page as well.
- ✅ Every visible link goes to a real page or a real external address. Pages: Forside/Home, Hvad vi måler/What we test, Sådan fungerer det/How it works, Din rapport/Your report, Priser/Pricing, FAQ.
- ⚠️ "Om Pandonia / About Pandonia" is not a page of the approved site and is not linked anywhere; nothing was invented for it.

## BOOKING
- ✅ Every booking button (header, hero, mobile menu, pricing, Essential Tests, FAQ, footer, page ends): `https://system.easypractice.net/book/pandonia#choose-service`, new tab.
- ✅ Membership: `https://system.easypractice.net/subscription/806` (EasyPractice's membership sign-up).
- ✅ The experimental 14-day calendar is not public. It stays in the repository as an internal preview (`preview/booking.html`), never deployed.

## LOGIN
- ✅ Every "Log ind / Log in": `https://system.easypractice.net/book/pandonia/center`. No custom login.

## COMMERCIAL
- ✅ Tests, prices and durations match EasyPractice's public catalogue (re-checked 2 Oct 2026): 11 services, membership 2.000 kr./md.
- ✅ No old prices or names anywhere on the public site (searched in every page, both languages).
- ⚠️ Open since the price update: placement of the three "Pandonia test" hormone products (EasyPractice groups them separately; the site shows Female hormones under Essential Tests and the two Health check packages under Health Test); "Health check" vs "Health Test"; their short descriptions (EasyPractice has none); EasyPractice does not mark them "Skal betales online".

## CLINICAL
- ✅ No unresolved public placeholders: all copy still awaiting clinical sign-off is withheld from the public build (marker explanations, units and ranges that are not approved, English wording not yet approved).
- ✅ Examples are labelled as examples on the page (marker bars "Eksempel … illustrative", report radar "Eksempel fra Pandonias rapport-UI", anonymised "ABC / X,X" state).
- ⚠️ Footer disclaimer ("Pandonias tests erstatter ikke lægelig undersøgelse …") is shown but still awaits legal approval, in Danish and English.
- ⚠️ Homepage radar (desktop) shows made-up example scores without a visible "Eksempel" label (it is labelled as an example for screen readers).
- ⚠️ Marker example ranges are general illustrative limits, not Pandonia's laboratory ranges (labelled "illustrative").
- ⚠️ Turnaround: the site says the report arrives the same day. Please confirm this is the promise.

## DA / EN
- ✅ Both languages work: navigation, mobile menu, routes, footer, booking, login, prices, What We Test, titles.
- ✅ Each language has its own address (`/` and `/en/`); switching language updates the address, and a reload stays in the language.
- ⚠️ Privacy and cookie policies exist in Danish only (the English footer says so).

## MOBILE
- ✅ 375 and 768 px verified (Chromium, WebKit): layout, mobile menu (focus, Escape), pricing blocks, no horizontal overflow.

## DESKTOP
- ✅ 1440 px verified (Chromium, WebKit).

## LEGAL
- ✅ Privacy policy → `https://www.pandonia.com/persondatapolitik` (Pandonia's published policy).
- ✅ Cookie policy → `https://www.pandonia.com/cookiepolitik` (Pandonia's published policy).
- ✅ Company: Pandonia ApS · CVR 41 58 87 64 (from Pandonia's own policies). Contact: labs@pandonia.com.
- ⛔ **Terms of sale (handelsbetingelser) do not exist** on pandonia.com. Not shown on the public site. Pandonia must supply them (or confirm that EasyPractice's checkout covers them) before launch.
- ⛔ **The two policies live on the current www.pandonia.com.** If that domain is moved to the new site, they must be moved first, or the footer links break.
- ⚠️ The cookie policy describes marketing cookies. The new site sets **no cookies** (it remembers the chosen language in the browser's local storage) but loads fonts from Google Fonts, which sends the visitor's IP address to Google. Pandonia should review the two policies for the new site.
- ⚠️ Address: the policies give Nordre Fasanvej 215, 2000 Frederiksberg; the footer shows the laboratory, Langebrogade 3A. Confirm which address is the company address.

## SEO
- ✅ Unique title and description per language; `html lang`; canonical; `hreflang` da-DK / en / x-default; Open Graph and Twitter card with a 1200×630 image; favicon and touch icon; `robots.txt`; `sitemap.xml` (`/` and `/en/` only, no internal pages).
- ✅ Page titles change per page while browsing (e.g. "Priser — Pandonia").
- ✅ Indexing is off on the temporary GitHub address and switches on automatically on the real domain.
- ⚠️ The site uses in-page (#) routes, so search engines see two addresses (Danish and English home). Sub-pages are not separately indexable. Fine for launch; real per-page URLs would be a later improvement.
- ✅ No medical schema added.

## SECURITY
- ✅ No API keys, tokens, passwords, credentials, private endpoints or local paths in the repository or the deployment. No EasyPractice API credentials anywhere (the site only links to EasyPractice).
- ✅ The deployment contains only `site/` and the six photographs it uses.

## DOMAIN
- ✅ Internal links are host-independent (in-page routes, assets under the base path filled in at deploy). The address is read from GitHub Pages at deploy; one override point: `site.config.json`.
- ⛔ Pandonia to decide the domain (`pandonia.dk` or `pandonia.com`) and whether `www` is primary (recommended). See `DOMAIN_SETUP.md`.

## HTTPS
- ✅ GitHub Pages serves HTTPS today; a certificate for the custom domain is issued automatically. Tick "Enforce HTTPS" after connecting (DOMAIN_SETUP.md §7).

## PERFORMANCE
- ✅ Only the six photographs in use are deployed (61–179 KB each), all lazy-loaded; one HTML file per language (~160 KB, scripts inline); all three font weights and the one italic are used; layout shift checks pass; motion respects reduced-motion and pauses off screen.
- ⚠️ Fonts load from Google Fonts. Self-hosting them would remove the third-party request (privacy and speed).

## ACCESSIBILITY
- ✅ Keyboard navigation, visible focus, mobile menu as a modal dialog, heading structure, screen-reader labels, touch targets, reduced motion, contrast and overflow — checked by the existing Playwright suite against the production build.
- ⚠️ Safari only: links are not in the Tab order by default (a Safari setting, "Press Tab to highlight each item"). Links are focusable and work with Enter.

## QA
- ✅ Production build, Chromium and WebKit, 375 / 768 / 1440 px, Danish and English:
  - existing site suite — Chromium 322/322; WebKit 321/322 (the Safari Tab setting above);
  - production suite (SEO, no review/demo content, booking and login links, footer, routes, deep links, reload, back/forward, language switching, mobile menu, marker search and expansion, images, console errors, overflow, 404, demo not published) — 214/214 in both;
  - prices suite — 66/66 in both.
- ✅ Re-run against the live public address after deployment (see the final report).
