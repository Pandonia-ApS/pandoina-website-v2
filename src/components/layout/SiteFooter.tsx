import Link from 'next/link';
import { contact, footerNav } from '@/content/navigation';
import { healthDisclaimer, companyDetails } from '@/data/clinical/claims';
import { ClinicalText } from '@/components/clinical/ClinicalText';

/**
 * FOOTER — Phase 5 §04.
 * What is genuinely necessary. Not a directory of every page.
 * The health disclaimer sits on its own rule, at body-small, never smaller.
 */

const groups: Array<{ heading: string; items: readonly { href: string; label: string }[] }> = [
  { heading: 'Websted', items: footerNav.websted },
  { heading: 'Praktisk', items: footerNav.praktisk },
  { heading: 'Juridisk', items: footerNav.juridisk },
];

export function SiteFooter() {
  return (
    <footer className="bg-deep text-ink-inv">
      <div className="mx-auto max-w-content px-[clamp(20px,4vw,64px)] pb-[clamp(26px,3vw,40px)] pt-[clamp(44px,6vw,76px)]">
        <div className="grid grid-cols-2 gap-[34px_40px] lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <p className="mb-[14px] font-serif text-[26px] tracking-[-0.01em]">Pandonia</p>
            <p className="max-w-[30ch] text-body-s text-on-deep-muted">{contact.blurb}</p>
            <address className="mt-4 not-italic text-body-s text-on-deep-muted">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`mailto:${contact.email}`} className="mt-1 inline-block hover:text-ink-inv">
                {contact.email}
              </a>
            </address>
          </div>

          {groups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="mb-[14px] font-mono text-[9.5px] font-normal uppercase tracking-[0.11em] text-on-deep-quiet">
                {group.heading}
              </h2>
              <ul className="flex flex-col gap-[9px] text-[14.5px]">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="inline-block py-1 text-on-deep-muted hover:text-ink-inv"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[clamp(30px,4vw,46px)] flex flex-wrap items-start justify-between gap-[14px_34px] border-t border-rule-inv pt-5">
          <ClinicalText
            field={healthDisclaimer}
            tone="deep"
            className="max-w-[62ch] text-body-s text-on-deep-quiet"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-on-deep-quiet">
            Dansk · English
          </p>
        </div>

        <ClinicalText field={companyDetails} tone="deep" className="mt-[18px] max-w-[62ch] text-body-s" />
      </div>
    </footer>
  );
}
