/**
 * DESIGN CONTENT — navigation.
 * No clinical facts live in this file. See src/data/clinical/ for those.
 *
 * Four editorial destinations plus one action (Phase 5 §02).
 * Priser is absorbed into /book; FAQ sits in the utility group.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const primaryNav: readonly NavItem[] = [
  { href: '/hvad-vi-maaler', label: 'Hvad vi måler' },
  { href: '/saadan-fungerer-det', label: 'Sådan fungerer det' },
  { href: '/din-rapport', label: 'Din rapport' },
  { href: '/om-pandonia', label: 'Om Pandonia' },
];

export const utilityNav: readonly NavItem[] = [
  { href: '/faq', label: 'FAQ' },
  // Integration boundary — see docs/README "Backend integration points".
  { href: '#', label: 'Log ind' },
  { href: '#', label: 'EN' },
];

/** One label, everywhere. Users should learn one word (Phase 5 §07). */
export const PRIMARY_CTA = 'Book din blodprøve';
export const PRIMARY_CTA_HREF = '/book';

export const footerNav = {
  websted: [
    { href: '/hvad-vi-maaler', label: 'Hvad vi måler' },
    { href: '/saadan-fungerer-det', label: 'Sådan fungerer det' },
    { href: '/saadan-fungerer-det#laboratoriet', label: 'Laboratoriet' },
    { href: '/din-rapport', label: 'Din rapport' },
    { href: '/om-pandonia', label: 'Om Pandonia' },
  ],
  praktisk: [
    { href: '/book#priser', label: 'Priser' },
    { href: '/book', label: 'Book din blodprøve' },
    { href: '/faq', label: 'FAQ' },
    { href: '/virksomheder', label: 'For virksomheder' },
    { href: '#', label: 'Gavekort' },
  ],
  juridisk: [
    { href: '/persondatapolitik', label: 'Persondatapolitik' },
    { href: '/cookiepolitik', label: 'Cookiepolitik' },
    { href: '/handelsbetingelser', label: 'Handelsbetingelser' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
} satisfies Record<string, readonly NavItem[]>;

export const contact = {
  address: ['Langebrogade 3A, 2. sal', '1411 København K'],
  email: 'labs@pandonia.com',
  blurb: 'Blodprøver hjemme hos dig i København, analyseret i vores eget laboratorium.',
};
