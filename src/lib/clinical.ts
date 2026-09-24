import {
  CLINICAL_MARKER,
  isClinicalField,
  type ClinicalField,
  type ClinicalStatus,
} from '@/data/clinical/types';

/**
 * Runtime + build-time helpers for the clinical gate.
 * See docs/clinical-content.md.
 */

/** Explicit opt-in for preview deploys. Never set in production. */
export function placeholdersAllowed(): boolean {
  return process.env.PANDONIA_ALLOW_PLACEHOLDERS === 'true';
}

/**
 * Resolve a clinical field for rendering.
 *  - verified              → render the value
 *  - anything else         → render the review treatment (preview only)
 *
 * There is deliberately no fallback string. A component cannot accidentally
 * print invented copy, because none exists to print.
 */
export type Resolved<T> =
  | { kind: 'value'; value: T }
  | { kind: 'review'; status: ClinicalStatus; intent?: string; needs?: string; id: string }
  | { kind: 'omit'; id: string };

export function resolve<T>(field: ClinicalField<T>): Resolved<T> {
  if (field.status === 'verified' && field.value !== null) {
    return { kind: 'value', value: field.value };
  }
  if (placeholdersAllowed()) {
    return {
      kind: 'review',
      status: field.status,
      intent: field.intent,
      needs: field.needs,
      id: field.id,
    };
  }
  // Production with an unresolved field: the build should already have failed.
  // This is the backstop — render nothing rather than anything invented.
  return { kind: 'omit', id: field.id };
}

export interface CollectedField {
  id: string;
  status: ClinicalStatus;
  path: string;
  needs?: string;
  intent?: string;
  appearsOn?: readonly string[];
}

/**
 * Deep-walk a module's exports and collect every ClinicalField.
 * Used by scripts/validate-clinical.ts — no manual registry to keep in sync.
 */
export function collectClinicalFields(root: unknown, rootPath = ''): CollectedField[] {
  const found: CollectedField[] = [];
  const seen = new WeakSet<object>();

  function walk(node: unknown, path: string): void {
    if (node === null || typeof node !== 'object') return;
    if (seen.has(node as object)) return;
    seen.add(node as object);

    if (isClinicalField(node)) {
      const f = node as ClinicalField<unknown>;
      found.push({
        id: f.id,
        status: f.status,
        path,
        needs: f.needs,
        intent: f.intent,
        appearsOn: f.appearsOn,
      });
      return; // a clinical field has no nested clinical fields
    }

    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`));
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      if (key === CLINICAL_MARKER) continue;
      walk(child, path ? `${path}.${key}` : key);
    }
  }

  walk(root, rootPath);
  return found;
}

export function groupByStatus(fields: CollectedField[]): Record<ClinicalStatus, CollectedField[]> {
  const out: Record<ClinicalStatus, CollectedField[]> = {
    verified: [],
    placeholder: [],
    requires_review: [],
  };
  for (const f of fields) out[f.status].push(f);
  return out;
}
