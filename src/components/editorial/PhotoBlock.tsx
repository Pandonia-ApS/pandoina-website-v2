import Image from 'next/image';
import { getImage, type ShotId } from '@/content/images';
import { cn } from '@/lib/cn';

/**
 * PHOTOGRAPHY
 *
 * Square corners, always. Radius belongs to a product panel and nothing else
 * (Phase 2 §05). No shadows. At least one image per page bleeds off an edge.
 *
 * Until a real file exists, this renders a neutral ART-DIRECTION PLATE, not a
 * gradient pretending to be a photograph: the shot id, the crop, the focal
 * point and the brief, on a flat warm ground. It is unmistakably not a photo,
 * it is genuinely useful to the photographer, and the layout is final.
 *
 * Drop a file into /public/images and set `src` in src/content/images.ts —
 * the plate is replaced automatically and nothing else changes.
 */

export function PhotoBlock({
  id,
  className,
  sizes = '100vw',
  mobile = false,
}: {
  id: ShotId;
  className?: string;
  /** Next/Image sizes attribute. Always set it — it drives the srcset. */
  sizes?: string;
  /** Use the declared mobile recrop rather than the desktop frame. */
  mobile?: boolean;
}) {
  const img = getImage(id);
  const aspect = mobile ? img.mobileAspect : img.aspect;
  const focal = (mobile ? img.mobileFocal : img.focal) ?? img.focal;

  if (img.src) {
    return (
      <div className={cn('relative overflow-hidden', className)} style={{ aspectRatio: aspect }}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={img.priority}
          loading={img.priority ? undefined : 'lazy'}
          style={{ objectFit: 'cover', objectPosition: focal }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#DCD2C2] text-ink-3',
        // A single hairline frame so the plate reads as a reserved space,
        // not as a design element.
        'outline outline-1 -outline-offset-1 outline-[rgba(38,32,26,0.14)]',
        className,
      )}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={img.alt || `Billedplads: ${img.id}`}
      data-shot={img.id}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
            {img.id}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em]">
            {aspect.replace(/\s/g, '')} · {focal}
          </span>
        </div>
        <p className="max-w-[46ch] font-mono text-[9.5px] leading-[1.55] tracking-[0.02em]">
          {img.brief}
        </p>
      </div>
      {/* Crop guide — two hairlines at the focal point. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          background:
            'linear-gradient(to right, transparent calc(var(--fx) - 0.5px), rgba(38,32,26,1) calc(var(--fx) - 0.5px), rgba(38,32,26,1) calc(var(--fx) + 0.5px), transparent calc(var(--fx) + 0.5px)), linear-gradient(to bottom, transparent calc(var(--fy) - 0.5px), rgba(38,32,26,1) calc(var(--fy) - 0.5px), rgba(38,32,26,1) calc(var(--fy) + 0.5px), transparent calc(var(--fy) + 0.5px))',
          ['--fx' as string]: focal.split(' ')[0] ?? '50%',
          ['--fy' as string]: focal.split(' ')[1] ?? '50%',
        }}
      />
    </div>
  );
}

/** A full-bleed photographic band with one serif caption bottom-left. */
export function PhotoBand({
  id,
  caption,
  heightClass = 'min-h-[min(60vh,440px)]',
}: {
  id: ShotId;
  caption?: string;
  heightClass?: string;
}) {
  return (
    <div className={cn('relative', heightClass)}>
      <PhotoBlock id={id} className="absolute inset-0 !aspect-auto h-full w-full" sizes="100vw" />
      {caption ? (
        <div className="relative flex h-full items-end">
          <p className="max-w-[26ch] px-[clamp(20px,4vw,64px)] pb-[clamp(26px,4vw,44px)] font-serif text-[clamp(18px,2vw,26px)] leading-[1.3] text-cream [text-shadow:0_2px_14px_rgba(30,22,14,0.6)]">
            {caption}
          </p>
        </div>
      ) : null}
    </div>
  );
}
