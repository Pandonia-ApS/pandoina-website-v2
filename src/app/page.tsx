import { Bleed, Container, Section, Split } from '@/components/layout/Section';
import { PhotoBand, PhotoBlock } from '@/components/editorial/PhotoBlock';
import { Cta, EditorialLink } from '@/components/ui/Button';
import { ClinicalText, ClinicalTag, ClinicalValue } from '@/components/clinical/ClinicalText';
import { MicroBand, RangeBand, RangeStateLabel, Value } from '@/components/nulpunkt/RangeBand';
import { DayTimeline } from '@/components/nulpunkt/DayTimeline';
import {
  areasPreview,
  breath,
  close,
  day,
  doctorAndLab,
  featuredMarker,
  groundLine,
  hero,
  pricing,
  reportPreview,
  why,
} from '@/content/home';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import { healthAreas } from '@/data/clinical/health-areas';
import { biologicalSystems } from '@/data/clinical/biological-systems';
import { biomarkers, biomarkerCount } from '@/data/clinical/biomarkers';
import { ownLaboratory, scoreBasis } from '@/data/clinical/claims';
import { flagshipProducts, formatDkk } from '@/content/products';
import { resolve } from '@/lib/clinical';

/**
 * FORSIDE — eleven beats in three acts (Phase 5).
 * Server component throughout; the only client islands are the header and
 * the day timeline.
 *
 * Rhythm invariant: no beat repeats the previous beat's ground AND density.
 *   cream/air · cream/dense · sand/air · sand/dense · image/air ·
 *   cream/std · deep/std · deep/dense · cream/air · sand/std · cream/air
 */
