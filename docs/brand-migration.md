# Pandonia — brand and content migration

Status: **implemented in the private preview, not committed.** Nothing has been
pushed to GitHub. On approval, the same source builds into the repository.

Sources: `Pandonia_health_report_PDF_design_ap_2.pdf` (3 pages),
`pandonia-feed copy.pdf` (1 page, 12 posts), `pandonia-lp.pdf` (1 long page).

---

## 1 · What the three documents are

| Document | What it is | Use on the consumer site |
|---|---|---|
| Feed | 12 Instagram posts, "Vol. 01 · Issue No. 001" | Tone, typography, image grading. Consumer and B2B mixed. |
| Landing page | A **B2B** clinic/partner page — "For clinics & practitioners", partner portal, panel pricing | Brand, layout rhythm, lab language. **Not** its offers or claims. |
| Health report | A **real patient's** report — cover carries a name and date | The data-visualisation language. **No** patient values or name reused anywhere. |

## 2 · The brand system, extracted

**Typefaces — measured, not guessed.** Both brand PDFs were exported from
Chrome with **Liberation Sans** and **Liberation Serif** embedded — metric
stand-ins for Arial/Helvetica and Times. Google Fonts carries the same designs
as **Arimo** and **Tinos**, so the site now matches the documents on every
platform. If Pandonia has licensed brand fonts behind these, they drop into two
tokens (`--sans`, `--serif`).

The report uses a third, geometric sans. Its font isn't recoverable from the
file; the report components use Arimo.

**Colour — from the PDFs' own fill operators.** Feed and landing page use the
identical palette:

| Token | Hex | Role |
|---|---|---|
| ink | `#0A0A0A` | text, black blocks, CTAs |
| paper | `#FAFAF7` | main ground |
| warm paper | `#F1EDE4` | alternating sections |
| rule | `#E8E3D6` → `#E1DCCE` | hairlines (one step darker so it reads on warm paper) |
| grey | `#6E6E68` → `#65655F` | secondary text — **brand grey fails AA on warm paper (4.4:1); darkened one step to 5.0:1** |
| acid | `#F1EC7A` | the single accent. **1.2:1 on paper**, so only ever a fill behind ink or a dot on black |

Report colours, sampled from the report: optimal `#A7D185`, reference
`#EDD293`, outside `#D7998F`, improved `#8CC28B`, worsened `#E86A68`, radar
fill `#EBF2F8`, callout navy `#141F61`.

Image tones, sampled from the blurred panels: sand glow `#E6D3B6`, taupe
`#AE9880`, copper `#D2B697`, umber `#594734`, charcoal `#27221A`, sage
`#D1D9C5` / `#3E473D`.

**Type roles.**
- Statements and page openers — Arimo 700, tracking −0.045em (`d1`, `d2`)
- Section headings, quiet lines — Tinos, the editorial contrast (`d3`)
- Metadata — Arimo, small tracked capitals (0.16em)
- Wordmark — lowercase `pandonia`, Arimo 700, tight

**Signature devices carried over:** the black statement block with a ghosted
third word; the single acid dot on black; numbered rows on thin rules; square
black CTAs; lowercase wordmark.

## 3 · What changed, page by page

