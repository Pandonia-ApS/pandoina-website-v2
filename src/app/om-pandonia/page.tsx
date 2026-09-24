import type { Metadata } from 'next';
import { Fragment } from 'react';
import { Section, Split } from '@/components/layout/Section';
import { PhotoBand, PhotoBlock } from '@/components/editorial/PhotoBlock';
import { Cta, EditorialLink } from '@/components/ui/Button';
import { ClinicalText } from '@/components/clinical/ClinicalText';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import { about } from '@/content/report';
import { modelIntro } from '@/data/clinical/biological-systems';
import type { ShotId } from '@/content/images';

export const metadata: Metadata = {
  title: 'Om Pandonia',
  description:
    'Et lille hold i København. Hvorfor vi tager prøven hjemme hos dig, hvorfor vi driver vores eget laboratorium, og hvem der står bag.',
  alternates: { canonical: '/om-pandonia' },
};

/**
 * /om-pandonia
 *
 * Phase 5 design review found this the most text-heavy page on the site:
 * three consecutive text blocks with one image between them. Resolution
 * (Phase 6 §9): a LYS-01 light frame is inserted after the first section
 * rather than cutting content. It fixes the rhythm at the cost of one frame
 * at the shoot — and removes nothing Pandonia may want to keep.
 */
export default function OmPandoniaPage() {
  return (
    <>
      <Section ground="cream" density="none" className="pb-[clamp(30px,4vw,56px)] pt-[clamp(36px,6vw,80px)]">
        <h1 className="max-w-[18ch] font-serif text-d2 text-forest">{about.heading}</h1>
        <p className="mt-7 max-w-[52ch] text-body-l text-ink-2">{about.standfirst}</p>
      </Section>

      <PhotoBand id="RUM-02" heightClass="min-h-[min(52vh,400px)]" />

      {about.sections.map((section, i) => (
        <Fragment key={section.title}>
          <Section ground={i % 2 === 0 ? 'cream' : 'sand'} density="standard">
            <Split ratio="42-58" align="start">
              <h2 className="font-serif text-d3 text-forest">{section.title}</h2>
              <div>
                {section.body.map((para) => (
                  <p key={para} className="u-measure mb-4 text-body last:mb-0">
                    {para}
                  </p>
                ))}
                {'sourceNote' in section && section.sourceNote ? (
                  <p className="u-label mt-4">{section.sourceNote}</p>
                ) : null}
                {section.title === 'Modellen' ? (
                  <ClinicalText field={modelIntro} className="u-measure mt-5 text-body" />
                ) : null}
                {'link' in section && section.link ? (
                  <div className="mt-5">
                    <EditorialLink href={section.link.href}>{section.link.label}</EditorialLink>
                  </div>
                ) : null}
              </div>
            </Split>
          </Section>

          {/* The rhythm break — see the note at the top of this file. */}
          {i === about.breakAfterSection ? (
            <PhotoBand id={about.breakImageId as ShotId} heightClass="min-h-[min(38vh,300px)]" />
          ) : null}
        </Fragment>
      ))}

      {/* ---- the team. A contact sheet, not a card grid. ---- */}
      <Section ground="deep" density="standard" labelledBy="hold-h">
        <h2 id="hold-h" className="mb-2 font-serif text-d3">
          {about.team.heading}
        </h2>
        <p className="mb-9 u-measure text-body text-on-deep-muted">{about.team.lead}</p>

        <ul className="m-0 grid list-none grid-cols-2 gap-px bg-rule-inv p-0 p-0 lg:grid-cols-4">
          {about.team.members.map((m) => (
            <li key={m.name} className="bg-deep pr-px">
              <PhotoBlock id={m.imageId as ShotId} sizes="(min-width:1024px) 24vw, 45vw" />
              <div className="pb-1 pt-[14px]">
                <p className="text-[15px] font-medium">{m.name}</p>
                <p className="u-label mt-[3px] text-on-deep-quiet">{m.role}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-body-s text-on-deep-quiet">{about.team.others}</p>
        <p className="u-label mt-[10px] text-on-deep-quiet">{about.team.consentNote}</p>
      </Section>

      <Section ground="cream" density="air" className="text-center">
        <h2 className="mx-auto max-w-[22ch] font-serif text-d3 text-forest">
          {about.closing.heading}
        </h2>
        <p className="u-label mt-5">{about.closing.note}</p>
        <div className="mt-8">
          <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
        </div>
      </Section>
    </>
  );
}
