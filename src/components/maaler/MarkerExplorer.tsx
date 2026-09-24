'use client';

import { useMemo, useState } from 'react';
import { biomarkers } from '@/data/clinical/biomarkers';
import type { Biomarker } from '@/data/clinical/types';
import { ClinicalText, ClinicalTag } from '@/components/clinical/ClinicalText';
import { RangeBand } from '@/components/nulpunkt/RangeBand';
import { resolve } from '@/lib/clinical';
import { cn } from '@/lib/cn';

/**
 * /hvad-vi-maaler — the marker explorer.
 *
 * Interaction: expansion IN PLACE via native <details>. Chosen on usability
 * grounds (Phase 4 §05): you keep your place in the area, one implementation
 * serves both viewports, and the browser gives keyboard operation,
 * screen-reader semantics and find-in-page for free.
 *
 * Search: a live FILTER, not a search engine. At ~34 markers a results page
 * would be more machinery than the content justifies — but people arrive with
 * a word, not an area, so the filter is what makes Layer 1 navigation safe.
 * Revisit above ~60 markers.
 */

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'oe')
    .replaceAll('å', 'aa')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function haystack(m: Biomarker): string {
  return normalise([m.name, m.nameEn ?? '', ...m.synonyms].join(' '));
}

export function MarkerExplorer({ areaLabel }: { areaLabel: string }) {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = normalise(query);
    if (!q) return biomarkers;
    return biomarkers.filter((m) => haystack(m).includes(q));
  }, [query]);

  return (
    <>
      <div className="sticky top-[60px] z-30 -mx-[clamp(20px,4vw,64px)] border-y border-rule bg-cream px-[clamp(20px,4vw,64px)] lg:top-[72px]">
        <div className="flex min-h-[50px] flex-wrap items-center gap-5">
          <p className="u-label py-[11px]">{areaLabel}</p>
          <div className="ml-auto flex items-center gap-[10px] py-[9px]">
            <label htmlFor="marker-filter" className="u-label">
              Find markør
            </label>
            <input
              id="marker-filter"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="fx kolesterol"
              className="w-[150px] rounded-none border-b border-rule bg-transparent py-[6px] text-[14px] text-ink placeholder:text-ink-3 focus:border-b-2 focus:border-forest focus:pb-[5px] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div
        className="mt-8 grid grid-cols-[minmax(0,1fr)_20px] gap-[18px] border-b border-rule pb-[10px] lg:grid-cols-[minmax(0,1fr)_88px_110px_20px]"
        aria-hidden="true"
      >
        <span className="u-label">Markør</span>
        <span className="u-label hidden text-right lg:block">Enhed</span>
        <span className="u-label hidden text-right lg:block">Indgår i</span>
        <span />
      </div>

      <div>
        {rows.map((m) => (
          <MarkerRow key={m.slug} marker={m} />
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="py-7 text-body">
          Ingen markører matcher.{' '}
          <span className="u-label">Prøv fx &quot;kolesterol&quot; eller &quot;d-vitamin&quot;</span>
        </p>
      ) : (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3" aria-live="polite">
          {query ? `${rows.length} af ${biomarkers.length} vist` : `${biomarkers.length} markører`}
        </p>
      )}
    </>
  );
}

function MarkerRow({ marker }: { marker: Biomarker }) {
  const unit = resolve(marker.unit);

  return (
    <details id={`markor-${marker.slug}`} className="group border-b border-rule-soft">
      <summary className="grid cursor-pointer grid-cols-[minmax(0,1fr)_20px] items-center gap-[18px] py-[15px] lg:grid-cols-[minmax(0,1fr)_88px_110px_20px]">
        <span>
          <span className="block text-[16px] font-medium transition-colors duration-hover ease-pandonia group-open:text-forest">
            {marker.name}
            {marker.pronunciation ? (
              <span className="ml-2 font-mono text-[11px] font-normal text-ink-3">
                {marker.pronunciation}
              </span>
            ) : null}
          </span>
          <ClinicalText
            field={marker.summary}
            as="span"
            className="mt-[2px] block max-w-[54ch] font-serif text-[14.5px] leading-[1.45] text-ink-2"
          />
        </span>
        <span className="hidden text-right font-mono text-[10.5px] tracking-[0.07em] text-ink-3 lg:block">
          {unit.kind === 'value' ? unit.value : '—'}
        </span>
        <span className="hidden text-right font-mono text-[10.5px] tracking-[0.07em] text-ink-3 lg:block">
          Health Test
        </span>
        <span
          aria-hidden="true"
          className="text-right text-[17px] text-ink-3 transition-transform duration-hover ease-pandonia group-open:rotate-45 group-open:text-forest"
        >
          +
        </span>
      </summary>

      <div className="grid gap-5 pb-7 pt-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-9">
        <dl className="m-0 grid grid-cols-1 gap-x-5 text-[15px] lg:grid-cols-[130px_minmax(0,1fr)]">
          {marker.isPanel ? (
            <Field label="Bemærk">
              <span className="inline-block border border-brick px-[6px] py-[2px] font-mono text-[9px] uppercase tracking-[0.11em] text-brick">
                Panel — indhold ukendt
              </span>{' '}
              <span className="text-body-s">
                Pandonia offentliggør ikke hvilke enkeltmarkører dette dækker. Et panel vises
                som flere markører, ikke som ét bånd.
              </span>
            </Field>
          ) : null}

          <Field label="Hvad er det">
            <ClinicalText field={marker.whatItIs} as="span" />
          </Field>
          <Field label="Hvorfor måler vi det">
            <ClinicalText field={marker.whyWeMeasure} as="span" />
          </Field>
          <Field label="Hvad kan det pege på">
            <ClinicalText field={marker.whatItMayIndicate} as="span" />
          </Field>
          <Field label="Måleenhed">
            {unit.kind === 'value' ? unit.value : <ClinicalTag field={marker.unit} />}
          </Field>
          <Field label="Referenceområde">
            <ClinicalTag field={marker.range} />
          </Field>
          <Field label="Varierer efter">
            <ClinicalTag field={marker.variesBy} />
          </Field>
        </dl>

        <div className="bg-ink/[0.035] p-5">
          <p className="u-label mb-3">Referenceområde</p>
          <RangeBand state="unavailable" axisNote="afventer laboratoriet" />

          <div className="mt-[18px] border-t border-rule-soft pt-[14px]">
            <p className="u-label mb-[6px]">Områder</p>
            <ClinicalTag field={marker.areas} />
            <p className="u-label mb-[6px] mt-[14px]">Biologisk system</p>
            <ClinicalTag field={marker.systems} />
          </div>
        </div>
      </div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="border-b-0 pb-0 pt-[9px] font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink-3 lg:border-b lg:border-rule-soft lg:pb-[9px]">
        {label}
      </dt>
      <dd className={cn('m-0 border-b border-rule-soft pb-[9px] pt-[2px] leading-[1.5] lg:pt-[9px]')}>
        {children}
      </dd>
    </>
  );
}
