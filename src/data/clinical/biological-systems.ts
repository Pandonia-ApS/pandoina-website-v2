import { placeholder, requiresReview, verified, type BiologicalSystem } from './types';

/**
 * LAYER 2 — the Pandonia biological model.
 *
 * Context, never navigation. These six names are quoted verbatim from the FAQ
 * answer to "Hvilke biomarkører analyserer I…" on pandonia.com (DK and EN),
 * read 23 September 2026. It is the only six-part list published anywhere.
 *
 * Two labels are flagged for clinical review — see `terminologyFlag`.
 * We do not silently normalise either of them.
 */

export const biologicalSystems: readonly BiologicalSystem[] = [
  {
    slug: 'signalering',
    nameDa: verified({
      id: 'system.signalering.da',
      value: 'Signalering',
      source: 'pandonia.com FAQ (DK)',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: verified({
      id: 'system.signalering.en',
      value: 'Cellular signalling',
      source: 'pandonia.com/en FAQ',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.signalering.description',
      intent: 'One paragraph explaining what this system does, written for a lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
  },
  {
    slug: 'transport',
    nameDa: verified({
      id: 'system.transport.da',
      value: 'Transport',
      source: 'pandonia.com FAQ (DK)',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: verified({
      id: 'system.transport.en',
      value: 'Transport',
      source: 'pandonia.com/en FAQ',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.transport.description',
      intent: 'One paragraph, lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
  },
  {
    slug: 'fordoejelse',
    nameDa: requiresReview({
      id: 'system.fordoejelse.da',
      value: 'Fordøjelse',
      source: 'pandonia.com FAQ (DK)',
      needs:
        'Pandonia publishes no digestive or gut marker anywhere. Confirm what the panel actually measures under this heading — this may be a label describing something the test does not do.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: requiresReview({
      id: 'system.fordoejelse.en',
      value: 'Digestion',
      source: 'pandonia.com/en FAQ',
      needs: 'Same review as the Danish label.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.fordoejelse.description',
      intent: 'One paragraph, lay reader.',
      needs: 'Blocked on the terminology review above.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
    terminologyFlag:
      'No digestive marker is published. Possibly mislabelled — see Appendix A §03.',
  },
  {
    slug: 'energi',
    nameDa: verified({
      id: 'system.energi.da',
      value: 'Energi',
      source: 'pandonia.com FAQ (DK)',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: verified({
      id: 'system.energi.en',
      value: 'Energy production',
      source: 'pandonia.com/en FAQ',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.energi.description',
      intent: 'One paragraph, lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
  },
  {
    slug: 'immunforsvar',
    nameDa: verified({
      id: 'system.immunforsvar.da',
      value: 'Immunforsvar',
      source: 'pandonia.com FAQ (DK)',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: verified({
      id: 'system.immunforsvar.en',
      value: 'Immune defence',
      source: 'pandonia.com/en FAQ',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.immunforsvar.description',
      intent: 'One paragraph, lay reader.',
      needs: 'Clinical copy from Pandonia.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
  },
  {
    slug: 'affaldssystem',
    nameDa: requiresReview({
      id: 'system.affaldssystem.da',
      value: 'Affaldssystem',
      source: 'pandonia.com FAQ (DK)',
      needs:
        'Anatomically neutral but not standard Danish clinical language. Confirm or replace — no replacement proposed by design.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    nameEn: requiresReview({
      id: 'system.affaldssystem.en',
      value: 'Detoxification',
      source: 'pandonia.com/en FAQ',
      needs:
        'Carries consumer-wellness baggage (detox teas, cleanses) that the rest of the brand avoids. Confirm whether this is a deliberate translation choice. DK and EN must describe the same thing.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
    description: placeholder({
      id: 'system.affaldssystem.description',
      intent: 'One paragraph, lay reader.',
      needs: 'Blocked on the terminology review above.',
      appearsOn: ['/hvad-vi-maaler#modellen'],
    }),
    terminologyFlag: 'DK and EN carry different registers — see Appendix A §03.',
  },
];

export const modelIntro = placeholder({
  id: 'system.model.intro',
  intent:
    'Two to three paragraphs on the Pandonia Health Model, its relationship to the four horsemen of aging, and — explicitly — what it does not promise.',
  needs:
    'Clinical copy. Must also explain how four horsemen become six areas; the current site states both and connects neither.',
  appearsOn: ['/hvad-vi-maaler#modellen', '/om-pandonia'],
});
