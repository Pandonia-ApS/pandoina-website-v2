---
target: the whole Pandonia website (preview/index.html)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
target_identity: "file:C:\\Users\\SebastianBaldur-Fels\\pandonia-website-v3\\preview\\index.html"
target_fingerprint: "sha256:e41ceff785ae74570fb3e9526b87aec876b503c2450c3f61787a435e2e4c4b41"
target_path: "C:\\Users\\SebastianBaldur-Fels\\pandonia-website-v3\\preview\\index.html"
timestamp: 2026-10-01T16-31-08Z
slug: preview-index-html
---
Method: dual-agent (A: design review sub-agent · B: detector + browser sub-agent), plus a separate technical audit sub-agent.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Booking steps, rail counter and nav underline work; route changes give no URL/title/focus cue |
| 2 | Match System / Real World | 2 | "35+ biomarkører" in the hero vs a 15-row list that mixes markers, panels and a product; English system names lead on the Danish site |
| 3 | User Control and Freedom | 3 | Tabs, accordions, "Skift tid" work; Back leaves the site; booking choice must be re-made in EasyPractice |
| 4 | Consistency and Standards | 2 | Sådan steps 01, 02, (Test.), 04, 04; visit length "fem minutter" vs 10/15 min; two colour scales for status |
| 5 | Error Prevention | 2 | Booking never asks area/location before times; fasting not shown near early slots |
| 6 | Recognition Rather Than Recall | 3 | Comparison table and repeated CTAs help; hand-off asks the user to recall their choice |
| 7 | Flexibility and Efficiency | 2 | Marker search and "Næste ledige tid" are good; markers do not lead to the test that contains them |
| 8 | Aesthetic and Minimalist Design | 3 | Strong restraint; homepage opens on 15 equal rows; thin Sådan sections inside large padding |
| 9 | Error Recovery | 2 | "Ingen markører matcher." is a dead end; booking empty state only links out |
| 10 | Help and Documentation | 2 | Key buyer questions (when do I get results, cancellation, duration, consultation included) are unanswered in the customer FAQ |
| **Total** | | **24/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: Authored for Pandonia, not category-interchangeable. The report's own visual language (zoned GLU bar, hexagon value, six-system radar, green/yellow/red range cards), the Arimo/Tinos editorial pairing, square buttons, hairline rules and an acid accent held to chips and dots are specific. Where it slips is page-level storytelling: after the content cuts the homepage is a slogan hero followed by an inventory list, and some pages carry more frame than content.

**Deterministic scan**: 113 findings in preview/index.html, 120 in the booking preview (exit 2). Most are false positives from the hidden review layer (.pl, .revonly, .phTag), hidden .mCut blocks and hidden routes. Real, rendered: tracked-caps labels at 9.5–10.5px (footer column heads, rail card heads, comparison row labels, system context, pricing tab subs), the placeholder "fx kolesterol" at 4.4:1, numbered labels on Sådan (03 missing, 04 twice), thin-border-plus-wide-shadow on the six rail cards, the infinite marquee, and gradient text on "It's the cheapest way…" (deliberate brand device). 0 console errors, 0 failed requests, no horizontal overflow on any view.

**Visual overlays**: injected in headless Chromium only; no user-visible overlay exists.

## Overall Impression

A disciplined, product-specific identity whose components are better than its page structure. The single biggest opportunity: make the site reachable and dependable (keyboard routing, back button, consistent numbers) and lift the label sizes, without touching the identity.

## What's Working

1. The report as hero component (`.rbar`, `.rcards`, radar) teaches how to read a result before purchase.
2. A disciplined type and ink system that holds across all routes and both languages.
3. Honest labelling of examples and solid interaction details (booking guided scroll, tablist, rail).

## Priority Issues

- **[P0] Internal navigation is not keyboard-reachable** — ~40 router links are `<a>` without `href`; Tab skips header, menu and footer route links; screen readers do not list them. Fix: real hash hrefs + history + title + focus on route change. `harden`
- **[P0] Marker count contradicts the promise** — hero "35+" vs list "15", which includes panels and a product; markers do not point to the test that contains them. Fix: retitle/split the list and link each marker to its tests. `clarify` (content — needs Pandonia's decision)
- **[P1] Homepage has no price, process or doctor beat; desktop hero leaves the right 38% empty** after the hidden card. `layout` (structural — needs Pandonia's decision)
- **[P1] Sådan fungerer det skips 03 and repeats 04** after the analysis section was replaced by "Test.". `clarify`
- **[P1] Booking preview: demo choice is repeated in EasyPractice; no "where" step; radios lose focus on arrow keys; mobile menu does not contain focus.** `harden` + `onboard`

## Persona Red Flags

**Jordan (first-timer)**: no price on the homepage; "Highway"/"Waste" mean nothing; unselected pricing tabs look disabled on phones.
**Riley (stress tester)**: 35+ vs 15; "fem minutter" vs 10/15 min; "Glukose Monitorering" listed as a marker; red ▼ at 97,0; prototype bar and "— afventer" legal links visible.
**Casey (mobile)**: no booking CTA in the header on phones; ~900px of list before any reason to book; footer/menu/inline links 28–36px tall.
**Mette, 45, Vesterbro, first check, worried about cholesterol**: search "kolesterol" never surfaces the 1.300 kr. Blodsukker- og Kolesteroltest; area coverage not on the homepage; no fasting reminder at booking.

## Minor Observations

- `.mkbody dd` keeps the default 40px indent; `#mkf` placeholder not localised; two h1 on the homepage.
- `.idx` wraps awkwardly at 375; disabled booking CTA reads as a broken grey button; `.bkSvc` selected state uses a gradient wash.
- All six route images load eagerly (733 KB) though one is visible; Google Fonts requests unused faces.
- Status in report graphics is colour-only; change markers below 3:1.

## Questions to Consider

- Should the homepage sell (price, process, doctor) or index (markers)?
- Should the report's English system names lead on the Danish site for first-timers?
- Should a worried visitor be led to the focused test or the full Health Test?
