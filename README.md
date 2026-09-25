# Pandonia — website v2

Complete redesign: design system, content architecture, clinical content gate,
bilingual production codebase, and a clickable preview.

**Nothing here has been built or run.** Node is not installed on the machine
this was authored on, so `npm install`, `tsc`, `next build` and the clinical
validator have never executed. Treat the TypeScript as reviewed-but-unverified.
The preview under `preview/` is plain HTML and does run.

---

## What is in here

| Path | What it is | State |
|---|---|---|
| `preview/index.html` | Clickable preview — 7 routes × 2 languages, real navigation, real imagery | **Works. Open it in a browser.** |
| `src/` | Next.js 15 App Router codebase, TypeScript strict, Tailwind | Never compiled |
| `scripts/validate-clinical.ts` | Build-time gate that fails the build on unapproved clinical content | Never run |
| `public/images/` | 12 photographs — 11 real Pandonia, 1 licensed. See `IMAGE-LICENCES.md` | Final crops |
| `docs/` | Clinical gate, i18n, content architecture, image manifest, translation register, QA | Current |
| `design/` | The design documents from each phase of the engagement, as standalone HTML | Archive |

Start with `preview/index.html`, then `docs/clinical-content.md`.

---

## The preview

Open `preview/index.html` directly in a browser. No build step, no server.
It loads its photographs from `../public/images/`, so keep the repository
structure intact.

It covers all seven routes in both languages:

| | Danish | English |
|---|---|---|
| Home | `/da` | `/en` |
| What we test | `/da/hvad-vi-maaler` | `/en/what-we-test` |
| How it works | `/da/saadan-fungerer-det` | `/en/how-it-works` |
| Your report | `/da/din-rapport` | `/en/your-report` |
| About | `/da/om-pandonia` | `/en/about-pandonia` |
| FAQ | `/da/faq` | `/en/faq` |
| Book | `/da/book` | `/en/book` |

Routing is simulated in one file — the strip at the top prints the URL each
route would have in production. The language switch holds your current page.

External links are real: booking goes to `system.easypractice.net/book/pandonia`,
login to `.../book/pandonia/center`.

---

## The clinical gate

The single most important rule in this codebase:

> **The website must never deploy fabricated clinical information by accident.**

Every clinical statement is a typed field carrying a status — `verified`,
`placeholder` or `requires_review` — plus its source. `scripts/validate-clinical.ts`
runs as `prebuild`, walks the clinical modules, and exits non-zero if anything
unresolved would reach a production-critical context.

`<ClinicalText>` has **no `fallback` prop**. There is no way to render
plausible-looking medical copy when the real copy is missing; the component
renders a visible placeholder instead. This is structural, not a convention.

Approval is **per locale**. A verified Danish sentence is not a verified English
one — translating an approved sentence produces an unapproved sentence.
`blocksBuild()` returns true if *either* locale is unresolved.

Do not weaken this to make a build pass. Details in `docs/clinical-content.md`.

---

## Unresolved product facts

These are flagged in the UI rather than silently decided. They need answers
from Pandonia, not from a designer or a developer.

| Question | The conflict |
|---|---|
| How many biomarkers? | 30 vs 34 vs "over 30" — three published figures for one product |
| How long does the draw take? | Site says 5 minutes; the booking system allocates 10 and 15 |
| Is 2–4 hours typical or best case? | Presented as a promise with no stated basis |
| English names for the six systems | Two published English label sets disagree on three of six |
| The six scores cluster 94.9–97.2 | On a 0–100 band all six ticks collapse — the scale or the scoring is wrong |
| Which portrait is which person? | Nine studio portraits, none matchable to a name from public material |

The biomarker count blocks the numeral variant of the hero headline. The
preview ships the variant that does not depend on it.

---

## Getting it running

```bash
npm install
npm run dev
```

Expect the first `npm run build` to fail on the clinical validator. That is the
validator working. To preview with placeholders visible:

```bash
PANDONIA_ALLOW_PLACEHOLDERS=true npm run build
```

Never set that in production.

---

## Before launch

- Node has never run here — budget time for a first real `tsc` and `next build`
- The four legal pages have no content; they are inert labels in the preview, not links
- 5 placements are art-direction plates marked "new shoot required" — laboratory ×4, the doctor ×1
- Two client-supplied images have **no documented licence** — the sample-in-transit frame and the building beside the laboratory address; clear the rights or replace them; see `IMAGE-LICENCES.md`
- The building photograph is presented as Langebrogade 3A but that match is **unverified**
- The doctor portrait is upscaled 4.9× from a 164px avatar and will look soft — **ask for the original file**
- The product render on the homepage carries two empty placeholder panels
- Identifiable people appear on a public page; confirm consent for web use
- The hero photograph is a licensed holding image, not Pandonia's own
- Team portraits need consent as well as name pairing
- Danish URLs move under the `/da/` prefix; 301s are listed in `docs/i18n.md`
