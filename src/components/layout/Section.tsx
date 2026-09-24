import { cn } from '@/lib/cn';

/**
 * LAYOUT PRIMITIVES
 *
 * Three section densities carry the page rhythm (Phase 2 §03):
 *   air       180 / 88   editorial and photographic
 *   standard  128 / 64   explanatory
 *   dense      72 / 48   Nulpunkt — the compression IS the signal
 *
 * Rule: no section repeats the previous section's ground AND density.
 * Container width is intentionally variable — not every section shares one
 * max-width, or the page becomes a stack of identical bands.
 */

type Ground = 'cream' | 'sand' | 'deep' | 'none';
type Density = 'air' | 'standard' | 'dense' | 'none';
type Width = 'content' | 'narrow' | 'bleed';

const grounds: Record<Ground, string> = {
  cream: 'bg-cream text-ink',
  sand: 'bg-sand text-ink',
  deep: 'bg-deep text-ink-inv',
  none: '',
};

const densities: Record<Density, string> = {
  air: 'py-[clamp(72px,11vw,180px)]',
  standard: 'py-[clamp(52px,8vw,128px)]',
  dense: 'py-[clamp(40px,5vw,72px)]',
  none: '',
};

export function Container({
  children,
  width = 'content',
  className,
}: {
  children: React.ReactNode;
  width?: Width;
  className?: string;
}) {
  if (width === 'bleed') return <div className={className}>{children}</div>;
  return (
    <div
      className={cn(
        'mx-auto px-[clamp(20px,4vw,64px)]',
        width === 'content' ? 'max-w-content' : 'max-w-[980px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  ground = 'cream',
  density = 'standard',
  width = 'content',
  id,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  ground?: Ground;
  density?: Density;
  width?: Width;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(grounds[ground], className)}>
      <Container width={width} className={densities[density]}>
        {children}
      </Container>
    </section>
  );
}

/** A full-bleed band with no container — for photography and split layouts. */
export function Bleed({
  children,
  ground = 'none',
  id,
  className,
}: {
  children: React.ReactNode;
  ground?: Ground;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn(grounds[ground], className)}>
      {children}
    </section>
  );
}

/**
 * Asymmetric split. Never 50/50 — an even split reads as a template
 * (Phase 2 §03). Stacks to one column below 900px.
 */
export function Split({
  children,
  ratio = '55-45',
  align = 'start',
  gap = 'normal',
  className,
}: {
  children: React.ReactNode;
  ratio?: '55-45' | '42-58' | '62-38' | '38-62';
  align?: 'start' | 'center' | 'stretch' | 'end';
  gap?: 'none' | 'normal' | 'wide';
  className?: string;
}) {
  const cols: Record<string, string> = {
    '55-45': 'lg:grid-cols-[55fr_45fr]',
    '42-58': 'lg:grid-cols-[42fr_58fr]',
    '62-38': 'lg:grid-cols-[62fr_38fr]',
    '38-62': 'lg:grid-cols-[38fr_62fr]',
  };
  const gaps: Record<string, string> = {
    none: 'gap-0',
    normal: 'gap-[clamp(24px,4vw,56px)]',
    wide: 'gap-[clamp(28px,5vw,80px)]',
  };
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        cols[ratio],
        gaps[gap],
        `items-${align}`,
        className,
      )}
    >
      {children}
    </div>
  );
}
