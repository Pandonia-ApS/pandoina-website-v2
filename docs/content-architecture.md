# Content architecture

Two content layers, kept in separate folders so the difference shows up in a
diff and in a pull request's file list.

| | `src/content/` | `src/data/clinical/` |
|---|---|---|
| Holds | editorial copy, navigation, products, image manifest | biomarkers, health areas, biological systems, medical and operational claims |
| Who edits | design, marketing, engineering | **Pandonia's clinicians only** |
| Validated? | no | yes — every field is gated |
| Can it block a build? | no | yes |

If you are unsure which layer something belongs in, ask: *could a wrong value
here mislead someone about their health?* If yes, it is clinical.

---

## `src/content/` — design content

| File | Owns |
|---|---|
| `navigation.ts` | primary nav, utility nav, footer groups, the one CTA label, contact block |
| `home.ts` | the eleven homepage beats — hero fragments, section headings, editorial copy |
| `process.ts` | `/saadan-fungerer-det` stage words and structure |
| `report.ts` | `/din-rapport` copy, demo values, and all of `/om-pandonia` |
| `faq.ts` | FAQ grouped by journey stage; answers may *reference* clinical fields |
| `products.ts` | products, prices, booking refs, the post-booking sequence |
| `images.ts` | the image manifest — every frame declared before it exists |

Copy here can be rewritten freely. It carries no medical weight.

**One deliberate crossover:** `faq.ts` imports clinical fields rather than
copying their text. An FAQ answer about preparation renders the *same*
`claims.preparation` field the process page renders, so the two cannot drift.

---

## `src/data/clinical/` — clinical content

| File | Owns |
|---|---|
| `types.ts` | `ClinicalField`, the three constructors, and the domain types |
| `biomarkers.ts` | ~34 markers. 6 named, 1 with real copy. |
| `health-areas.ts` | Layer 1 — the navigation layer. 3 named, 3 pending. |
| `biological-systems.ts` | Layer 2 — the Pandonia model. All 6 verified; 2 flagged for terminology review. |
| `claims.ts` | product facts, operational claims, scores, legal copy |

See [clinical-content.md](clinical-content.md).

---

## The two-layer taxonomy

Approved in Phase 3 Revision B. **Health areas navigate. The Pandonia model
explains.**

```
Layer 1 — health areas          Layer 2 — biological systems
Hjerte og kar                   signalering
Blodsukker og stofskifte        transport
Hormoner                        fordøjelse      ← terminology review
[three pending]                 energi
                                immunforsvar
                                affaldssystem   ← terminology review
```

### It is not a hierarchy

A marker belongs to one or more areas **and** one or more systems, and the two
cut across each other. Vitamin D touches immunity, bone strength and mood —
three concerns, one measurement.

Consequences in code:

- `Biomarker.areas` and `Biomarker.systems` are both **arrays**.
- Layer 1 is the URL structure. Layer 2 is a *field on the marker record*.
- Layer 2 is never a link target, never a breadcrumb, never navigation. It is
  rendered in mono, under a rule, labelled `Bag dette område`.
- No URL will ever read `/hormoner/signalering/tsh`.

### The one question that could change this

If the six *scores* turn out to be computed per biological system rather than
per health area, Layer 2 becomes the scoring model and Layer 1 is navigation
only. The layout survives either way — that was deliberate — but the labelling
on `/din-rapport` would have to change. Tracked as `claim.scoreBasis`.

---

## Adding a biomarker

```ts
{
  slug: 'ferritin',
  name: 'Ferritin',
  nameEn: 'Ferritin',
  synonyms: ['ferritin', 'jern', 'jernlager', 'iron'],  // lay terms matter most
  pronunciation: 'fer-i-tin',                            // only where it helps
  isSignature: true,
  ...pending('ferritin'),
  // then override each field as it is verified
}
```

`synonyms` is the highest-value invisible field on the site. **"Langtidsblodsukker"
must find HbA1c.** Someone who knows the lay term but not the clinical one is
exactly the person Layer 1 exists for.

`pending(slug)` generates the standard 11-field placeholder set so a new marker
starts correctly gated. Override fields as they are approved.

---

## Adding a health area

When Pandonia names areas 4–6, change `placeholder(...)` to
`requiresReview(...)` or `verified(...)` in `health-areas.ts`. The homepage
list, the `/din-rapport` score rows and the area chapters all read from the same
array — nothing else needs touching.

Until then the UI renders explicit `AFVENTER` rows. **Showing a gap is honest.
Inventing a clinical taxonomy is not.**

---

## Adding a page

1. `src/app/<route>/page.tsx`, server component, export `metadata`.
2. Compose from `Section` / `Split` / `Bleed`. Pick `ground` and `density` so
   the page does not repeat the previous section's combination.
3. Editorial copy → `src/content/`. Clinical fact → `src/data/clinical/`.
4. Add the route to `src/app/sitemap.ts` and, if it belongs there, to
   `src/content/navigation.ts`.
