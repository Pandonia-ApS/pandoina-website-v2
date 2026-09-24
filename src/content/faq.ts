import * as claims from '@/data/clinical/claims';
import type { ClinicalField } from '@/data/clinical/types';

/**
 * DESIGN CONTENT — FAQ.
 *
 * Grouped by journey stage, not dumped as one accordion list.
 * Each answer is SHORT and links to the page that owns the long version
 * (Phase 5 §03, page responsibility map). Answers that are clinical or
 * operational pull straight from the gated data layer.
 */

export interface FaqItem {
  q: string;
  /** Editorial answer, or a gated clinical/operational field, or both. */
  a?: string;
  clinical?: ClinicalField<string>;
  /** "The long version lives here." */
  more?: { href: string; label: string };
}

export interface FaqGroup {
  stage: string;
  items: readonly FaqItem[];
}

export const faqGroups: readonly FaqGroup[] = [
  {
    stage: 'Før du booker',
    items: [
      {
        q: 'Hvor kan prøven tages?',
        clinical: claims.coverageArea,
        a: 'Vi kommer hjem til dig eller på din arbejdsplads. Vi tilbyder på nuværende tidspunkt kun prøver i og omkring København.',
        more: { href: '/saadan-fungerer-det', label: 'Hele forløbet' },
      },
      {
        q: 'Hvad koster det?',
        a: 'Health Test koster 3.500 kr. Health Test med konsultation som samlet pakke koster 4.750 kr. Enkelte tests fra 1.000 kr.',
        more: { href: '/book', label: 'Se alle priser' },
      },
      {
        q: 'Er konsultationen med i prisen?',
        clinical: claims.consultationIncluded,
      },
    ],
  },
  {
    stage: 'Prøvetagningen',
    items: [
      {
        q: 'Hvordan forbereder jeg mig?',
        clinical: claims.preparation,
        more: { href: '/saadan-fungerer-det', label: 'Forberedelse i detaljer' },
      },
      {
        q: 'Hvorfor om morgenen?',
        clinical: claims.morningRationale,
      },
      {
        q: 'Hvem tager prøven?',
        clinical: claims.phlebotomist,
      },
      {
        q: 'Hvor lang tid tager det?',
        clinical: claims.drawDuration,
      },
    ],
  },
  {
    stage: 'Laboratoriet',
    items: [
      {
        q: 'Hvor analyseres min prøve?',
        clinical: claims.ownLaboratory,
        more: { href: '/saadan-fungerer-det#laboratoriet', label: 'Se laboratoriet' },
      },
      {
        q: 'Hvordan sikrer I kvaliteten?',
        clinical: claims.laboratoryQuality,
      },
    ],
  },
  {
    stage: 'Resultater og samtale',
    items: [
      {
        q: 'Hvornår får jeg svar?',
        clinical: claims.turnaround,
      },
      {
        q: 'Hvordan foregår konsultationen?',
        clinical: claims.consultation,
        more: { href: '/din-rapport', label: 'Hvad du får' },
      },
      {
        q: 'Kan resten af sundhedsvæsenet se mine svar?',
        clinical: claims.dataHandling,
      },
    ],
  },
  {
    stage: 'Praktisk',
    items: [
      {
        q: 'Kan flere medarbejdere testes samtidig?',
        clinical: claims.corporateProgramme,
        a: 'Skriv til labs@pandonia.com.',
      },
      {
        q: 'Kan jeg afbestille?',
        clinical: claims.cancellation,
      },
    ],
  },
];

export const faqHeading = 'Spørgsmål, i den rækkefølge de plejer at komme.';
