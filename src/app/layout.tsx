import type { Metadata, Viewport } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pandonia.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pandonia — blodprøver hjemme hos dig i København',
    template: '%s — Pandonia',
  },
  description:
    'Blodprøven tages hjemme hos dig i København og analyseres i vores eget laboratorium. Du får tallene — og en læge til at læse dem sammen med dig.',
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    siteName: 'Pandonia',
    url: siteUrl,
    // Placeholder until the shoot. See src/content/images.ts.
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Pandonia' }],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F6F1E8',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={fontVariables}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Spring til indhold
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
