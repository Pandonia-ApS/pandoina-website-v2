/**
 * DESIGN CONTENT — products and pricing.
 *
 * Prices are verified from Pandonia's live booking system (23 Sep 2026).
 * What is *included* is partly unresolved — see claims.consultationIncluded.
 *
 * Rows on rules, never cards (Phase 5 §12, fingerprint pass).
 */

export interface Product {
  id: string;
  name: string;
  eyebrow?: string;
  description: string;
  /** DKK incl. VAT. `null` where Pandonia publishes no price. */
  priceInclVat: number | null;
  priceExclVat?: number;
  emphasis: 'primary' | 'secondary';
  /** Booking handoff. See docs/README "Backend integration points". */
  bookingRef: string;
}

export const flagshipProducts: readonly Product[] = [
  {
    id: 'health-test-consultation',
    name: 'Health Test + Consultation',
    eyebrow: 'Anbefales første gang',
    description:
      'Pandonia Score og seks områdescorer, blodprøve hjemme hos dig, og 20 minutters lægekonsultation — booket som én samlet pakke.',
    priceInclVat: 4750,
    priceExclVat: 3800,
    emphasis: 'primary',
    bookingRef: 'health-test-consultation',
  },
  {
    id: 'health-test',
    name: 'Health Test',
    eyebrow: 'Kun prøven',
    description: 'Samme markører, Pandonia Score og seks områdescorer.',
    priceInclVat: 3500,
    priceExclVat: 2800,
    emphasis: 'secondary',
    bookingRef: 'health-test',
  },
];

/** Seven products currently sold and entirely invisible on the live website. */
export const singleTests: readonly Product[] = [
  {
    id: 'd-vitamin',
    name: 'D-vitamin Test',
    description: 'Måler dit niveau af D-vitamin.',
    priceInclVat: 1000,
    emphasis: 'secondary',
    bookingRef: 'd-vitamin-test',
  },
  {
    id: 'metabolisk',
    name: 'Metabolisk Sundheds Test',
    description: 'Blodsukker, elektrolytter og væskebalance, leverfunktion, nyrernes filtrering.',
    priceInclVat: 1250,
    emphasis: 'secondary',
    bookingRef: 'metabolisk-sundheds-test',
  },
  {
    id: 'blodsukker-kolesterol',
    name: 'Blodsukker- og Kolesteroltest',
    description: 'Metabolisk sundhed, kolesterolprofil, langtidsblodsukker.',
    priceInclVat: 1300,
    emphasis: 'secondary',
    bookingRef: 'blodsukker-kolesterol',
  },
  {
    id: 'maends-sundhed',
    name: 'Mænds Sundhedstest',
    description: 'Testosteron og D-vitamin.',
    priceInclVat: 1400,
    emphasis: 'secondary',
    bookingRef: 'maends-sundhedstest',
  },
  {
    id: 'skjoldbruskkirtel',
    name: 'Skjoldbruskkirtel Test',
    description: '',
    priceInclVat: 1600,
    emphasis: 'secondary',
    bookingRef: 'skjoldbruskkirtel-test',
  },
  {
    id: 'glukose-monitorering',
    name: 'Glukose Monitorering · 14 dage',
    description: 'En sensor måler dit blodsukker i 14 dage. Detaljeret rapport og en score.',
    priceInclVat: 2000,
    emphasis: 'secondary',
    bookingRef: 'glukose-monitorering',
  },
  {
    id: 'female-hormones',
    name: 'Health check + Female hormones',
    description: '',
    priceInclVat: null, // Bookable on the live system with no published price.
    emphasis: 'secondary',
    bookingRef: 'health-check-female-hormones',
  },
];

export const bookingPage = {
  heading: 'Vælg en tid, så kommer vi.',
  standfirst:
    'Alt herunder foregår i København. Du skal ikke bruge henvisning, og du behøver ikke vide på forhånd, hvad du leder efter.',
  singleTestsHeading: 'Vil du begynde mindre?',
  singleTestsLead: 'Syv enkelttests, hvis du har ét bestemt spørgsmål.',
  extrasNote: 'Også som gavekort, klippekort og virksomhedsordning.',
  afterHeading: 'Hvad der sker, når du har booket',
  afterSteps: [
    { n: '01', title: 'Du får en bekræftelse', body: 'Med tid, adresse og hvad du skal gøre aftenen inden.' },
    { n: '02', title: 'Vi ringer på', body: 'Fem minutter ved dit eget bord. Du skal ikke forberede rummet.' },
    { n: '03', title: 'Rapporten kommer', body: 'Samme dag. Du får en mail, når den ligger klar.' },
    { n: '04', title: 'Du booker samtalen', body: 'Når du har haft svaret i mindst tre timer.' },
  ],
  reassurance: [
    { label: 'Ingen henvisning', body: 'Du booker direkte.' },
    { label: 'Spørgsmål', body: 'labs@pandonia.com' },
  ],
} as const;

export function formatDkk(amount: number): string {
  return new Intl.NumberFormat('da-DK').format(amount);
}
