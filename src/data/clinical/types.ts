/**
 * CLINICAL DATA LAYER — types and constructors.
 *
 * Rule: no clinical statement enters the site as a plain string. Every one is
 * a ClinicalField carrying its own status, so the build can refuse to ship
 * anything that has not been signed off.
 *
 * See docs/clinical-content.md.
 */

export const CLINICAL_MARKER = '__clinical' as const;

export type ClinicalStatus =
  /** Quoted from a Pandonia source, or signed off by Pandonia's clinicians. Shippable. */
  | 'verified'
  /** No content exists yet. `intent` describes what the copy will do — never what it will say. */
  | 'placeholder'
  /** Content exists but has not been approved for publication. Blocks the build. */
  | 'requires_review';

export interface ClinicalField<T = string> {
  readonly [CLINICAL_MARKER]: true;
  /** Stable id, used by the validator report and the clinical register. */
  readonly id: string;
  readonly status: ClinicalStatus;
  /** Present only when the field is safe to render. Never invented. */
  readonly value: T | null;
  /** Where a verified value came from. Required for `verified`. */
  readonly source?: string;
  /** What the final copy must do. Deliberately not medical content. */
  readonly intent?: string;
  /** What Pandonia must confirm before this can become `verified`. */
  readonly needs?: string;
  /** Route(s) where this field is rendered — drives the register report. */
  readonly appearsOn?: readonly string[];
}

export interface VerifiedInit<T> {
  id: string;
  value: T;
  source: string;
  appearsOn?: readonly string[];
}

export interface PendingInit {
  id: string;
  intent: string;
  needs: string;
  appearsOn?: readonly string[];
}

export interface ReviewInit<T> {
  id: string;
  value: T;
  needs: string;
  source?: string;
  appearsOn?: readonly string[];
}

/** A statement quoted from Pandonia or approved by their clinicians. */
export function verified<T>(init: VerifiedInit<T>): ClinicalField<T> {
  return {
    [CLINICAL_MARKER]: true,
    id: init.id,
    status: 'verified',
    value: init.value,
    source: init.source,
    appearsOn: init.appearsOn,
  };
}

/** Nothing written yet. Carries intent and length only — never medical content. */
export function placeholder<T = string>(init: PendingInit): ClinicalField<T> {
  return {
    [CLINICAL_MARKER]: true,
    id: init.id,
    status: 'placeholder',
    value: null,
    intent: init.intent,
    needs: init.needs,
    appearsOn: init.appearsOn,
  };
}

/** Draft copy that exists but has not been signed off. Still blocks the build. */
export function requiresReview<T>(init: ReviewInit<T>): ClinicalField<T> {
  return {
    [CLINICAL_MARKER]: true,
    id: init.id,
    status: 'requires_review',
    value: init.value,
    source: init.source,
    needs: init.needs,
    appearsOn: init.appearsOn,
  };
}

export function isClinicalField(v: unknown): v is ClinicalField<unknown> {
  return typeof v === 'object' && v !== null && CLINICAL_MARKER in v;
}

/** True only for fields safe to render in production. */
export function isPublishable(f: ClinicalField<unknown>): boolean {
  return f.status === 'verified' && f.value !== null;
}

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type RangeState =
  /** No personal value — the default on /hvad-vi-maaler. */
  | 'reference-only'
  | 'inside'
  | 'outside-low'
  | 'outside-high'
  /** Ratios and context-dependent markers: a scale with no sage band. */
  | 'no-simple-range'
  /** Interval unknown, or the sample could not be analysed. */
  | 'unavailable';

export interface ReferenceRange {
  /** Lower bound of the reference interval. */
  low: ClinicalField<number>;
  /** Upper bound of the reference interval. */
  high: ClinicalField<number>;
  /** Drawing scale — how far outside the band a tick may sit. */
  scaleMin: ClinicalField<number>;
  scaleMax: ClinicalField<number>;
  /** e.g. "Kvinder 18–50". Omitted when the range does not vary. */
  appliesTo?: string;
}

export interface Biomarker {
  /** URL-safe id. Stable — used for deep links and the register. */
  slug: string;
  /** Danish name as Pandonia writes it. */
  name: string;
  nameEn?: string;
  /** Lay terms the filter must also match, e.g. "langtidsblodsukker". */
  synonyms: readonly string[];
  /** Optional pronunciation, used sparingly where it genuinely helps. */
  pronunciation?: string;
  /** True when this row is a panel name whose components are unpublished. */
  isPanel?: boolean;
  /** One of the six signature markers that get their own indexable page. */
  isSignature?: boolean;

  unit: ClinicalField<string>;
  /** One sentence, plain Danish. The highest-value content on the site. */
  summary: ClinicalField<string>;
  /** Longer explanation shown in the expanded detail. */
  whatItIs: ClinicalField<string>;
  whyWeMeasure: ClinicalField<string>;
  /** Phrased as "kan pege på". Never a list of diagnoses. */
  whatItMayIndicate: ClinicalField<string>;
  /** Reference interval, or an explicit no-simple-range marker. */
  range: ClinicalField<ReferenceRange | ReferenceRange[]>;
  /** Whether the interval varies, and by what. */
  variesBy: ClinicalField<readonly string[]>;
  /** Layer 1 — health areas. Many-to-many. */
  areas: ClinicalField<readonly string[]>;
  /** Layer 2 — biological systems. Many-to-many, never a parent. */
  systems: ClinicalField<readonly string[]>;
  /** Calculated rather than measured → renders BEREGNET VÆRDI. */
  isDerived: ClinicalField<boolean>;
  /** Product membership. Commercial, not clinical, but gated the same way. */
  includedIn: ClinicalField<readonly string[]>;
}

export interface HealthArea {
  slug: string;
  name: ClinicalField<string>;
  /** Plain-language introduction, 2–4 sentences. */
  intro: ClinicalField<string>;
  /** Marker count. Derived at build time once the mapping exists. */
  markerCount: ClinicalField<number>;
  /** The unexpected marker that opens the chapter. */
  signatureMarker: ClinicalField<string>;
  /** Layer 2 systems this area draws on. Context only, never navigation. */
  systems: ClinicalField<readonly string[]>;
  imageId: string;
}

export interface BiologicalSystem {
  slug: string;
  nameDa: ClinicalField<string>;
  nameEn: ClinicalField<string>;
  description: ClinicalField<string>;
  /** Set where the label itself has been sent for clinical review. */
  terminologyFlag?: string;
}
