import type { Locale } from '@/i18n/config';
import { CLINICAL_MARKER, type ClinicalStatus } from './types';

/**
 * LOCALISED CLINICAL FIELDS — Phase 6.6.
 *
 * The rule that makes this necessary:
 *
 *   A verified Danish clinical statement is NOT a verified English one.
 *
 * Translating an approved sentence produces an unapproved sentence. The
 * English wording has to clear the same gate. So status is tracked per locale,
 * and the build gate fails if EITHER locale is unresolved.
 *
 * Product facts (counts, prices, durations) work the opposite way: the number
 * is universal and only its presentation is localised — see `SharedFact`.
 */

export type TranslationStatus =
  /** No English text exists yet. */
  | 'requires_translation'
  /** English exists, editorial only, no clinical content. Shippable. */
  | 'translated'
  /** English exists but carries clinical meaning and is not approved. Blocks. */
  | 'requires_review'
  /** English approved by Pandonia's clinicians. Shippable. */
  | 'verified';

export interface LocaleEntry<T> {
  readonly status: ClinicalStatus;
  readonly value: T | null;
  readonly source?: string;
  readonly intent?: string;
  readonly needs?: string;
}

export interface LocalisedClinicalField<T = string> {
  readonly [CLINICAL_MARKER]: true;
  readonly id: string;
  /** Danish is the source. English is derived and separately approved. */
  readonly da: LocaleEntry<T>;
  readonly en: LocaleEntry<T>;
  /** Tracks the translation lifecycle independently of clinical approval. */
  readonly translation: TranslationStatus;
  readonly appearsOn?: readonly string[];
}

/**
 * A fact that is the same number in both languages.
 * Declared ONCE so Danish and English cannot drift — this is why `34` is not
 * typed into two translation files.
 */
export interface SharedFact<T = number> {
  readonly [CLINICAL_MARKER]: true;
  readonly id: string;
  readonly status: ClinicalStatus;
  readonly value: T | null;
  readonly source?: string;
  readonly needs?: string;
  /** Presentation only. The value never differs. */
  readonly format?: Partial<Record<Locale, (v: T) => string>>;
  readonly appearsOn?: readonly string[];
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function localised<T>(init: {
  id: string;
  da: LocaleEntry<T>;
  en: LocaleEntry<T>;
  translation: TranslationStatus;
  appearsOn?: readonly string[];
}): LocalisedClinicalField<T> {
  return { [CLINICAL_MARKER]: true, ...init };
}

/** Danish approved, English drafted but not yet cleared. The common case. */
export function daVerifiedEnPending<T>(init: {
  id: string;
  daValue: T;
  daSource: string;
  enDraft: T;
  enNeeds: string;
  appearsOn?: readonly string[];
}): LocalisedClinicalField<T> {
  return localised<T>({
    id: init.id,
    da: { status: 'verified', value: init.daValue, source: init.daSource },
    en: { status: 'requires_review', value: init.enDraft, needs: init.enNeeds },
    translation: 'requires_review',
    appearsOn: init.appearsOn,
  });
}

/** Both languages quoted from Pandonia's own DK and EN sites. */
export function bothVerified<T>(init: {
  id: string;
  daValue: T;
  daSource: string;
  enValue: T;
  enSource: string;
  appearsOn?: readonly string[];
}): LocalisedClinicalField<T> {
  return localised<T>({
    id: init.id,
    da: { status: 'verified', value: init.daValue, source: init.daSource },
    en: { status: 'verified', value: init.enValue, source: init.enSource },
    translation: 'verified',
    appearsOn: init.appearsOn,
  });
}

export function sharedFact<T>(init: {
  id: string;
  status: ClinicalStatus;
  value: T | null;
  source?: string;
  needs?: string;
  format?: Partial<Record<Locale, (v: T) => string>>;
  appearsOn?: readonly string[];
}): SharedFact<T> {
  return { [CLINICAL_MARKER]: true, ...init };
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export function entryFor<T>(f: LocalisedClinicalField<T>, locale: Locale): LocaleEntry<T> {
  return locale === 'da' ? f.da : f.en;
}

/** Shippable only when THIS locale is verified. Danish approval never covers English. */
export function isPublishableIn<T>(f: LocalisedClinicalField<T>, locale: Locale): boolean {
  const e = entryFor(f, locale);
  return e.status === 'verified' && e.value !== null;
}

/**
 * The gate: a field blocks the build if ANY locale is unresolved.
 * Shipping a Danish-only site was never the plan, so a half-approved field is
 * a blocked field.
 */
export function blocksBuild<T>(f: LocalisedClinicalField<T>): boolean {
  return !isPublishableIn(f, 'da') || !isPublishableIn(f, 'en');
}

/**
 * Formats a shared fact for a locale. Numbers are never retyped per language —
 * only their presentation differs (1.000 kr. / DKK 1,000).
 */
export function formatShared<T>(f: SharedFact<T>, locale: Locale): string | null {
  if (f.status !== 'verified' || f.value === null) return null;
  const fmt = f.format?.[locale];
  return fmt ? fmt(f.value) : String(f.value);
}

export const dkk = {
  da: (v: number) => `${new Intl.NumberFormat('da-DK').format(v)} kr.`,
  en: (v: number) => `DKK ${new Intl.NumberFormat('en-GB').format(v)}`,
};