export default function HomePage() {
  const dVitamin = biomarkers.find((m) => m.slug === featuredMarker.slug);
  const summary = dVitamin ? resolve(dVitamin.summary) : null;
  const unit = dVitamin ? resolve(dVitamin.unit) : null;

  return (
    <>
      {/* ---- 01 HERO — V2 Editorial. Static: a record does not perform. ---- */}
      <Section ground="cream" density="none" className="pb-[clamp(40px,6vw,80px)] pt-[clamp(28px,5vw,66px)]">
        <Split ratio="62-38" align="start">
          <div>
            <h1 className="grid grid-cols-[62px_minmax(0,1fr)] items-baseline gap-x-5">
              {hero.fragments.map((f) => (
                <span key={f.time} className="contents">
                  <span
                    className={`text-right font-mono text-[10.5px] tracking-[0.1em] ${
                      f.countIsClinical ? 'text-amber' : 'text-ink-3'
                    }`}
                  >
                    {f.time}
                    {f.countIsClinical ? (
                      <ClinicalTag field={biomarkerCount} className="mt-[5px] block !border-0 !px-0" />
                    ) : null}
                  </span>
                  <span
                    className="font-serif text-d1 text-forest"
                    style={{ paddingLeft: f.indent }}
                  >
                    {f.text}
                  </span>
                </span>
              ))}
            </h1>

            <p className="ml-[82px] mt-[34px] max-w-meas-n text-body-l text-ink-2">
              {hero.standfirst}
            </p>

            <div className="ml-[82px] mt-[26px] flex flex-wrap items-center gap-[22px]">
              <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
              <EditorialLink href={hero.secondaryHref}>{hero.secondaryLabel}</EditorialLink>
            </div>
          </div>

          <PhotoBlock id="ARM-01" className="-mt-7" sizes="(min-width:1024px) 34vw, 100vw" />
        </Split>
      </Section>

      {/* ---- 02 GRUNDLAGET — mechanism, not duration ---- */}
      <Section ground="cream" density="none" className="pb-[30px] pt-[6px]">
        <div className="flex flex-wrap gap-[12px_40px] border-y border-rule py-[18px] font-mono text-[11px] uppercase tracking-[0.11em] text-ink-2">
          <span>
            <ClinicalValue field={biomarkerCount} /> biomarkører{' '}
            <ClinicalTag field={biomarkerCount} className="ml-[6px]" />
          </span>
          {groundLine.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </Section>

      {/* ---- 03 HVORFOR — the quietest screen on the site ---- */}
      <Section ground="sand" density="air">
        <div className="ml-[8%] max-w-[54ch]">
          <h2 className="font-serif text-d2 text-forest">{why.heading}</h2>
          <p className="mt-[26px] text-body">{why.body}</p>
          <p className="u-label mt-[26px]">{why.note}</p>
        </div>
      </Section>

      {/* ---- 04 ÉN MARKØR — depth before volume ---- */}
      <Bleed ground="sand">
        <Split ratio="42-58" align="stretch" gap="none">
          <PhotoBlock
            id="HALS-01"
            className="min-h-[340px] !aspect-auto"
            sizes="(min-width:1024px) 42vw, 100vw"
          />
          <div className="px-[clamp(20px,4vw,64px)] py-[clamp(40px,5vw,72px)]">
            <p className="u-label mb-[14px]">{featuredMarker.eyebrow}</p>
            <h2 className="max-w-meas-s font-serif text-d3 text-forest">
              {summary?.kind === 'value' ? summary.value : 'Én måling ad gangen.'}
            </h2>
            {dVitamin ? (
              <>
                <ClinicalText
                  field={dVitamin.whatItIs}
                  className="mb-2 mt-[18px] max-w-meas-n text-body"
                />
                <ClinicalTag field={dVitamin.summary} />
              </>
            ) : null}

            <div className="mt-[26px] max-w-[420px]">
              <div className="mb-[10px] flex items-baseline justify-between gap-4">
                <Value value="62" unit={unit?.kind === 'value' ? unit.value : undefined} size="lg" />
                <RangeStateLabel state="inside" />
              </div>
              {/* Homepage never shows an out-of-range value (Phase 3 Rev B §08). */}
              <RangeBand
                state="inside"
                refLow={0.28}
                refHigh={0.84}
                value={0.37}
                axisMin="0"
                axisMax="200"
                axisNote="referenceområde afventer laboratoriet"
              />
            </div>

            <div className="mt-[26px]">
              <EditorialLink href={featuredMarker.linkHref}>{featuredMarker.linkLabel}</EditorialLink>
            </div>
          </div>
        </Split>
      </Bleed>

      {/* ---- 05 VEJRTRÆKNINGEN — no heading, no CTA, no link ---- */}
      <PhotoBand id="RUM-01" caption={breath.caption} />

      {/* ---- 06 DAGEN — the one orchestrated moment ---- */}
      <Section ground="cream" density="standard">
        <h2 className="max-w-meas-s font-serif text-d3 text-forest">{day.heading}</h2>
        <p className="mb-10 mt-4 max-w-meas-n text-body">{day.standfirst}</p>
        <DayTimeline />
        <div className="mt-8">
          <EditorialLink href={day.linkHref}>{day.linkLabel}</EditorialLink>
        </div>
      </Section>

      {/* ---- 07 HVAD VI MÅLER — the inversion ---- */}
      <Section ground="deep" density="standard" labelledBy="beat-areas">
        <h2 id="beat-areas" className="max-w-meas-s font-serif text-d3">
          {areasPreview.heading}
        </h2>
        <p className="mb-9 mt-[14px] max-w-meas-n text-body text-on-deep-muted">
          {areasPreview.standfirst}
        </p>

        <ul className="m-0 list-none p-0">
          {healthAreas.map((area) => {
            const name = resolve(area.name);
            return (
              <li
                key={area.slug}
                className="flex items-center justify-between gap-4 border-b border-rule-inv-soft py-[13px]"
              >
                <span className="flex min-w-0 items-center gap-4">
                  {name.kind === 'value' ? (
                    <span className="min-w-[230px] font-serif text-[clamp(19px,1.9vw,26px)]">
                      {name.value}
                    </span>
                  ) : (
                    <span className="min-w-[230px] font-mono text-[13px] uppercase tracking-[0.09em] text-on-deep-quiet">
                      {area.slug.replace('-', ' ')} — afventer
                    </span>
                  )}
                  <MicroBand
                    state={name.kind === 'value' ? 'reference-only' : 'unavailable'}
                    tone="deep"
                  />
                </span>
                <span className="whitespace-nowrap font-mono text-[12px] text-on-deep-quiet">
                  <ClinicalValue field={area.markerCount} /> markører
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 grid items-end gap-6 border-t border-rule-inv pt-[18px] lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="u-label mb-2 text-on-deep-quiet">{areasPreview.layerTwoLabel}</p>
            {/* Layer 2: mono, under a rule, never a link target (Phase 4 §06). */}
            <p className="font-mono text-[11.5px] leading-[1.8] tracking-[0.07em] text-on-deep-muted">
              {biologicalSystems
                .map((s) => (resolve(s.nameDa).kind === 'value' ? (resolve(s.nameDa) as { value: string }).value : '—'))
                .join(' · ')
                .toUpperCase()}
            </p>
          </div>
          <EditorialLink href={areasPreview.linkHref} tone="deep">
            {areasPreview.linkLabel}
          </EditorialLink>
        </div>
      </Section>

      {/* ---- 08 RAPPORTEN ----
          Phase 5 flagged 07→08 as flat. Kept as designed (Phase 6 §10) with a
          top hairline and extra air so it reads as a second movement, not a
          continuation. The flatness is a content problem — beat 08 is mostly
          placeholders until the score basis is confirmed — not a structural one. */}
      <Bleed ground="deep">
        <Container>
          <div className="border-t border-rule-inv pb-[clamp(40px,5vw,72px)] pt-[clamp(44px,6vw,88px)]">
            <Split ratio="42-58" align="start">
              <div>
                <p className="u-label mb-[10px] text-on-deep-quiet">{reportPreview.scoreLabel}</p>
                <Value value={reportPreview.demoScore} unit="/ 100" size="xl" />
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
                <ClinicalText field={scoreBasis} tone="deep" className="mt-5 text-body-s" />
              </div>

              <div className="lg:mt-[26px]">
                <ul className="m-0 list-none p-0">
                  {healthAreas.slice(0, 3).map((area, i) => (
                    <li
                      key={area.slug}
                      className="flex items-center justify-between gap-4 border-b border-rule-inv-soft py-[10px]"
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <span className="min-w-[180px] text-[15px]">
                          <ClinicalValue field={area.name} />
                        </span>
                        <MicroBand
                          state="inside"
                          refLow={0.58}
                          refHigh={1}
                          value={(reportPreview.demoAreaScores[i] ?? 78) / 100}
                          tone="deep"
                        />
                      </span>
                      <span className="font-mono tabular text-[12px]">
                        {reportPreview.demoAreaScores[i]}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between gap-4 border-b border-rule-inv-soft py-[10px]">
                    <span className="min-w-[180px] font-mono text-[12px] uppercase tracking-[0.09em] text-on-deep-quiet">
                      Område 4–6 afventer
                    </span>
                    <span className="font-mono text-[12px] text-on-deep-quiet">—</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <EditorialLink href={reportPreview.linkHref} tone="deep">
                    {reportPreview.linkLabel}
                  </EditorialLink>
                </div>
              </div>
            </Split>
          </div>
        </Container>
      </Bleed>

      {/* ---- 09 LÆGEN OG LABORATORIET — mechanism before consequence ---- */}
      <Bleed ground="cream">
        <Split ratio="42-58" align="center" gap="none">
          <PhotoBlock
            id="PORTRAET-01"
            className="min-h-[380px] !aspect-auto"
            sizes="(min-width:1024px) 42vw, 100vw"
          />
          <div className="px-[clamp(20px,4vw,64px)] py-[clamp(72px,11vw,180px)]">
            <h2 className="max-w-meas-s font-serif text-d3 text-forest">{doctorAndLab.heading}</h2>
            <p className="mb-[26px] mt-5 max-w-meas-n text-body">{doctorAndLab.body}</p>
            <div className="max-w-[46ch] border-t border-rule pt-[18px]">
              <p className="u-label mb-2">{doctorAndLab.labLabel}</p>
              <ClinicalText field={ownLaboratory} className="text-body-s" />
              <div className="mt-4">
                <EditorialLink href={doctorAndLab.linkHref}>{doctorAndLab.linkLabel}</EditorialLink>
              </div>
            </div>
          </div>
        </Split>
      </Bleed>

      {/* ---- 10 PRIS — rows on rules, never cards ---- */}
      <Section ground="sand" density="standard">
        <h2 className="mb-[26px] max-w-meas-s font-serif text-d3 text-forest">{pricing.heading}</h2>
        <ul className="m-0 max-w-[680px] list-none p-0">
          {flagshipProducts.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-4 border-b border-rule-soft py-[18px]"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-h3">{p.name}</span>
                <span className="max-w-meas-n text-body-s">{p.description}</span>
              </span>
              <span className="whitespace-nowrap font-mono tabular text-[15px]">
                {p.priceInclVat ? `${formatDkk(p.priceInclVat)} kr.` : '—'}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-[18px] max-w-[54ch] text-body-s">{pricing.footnote}</p>
        <div className="mt-[26px] flex flex-wrap items-center gap-[22px]">
          <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
          <EditorialLink href={pricing.linkHref}>{pricing.linkLabel}</EditorialLink>
        </div>
      </Section>

      {/* ---- 11 AFSLUTNING — the only centred type on the page ---- */}
      <Section ground="cream" density="air" className="text-center">
        <h2 className="mx-auto max-w-[20ch] font-serif text-d2 text-forest">{close.heading}</h2>
        <div className="mt-8">
          <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
        </div>
        <p className="u-label mt-7">{close.note}</p>
      </Section>
    </>
  );
}
