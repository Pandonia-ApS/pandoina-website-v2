# Clinical content gate

> A visually convincing prototype with fake science is worse than one with
> clearly labelled placeholders. This document describes the mechanism that
> makes that impossible to get wrong by accident.

---

## The rule

**No clinical statement enters the site as a plain string.**

Every clinical fact is a `ClinicalField` declared in `src/data/clinical/`,
carrying its own status. Components read it through `<ClinicalText>`, which has
**no `fallback` prop**. A developer cannot supply plausible-looking copy to fill
a gap, because the component will not accept it.

---

## Three statuses

| Status | Meaning | Ships? |
|---|---|---|
| `verified` | Quoted from a Pandonia source, or signed off by their clinicians. Carries `source`. | ✅ |
| `placeholder` | No content exists. Carries `intent` (what the copy will *do*) and `needs` (what must be confirmed). Never carries medical content. | ❌ blocks build |
| `requires_review` | Draft copy exists but has not been approved. Carries a `value` *and* a `needs`. | ❌ blocks build |

`requires_review` exists because "we have words" and "the words are approved"
are different things. The health disclaimer is drafted; a clinician has not
signed it. It blocks the build exactly like an empty field.

---

## Declaring a field

```ts
import { verified, placeholder, requiresReview } from './types';

// Quoted from Pandonia's own booking system.
summary: verified({
  id: 'marker.d-vitamin.summary',
  value: 'Lavt D-vitamin er udbredt i Danmark, især i vinterhalvåret.',
  source: 'Pandonia booking system, D-vitamin Test product description',
  appearsOn: ['/hvad-vi-maaler', '/'],
}),

// Nothing written yet. `intent` describes the JOB, never the content.
whatItMayIndicate: placeholder({
  id: 'marker.hba1c.whatItMayIndicate',
  intent: 'Phrased as "kan pege på", never as a diagnosis and never a list of disease names.',
  needs: 'Clinical sign-off.',
  appearsOn: ['/hvad-vi-maaler'],
}),
```

`intent` is a note to the writer. It is rendered in preview builds, so keep it
free of anything that could be mistaken for medical copy.

---

## Rendering

```tsx
<ClinicalText field={marker.whatItIs} className="text-body" />
```

Behaviour:

| State | Development / preview | Production |
|---|---|---|
| `verified` | the value | the value |
| `placeholder` / `requires_review` | dotted rule, muted ink, red `AFVENTER` tag, `data-clinical-id` attribute | **renders nothing** |

Production renders nothing rather than anything invented. This is a backstop —
the build should already have failed.

Three components:

- `<ClinicalText>` — prose
- `<ClinicalValue>` — inline value with an em-dash fallback
- `<ClinicalTag>` — a status badge for naming an absence in place

---

## The build gate

`scripts/validate-clinical.ts` runs as npm's `prebuild`, so it is impossible to
run `npm run build` without it.

It deep-walks every export of the four clinical modules looking for the
`__clinical` marker, so **there is no registry to keep in sync** — a new field
is picked up the moment it is declared.

```bash
npm run validate:clinical          # exits 1 while anything is unresolved
npm run validate:clinical:report   # prints the register, always exits 0
```

Output groups unresolved fields by module and prints each field's `needs` and
the routes it appears on. That report is the checklist to hand to Pandonia.

### The escape hatch

```bash
PANDONIA_ALLOW_PLACEHOLDERS=true npm run build
```

Warns loudly, exits 0, and renders the review treatment. **For internal preview
deploys only.** Never set it in the production environment; consider asserting
in CI that it is unset for the production target.

### Suggested CI

```yaml
- run: npm ci
- run: npm run typecheck
- run: npm run lint
- run: npm run validate:clinical     # blocks the merge
```

---

## What is verified today

**One statement**, quoted verbatim from Pandonia's booking system:

> Lavt D-vitamin er udbredt i Danmark, især i vinterhalvåret. Påvirker
> immunforsvar, knoglestyrke og mental balance.

Plus operational claims quoted from the live FAQ — coverage area, preparation,
the morning rationale, the phlebotomist's supervision, the consultation
mechanics, the corporate programme, and the laboratory itself.

---

## What is blocked

31 fields across eight groups. The five that block the most:

1. **The marker list** — 6 of ~34 names recovered; none of the rest exists publicly.
2. **Marker → health area mapping** — nothing assigned. Decides which chapter each row sits in.
3. **Reference ranges** — none published. *Every band on the site renders `unavailable` until these exist.*
4. **The three missing health area names** — the concept gives three; Pandonia must name three more.
5. **What the six scores are scored on** — decides whether the two taxonomy layers are independent.

Also blocked: the biomarker count for an exact figure — the site now states "30+", chosen 25 Sep 2026 as the conservative form of three published figures (30, 34, "over 30") —
laboratory accreditation, whether the consultation is included in the 3.500 kr.
test, the `affaldssystem`/`detoxification` and `fordøjelse` terminology reviews,
and all legal copy.

Run `npm run validate:clinical:report` for the current list with `needs` notes.

---

## Two rules for whoever maintains this

**1. Never downgrade a field to a plain string to unblock a build.**
If you find yourself typing medical copy into a `.tsx` file, stop. Either the
content is approved — in which case declare it `verified` with its `source` —
or it is not, and the build is doing its job.

**2. `intent` is not content.**
It describes what the sentence will do and roughly how long it will be. It must
never read as a medical claim, because it is rendered in preview builds and
someone will eventually screenshot one.
