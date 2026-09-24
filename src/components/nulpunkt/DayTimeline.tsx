'use client';

import { useEffect, useRef, useState } from 'react';
import { PhotoBlock } from '@/components/editorial/PhotoBlock';
import { MicroBand } from '@/components/nulpunkt/RangeBand';
import { day } from '@/content/home';
import type { ShotId } from '@/content/images';
import { cn } from '@/lib/cn';

/**
 * BEAT 06 — the day. The page's ONE orchestrated motion moment.
 *
 * Desktop: five moments on one full-width hairline, photographs alternating
 * up and down so the row never reads as a card grid.
 * Mobile: a VERTICAL timeline with the rule down the left edge — genuinely
 * redesigned, not reflowed (Phase 5 §08).
 *
 * Motion: the rule draws left to right once as the section enters; moments
 * stagger in at 60ms. Everything starts VISIBLE (opacity .6) so the section
 * is complete in the first paint. Respects prefers-reduced-motion.
 *
 * Deliberately no animation library: this is ~30 lines of IntersectionObserver
 * against a 40KB dependency, and the Phase 5 budget is 40KB of JS total.
 */
export function DayTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '-15% 0px -15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* ---------- desktop: horizontal ---------- */}
      <div className="hidden lg:block">
        <ol className="grid grid-cols-5 items-end gap-[clamp(8px,1.4vw,20px)] list-none p-0">
          {day.moments.map((m, i) => (
            <li
              key={m.time}
              className={cn('reveal', m.offset && 'pb-[30px]')}
              data-shown={shown}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <PhotoBlock id={m.imageId as ShotId} sizes="(min-width:1024px) 18vw, 90vw" />
            </li>
          ))}
        </ol>

        <div className="relative mt-[26px] h-px bg-[var(--rule)]">
          <div
            className="absolute inset-y-0 left-0 bg-forest origin-left"
            style={{
              width: '100%',
              transform: shown ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform var(--dur-orchestrated) var(--ease)',
            }}
            aria-hidden="true"
          />
          {[8, 29, 50, 92].map((left) => (
            <span
              key={left}
              aria-hidden="true"
              className="absolute -top-1 h-[9px] w-px bg-ink/50"
              style={{ left: `${left}%` }}
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute -top-1 h-[9px] w-[9px] rounded-full bg-amber"
            style={{
              left: 'calc(71% - 4px)',
              opacity: shown ? 1 : 0,
              transition: 'opacity var(--dur-reveal) var(--ease) 700ms',
            }}
          />
        </div>

        <ol className="mt-[14px] grid grid-cols-5 gap-[clamp(8px,1.4vw,20px)] list-none p-0">
          {day.moments.map((m, i) => (
            <li
              key={m.time}
              className="reveal"
              data-shown={shown}
              style={{ transitionDelay: `${i * 60 + 120}ms` }}
            >
              <p
                className={cn(
                  'font-mono text-[10.5px] tracking-[0.1em]',
                  m.isArrival ? 'text-amber' : 'text-ink-3',
                )}
              >
                {m.time}
              </p>
              <h3 className="mt-1 text-h3">{m.title}</h3>
              <p className="mt-[3px] text-body-s">{m.body}</p>
              {m.isArrival ? (
                <MicroBand state="inside" refLow={0.26} refHigh={0.8} value={0.41} className="mt-2 !w-full" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- mobile: vertical, rule down the left edge ---------- */}
      <ol className="list-none p-0 lg:hidden">
        {day.moments.map((m, i) => (
          <li
            key={m.time}
            className="reveal relative grid grid-cols-[58px_minmax(0,1fr)] gap-4 pb-8"
            data-shown={shown}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[10px] top-2 w-px bg-[var(--rule)]"
            />
            <div className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-[7px] top-[7px] h-[7px] w-[7px] rounded-full',
                  m.isArrival ? 'bg-amber' : 'bg-ink/45',
                )}
              />
              <p
                className={cn(
                  'pl-[22px] font-mono text-[10.5px] tracking-[0.1em]',
                  m.isArrival ? 'text-amber' : 'text-ink-3',
                )}
              >
                {m.time}
              </p>
            </div>
            <div>
              <h3 className="text-h3">{m.title}</h3>
              <p className="mt-[3px] text-body-s">{m.body}</p>
              <PhotoBlock
                id={m.imageId as ShotId}
                mobile
                className="mt-3"
                sizes="(max-width:1023px) 70vw, 20vw"
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
