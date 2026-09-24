import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { ExternalCta } from '@/components/ui/Button';
import { ClinicalText, ClinicalTag } from '@/components/clinical/ClinicalText';
import { bookingPage, flagshipProducts, formatDkk, singleTests } from '@/content/products';
import { biomarkerCount } from '@/data/clinical/biomarkers';
import * as claims from '@/data/clinical/claims';

export const metadata: Metadata = {
  title: 'Book din blodprøve',
  description:
    'Priser, hvad der er inkluderet, og hvad der sker efter du har booket. Blodprøver hjemme hos dig i København.',
  alternates: { canonical: '/book' },
};

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#';

/**
 * /book — the single commercial page. Priser is absorbed here (Phase 5 §01).
 *
 * BACKEND INTEGRATION BOUNDARY
 * No booking is created by this codebase. Every "Vælg tid" hands off to the
 * external scheduler via NEXT_PUBLIC_BOOKING_URL and is marked
 * data-integration="booking". Nothing here fakes a successful booking.
 * See docs/README.md → "Backend integration points".
 */
export default function BookPage() {
  return (
    <>
      <Section ground="cream" density="none" className="pb-[clamp(24px,3vw,44px)] pt-[clamp(36px,6vw,80px)]">
        <h1 className="max-w-[17ch] font-serif text-d2 text-forest">{bookingPage.heading}</h1>
        <p className="mt-6 max-w-[50ch] text-body-l text-ink-2">{bookingPage.standfirst}</p>
      </Section>

      {/* ---- flagship products: rows on rules, never cards ---- */}
      <Section ground="cream" density="none" id="priser" className="pb-[clamp(40px,6vw,80px)]">
        <div className="border-t border-rule">
          {flagshipProducts.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 items-start gap-[20px_40px] border-b border-rule py-[clamp(22px,3vw,32px)] sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div>
                {p.eyebrow ? <p className="u-label mb-2">{p.eyebrow}</p> : null}
                <h2 className="text-h2">{p.name}</h2>
                <p className="mt-[10px] max-w-meas-n text-body-s">{p.description}</p>
                {p.id === 'health-test' ? (
                  <ClinicalText
                    field={claims.consultationIncluded}
                    className="mt-[10px] max-w-meas-n text-body-s"
                  />
                ) : null}
              </div>
              <div className="sm:text-right">
                <p className="font-mono tabular text-[clamp(26px,3vw,34px)] tracking-[-0.01em]">
                  {p.priceInclVat ? formatDkk(p.priceInclVat) : '—'}
                  <span className="ml-[6px] text-[0.42em] tracking-[0.04em] text-ink-3">kr.</span>
                </p>
                <p className="u-label mt-[5px]">
                  inkl. moms{p.priceExclVat ? ` · ${formatDkk(p.priceExclVat)} ekskl.` : ''}
                </p>
                <div className="mt-4">
                  <ExternalCta
                    href={`${BOOKING_URL}#${p.bookingRef}`}
                    level={p.emphasis === 'primary' ? 'primary' : 'secondary'}
                  >
                    Vælg tid
                  </ExternalCta>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-body-s">
          Antal biomarkører: <ClinicalTag field={biomarkerCount} className="ml-1" /> · Priser
          verificeret fra Pandonias bookingsystem.
        </p>
      </Section>

      {/* ---- the seven smaller tests, currently invisible on the live site ---- */}
      <Section ground="sand" density="standard">
        <h2 className="mb-2 font-serif text-d3 text-forest">{bookingPage.singleTestsHeading}</h2>
        <p className="mb-[26px] max-w-meas text-body">{bookingPage.singleTestsLead}</p>

        <ul className="m-0 max-w-[720px] list-none p-0">
          {singleTests.map((t) => (
            <li
              key={t.id}
              className="flex items-start justify-between gap-4 border-b border-rule-soft py-[14px]"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[15.5px]">{t.name}</span>
                {t.description ? (
                  <span className="max-w-meas-n text-body-s">{t.description}</span>
                ) : null}
              </span>
              <span className="whitespace-nowrap font-mono tabular text-[13px]">
                {t.priceInclVat ? (
                  `${formatDkk(t.priceInclVat)} kr.`
                ) : (
                  <span className="inline-block border border-brick px-[6px] py-[2px] text-[9px] uppercase tracking-[0.11em] text-brick">
                    pris afventer
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-[18px] text-body-s">{bookingPage.extrasNote}</p>
      </Section>

      {/* ---- what happens after. A numbered list on rules, not a column grid. ---- */}
      <Section ground="cream" density="standard">
        <h2 className="mb-7 font-serif text-d3 text-forest">{bookingPage.afterHeading}</h2>

        <ol className="m-0 max-w-[720px] list-none p-0">
          {bookingPage.afterSteps.map((step, i) => (
            <li
              key={step.n}
              className={`grid grid-cols-[34px_minmax(0,1fr)] gap-5 border-t border-rule-soft py-4 ${
                i === bookingPage.afterSteps.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className="pt-1 font-mono text-[11px] tracking-[0.09em] text-ink-3">
                {step.n}
              </span>
              <div>
                <h3 className="text-h3">{step.title}</h3>
                <p className="mt-[5px] text-body-s">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <dl className="mt-11 grid grid-cols-1 gap-[22px_40px] border-t border-rule pt-[26px] sm:grid-cols-2 lg:grid-cols-4">
          {bookingPage.reassurance.map((r) => (
            <div key={r.label}>
              <dt className="u-label mb-[6px]">{r.label}</dt>
              <dd className="m-0 text-body-s">{r.body}</dd>
            </div>
          ))}
          <div>
            <dt className="u-label mb-[6px]">Afbestilling</dt>
            <dd className="m-0">
              <ClinicalText field={claims.cancellation} className="text-body-s" />
            </dd>
          </div>
          <div>
            <dt className="u-label mb-[6px]">Dine data</dt>
            <dd className="m-0">
              <ClinicalText field={claims.dataHandling} className="text-body-s" />
            </dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
