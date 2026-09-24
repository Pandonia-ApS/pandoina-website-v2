import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * CTA SYSTEM — Phase 5 §07.
 * Three levels. 2px radius, never a pill. No shadows, no gradients, no caps.
 * Never more than one primary in a viewport.
 */

type Level = 'primary' | 'secondary' | 'link';
type Tone = 'light' | 'deep';

const base =
  'inline-flex items-center justify-center font-medium transition-colors duration-hover ease-pandonia';

const styles: Record<Level, Record<Tone, string>> = {
  primary: {
    light: 'bg-forest text-cream hover:bg-forest-deep px-[26px] py-[14px] rounded-control text-[15px]',
    deep: 'bg-cream text-deep hover:bg-ink-inv px-[26px] py-[14px] rounded-control text-[15px]',
  },
  secondary: {
    light:
      'border border-forest text-forest hover:bg-forest hover:text-cream px-[25px] py-[13px] rounded-control text-[15px]',
    deep:
      'border border-cream text-cream hover:bg-cream hover:text-deep px-[25px] py-[13px] rounded-control text-[15px]',
  },
  link: {
    // Padding gives a 44px touch target without changing how it looks.
    light:
      'text-forest border-b border-forest/40 hover:border-forest text-[15px] py-[11px] rounded-none',
    deep:
      'text-ink-inv border-b border-ink-inv/45 hover:border-ink-inv text-[15px] py-[11px] rounded-none',
  },
};

export function Cta({
  href,
  children,
  level = 'primary',
  tone = 'light',
  className,
}: {
  href: string;
  children: React.ReactNode;
  level?: Level;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, styles[level][tone], className)}>
      {children}
    </Link>
  );
}

/**
 * Editorial link. Always names its destination — never "Læs mere".
 * The arrow is drawn, not an icon from a set (Phase 2 §06).
 */
export function EditorialLink({
  href,
  children,
  tone = 'light',
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, styles.link[tone], 'gap-2', className)}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/**
 * External handoff — currently the booking scheduler.
 * Marked explicitly so the integration boundary is visible in the code.
 */
export function ExternalCta({
  href,
  children,
  level = 'primary',
  tone = 'light',
  className,
}: {
  href: string;
  children: React.ReactNode;
  level?: Level;
  tone?: Tone;
  className?: string;
}) {
  return (
    <a
      href={href}
      rel="noopener"
      className={cn(base, styles[level][tone], className)}
      data-integration="booking"
    >
      {children}
    </a>
  );
}
