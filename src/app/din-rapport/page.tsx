import type { Metadata } from 'next';
import { Section, Split } from '@/components/layout/Section';
import { PhotoBlock } from '@/components/editorial/PhotoBlock';
import { Cta, EditorialLink } from '@/components/ui/Button';
import { ClinicalText, ClinicalValue } from '@/components/clinical/ClinicalText';
import { MicroBand, RangeBand, RangeStateLabel, Value } from '@/components/nulpunkt/RangeBand';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import {
  consultationSection,
  demoMarker,
  rangePrinciples,
  reportOpening,
  scoreSection,
} from '@/content/report';
import { healthAreas } from '@/data/clinical/health-areas';
import { scoreBasis, scoreComparability } from '@/data/clinical/claims';

export const metadata: Metadata = {
  title: 'Din rapport',
  description:
    'Hvad du får, før du køber: hver måling med sit referenceområde, en forklaring på almindeligt dansk, og en læge der læser den med dig.',
  alternates: { canonical: '/din-rapport' },
};

/**
 * /din-rapport — the result experience, explained before purchase.
 * Every number is demonstration data and says so on the component.
 * No medical interpretation is invented.
 */
export default function DinRapportPage() {
  return (
    <>
      <Section ground="cream" density="none" className="pb-[clamp(24px,3vw,44px)] pt-[clamp(36px,6vw,80px)]">
        <Split ratio="62-38" align="start" gap="wide">
          <div>
            <h1 className="max-w-[19ch] font-serif text-d2 text-forest">{reportOpening.heading}</h1>
            <p className="mt-7 max-w-[50ch] text-body-l text-ink-2">{reportOpening.standfirst}</p>
          </div>
          <PhotoBlock id="SKAERM-01" sizes="(min-width:1024px) 34vw, 100vw" />
        </Split>
      </Section>

      {/* ---- the marker panel. The one permitted 8px radius on the site. ---- */}
      <Section ground="sand" density="standard">
        <p className="u-label mb-[18px]">{demoMarker.label}</p>

        <div className="max-w-[720px] rounded-panel border border-rule bg-paper p-[clamp(20px,3vw,34px)]">
          <div className="mb-[6px] flex flex-wrap items-baseline justify-between gap-5">
            <span className="text-h2">{demoMarker.name}</span>
            <span className="inline-block border border-brick px-[6px] py-[2px] font-mono text-[9px] uppercase tracking-[0.11em] text-brick">
              Demodata — ikke en Pandonia-værdi
            </span>
          </div>
          <p className="clinical-placeholder mb-[22px] text-body-s">
            <b className="mb-[3px] block font-mono text-[9px] font-normal uppercase tracking-[0.11em] text-brick">
              Afventer klinisk tekst
            </b>
            Én sætning om hvad markøren fortæller, på almindeligt dansk.
          </p>

          <div className="mb-3 flex items-baseline justify-between gap-5">
            <Value value={demoMarker.demoValue} unit={demoMarker.demoUnit} size="lg" />
            <RangeStateLabel state="inside" />
          </div>
          <RangeBand
            state="inside"
            refLow={0.26}
            refHigh={0.78}
            value={0.48}
            axisMin="0"
            axisMax="250"
            axisNote="reference 30–160 · demodata"
          />

          <dl className="mt-[22px] grid grid-cols-1 gap-[18px_26px] border-t border-rule-soft pt-4 sm:grid-cols-3">
            <div>
              <dt className="u-label mb-[5px]">Områder</dt>
              <dd className="m-0 text-[14px]">
                <ClinicalValue field={healthAreas[0]!.name} />
              </dd>
            </div>
            <div>
              <dt className="u-label mb-[5px]">Biologisk system</dt>
              <dd className="m-0 font-mono text-[11.5px] text-ink-2">AFVENTER</dd>
            </div>
            <div>
              <dt className="u-label mb-[5px]">Sidste måling</dt>
              <dd className="m-0 font-mono text-[12px] text-ink-3">Første gang</dd>
            </div>
          </dl>
        </div>

        {/* Rows on rules, not a four-column feature grid (Phase 5 fingerprint pass). */}
        <div className="mt-11 max-w-[760px]">
          {rangePrinciples.map((p, i) => (
            <div
              key={p.title}
              className={`grid grid-cols-1 gap-[14px_40px] py-[18px] lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] ${
                i === 0 ? 'border-t border-rule' : 'border-t border-rule-soft'
              } ${i === rangePrinciples.length - 1 ? 'border-b border-rule-soft' : ''}`}
            >
              <h2 className="text-h3">{p.title}</h2>
              <p className="text-body-s">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- the score: the same object as a single marker ---- */}
      <Section ground="deep" density="standard">
        <Split ratio="42-58" align="start">
          <div>
            <p className="u-label mb-[10px] text-on-deep-quiet">{scoreSection.label}</p>
            <Value value={scoreSection.demoScore} unit="/ 100" size="xl" />
            <RangeBand
              state="inside"
              refLow={0.58}
              refHigh={1}
              value={0.78}
              axisMin="0"
              axisMax="100"
              axisNote="eksempeldata"
              tone="deep"
              className="mt-[22px]"
            />
          </div>
          <div>
            <h2 className="max-w-meas-s font-serif text-d3">{scoreSection.heading}</h2>
            <p className="mt-4 u-measure text-body text-on-deep-muted">{scoreSection.body}</p>
            <ClinicalText field={scoreBasis} tone="deep" className="mt-4 u-measure text-body" />
            <ClinicalText field={scoreComparability} tone="deep" className="mt-4 u-measure text-body" />

            <ul className="mt-7 m-0 list-none p-0">
              {healthAreas.slice(0, 3).map((area, i) => (
                <li
                  key={area.slug}
                  className="flex items-center justify-between gap-4 border-b border-rule-inv-soft py-[10px]"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="min-w-[170px] text-[15px]">
                      <ClinicalValue field={area.name} />
                    </span>
                    <MicroBand state="inside" refLow={0.58} refHigh={1} value={[0.82, 0.74, 0.8][i]} tone="deep" />
                  </span>
                  <span className="font-mono tabular text-[12px]">{[82, 74, 80][i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </Split>
      </Section>

      {/* ---- the consultation ---- */}
      <Section ground="cream" density="standard">
        <Split ratio="38-62" align="center" gap="wide">
          <PhotoBlock id="PORTRAET-01" sizes="(min-width:1024px) 38vw, 100vw" />
          <div>
            <h2 className="max-w-meas-s font-serif text-d3 text-forest">
              {consultationSection.heading}
            </h2>
            <p className="mt-[18px] u-measure text-body">{consultationSection.body}</p>
            <p className="mt-[14px] text-body-s">
              Konsultationen er inkluderet. Du booker den, når du har haft svaret i mindst tre timer.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-[22px]">
              <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
              <EditorialLink href={consultationSection.linkHref}>
                {consultationSection.linkLabel}
              </EditorialLink>
            </div>
          </div>
        </Split>
      </Section>
    </>
  );
}
