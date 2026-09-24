# QA checklist

> **Nothing below has been executed.** Node was unavailable in the environment
> where this codebase was written, so `npm install`, `tsc`, `next build` and the
> clinical validator have never run. Treat every box as unchecked.

Work top to bottom — the build gate will stop you early, which is correct.

---

## 0 · First run

- [ ] `npm install` completes
- [ ] `npm run typecheck` — expect to fix a small number of import/type errors
- [ ] `npm run lint`
- [ ] `npm run validate:clinical` — **expect exit 1**, listing ~31 fields
- [ ] `npm run validate:clinical:report` — exits 0, prints the register
- [ ] `PANDONIA_ALLOW_PLACEHOLDERS=true npm run build` completes
- [ ] `npm run build` **without** the flag still fails ← the gate works

---

## 1 · Clinical gate

- [ ] Placeholders render with dotted rule, muted ink and a red `AFVENTER` tag
- [ ] Every placeholder carries `data-clinical-id` and `data-clinical-status`
- [ ] With `PANDONIA_ALLOW_PLACEHOLDERS` unset, placeholder elements render **nothing** — not an empty box, not a stray label
- [ ] The D-vitamin text is the only clinical prose that renders as normal copy
- [ ] Adding a new `placeholder()` field is picked up by the validator with no registry edit
- [ ] Changing a field to `verified` removes it from the report

---

## 2 · Routes and navigation

- [ ] All seven routes render: `/`, `/hvad-vi-maaler`, `/saadan-fungerer-det`, `/din-rapport`, `/om-pandonia`, `/faq`, `/book`
- [ ] Active nav item shows the forest underline and `aria-current="page"`
- [ ] `/saadan-fungerer-det#laboratoriet` scrolls to the laboratory chapter **and the sticky header does not cover the heading** (`scroll-padding-top: 130px`)
- [ ] `/book#priser` lands on the price rows
- [ ] Footer "Laboratoriet" reaches the anchor
- [ ] 404 renders with working links
- [ ] `/sitemap.xml` and `/robots.txt` resolve and carry the right origin

---

## 3 · Marker explorer

- [ ] Rows expand and collapse; `+` rotates to `×`
- [ ] Multiple rows can be open at once
- [ ] Filter: "kolesterol" → Kolesterolprofil
- [ ] Filter: "langtidsblodsukker" → **HbA1c** (the synonym path — the most important case)
- [ ] Filter: "d-vitamin", "vitamin d", "dvitamin" all match
- [ ] Danish folding: "maaler" matches "måler"
- [ ] No match → the empty state with two suggestions
- [ ] Count line updates and is announced (`aria-live="polite"`)
- [ ] Filtering closes any open row (no orphaned expanded content)
- [ ] Panel rows show the "Panel — indhold ukendt" note
- [ ] Keyboard: Tab to a summary, Enter/Space toggles it
- [ ] Browser find-in-page finds text inside a **closed** row (native `<details>`)

---

## 4 · Mobile — redesigned, not stacked

- [ ] Hero: times sit **above** each fragment, not in a left margin
- [ ] Day timeline: **vertical**, rule down the left edge, times on the rail
- [ ] Marker rows drop the unit and inclusion columns; detail keeps them
- [ ] Range band goes full width with the value above
- [ ] Menu: full-screen deep-forest overlay, serif items, CTA at the bottom
- [ ] Menu closes on Escape and on route change; focus returns to the trigger
- [ ] `aria-expanded` toggles on the trigger
- [ ] Body scroll is locked while the menu is open, restored after
- [ ] **No horizontal scrolling on any page at 390px**
- [ ] Long Danish compounds: "Blodsukker og stofskifte" and "referenceområde" break acceptably at 390px
- [ ] Touch targets ≥ 44px — including inline editorial links

---

## 5 · Accessibility

- [ ] Skip link appears on first Tab and reaches `#main`
- [ ] One `<h1>` per page, no skipped levels
- [ ] Focus ring visible on every interactive element, never removed
- [ ] Filter has a **visible** `<label>`, not a placeholder standing in for one
- [ ] Range state is legible **without colour** — position plus text label
- [ ] Greyscale test: in-range vs out-of-range still distinguishable
- [ ] Contrast: ink-3 `#756C60` on cream measures ≥ 4.5:1 (it was `#8A8175` at 3.4:1 — do not revert)
- [ ] Contrast: no text on deep forest below 0.55 opacity
- [ ] `prefers-reduced-motion`: timeline renders complete, no transforms, no smooth scroll
- [ ] Art-direction plates carry `role="img"` and a label
- [ ] Screen reader: marker rows announce expanded state
- [ ] `lang="da"` on `<html>`; English product names marked `lang="en"` *(not yet done — see limitations)*

---

## 6 · Motion

- [ ] Hero timestamps **never animate** — a record does not perform
- [ ] First viewport is complete on load; nothing waits on an observer
- [ ] Day timeline is the only orchestrated moment; it runs **once**
- [ ] Reveals start at opacity 0.6, never 0 (screenshot and thumbnail safe)
- [ ] No scroll-jacking, no parallax on text, nothing loops

---

## 7 · Design invariants — regression sweep

- [ ] No rounded rectangle creep: 2px on controls, 8px on the one product panel, **0 on photography**
- [ ] No card holds prose
- [ ] No three-equal-column feature grid anywhere
- [ ] No gradients, shadows, glass, glow, icon sets
- [ ] No pills
- [ ] Serif above 44px, sans below 24px
- [ ] No section repeats the previous section's ground **and** density
- [ ] Deep forest used twice on the homepage (beats 07–08) and once per other page — not more
- [ ] `/saadan-fungerer-det` uses **stage words**, not clock times
- [ ] "samme dag" appears at most three times site-wide
- [ ] Only one centred type moment (homepage beat 11)
- [ ] Every number carries its unit or its status tag

---

## 8 · Performance

- [ ] LCP < 2.0s on throttled 4G mobile
- [ ] CLS < 0.05 — aspect ratios reserved before images arrive
- [ ] Total JS < 40 KB (three client components, no animation library)
- [ ] Fonts: four files, subset to Latin + Danish, no visible swap above the fold
- [ ] Lighthouse ≥ 95 performance, 100 accessibility, on `/` and `/hvad-vi-maaler`

*Re-run all of section 8 after real photography lands — the current plates cost
nothing and will flatter the numbers.*

---

## 9 · SEO

- [ ] Unique title and description per route
- [ ] Canonicals correct
- [ ] `/og-default.png` exists (**it does not yet**)
- [ ] No medical structured data published while clinical content is unverified

---

## 10 · Content and integration

- [ ] Every "Vælg tid" opens the external scheduler; **no success state is faked**
- [ ] `Log ind` and `EN` are visibly inert placeholders, not broken links
- [ ] Footer legal routes either exist or are removed before launch
- [ ] Prices match Pandonia's booking system on the day of launch
