import { cn } from '@/lib/cn';
import type { RangeState } from '@/data/clinical/types';

/**
 * NULPUNKT — the reference band.
 *
 * One object at three scales, used for everything numeric on the site: a
 * single biomarker, a category score, the Pandonia Score. Learn it once.
 *
 * State is encoded THREE ways — position of the tick, a text label, and
 * colour last. A reader with any colour vision deficiency loses nothing.
 * There is no traffic-light variant and there never will be.
 *
 * All seven states are specified in Phase 4 §04.
 */

export interface BandProps {
  state: RangeState;
  /** 0–1 positions along the drawing scale. */
  refLow?: number;
  refHigh?: number;
  value?: number;
  /** Axis end labels. Em-dashes when the interval is unknown. */
  axisMin?: string;
  axisMax?: string;
  /** Centre caption — unit, interval, or the reason it is unavailable. */
  axisNote?: string;
  tone?: 'light' | 'deep';
  className?: string;
}

export function RangeBand({
  state,
  refLow = 0.26,
  refHigh = 0.78,
  value,
  axisMin = '—',
  axisMax = '—',
  axisNote,
  tone = 'light',
  className,
}: BandProps) {
  const showRef = state === 'reference-only' || state === 'inside' || state === 'outside-low' || state === 'outside-high';
  const showTick = typeof value === 'number' && state !== 'reference-only' && state !== 'unavailable';
  const isOut = state === 'outside-low' || state === 'outside-high';

  const pct = (n: number) => `${Math.max(0, Math.min(1, n)) * 100}%`;

  return (
    <div className={className}>
      <div className={cn('band', tone === 'deep' && 'band--inv')}>
        {state === 'unavailable' ? <div className="band__none" aria-hidden="true" /> : null}

        {showRef ? (
          <div
            className="band__ref"
            aria-hidden="true"
            style={{ left: pct(refLow), width: pct(refHigh - refLow) }}
          />
        ) : null}

        {/* Lead rule: lets the eye measure HOW FAR outside, not just that. */}
        {isOut && showTick && typeof value === 'number' ? (
          <div
            className="band__lead"
            aria-hidden="true"
            style={
              state === 'outside-low'
                ? { left: pct(value), width: pct(refLow - value) }
                : { left: pct(refHigh), width: pct(value - refHigh) }
            }
          />
        ) : null}

        {showTick && typeof value === 'number' ? (
          <div
            className={cn('band__tick', isOut && 'band__tick--out')}
            aria-hidden="true"
            style={{ left: pct(value) }}
          />
        ) : null}
      </div>

      <div
        className={cn(
          'mt-[6px] flex justify-between font-mono text-[9.5px] tracking-[0.07em]',
          tone === 'deep' ? 'text-on-deep-quiet' : 'text-ink-3',
        )}
      >
        <span>{state === 'no-simple-range' ? 'INGEN ENKEL REFERENCE' : axisMin}</span>
        {axisNote && state !== 'no-simple-range' ? (
          <span className="uppercase">{axisNote}</span>
        ) : null}
        {state === 'no-simple-range' ? null : <span>{axisMax}</span>}
      </div>
    </div>
  );
}

/** Micro scale — 64px, no labels. Used inline in a list row. */
export function MicroBand({
  state,
  refLow = 0.22,
  refHigh = 0.76,
  value,
  tone = 'light',
  className,
}: BandProps) {
  const pct = (n: number) => `${Math.max(0, Math.min(1, n)) * 100}%`;
  const showRef = state !== 'unavailable' && state !== 'no-simple-range';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-block h-2 w-16 shrink-0 border-y align-middle',
        tone === 'deep' ? 'border-rule-inv' : 'border-rule',
        className,
      )}
    >
      {state === 'unavailable' ? (
        <span
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(135deg, rgba(38,32,26,0.09) 0 4px, transparent 4px 8px)',
          }}
        />
      ) : null}
      {showRef ? (
        <span
          className="absolute inset-y-0 bg-sage/40"
          style={{ left: pct(refLow), width: pct(refHigh - refLow) }}
        />
      ) : null}
      {typeof value === 'number' ? (
        <span className="absolute -top-[3px] -bottom-[3px] w-0.5 bg-amber" style={{ left: pct(value) }} />
      ) : null}
    </span>
  );
}

/** The human-readable state label. Always rendered — colour is never alone. */
export function RangeStateLabel({ state, tone = 'light' }: { state: RangeState; tone?: 'light' | 'deep' }) {
  const map: Record<RangeState, { text: string; cls: string } | null> = {
    'reference-only': null,
    inside: { text: 'Inden for området', cls: 'text-sage-deep' },
    'outside-low': { text: 'Under området', cls: 'text-brick' },
    'outside-high': { text: 'Over området', cls: 'text-brick' },
    'no-simple-range': { text: 'Vurderes i sammenhæng', cls: 'text-ink-3' },
    unavailable: { text: 'Afventer laboratoriet', cls: 'text-ink-3' },
  };
  const s = map[state];
  if (!s) return null;
  return (
    <span
      className={cn(
        'font-mono text-[10px] uppercase tracking-[0.1em]',
        tone === 'deep' ? 'text-on-deep-muted' : s.cls,
      )}
    >
      {s.text}
    </span>
  );
}

/** A measured value with its unit at 0.42× in muted ink (Phase 2 §07). */
export function Value({
  value,
  unit,
  size = 'md',
  className,
}: {
  value: string | number;
  unit?: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    md: 'text-[20px]',
    lg: 'text-[clamp(24px,1.4vw+19px,32px)]',
    xl: 'text-[clamp(50px,7vw,86px)] leading-[0.9]',
  } as const;
  return (
    <span className={cn('font-mono tabular tracking-[-0.01em]', sizes[size], className)}>
      {value}
      {unit ? <span className="ml-[6px] text-[0.42em] tracking-[0.04em] text-ink-3">{unit}</span> : null}
    </span>
  );
}
