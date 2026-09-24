import { placeholder, requiresReview, type HealthArea } from './types';

/**
 * LAYER 1 — health areas. The navigation layer.
 *
 * Three names come from the approved design concept. They appear NOWHERE on
 * pandonia.com in either language, so they are `requires_review`, not verified.
 * The other three do not exist yet and are not invented here.
 *
 * The UI renders pending areas as explicit AFVENTER rows. Showing a gap is
 * honest; inventing a clinical taxonomy is not.
 */

export const healthAreas: readonly HealthArea[] = [
  {
    slug: 'hjerte-og-kar',
    name: requiresReview({
      id: 'area.1.name',
      value: 'Hjerte og kar',
      source: 'Design concept, Phase 1 — not published by Pandonia',
      needs: 'Confirm this is the intended customer-facing area name.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.1.intro',
      intent:
        'Two to four sentences on what this area covers and why it is worth following over time — without promising disease prevention.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.1.count',
      intent: 'Number of markers in this area. Derived once the mapping exists.',
      needs: 'Marker → area mapping.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.1.signature',
      intent: 'The one marker people do not expect a blood test to cover.',
      needs: 'Clinical selection.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.1.systems',
      intent: 'Which biological systems this area draws on. Expected 1–3 of six.',
      needs: 'Clinical mapping.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'ARM-01',
  },
  {
    slug: 'blodsukker-og-stofskifte',
    name: requiresReview({
      id: 'area.2.name',
      value: 'Blodsukker og stofskifte',
      source: 'Design concept, Phase 1 — not published by Pandonia',
      needs: 'Confirm this is the intended customer-facing area name.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.2.intro',
      intent: 'Two to four sentences, lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.2.count',
      intent: 'Number of markers in this area.',
      needs: 'Marker → area mapping.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.2.signature',
      intent: 'The unexpected marker for this area.',
      needs: 'Clinical selection.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.2.systems',
      intent: 'Biological systems this area draws on.',
      needs: 'Clinical mapping.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'HALS-01',
  },
  {
    slug: 'hormoner',
    name: requiresReview({
      id: 'area.3.name',
      value: 'Hormoner',
      source: 'Design concept, Phase 1 — not published by Pandonia',
      needs: 'Confirm this is the intended customer-facing area name.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.3.intro',
      intent: 'Two to four sentences, lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.3.count',
      intent: 'Number of markers in this area.',
      needs: 'Marker → area mapping.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.3.signature',
      intent: 'The unexpected marker for this area.',
      needs: 'Clinical selection.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.3.systems',
      intent: 'Biological systems this area draws on.',
      needs: 'Clinical mapping.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'HAND-01',
  },
  {
    slug: 'omraade-4',
    name: placeholder({
      id: 'area.4.name',
      intent: 'The fourth customer-facing health area name, DK and EN.',
      needs: 'Pandonia must name it. Not invented here.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.4.intro',
      intent: 'Two to four sentences, lay reader.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.4.count',
      intent: 'Number of markers in this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.4.signature',
      intent: 'The unexpected marker for this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.4.systems',
      intent: 'Biological systems this area draws on.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'LYS-01',
  },
  {
    slug: 'omraade-5',
    name: placeholder({
      id: 'area.5.name',
      intent: 'The fifth customer-facing health area name, DK and EN.',
      needs: 'Pandonia must name it. Not invented here.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.5.intro',
      intent: 'Two to four sentences, lay reader.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.5.count',
      intent: 'Number of markers in this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.5.signature',
      intent: 'The unexpected marker for this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.5.systems',
      intent: 'Biological systems this area draws on.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'LYS-02',
  },
  {
    slug: 'omraade-6',
    name: placeholder({
      id: 'area.6.name',
      intent: 'The sixth customer-facing health area name, DK and EN.',
      needs: 'Pandonia must name it. Not invented here.',
      appearsOn: ['/', '/hvad-vi-maaler', '/din-rapport'],
    }),
    intro: placeholder({
      id: 'area.6.intro',
      intent: 'Two to four sentences, lay reader.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    markerCount: placeholder({
      id: 'area.6.count',
      intent: 'Number of markers in this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/', '/hvad-vi-maaler'],
    }),
    signatureMarker: placeholder({
      id: 'area.6.signature',
      intent: 'The unexpected marker for this area.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    systems: placeholder({
      id: 'area.6.systems',
      intent: 'Biological systems this area draws on.',
      needs: 'Blocked on the area name.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    imageId: 'LYS-03',
  },
];

/** The closing section of /hvad-vi-maaler. No competitor has one. */
export const whatWeDoNotMeasure = placeholder({
  id: 'area.limits',
  intent:
    'A short section on what the test does not cover, and when to speak to your own doctor instead.',
  needs:
    'Clinical copy. Highest trust value per word on the site — and it cannot be written by anyone but a clinician.',
  appearsOn: ['/hvad-vi-maaler'],
});
