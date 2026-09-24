/**
 * DESIGN CONTENT — /saadan-fungerer-det
 *
 * Stage words, not clock times. The homepage owns the timeline; this page
 * owns what only it has — preparation, coverage, the laboratory, the
 * consultation mechanics (Phase 5 §03, duplication removal).
 */

export interface ProcessStage {
  /** A stage word, never a timestamp. */
  stage: string;
  title: string;
  /** Editorial lead. Clinical detail is pulled from src/data/clinical/claims. */
  lead?: string;
  id?: string;
  ground: 'cream' | 'sand' | 'deep';
  imageId?: 'HAND-01' | 'OBJ-01';
  imageCaption?: string;
}

export const processOpening = {
  heading: 'Fra dit køkkenbord til dit svar.',
  standfirst:
    'Hele forløbet foregår på én dag. Her er hvad der sker, i den rækkefølge det sker.',
} as const;

export const stages: readonly ProcessStage[] = [
  {
    stage: 'Før',
    title: 'Aftenen inden',
    ground: 'cream',
  },
  {
    stage: 'Morgenen',
    title: 'Vi kommer til dig',
    ground: 'sand',
  },
  {
    stage: 'Midt på dagen',
    title: 'Laboratoriet',
    id: 'laboratoriet',
    ground: 'deep',
    lead: 'Det er ikke en detalje — det er hele grunden til, at svaret kan nå frem samme dag.',
  },
  {
    stage: 'Efter frokost',
    title: 'Rapporten',
    ground: 'cream',
    lead: 'Den er skrevet til at blive læst af dig — ikke af en læge.',
  },
  {
    stage: 'Senere samme dag',
    title: 'Samtalen',
    ground: 'sand',
  },
];

export const transitCaption = 'Prøven kører ind gennem byen.';

export const labFacts = [
  { label: 'Adresse', clinical: 'laboratoryAddress' },
  { label: 'Akkreditering', clinical: 'laboratoryAccreditation' },
  { label: 'Udstyr og metode', clinical: 'laboratoryScope' },
  { label: 'Kvalitetskontrol', clinical: 'laboratoryQuality' },
] as const;
