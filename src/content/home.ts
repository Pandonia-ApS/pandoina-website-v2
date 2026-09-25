/**
 * DESIGN CONTENT — homepage.
 * Editorial copy only. Every clinical or product fact is imported from
 * src/data/clinical/ so the build gate can see it.
 */

/**
 * BEAT 01 — hero. V2 Editorial / Klokken × Dagslys.
 * The timestamps are a RECORD of a day, not a countdown. They are the
 * smallest type on screen, they never animate, and no duration is stated.
 */
export const hero = {
  fragments: [
    { time: '08.40', text: 'En tirsdag.', indent: '0%' },
    { time: '09.30', text: 'Et køkkenbord.', indent: '6%' },
    // The count is clinical and unresolved — the component renders the
    // review treatment rather than silently choosing 34.
    { time: '12.14', text: 'Fireogtredive svar.', indent: '2%', countIsClinical: true },
  ],
  standfirst:
    'Blodprøven tages hjemme hos dig i København og analyseres i vores eget laboratorium på Langebrogade. Du får tallene — og en læge til at læse dem sammen med dig.',
  secondaryLabel: 'Se hvad vi måler',
  secondaryHref: '/hvad-vi-maaler',
} as const;

/** BEAT 02 — the proof line. Mechanism, not duration (Phase 3 Rev B speed audit). */
export const groundLine = [
  'Eget laboratorium · København',
  'Læge inkluderet',
  'Hjemme hos dig',
] as const;

/** BEAT 03 — why. The quietest screen on the site. */
export const why = {
  heading: 'De fleste ting kroppen fortæller, fortæller den stille og i god tid.',
  body: 'Et blodprøvesvar er ikke en dom. Det er en beskrivelse af, hvor du står lige nu — og hvad der har flyttet sig, siden sidst du så efter. Det meste vil være, som det skal være. Det er også et svar.',
  note: 'Ingen henvisning · ingen venteliste',
} as const;

/** BEAT 04 — one marker in depth. Depth before volume. */
export const featuredMarker = {
  eyebrow: 'Én af markørerne',
  slug: 'd-vitamin',
  linkLabel: 'Se alle markører',
  linkHref: '/hvad-vi-maaler',
} as const;

/** BEAT 05 — the breath. No heading, no CTA, no link. */
export const breath = {
  caption: 'Et køkken i København, ti minutter i ni.',
} as const;

/**
 * BEAT 06 — the day. The page's one orchestrated motion moment.
 * This is the ONLY place on the site where clock times appear as a sequence;
 * /saadan-fungerer-det uses stage words instead (Phase 5 §03).
 */
export const day = {
  heading: 'Prøven tages, mens kaffen stadig er varm.',
  standfirst: 'Fra din bordkant til dit svar — uden at du skulle andre steder hen.',
  moments: [
    {
      time: '08.40',
      title: 'Deborah ringer på',
      body: 'Fem minutter ved køkkenbordet. Så er dagen din igen.',
      imageId: 'HAND-02',
      offset: false,
    },
    {
      time: '09.05',
      title: 'Prøven kører ind',
      body: 'Til laboratoriet på Langebrogade.',
      imageId: 'OBJ-02',
      offset: true,
    },
    {
      time: '09.30',
      title: 'Analysen begynder',
      body: 'Vi laver den selv. Det er hele forskellen.',
      imageId: 'LAB-01',
      offset: false,
    },
    {
      time: '12.14',
      title: 'Rapporten ligger klar',
      body: 'Dine tal, dit sprog.',
      imageId: 'SKAERM-01',
      offset: true,
      isArrival: true,
    },
    {
      time: '16.00',
      title: 'Benedikte gennemgår den',
      body: 'Tyve minutter, inden du kører hjem.',
      imageId: 'PORTRAET-01',
      offset: false,
    },
  ],
  linkLabel: 'Hele forløbet, trin for trin',
  linkHref: '/saadan-fungerer-det',
} as const;

/** BEAT 07 — the six areas. Layer 1 leads; Layer 2 is one mono line beneath. */
export const areasPreview = {
  heading: 'Seks områder. Én blodprøve.',
  standfirst: 'Du finder dine tal der, hvor du ville lede efter dem.',
  layerTwoLabel: 'Bag områderne — Pandonia-modellen',
  linkLabel: 'Se hele listen',
  linkHref: '/hvad-vi-maaler',
} as const;

/**
 * BEAT 08 — the report.
 * Phase 5 flagged 07→08 as the flattest stretch: two deep-forest data
 * sections in sequence. Implementation decision (Phase 6 §10): keep them as
 * designed, but give 08 a top hairline and extra air so it reads as a second
 * movement rather than a continuation. Rationale in docs/README.
 */
export const reportPreview = {
  scoreLabel: 'Din Pandonia Score',
  demoScore: 78,
  demoAreaScores: [82, 74, 80] as const,
  linkLabel: 'Se hvordan rapporten ser ud',
  linkHref: '/din-rapport',
} as const;

/** BEAT 09 — the doctor and the laboratory. Mechanism before consequence. */
export const doctorAndLab = {
  heading: 'Tallene bliver først til noget, når nogen sætter dem ind i dit liv.',
  body: 'Benedikte Halle er læge hos Pandonia. Hun gennemgår din rapport med dig i tyve minutter og peger på det, der er værd at gøre noget ved — og det, der ikke er.',
  labLabel: 'Laboratoriet',
  linkLabel: 'Se hvad der sker i laboratoriet',
  linkHref: '/saadan-fungerer-det#laboratoriet',
} as const;

/** BEAT 10 — price. Rows on rules, never cards. */
export const pricing = {
  heading: 'To måder at begynde på.',
  footnote:
    'Enkelte tests fra 1.000 kr., hvis du vil begynde mindre. Også som virksomhedsordning.',
  linkLabel: 'Se alle priser',
  linkHref: '/book',
} as const;

/** BEAT 11 — close. The only centred type on the entire page. */
export const close = {
  heading: 'Kend din krop. Før den siger til.',
  note: 'København',
} as const;
