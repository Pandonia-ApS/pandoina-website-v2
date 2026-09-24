/**
 * DESIGN CONTENT — /din-rapport
 *
 * The result experience explained BEFORE purchase.
 * All numbers here are demonstration data and are labelled as such in the UI.
 * No medical interpretation is invented.
 */

export const reportOpening = {
  heading: 'Det, du får, er ikke en liste med tal.',
  standfirst:
    'Det er en rapport, hvor hver måling står sammen med sit referenceområde, en forklaring på almindeligt dansk, og — hvis du vil — en læge der læser den med dig.',
} as const;

/** The example marker panel. Demo values, visibly labelled. */
export const demoMarker = {
  label: 'Sådan ser en markør ud i rapporten',
  name: 'Eksempelmarkør',
  demoValue: 78,
  demoUnit: 'enhed',
  demoRange: { low: 30, high: 160, scaleMin: 0, scaleMax: 250 },
  demoStateLabel: 'Inden for området',
} as const;

/** Four principles about how a range is read. Rows on rules, not a feature grid. */
export const rangePrinciples = [
  {
    title: 'Hver måling har sit eget område',
    body: 'Ikke en karakter, ikke en farve der dømmer. Du kan se præcis hvor du ligger, og hvor langt der er til kanten.',
  },
  {
    title: 'Nogle markører har ikke ét område',
    body: 'Forhold mellem to værdier, eller markører der kun betyder noget sammen med andre, vises uden bånd. Rapporten siger det, i stedet for at lade som om.',
  },
  {
    title: 'Referenceområder kan variere',
    body: 'Hvor køn eller alder har betydning, vises begge områder — så du kan se, at de er forskellige.',
  },
  {
    title: 'Over tid',
    body: 'Tester du igen, lægger den nye måling sig oven på den gamle. Retningen er ofte mere interessant end tallet.',
  },
] as const;

export const scoreSection = {
  label: 'Din Pandonia Score',
  demoScore: 78,
  heading: 'Samme figur, hele vejen igennem.',
  body: 'Din samlede score og de seks områdescorer er tegnet på præcis samme måde som en enkelt markør. Har du forstået én, har du forstået dem alle.',
} as const;

export const consultationSection = {
  heading: 'Og så er der samtalen.',
  body: 'Tyve minutter online med en læge, der har læst din rapport på forhånd. I gennemgår den sammen og finder ud af, hvad der giver mening at gøre — og hvad der ikke gør.',
  linkLabel: 'Se hvad vi måler',
  linkHref: '/hvad-vi-maaler',
} as const;

// ---------------------------------------------------------------------------
// /om-pandonia
// ---------------------------------------------------------------------------

export const about = {
  heading: 'Vi ville gerne gøre det nemmere at se efter.',
  standfirst:
    'Pandonia er et lille hold i København. Vi tager blodprøver hjemme hos folk, analyserer dem i vores eget laboratorium og hjælper med at forstå, hvad der står i svaret.',
  sections: [
    {
      title: 'Hvorfor hjemme',
      body: [
        'De fleste udskyder en blodprøve, fordi den koster en formiddag. Venteværelse, transport, fri fra arbejde. Vi flyttede prøven hen til køkkenbordet, fordi det er den eneste måde at gøre den til noget, man faktisk får gjort.',
        'Fem minutter, og dagen fortsætter.',
      ],
    },
    {
      title: 'Hvorfor vores eget laboratorium',
      body: [
        'Det havde været billigere at sende prøverne videre. Men så ville svaret komme om en uge, og det ville ikke længere handle om den dag, prøven blev taget.',
        'Laboratoriet ligger på Langebrogade. Det er en beslutning, ikke en detalje.',
      ],
      link: { href: '/saadan-fungerer-det#laboratoriet', label: 'Se hvad der sker i laboratoriet' },
    },
    {
      title: 'Modellen',
      body: [
        'Pandonia Health-modellen er udviklet med udgangspunkt i det, der kaldes the four horsemen of aging — de fire største helbredsudfordringer, der oftest forbindes med alderdom.',
        'Vi kan ikke love beskyttelse mod dem. Modellen hjælper dig med at opdage og følge dine egne tendenser, så du kan træffe valg på et oplyst grundlag frem for et gæt.',
      ],
      sourceNote: 'Omskrevet fra Pandonias egen tekst',
    },
  ],
  /**
   * Phase 5 design review: this page was the most text-heavy on the site.
   * Resolution (Phase 6 §9): a LYS-01 light frame is inserted between the two
   * "hvorfor" sections rather than cutting a section — it fixes the rhythm
   * without removing content Pandonia may want.
   */
  breakAfterSection: 0,
  breakImageId: 'LYS-01',
  team: {
    heading: 'Holdet',
    lead: 'Seks mennesker i København. Du møder nogle af dem personligt.',
    members: [
      { name: 'Benedikte Halle', role: 'Læge', imageId: 'HOLD-01' },
      { name: 'Deborah Saren', role: 'Bioanalytiker · blodprøvetager', imageId: 'HOLD-02' },
      { name: 'Carol Melo', role: 'Leder af forskningsafdelingen', imageId: 'HOLD-03' },
      { name: 'Laura D. Ellis-Aguilar', role: 'Biomedicinsk forsker', imageId: 'HOLD-04' },
    ],
    others: 'Cecilie Lange, projektleder · Victor Prehn, SoMe og branding',
    consentNote: 'Navne og titler verificeret · portrætter kræver samtykke',
  },
  closing: {
    heading: 'Healthier in body, happier in soul, longer in life.',
    note: 'Pandonias egen linje',
  },
} as const;
