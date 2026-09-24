import { resolve } from '@/lib/clinical';
import type { ClinicalField } from '@/data/clinical/types';
import { cn } from '@/lib/cn';

/**
 * The only way clinical copy reaches the page.
 *
 *   verified        → renders the value
 *   otherwise       → renders the review treatment (preview builds only)
 *                     or nothing at all (production backstop)
 *
 * There is deliberately no `fallback` prop. A caller cannot supply
 * plausible-looking copy to fill a gap, because the component will not take it.
 *
 * The dotted treatment is `.clinical-placeholder`, which the build gate uses
 * as its visual signature. See docs/clinical-content.md.
 */

export function ClinicalText({
  field,
  as: Tag = 'p',
  className,
  tone = 'light',
}: {
  field: ClinicalField<string>;
  as?: 'p' | 'span' | 'div' | 'dd';
  className?: string;
  tone?: 'light' | 'deep';
}) {
  const r = resolve(field);

  if (r.kind === 'value') {
    return <Tag className={className}>{r.value}</Tag>;
  }
  if (r.kind === 'omit') return null;

  const label = r.status === 'requires_review' ? 'Afventer godkendelse' : 'Afventer klinisk tekst';

  return (
    <Tag
      className={cn(
        tone === 'deep' ? 'clinical-placeholder--inv' : 'clinical-placeholder',
        className,
      )}
      data-clinical-id={r.id}
      data-clinical-status={r.status}
    >
      <b className="mb-[3px] block font-mono text-[9px] uppercase tracking-[0.11em] font-normal text-brick">
        {label}
      </b>
      {r.intent ?? r.needs}
    </Tag>
  );
}

/** Inline status badge, for a field whose absence needs naming in place. */
export function ClinicalTag({
  field,
  className,
}: {
  field: ClinicalField<unknown>;
  className?: string;
}) {
  const r = resolve(field);
  if (r.kind === 'value') {
    return (
      <span
        className={cn(
          'inline-block border border-sage-deep px-[6px] py-[2px] font-mono text-[9px] uppercase tracking-[0.11em] text-sage-deep',
          className,
        )}
      >
        Verificeret
      </span>
    );
  }
  if (r.kind === 'omit') return null;
  return (
    <span
      className={cn(
        'inline-block border border-brick px-[6px] py-[2px] font-mono text-[9px] uppercase tracking-[0.11em] text-brick',
        className,
      )}
      data-clinical-id={r.id}
      data-clinical-status={r.status}
    >
      {r.status === 'requires_review' ? 'Afventer godkendelse' : 'Afventer'}
    </span>
  );
}

/**
 * A clinical value rendered inline (unit, count, area name…).
 * Falls back to an em-dash placeholder in preview, nothing in production.
 */
export function ClinicalValue<T extends string | number>({
  field,
  className,
  suffix,
}: {
  field: ClinicalField<T>;
  className?: string;
  suffix?: string;
}) {
  const r = resolve(field);
  if (r.kind === 'value') {
    return (
      <span className={className}>
        {String(r.value)}
        {suffix ? ` ${suffix}` : null}
      </span>
    );
  }
  if (r.kind === 'omit') return <span className={className}>—</span>;
  return (
    <span
      className={cn('font-mono text-ink-3', className)}
      data-clinical-id={r.id}
      data-clinical-status={r.status}
      title={r.needs}
    >
      —
    </span>
  );
}
