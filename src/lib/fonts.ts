import { DM_Mono, DM_Sans, Newsreader } from 'next/font/google';

/**
 * TYPOGRAPHY — three voices, three jobs (Phase 2 §02).
 *
 *   display    the editorial voice   — above 44px only, never interface
 *   interface  the working voice     — below 24px only, never a hero
 *   data       measured fact only    — units, ranges, timestamps, labels
 *
 * LICENSING NOTE
 * The approved faces are commercial and are NOT bundled here:
 *   display   → GT Sectra Display (Grilli Type), Regular + Italic
 *   interface → Degular (OH no Type Co.), Regular + Medium
 *
 * Until licences are in place we ship the approved fallbacks. To swap in the
 * real faces, replace the two loaders below with `next/font/local`, keep the
 * same CSS variable names, and nothing else in the codebase changes:
 *
 *   const display = localFont({
 *     src: [
 *       { path: './fonts/GTSectraDisplay-Regular.woff2', weight: '400', style: 'normal' },
 *       { path: './fonts/GTSectraDisplay-Italic.woff2',  weight: '400', style: 'italic' },
 *     ],
 *     variable: '--font-display',
 *     display: 'swap',
 *   });
 *
 * Budget: four files, < 110 KB total, Latin + Danish diacritics only.
 */

const display = Newsreader({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  // Keeps the fallback metrically close so the swap does not shift layout.
  adjustFontFallback: true,
});

const interfaceFont = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-interface',
  display: 'swap',
  adjustFontFallback: true,
});

const data = DM_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-data',
  display: 'swap',
});

export const fontVariables = [display.variable, interfaceFont.variable, data.variable].join(' ');
