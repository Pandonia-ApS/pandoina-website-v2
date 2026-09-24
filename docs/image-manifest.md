# Image manifest

20 frames. Realistically **one shoot day** plus a half-day at the laboratory —
thirteen of the twenty are the same Copenhagen kitchen in the same morning.

Machine-readable source: **`src/content/images.ts`**. This file is the human
version for the photographer and the producer.

---

## How to deliver

1. Export each frame at **desktop** and **mobile** crops as separate files.
   The mobile crop is a *recrop*, never a rescale — it is specified per frame.
2. Name them by shot id: `ARM-01.jpg`, `ARM-01-mobile.jpg`.
3. Drop them in `/public/images/`.
4. Set `src` on the entry in `src/content/images.ts`.

The art-direction plate is replaced automatically. **No layout dimension
changes** — every frame's aspect ratio is already declared and reserved, so
there is no cumulative layout shift when the images arrive.

Next/Image handles AVIF + WebP, four widths (390 / 780 / 1200 / 1800), lazy
loading below the fold, and `fetchpriority` on the two hero frames.

---

## Global direction

> Shoot it as if you were there and nobody asked you to come. Observed, not
> staged. If a frame looks arranged, it is wrong.

- **Light:** natural only. One source. No fill, no reflector, no flash, no LED.
  Shoot *into* the light, not with it. Deep shadow is permitted and wanted.
- **Grade:** lifted blacks, no crushed contrast, reds slightly desaturated so
  skin stays natural. No teal-and-orange.
- **Casting:** real Danish adults 30–65. No model casting, no styling beyond
  ordinary. **Eyes to the lens exactly once on the entire site** (PORTRAET-01).
- **Wardrobe:** cream, sand, oatmeal, olive, warm grey. No white shirts, no
  black, no logos, no pattern, no blue.
- **Locations:** real Copenhagen apartments. Worn parquet, a radiator under a
  window, a tiled kitchen, one plant, ceramic rather than glass. Never a set.
- **Corners are square.** No rounded frames anywhere on the site.

### Never

Laboratories shot as cleanrooms · white coats · scrubs · stethoscopes ·
clipboards · microscopes · petri dishes · DNA helices · molecules · glowing
organs · body diagrams · pill bottles · supplement flat-lays · gym tropes ·
smoothies · smiling at the camera · group shots in a bright room ·
before-and-after bodies · white cyclorama · any frame lit from two directions ·
**the needle, or blood.**

---

## Priority 1 — the site does not work without these

| ID | Subject | Where | Desktop | Mobile |
|---|---|---|---|---|
| **ARM-01** | Forearm and inner elbow, palm up, hard raking sidelight so skin reads as topography. Directly above. Cuts at wrist and mid-upper-arm. f/1.8. | `/` hero, `/hvad-vi-maaler` | 3:4 | 16:10 |
| **HAND-01** | A hand at rest on worn oak beside a ceramic cup, tourniquet coiled soft at the far edge. Window light raking from upper left, falling to shadow at right. Table height. f/2. | `/saadan-fungerer-det` opening | 16:7 | 4:5 |
| **HALS-01** | Neck, jaw underside, collarbone. Cold low **winter** daylight from the side — the season must be legible. Slightly below, looking up. Jumper collar entering bottom of frame. | `/` beat 04, `/hvad-vi-maaler` | 4:5 | 3:2 |
| **RUM-01** | The whole kitchen, person small and off-centre at the far left, not looking at camera. Window filling the right third, blown out. Standing height from a doorway, dark out-of-focus door frame entering left. | `/` beat 05 | 3:2 | **4:5 — the wide frame loses the person on a phone** |
| **LAB-01** | A rack of tubes on a working bench, a hand entering frame to label one. **A window must be in frame or clearly the light source.** f/2 — the room must not be readable as a room. | `/` beat 06, `/saadan-fungerer-det` | 3:4 | 3:4 |
| **PORTRAET-01** | Benedikte Halle, three-quarter, cropped at the shoulder. Soft window light from the left, shadow side intact. No coat, no props. Between expressions, not mid-smile. **The one frame where eyes meet the lens.** | `/` beat 09, `/din-rapport` | 4:5 | 4:5 |
| **SKAERM-01** | A phone face-up on a desk, report visible but **not legible**. Flat overhead midday light — cooler than the morning frames. Steep angle. f/2.2. No face reacting, no legible interface. | `/` beat 06, `/din-rapport` | 3:4 | 3:4 |
| **OBJ-01** | The filled tube upright on the kitchen table, label facing slightly away. Backlit so the edge catches; room falls to warm dark. No hands, no white surface, **no product lighting.** | `/saadan-fungerer-det` | 16:7 | 4:5 |

## Priority 2

| ID | Subject | Where |
|---|---|---|
| **HAND-02** | Two pairs of hands at the table — tourniquet being fastened, or plaster smoothed afterwards. Slight motion blur preferred over a frozen pose. No faces. **Never the needle.** | `/` beat 06 |
| **OBJ-02** | The tube in a transport bag, on a seat or in a hand. Copenhagen streets visible but unreadable through glass. **The one frame where background motion blur is required.** No branded vehicle, no landmark. | `/` beat 06 |
| **LAB-02 / LAB-03** | Second and third laboratory frames — bench detail, a hand labelling, mid-task. Same treatment as LAB-01. | `/saadan-fungerer-det#laboratoriet` |
| **RUM-02** | A second wide room, different apartment or different hour from RUM-01. Same rules. | `/om-pandonia` opening |
| **HOLD-01…04** | Team frames. PORTRAET-01 treatment but **eyes away from the lens**. Benedikte Halle, Deborah Saren, Carol Melo, Laura D. Ellis-Aguilar. | `/om-pandonia` |

## Priority 3 — connective tissue

| ID | Subject | Where |
|---|---|---|
| **LYS-01** | No person. Window light crossing a wooden table, a curtain moving, steam off a cup, a radiator under a sill. **Shoot several across the morning for a graded set** — they are cheap and endlessly useful. | `/om-pandonia`, between the two "hvorfor" sections — this frame exists specifically to break a run of text |
| **LYS-02 / LYS-03** | Further light frames for area chapters 5 and 6. | `/hvad-vi-maaler` |

---

## The daylight sequence

Beat 06 on the homepage grades **across the day**, and the light is the only
thing that says time has passed:

```
HAND-02   08.40   low raking dawn
OBJ-02    09.05   morning, moving
LAB-01    09.30   mid-morning, flatter
SKAERM-01 12.14   overhead midday, cooler
PORTRAET-01 16.00 low warm afternoon
```

Shoot them in that order, on that clock. It only works because the story
genuinely fits inside one day.

---

## Production notes

- **Shoot the real draw.** Book a genuine appointment and photograph it. A
  restaged draw will look restaged, and the whole art direction rests on being
  observed.
- **Consent.** Deborah Saren and Benedikte Halle appear by name and face across
  three pages. The subject whose arm is photographed needs a release for
  medical-adjacent imagery. Settle this before the shoot.
- **The laboratory is a workshop, not a cleanroom.** A window in frame,
  daylight rather than overhead fluorescents, worn surfaces, shallow depth of
  field. The value of the fact is that it is *here* — a stock cleanroom says
  "this could be anywhere."
- **Copenhagen without tourism.** The city appears as postcodes, a street name
  and a kitchen. No harbour, no Nyhavn, no bicycle in golden hour. This is the
  easiest thing to lose on the day.
- **`/public/og-default.png`** (1200×630) is referenced by metadata and does not
  exist yet. A RUM or LYS frame with the wordmark is the obvious choice.
