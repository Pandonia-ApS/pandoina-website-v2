import {
  placeholder,
  verified,
  type Biomarker,
  type ClinicalField,
  type ReferenceRange,
} from './types';

/**
 * BIOMARKERS.
 *
 * Pandonia publishes six single markers by name. The other ~28 are not
 * published anywhere, and no unit, reference range or marker→area mapping
 * exists in public. Nothing below is invented to fill the gap.
 *
 * Exactly one piece of clinical prose on this site is real: Pandonia's own
 * D-vitamin description, quoted from their booking system.
 *
 * `isPanel: true` marks a row that is a panel name whose components Pandonia
 * does not publish. The UI says so rather than pretending it is one marker
 * with one range.
 */

const NEEDS_TEXT = 'Plain-language copy from Pandonia clinicians.';
const NEEDS_LAB = 'Unit and reference interval from the laboratory.';
const NEEDS_MAP = 'Clinical mapping. Many-to-many — must not be assumed.';

/** The standard pending field set. Every marker starts here; verified fields override. */
function pending(slug: string, route = '/hvad-vi-maaler') {
  const on = [route] as const;
  return {
    unit: placeholder<string>({
      id: `marker.${slug}.unit`,
      intent: 'Measurement unit as the laboratory reports it.',
      needs: NEEDS_LAB,
      appearsOn: on,
    }),
    summary: placeholder<string>({
      id: `marker.${slug}.summary`,
      intent: 'One sentence, 15–25 words, on what the marker measures and what it is used for.',
      needs: NEEDS_TEXT,
      appearsOn: on,
    }),
    whatItIs: placeholder<string>({
      id: `marker.${slug}.whatItIs`,
      intent: 'Three to five sentences in plain Danish.',
      needs: NEEDS_TEXT,
      appearsOn: on,
    }),
    whyWeMeasure: placeholder<string>({
      id: `marker.${slug}.whyWeMeasure`,
      intent: 'Two sentences on why this marker is in Pandonia’s panel.',
      needs: NEEDS_TEXT,
      appearsOn: on,
    }),
    whatItMayIndicate: placeholder<string>({
      id: `marker.${slug}.whatItMayIndicate`,
      intent:
        'Phrased as "kan pege på", never as a diagnosis and never as a list of disease names.',
      needs: 'Clinical sign-off. See docs/clinical-content.md on the fear register.',
      appearsOn: on,
    }),
    range: placeholder<ReferenceRange | ReferenceRange[]>({
      id: `marker.${slug}.range`,
      intent: 'Reference interval plus drawing scale, or an explicit no-simple-range marker.',
      needs: NEEDS_LAB,
      appearsOn: on,
    }),
    variesBy: placeholder<readonly string[]>({
      id: `marker.${slug}.variesBy`,
      intent: 'Whether the interval varies by sex, age or anything else.',
      needs: NEEDS_LAB,
      appearsOn: on,
    }),
    areas: placeholder<readonly string[]>({
      id: `marker.${slug}.areas`,
      intent: 'Layer 1 health areas this marker contributes to.',
      needs: NEEDS_MAP,
      appearsOn: on,
    }),
    systems: placeholder<readonly string[]>({
      id: `marker.${slug}.systems`,
      intent: 'Layer 2 biological systems this marker relates to.',
      needs: NEEDS_MAP,
      appearsOn: on,
    }),
    isDerived: placeholder<boolean>({
      id: `marker.${slug}.isDerived`,
      intent: 'Whether the value is calculated rather than measured.',
      needs: 'Laboratory confirmation. Drives the BEREGNET VÆRDI annotation.',
      appearsOn: on,
    }),
    includedIn: placeholder<readonly string[]>({
      id: `marker.${slug}.includedIn`,
      intent: 'Which Pandonia products include this marker.',
      needs: 'Product confirmation.',
      appearsOn: on,
    }),
  };
}

