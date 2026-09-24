'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { PRIMARY_CTA, PRIMARY_CTA_HREF, primaryNav, utilityNav } from '@/content/navigation';
import { cn } from '@/lib/cn';

/**
 * GLOBAL NAVIGATION — Phase 5 §02.
 *
 * Desktop 72px. Four editorial destinations plus one action. Sticky, cream,
 * no blur, no shrink, no shadow — a 1px rule appears after 8px of scroll and
 * nothing else changes.
 *
 * Mobile 60px → full-screen deep-forest overlay with serif items. It is the
 * one moment mobile gets to feel like the brand.
 *
 * This is the site's only always-mounted client component. Everything it does
 * (scroll rule, menu open/close, focus return, Escape) needs the browser.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-cream transition-colors duration-hover ease-pandonia',
        stuck ? 'border-rule' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex min-h-[60px] max-w-content items-center justify-between gap-5 px-[clamp(20px,4vw,64px)] lg:min-h-[72px]">
        <Link href="/" className="font-serif text-[25px] tracking-[-0.01em] text-forest">
          Pandonia
        </Link>

        <nav aria-label="Hovednavigation" className="hidden lg:block">
          <ul className="flex gap-[26px]">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'border-b pb-[3px] text-[15px] transition-colors duration-hover ease-pandonia',
                      active
                        ? 'border-forest text-forest'
                        : 'border-transparent text-ink-2 hover:text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-[18px]">
          <ul className="hidden items-center gap-[14px] text-[12.5px] text-ink-3 lg:flex">
            {utilityNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="py-2 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={PRIMARY_CTA_HREF}
            className="hidden rounded-control bg-forest px-[17px] py-[9px] text-[13.5px] font-medium text-cream transition-colors duration-hover ease-pandonia hover:bg-forest-deep sm:inline-block"
          >
            {PRIMARY_CTA}
          </Link>

          <button
            ref={triggerRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block h-[9px] w-[26px] border-y border-ink" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          ref={panelRef}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-deep p-[clamp(20px,5vw,40px)] text-ink-inv lg:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Luk menu"
              className="flex h-11 w-11 items-center justify-center text-[30px] leading-none"
            >
              ×
            </button>
          </div>

          <nav aria-label="Mobilmenu">
            <ul className="flex flex-col gap-[18px]">
              {[...primaryNav, ...utilityNav.slice(0, 1)].map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="font-serif text-[clamp(28px,8vw,40px)] tracking-[-0.02em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Link
              href={PRIMARY_CTA_HREF}
              className="block rounded-control bg-cream px-[26px] py-[14px] text-center text-[15px] font-medium text-deep"
            >
              {PRIMARY_CTA}
            </Link>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.11em] text-on-deep-quiet">
              København · Log ind · EN
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