| Page | Changed | Stayed |
|---|---|---|
| All | Tokens, fonts, buttons, wordmark, footer, dark blocks forest → black | Routes, nav, mobile menu, DA/EN, review layer, booking + login links |
| Forside | Hero line in black grotesk, sub shortened · "Kend dine tal." · day sequence labelled 01 Indsamling → 04 Gennemgang · six systems on white with the report radar · report teaser with the GLU bar · closing becomes "Mål. Forstå. Handl." | Hero line you chose · stat strip · day sequence and its times · interactive system rows · pricing block |
| Hvad vi måler | Systems section on white with radar · over-time card is now the report's bar + score trace | Marker explorer, search, moving streams, composition, CTAs |
| Sådan fungerer det | Opens "Hvad der sker med din prøve." · sections labelled Inden / 01 Indsamling / 02 Transport (new, short) / 03 Analyse / 04 Gennemgang | Every existing section and its verified copy |
| Din rapport | Middle rebuilt as the report: overview radar with change arrows · bar anatomy · three range cards · score over time · results worth attention · "if in doubt, book a consultation" | Hero, product photo, conversation, CTAs |
| Om Pandonia | Closing line "A healthy, longer life — measured." | Team, sections, copy |
| FAQ | + "What should I do if I have doubts about my results?" (the report's own answer) | Everything else |
| Priser | Restyled only | Structure, membership, prices |

## 4 · Copy migrated

Direct from the documents, used once each where they fit:
"Know your numbers." · "What happens to your sample." · "Measure. Understand.
Act." + "The third step is yours." · "A healthy, longer life — measured." ·
Collect / Transport / Analyse / Review · the report's range definitions, score
basis, change-arrow explanation and doubt answer.

Not used: "You can't optimise what you haven't measured." (optimise-language),
"Test. It's the cheapest way to a better decision." (comparative claim),
"The number that predicts your heart." (health claim), all partner copy.

## 5 · Requires clinical / commercial verification

| Item | Conflict | What the preview does |
|---|---|---|
| Biomarker count | Feed says **48**. Site says 30+, live Health Test card says 34 | Keeps **30+** |
| Turnaround | Landing page says **48 hours** / "Four steps. Forty-eight hours." Consumer site says 2–4 hours | Keeps consumer copy; 48h is likely the B2B figure — confirm |
| Location | Feed footer: "Copenhagen — Palo Alto" | Not used |
| Lab equipment | "Powered by Randox" | Not used until confirmed |
| Female hormone panel | Feed advertises one; booking system has none | Not used |
| B2B panels | Core 42 markers / 1,290 · Men's 28 / 1,490 · Women's 32 / 1,490 · Longevity 36 / 1,890 · 200+ marker library | B2B only — not on consumer pages |
| Heart claim | "The number that predicts your heart." | Not used |
| Grip strength | Appears in the report's radar page (kgf) | Not described on the site |
| GLU unit | Report guide says **nmol/L**; glucose is mmol/L | Shown as mmol/L, flagged |
| Report tagline | Report cover: "Happier, Healthier, Longer" | Hero keeps "Healthier in body, happier in soul, longer in life." |
| CEO note | Landing page quote is signed "[Name]" | Not used |
| "One Thirty Labs" | Listed under "For consumers" in the landing-page footer | Not used |
| Danish translations | Range definitions, score basis, doubt answer are English in the report | Translated; **Danish needs sign-off** |
| Traffic-light colours | Report uses green / yellow / red | **Adopted** — it is the product's language. Supersedes the earlier no-traffic-light rule |

## 6 · Images

**Stay sharp — documentary Pandonia:** blood draw, apron, premises ×2,
report on laptop, product render, report deck, six team portraits.

**Softened (`gSoft`) — stock standing in documentary slots:** sample case,
analyser, consultation call, home blood draw, tourniquet, building, tube rack,
consultation photo.

**Blurred to atmosphere (`gAtmos`):** hero (licensed holding image) and the
lab interior with unidentified staff — which stops it reading as Pandonia's
own people.

The effect is a rule a visitor can feel: **sharp is Pandonia, soft is
atmosphere.** Reversible per image by removing one class.

## 7 · Accessibility notes

- Brand grey darkened one step for AA on warm paper.
- Ghosted "Act." lifted from ~1.6:1 to 3.2:1.
- Acid never carries meaning on light grounds.
- Radar and trends carry text alternatives; hero image is now decorative.

## 8 · Review round and release

Changes made during review, before approval:

- **Homepage four steps** rebuilt in the landing page's composition — large
  headline left, intro right, four columns under one rule with large
  numerals — and, at the reviewer's request, with the landing page's own text
  and no photographs. See the conflict note in `translation-register.md`.
- **Wordmark** set as "Pandonia" with a capital P, in the header and footer.
- **Header navigation** is now visible from 760px: between 760 and 1139px the
  links sit on a second header row (FAQ after Priser) instead of behind the
  menu button. Phones keep the menu button.

Released to the existing repository, `Pandonia-ApS/pandoina-website-v2`, on top
of v2. The last v2 commit is tagged `v2` (`8852aa4`) so it can be restored.