export const biomarkers: readonly Biomarker[] = [
  // -------------------------------------------------------------------------
  // The one marker with real, quotable Pandonia copy.
  // -------------------------------------------------------------------------
  {
    slug: 'd-vitamin',
    name: 'D-vitamin',
    nameEn: 'Vitamin D',
    synonyms: ['vitamin d', 'dvitamin', 'd vitamin', 'kolekalciferol'],
    isSignature: true,
    ...pending('d-vitamin'),
    unit: verified({
      id: 'marker.d-vitamin.unit',
      value: 'nmol/L',
      source: 'Standard Danish reporting unit — confirm with the laboratory',
      appearsOn: ['/hvad-vi-maaler', '/'],
    }),
    summary: verified({
      id: 'marker.d-vitamin.summary',
      value: 'Lavt D-vitamin er udbredt i Danmark, især i vinterhalvåret.',
      source: 'Pandonia booking system, D-vitamin Test product description',
      appearsOn: ['/hvad-vi-maaler', '/'],
    }),
    whatItIs: verified({
      id: 'marker.d-vitamin.whatItIs',
      value:
        'Lavt D-vitamin er udbredt i Danmark, især i vinterhalvåret. Påvirker immunforsvar, knoglestyrke og mental balance.',
      source: 'Pandonia booking system, verbatim',
      appearsOn: ['/hvad-vi-maaler', '/'],
    }),
  },

  // -------------------------------------------------------------------------
  // Markers Pandonia names publicly, with no other published detail.
  // -------------------------------------------------------------------------
  {
    slug: 'hba1c',
    name: 'HbA1c',
    nameEn: 'HbA1c',
    synonyms: ['langtidsblodsukker', 'hba1c', 'blodsukker', 'glykeret hæmoglobin'],
    ...pending('hba1c'),
  },
  {
    slug: 'tsh',
    name: 'TSH',
    nameEn: 'TSH',
    synonyms: ['tsh', 'stofskifte', 'skjoldbruskkirtel', 'thyroidea'],
    ...pending('tsh'),
  },
  {
    slug: 't3',
    name: 'T3',
    nameEn: 'T3',
    synonyms: ['t3', 'triiodthyronin', 'stofskifte', 'skjoldbruskkirtel'],
    ...pending('t3'),
  },
  {
    slug: 't4',
    name: 'T4',
    nameEn: 'T4',
    synonyms: ['t4', 'thyroxin', 'stofskifte', 'skjoldbruskkirtel'],
    ...pending('t4'),
  },
  {
    slug: 'testosteron',
    name: 'Testosteron',
    nameEn: 'Testosterone',
    synonyms: ['testosteron', 'testosterone', 'hormon'],
    ...pending('testosteron'),
    variesBy: placeholder<readonly string[]>({
      id: 'marker.testosteron.variesBy',
      intent: 'Two reference intervals are expected — the band renders them stacked, never toggled.',
      needs:
        'Sex-specific intervals from the laboratory. A men’s test and a female-hormone check are both sold, so variation is likely but unpublished.',
      appearsOn: ['/hvad-vi-maaler'],
    }),
  },

  // -------------------------------------------------------------------------
  // Panels. Named by Pandonia, components never published.
  // A panel row must eventually expand into its component markers.
  // -------------------------------------------------------------------------
  {
    slug: 'kolesterolprofil',
    name: 'Kolesterolprofil',
    nameEn: 'Cholesterol profile',
    synonyms: ['kolesterol', 'cholesterol', 'lipid', 'lipidprofil', 'ldl', 'hdl', 'triglycerid'],
    isPanel: true,
    ...pending('kolesterolprofil'),
  },
  {
    slug: 'elektrolytter',
    name: 'Elektrolytter og væskebalance',
    nameEn: 'Electrolyte balance',
    synonyms: ['elektrolytter', 'electrolyte', 'væskebalance', 'natrium', 'kalium'],
    isPanel: true,
    ...pending('elektrolytter'),
  },
  {
    slug: 'leverfunktion',
    name: 'Leverfunktion',
    nameEn: 'Liver function',
    synonyms: ['lever', 'leverfunktion', 'liver', 'alat', 'alt', 'bilirubin'],
    isPanel: true,
    ...pending('leverfunktion'),
  },
  {
    slug: 'nyrefunktion',
    name: 'Nyrefunktion',
    nameEn: 'Kidney function',
    synonyms: ['nyre', 'nyrefunktion', 'kidney', 'kreatinin', 'egfr'],
    isPanel: true,
    ...pending('nyrefunktion'),
  },
];

/**
 * The published biomarker count.
 * The live site carries three different figures for one product:
 *   "+30" / "over 30"  — stats band, process step 03, FAQ (×4 occurrences)
 *   "34 biomarkers"    — both pricing cards, DK and EN
 * We do not choose between them.
 */
export const biomarkerCount: ClinicalField<number> = placeholder<number>({
  id: 'product.biomarkerCount',
  intent:
    'The single number used everywhere on the site, including the hero headline ("Fireogtredive svar").',
  needs:
    'Pandonia must settle 30 vs 34, and clarify whether "unique" distinguishes measured from derived values.',
  appearsOn: ['/', '/hvad-vi-maaler', '/book'],
});

/** Markers recovered from public sources, for the register report. */
export const recoveredMarkerCount = 6;
