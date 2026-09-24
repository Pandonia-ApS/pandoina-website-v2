import type { Metadata } from 'next';
import { Section, Split } from '@/components/layout/Section';
import { PhotoBand, PhotoBlock } from '@/components/editorial/PhotoBlock';
import { Cta, EditorialLink } from '@/components/ui/Button';
import { ClinicalText, ClinicalTag } from '@/components/clinical/ClinicalText';
import { RangeBand, RangeStateLabel } from '@/components/nulpunkt/RangeBand';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import { processOpening, transitCaption } from '@/content/process';
import * as claims from '@/data/clinical/claims';

export const metadata: Metadata = {
  title: 'Sådan fungerer det',
  description:
    'Fra dit køkkenbord til dit svar. Forberedelse, prøvetagning, vores eget laboratorium i København, rapporten og samtalen med lægen.',
  alternates: { canonical: '/saadan-fungerer-det' },
};

/**
 * /saadan-fungerer-det
 *
 * STAGE WORDS, not clock times. The homepage owns the timeline; this page
 * owns what only it has — preparation, coverage, the laboratory, the
 * consultation mechanics (Phase 5 §03, duplication removal).
 */
export default function SaadanFungererDetPage() {
  return (
    <>
      <Section ground="cream" density="none" className="pb-[clamp(24px,3vw,40px)] pt-[clamp(36px,6vw,80px)]">
        <h1 className="max-w-[20ch] font-serif text-d2 text-forest">{processOpening.heading}</h1>
        <p className="mt-7 max-w-[52ch] text-body-l text-ink-2">{processOpening.standfirst}</p>
      </Section>

      <PhotoBand id="HAND-01" heightClass="min-h-[min(52vh,380px)]" />

      {/* ---- FØR ---- */}
      <Section ground="cream" density="standard">
        <Split ratio="42-58" align="start">
          <Stage word="Før" title="Aftenen inden" />
          <div>
            <ClinicalText field={claims.preparation} className="u-measure text-body" />
            <ClinicalText field={claims.morningRationale} className="u-measure mt-4 text-body" />
            <ClinicalText field={claims.morningMarkers} className="u-measure mt-4 text-body-s" />
            <div className="mt-4">
              <ClinicalTag field={claims.preparation} />
            </div>
          </div>
        </Split>
      </Section>

      {/* ---- MORGENEN ---- */}
      <Section ground="sand" density="standard">
        <Split ratio="42-58" align="start">
          <Stage word="Morgenen" title="Vi kommer til dig" />
          <div>
            <ClinicalText field={claims.phlebotomist} className="u-measure text-body" />
            <ClinicalText field={claims.drawDuration} className="u-measure mt-4 text-body" />
            <div className="mt-[22px] border-t border-rule-soft pt-4">
              <p className="u-label mb-2">Vi kommer i disse områder</p>
              <ClinicalText field={claims.coverageArea} className="text-body-s" />
              <div className="mt-[10px]">
                <ClinicalTag field={claims.coverageArea} />
              </div>
            </div>
          </div>
        </Split>
      </Section>

      <PhotoBand id="OBJ-01" caption={transitCaption} heightClass="min-h-[min(46vh,340px)]" />

      {/* ---- LABORATORIET — a chapter, not a page (Phase 5 §01) ---- */}
      <Section ground="deep" density="standard" id="laboratoriet" labelledBy="lab-h">
        <Split ratio="42-58" align="start">
          <Stage word="Midt på dagen" title="Laboratoriet" id="lab-h" tone="deep" />
          <div>
            <ClinicalText field={claims.ownLaboratory} tone="deep" className="u-measure text-body-l" />
            <p className="u-measure mt-4 text-body text-on-deep-muted">
              De fleste sender blodprøver videre til et eksternt laboratorium og venter. Vi
              analyserer selv, i samme by som du bor i.
            </p>
            <div className="mt-[14px]">
              <ClinicalTag field={claims.ownLaboratory} />
            </div>
          </div>
        </Split>

        {/* Workshop, not cleanroom (Phase 3 Rev B §04). */}
        <div className="mt-[clamp(28px,4vw,52px)] grid grid-cols-1 gap-px bg-rule-inv sm:grid-cols-3">
          {(['LAB-01', 'LAB-02', 'LAB-03'] as const).map((id) => (
            <PhotoBlock key={id} id={id} sizes="(min-width:640px) 30vw, 100vw" />
          ))}
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-[26px_40px] sm:grid-cols-2 lg:grid-cols-4">
          <LabFact label="Adresse">
            <ClinicalText field={claims.laboratoryAddress} tone="deep" className="text-body-s text-on-deep-muted" />
          </LabFact>
          <LabFact label="Akkreditering">
            <ClinicalText field={claims.laboratoryAccreditation} tone="deep" className="text-body-s" />
          </LabFact>
          <LabFact label="Udstyr og metode">
            <ClinicalText field={claims.laboratoryScope} tone="deep" className="text-body-s" />
          </LabFact>
          <LabFact label="Kvalitetskontrol">
            <ClinicalText field={claims.laboratoryQuality} tone="deep" className="text-body-s" />
          </LabFact>
        </dl>
      </Section>

      {/* ---- RAPPORTEN ---- */}
      <Section ground="cream" density="standard">
        <Split ratio="42-58" align="start">
          <Stage word="Efter frokost" title="Rapporten" />
          <div>
            <ClinicalText field={claims.turnaround} className="u-measure text-body" />
            <p className="u-measure mt-3 text-body">
              Den er skrevet til at blive læst af dig — ikke af en læge.
            </p>

            <div className="mt-6 max-w-[440px]">
              <div className="mb-[10px] flex items-baseline justify-between gap-4">
                <span className="text-[16px] font-medium">Eksempel på en markør</span>
                <RangeStateLabel state="inside" />
              </div>
              <RangeBand
                state="inside"
                refLow={0.26}
                refHigh={0.78}
                value={0.48}
                axisMin="0"
                axisMax="250"
                axisNote="demodata"
              />
            </div>

            <div className="mt-[22px]">
              <EditorialLink href="/din-rapport">Se hele rapporten</EditorialLink>
            </div>
          </div>
        </Split>
      </Section>

      {/* ---- SAMTALEN ---- */}
      <Section ground="sand" density="standard">
        <Split ratio="42-58" align="start">
          <Stage word="Senere samme dag" title="Samtalen" />
          <div>
            <ClinicalText field={claims.consultation} className="u-measure text-body" />
            <div className="mt-[14px]">
              <ClinicalTag field={claims.consultation} />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-[22px]">
              <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
              <EditorialLink href="/faq">Praktiske spørgsmål</EditorialLink>
            </div>
          </div>
        </Split>
      </Section>
    </>
  );
}

function Stage({
  word,
  title,
  id,
  tone = 'light',
}: {
  word: string;
  title: string;
  id?: string;
  tone?: 'light' | 'deep';
}) {
  return (
    <div>
      <p
        className={`font-mono text-[13px] uppercase tracking-[0.1em] ${
          tone === 'deep' ? 'text-on-deep-quiet' : 'text-ink-3'
        }`}
      >
        {word}
      </p>
      <h2 id={id} className={`mt-2 font-serif text-d3 ${tone === 'deep' ? '' : 'text-forest'}`}>
        {title}
      </h2>
    </div>
  );
}

function LabFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="u-label mb-2 text-on-deep-quiet">{label}</dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}
