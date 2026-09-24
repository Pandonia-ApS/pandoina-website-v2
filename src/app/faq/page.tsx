import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, Split } from '@/components/layout/Section';
import { Cta } from '@/components/ui/Button';
import { ClinicalText } from '@/components/clinical/ClinicalText';
import { PRIMARY_CTA, PRIMARY_CTA_HREF } from '@/content/navigation';
import { faqGroups, faqHeading } from '@/content/faq';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Spørgsmål om prøvetagning, laboratoriet, resultater og praktiske forhold — i den rækkefølge de plejer at komme.',
  alternates: { canonical: '/faq' },
};

/**
 * /faq — grouped by journey stage, not one long accordion.
 *
 * Every answer is SHORT and links to the page that owns the long version
 * (Phase 5 §03). Native <details> gives keyboard operation, screen-reader
 * semantics and browser find-in-page for free.
 *
 * No FAQPage structured data: several answers are still unverified, and
 * publishing health claims as schema before clinical sign-off would be
 * exactly the kind of accidental assertion the clinical gate exists to stop.
 */
export default function FaqPage() {
  return (
    <>
      <Section ground="cream" density="none" className="pb-[clamp(24px,3vw,44px)] pt-[clamp(36px,6vw,80px)]">
        <h1 className="max-w-[16ch] font-serif text-d2 text-forest">{faqHeading}</h1>
      </Section>

      <Section ground="cream" density="none" className="pb-[clamp(50px,8vw,110px)]">
        {faqGroups.map((group) => (
          <div key={group.stage} className="border-t border-rule py-[clamp(26px,4vw,44px)]">
            <Split ratio="42-58" align="start">
              <h2 className="font-serif text-d3 text-forest">{group.stage}</h2>
              <div>
                {group.items.map((item) => (
                  <details key={item.q} className="group border-b border-rule-soft">
                    <summary className="flex cursor-pointer items-baseline justify-between gap-[18px] py-[17px] text-[17px] transition-colors duration-hover ease-pandonia group-open:text-forest hover:text-forest">
                      <span>{item.q}</span>
                      <span
                        aria-hidden="true"
                        className="text-[17px] text-ink-3 transition-transform duration-hover ease-pandonia group-open:rotate-45 group-open:text-forest"
                      >
                        +
                      </span>
                    </summary>
                    <div className="max-w-meas pb-[22px]">
                      {item.clinical ? (
                        <ClinicalText field={item.clinical} className="text-body" />
                      ) : null}
                      {item.a ? <p className="mt-3 text-body">{item.a}</p> : null}
                      {item.more ? (
                        <p className="mt-4">
                          <Link
                            href={item.more.href}
                            className="inline-block border-b border-forest/40 py-1 text-[15px] font-medium text-forest hover:border-forest"
                          >
                            {item.more.label} →
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </Split>
          </div>
        ))}

        <div className="mt-10">
          <Cta href={PRIMARY_CTA_HREF}>{PRIMARY_CTA}</Cta>
        </div>
      </Section>
    </>
  );
}
