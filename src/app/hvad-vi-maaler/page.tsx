import type { Metadata } from 'next';
import { Section, Split } from '@/components/layout/Section';
import { PhotoBlock } from '@/components/editorial/PhotoBlock';
import { Cta, EditorialLink } from '@/components/ui/Button';
import { ClinicalText, ClinicalTag, ClinicalValue } from '@/components/clinical/ClinicalText';
import { MarkerExplorer } from '@/components/maaler/MarkerExplorer';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import { healthAreas, whatWeDoNotMeasure } from '@/data/clinical/health-areas';
import { biologicalSystems, modelIntro } from '@/data/clinical/biological-systems';
import { biomarkers } from '@/data/clinical/biomarkers';
import { resolve } from '@/lib/clinical';

export const metadata: Metadata = {
  title: 'Hvad vi måler',
  description:
    'Ét tal fortæller sjældent noget alene. Se de markører Pandonia måler, hvad de kan fortælle, og hvordan de hænger sammen.',
  alternates: { canonical: '/hvad-vi-maaler' },
};

/**
 * /hvad-vi-maaler — meaning → area → marker → detail.
 * The count is deliberately demoted: it appears first beside an area name,
 * never in the opening (Phase 4 §01).
 */
export default function HvadViMaalerPage() {
  const dVitamin = biomarkers.find((m) => m.slug === 'd-vitamin');
  const firstArea = healthAreas[0];
  const areaName = firstArea ? resolve(firstArea.name) : null;

  return (
    <>
      {/* ---- opening: one marker touching three concerns ---- */}
      <Section ground="cream" density="none" className="pb-[clamp(28px,4vw,52px)] pt-[clamp(36px,6vw,80px)]">
        <Split ratio="62-38" align="start" gap="wide">
          <div>
            <h1 className="max-w-meas-s font-serif text-d2 text-forest">
              Ét tal fortæller sjældent noget alene.
            </h1>
            <p className="mt-7 max-w-meas-n text-body-l text-ink-2">
              En blodprøve er ikke en facitliste. Den er en række målinger, der først bliver til
              noget, når man ser dem sammen — og sammen med det, du ved om dit eget liv.
            </p>
            <p className="mt-4 max-w-meas-n text-body">
              Tag D-vitamin. Én måling, der rører ved tre forskellige ting på én gang:
            </p>

            {dVitamin ? (
              <div className="mt-[30px] max-w-[48ch] border-t border-rule pt-[22px]">
                <div className="mb-3 flex flex-wrap items-baseline gap-[14px]">
                  <span className="font-serif text-[26px] text-forest">{dVitamin.name}</span>
                  <ClinicalTag field={dVitamin.whatItIs} />
                </div>
                <ClinicalText field={dVitamin.whatItIs} className="mb-[18px] text-body-s" />

                <ul className="m-0 grid list-none grid-cols-1 gap-px bg-rule p-0 sm:grid-cols-3">
                  {['Immunforsvar', 'Knoglestyrke', 'Mental balance'].map((concern) => (
                    <li key={concern} className="bg-cream px-3 py-[11px]">
                      <span className="u-label mb-1 block">Rører ved</span>
                      <span className="text-[14px] font-medium">{concern}</span>
                    </li>
                  ))}
                </ul>
                <p className="u-label mt-3">
                  Derfor hører markører til flere steder på én gang
                </p>
              </div>
            ) : null}

            <div className="mt-7">
              <EditorialLink href="/book">Se hvad et tjek koster</EditorialLink>
            </div>
          </div>

          <PhotoBlock id="HALS-01" sizes="(min-width:1024px) 34vw, 100vw" />
        </Split>
      </Section>

      {/* ---- index bar + marker explorer (client island) ---- */}
      <Section ground="cream" density="dense">
        <Split ratio="55-45" align="start" className="mb-[30px]">
          <div>
            <div className="flex flex-wrap items-baseline gap-4">
              <h2 className="font-serif text-d3 text-forest">
                {areaName?.kind === 'value' ? areaName.value : 'Område'}
              </h2>
              {firstArea ? (
                <span className="font-mono text-[12px] tracking-[0.09em] text-ink-3">
                  <ClinicalValue field={firstArea.markerCount} /> MARKØRER
                </span>
              ) : null}
            </div>
            {firstArea ? (
              <ClinicalText field={firstArea.intro} className="mt-4 max-w-[48ch] text-body" />
            ) : null}
            <p className="u-label mt-4">
              Områdenavn fra konceptet · ikke bekræftet på pandonia.com
            </p>
          </div>
          <PhotoBlock id="ARM-01" sizes="(min-width:1024px) 45vw, 100vw" />
        </Split>

        <MarkerExplorer areaLabel={areaName?.kind === 'value' ? areaName.value : 'Alle markører'} />

        <div className="mt-[30px] border-t border-rule pt-[18px]">
          <p className="u-label mb-2">Bag dette område — Pandonia-modellen</p>
          {firstArea ? <ClinicalTag field={firstArea.systems} /> : null}
        </div>
      </Section>

      {/* ---- the model chapter: Layer 2 explained once ---- */}
      <Section ground="deep" density="standard" id="modellen" labelledBy="modellen-h">
        <h2 id="modellen-h" className="max-w-meas-s font-serif text-d3">
          Kroppen arbejder ikke i kasser.
        </h2>
        <p className="mt-[14px] max-w-meas-n text-body text-on-deep-muted">
          Områderne ovenfor er den nemmeste måde at finde rundt på. Men en markør hører sjældent kun
          ét sted til — og det er dét, Pandonia-modellen beskriver.
        </p>
        <ClinicalText field={modelIntro} tone="deep" className="mt-4 max-w-meas-n text-body" />

        {/* The one figure. Used once on the whole site (Phase 4 §06). */}
        <figure className="my-[30px] border-y border-rule-inv py-8">
          <figcaption className="u-label mb-6 text-on-deep-quiet">
            Én markør · flere områder · flere systemer
          </figcaption>
          <div className="grid max-w-[680px] grid-cols-1 items-center gap-[clamp(10px,2vw,26px)] sm:grid-cols-3">
            <p className="text-[14.5px] leading-[1.75]">
              Immunforsvar
              <br />
              Knoglestyrke
              <br />
              Mental balance
              <span className="u-label mt-2 block text-on-deep-quiet">Områder · lag 1</span>
            </p>
            <p className="relative text-center">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 hidden h-px bg-rule-inv sm:block"
              />
              <span className="relative bg-deep px-[14px] font-serif text-[clamp(18px,2.2vw,28px)]">
                D-vitamin
              </span>
            </p>
            <p className="font-mono text-[12px] leading-[1.85] tracking-[0.06em] text-on-deep-muted sm:text-right">
              AFVENTER
              <br />
              KLINISK
              <br />
              MAPPING
              <span className="u-label mt-2 block text-on-deep-quiet">Systemer · lag 2</span>
            </p>
          </div>
          <p className="mt-5 max-w-[52ch] text-body-s text-on-deep-quiet">
            Venstre side er verificeret — Pandonias egen beskrivelse. Højre side afventer.
          </p>
        </figure>

        <p className="font-mono text-[11.5px] leading-[1.8] tracking-[0.07em] text-on-deep-muted">
          {biologicalSystems
            .map((s) => {
              const n = resolve(s.nameDa);
              return n.kind === 'value' ? n.value.toUpperCase() : '—';
            })
            .join(' · ')}
        </p>
        <p className="mt-[10px] font-mono text-[9.5px] uppercase tracking-[0.1em] text-amber">
          To af disse seks navne er sendt til klinisk gennemsyn
        </p>
      </Section>

      {/* ---- what we do not measure. No competitor has this. ---- */}
      <Section ground="sand" density="standard">
        <h2 className="max-w-meas-s font-serif text-d3 text-forest">Hvad vi ikke måler.</h2>
        <ClinicalText field={whatWeDoNotMeasure} className="mt-5 max-w-meas-n text-body" />
        <div className="mt-8 flex flex-wrap items-center gap-[22px]">
          <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
          <EditorialLink href="/din-rapport">Se hvordan resultatet ser ud</EditorialLink>
        </div>
      </Section>
    </>
  );
}
