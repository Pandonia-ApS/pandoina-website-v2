/**
 * PANDONIA — i18n configuration.
 *
 * Danish is the source of truth and the default market. English is a full
 * locale, not a translation layer bolted on top.
 *
 * ROUTING DECISION
 * `/da/...` and `/en/...`, both prefixed. We do NOT leave Danish unprefixed.
 *
 * Why: an unprefixed default (`/hvad-vi-maaler` + `/en/what-we-test`) means
 * the root has two jobs — locale-neutral entry AND the Danish homepage — which
 * makes hreflang, canonicals and middleware redirects all special-case Danish.
 * With both prefixed, `/` is a single 307 to the negotiated locale and every
 * other route is symmetric. It costs one redirect on first visit and removes
 * an entire class of SEO bug.
 *
 * Trade-off accepted: existing Danish URLs change. 301s from the current flat
 * paths to `/da/...` are required at launch — listed in docs/i18n.md.
 */

export const locales = ['da', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'da';

/** For <html lang>, hreflang and Open Graph. */
export const localeMeta: Record<Locale, { htmlLang: string; hreflang: string; ogLocale: string; label: string }> = {
  da: { htmlLang: 'da', hreflang: 'da-DK', ogLocale: 'da_DK', label: 'Dansk' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_GB', label: 'English' },
};

/**
 * ROUTE MAP — the single source for slugs in both locales.
 *
 * The `key` is stable and locale-independent; it is what components and links
 * refer to. Slugs are data. This is what makes the language switcher able to
 * stay on the equivalent page rather than dumping the visitor on the homepage.
 */
export const routes = {
  home: { da: '', en: '' },
  whatWeTest: { da: 'hvad-vi-maaler', en: 'what-we-test' },
  howItWorks: { da: 'saadan-fungerer-det', en: 'how-it-works' },
  yourReport: { da: 'din-rapport', en: 'your-report' },
  about: { da: 'om-pandonia', en: 'about-pandonia' },
  faq: { da: 'faq', en: 'faq' },
  book: { da: 'book', en: 'book' },
  business: { da: 'virksomheder', en: 'for-business' },
  privacy: { da: 'persondatapolitik', en: 'privacy-policy' },
  cookies: { da: 'cookiepolitik', en: 'cookie-policy' },
  terms: { da: 'handelsbetingelser', en: 'terms' },
  contact: { da: 'kontakt', en: 'contact' },
} as const;

export type RouteKey = keyof typeof routes;

/** In-page anchors are locale-specific too — they appear in shared links. */
export const anchors = {
  laboratory: { da: 'laboratoriet', en: 'the-laboratory' },
  prices: { da: 'priser', en: 'prices' },
  model: { da: 'modellen', en: 'the-model' },
} as const;

/** Build a path. `href('whatWeTest', 'en')` → `/en/what-we-test` */
export function href(key: RouteKey, locale: Locale, anchor?: keyof typeof anchors): string {
  const slug = routes[key][locale];
  const base = slug ? `/${locale}/${slug}` : `/${locale}`;
  return anchor ? `${base}#${anchors[anchor][locale]}` : base;
}

/** Reverse lookup — used by the switcher to stay on the equivalent page. */
export function routeKeyFromSlug(slug: string, locale: Locale): RouteKey | null {
  const entries = Object.entries(routes) as Array<[RouteKey, Record<Locale, string>]>;
  const hit = entries.find(([, v]) => v[locale] === slug);
  return hit ? hit[0] : null;
}

/**
 * The switcher's job: same page, other language.
 * `/da/hvad-vi-maaler` → `/en/what-we-test`, never → `/en`.
 * Falls back to the target-locale homepage only if the route has no counterpart.
 */
export function alternatePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  const current = (locales as readonly string[]).includes(parts[0] ?? '')
    ? (parts[0] as Locale)
    : defaultLocale;
  const slug = parts.slice(1).join('/');
  if (!slug) return `/${target}`;

  const [path, hash] = slug.split('#');
  const key = routeKeyFromSlug(path ?? '', current);
  if (!key) return `/${target}`;

  let anchorKey: keyof typeof anchors | undefined;
  if (hash) {
    const found = (Object.keys(anchors) as Array<keyof typeof anchors>).find(
      (a) => anchors[a][current] === hash,
    );
    anchorKey = found;
  }
  return href(key, target, anchorKey);
}

/** All paths for a route, for hreflang and the sitemap. */
export function alternates(key: RouteKey): Record<Locale, string> {
  return { da: href(key, 'da'), en: href(key, 'en') };
}

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
