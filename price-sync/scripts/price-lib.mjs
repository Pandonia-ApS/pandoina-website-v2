// Shared rules for the EasyPractice price sync. Pure functions only: no network, no files.
// Only these fields of a product are ever read; everything else in the feed is ignored.

export const MIN_DKK = 100;
export const MAX_DKK = 50000;
export const MAX_CHANGE = 0.30; // larger moves are held for a person to review
export const VAT = 1.25; // Danish VAT, 25 %

const fail = (msg) => { throw new Error(msg); };

// The feed's own shape: { product_groups: [ { products: [ {...} ] } ] }. Returns id -> the few fields we use.
export function extractProducts(feed) {
  if (!feed || typeof feed !== 'object' || !Array.isArray(feed.product_groups)) fail('feed: product_groups missing, the response format has changed');
  const out = new Map();
  for (const g of feed.product_groups) {
    if (!g || !Array.isArray(g.products)) fail('feed: a product group has no products list');
    for (const p of g.products) {
      if (!p || !Number.isInteger(p.id)) fail('feed: a product has no numeric id');
      const v = { name: p.name, currency: p.currency, price: p.price, inclCents: p.price_in_cents_with_vat, addon: p.is_addon, online: p.available_online_book };
      const seen = out.get(p.id);
      // a product can sit in several groups; the copies must agree
      if (seen && JSON.stringify(seen) !== JSON.stringify(v)) fail(`feed: service ${p.id} appears twice with different data`);
      out.set(p.id, v);
    }
  }
  return out;
}

const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

// All-or-nothing: either every mapped product passes and we get a full price set, or nothing is returned.
export function validate(mapping, products) {
  const errors = [], prices = {};
  const sites = new Set(), services = new Set();
  for (const m of mapping.products) {
    if (sites.has(m.site) || services.has(m.service)) { errors.push(`mapping: ${m.site}/${m.service} is listed twice`); continue; }
    sites.add(m.site); services.add(m.service);
    const p = products.get(m.service), at = `${m.site} (service ${m.service})`;
    if (!p) { errors.push(`${at}: not in EasyPractice's feed`); continue; }
    if (norm(p.name) !== norm(m.easypractice)) { errors.push(`${at}: EasyPractice now calls it "${p.name}", the mapping expects "${m.easypractice}"`); continue; }
    if (p.addon !== false) { errors.push(`${at}: marked as an add-on`); continue; }
    if (p.online !== true) { errors.push(`${at}: no longer bookable online`); continue; }
    if (p.currency !== 'DKK') { errors.push(`${at}: currency is ${JSON.stringify(p.currency)}, not DKK`); continue; }
    if (!Number.isInteger(p.inclCents) || p.inclCents <= 0) { errors.push(`${at}: price incl. VAT is missing, zero, negative or not a number (${JSON.stringify(p.inclCents)})`); continue; }
    if (p.inclCents % 100) { errors.push(`${at}: price incl. VAT is not whole kroner (${p.inclCents / 100})`); continue; }
    if (typeof p.price !== 'string' || !/^\d+(\.\d{1,2})?$/.test(p.price)) { errors.push(`${at}: price excl. VAT is not a valid amount (${JSON.stringify(p.price)})`); continue; }
    const exclCents = Math.round(Number(p.price) * 100), incl = p.inclCents / 100;
    if (Math.round(exclCents * VAT) !== p.inclCents) { errors.push(`${at}: VAT does not add up (excl. ${exclCents / 100} × 1.25 ≠ incl. ${incl})`); continue; }
    if (exclCents % 100) { errors.push(`${at}: price excl. VAT is not whole kroner (${exclCents / 100}); the website shows excl. VAT in whole kroner`); continue; }
    if (incl < MIN_DKK || incl > MAX_DKK) { errors.push(`${at}: DKK ${incl} is outside the allowed ${MIN_DKK}–${MAX_DKK}`); continue; }
    prices[m.site] = { incl, excl: exclCents / 100 };
  }
  return errors.length ? { errors } : { errors, prices };
}

// The stored price file must itself always be complete and sane (it is what the website is built from).
export function checkPriceFile(file, mapping) {
  const errors = [];
  if (!file || typeof file.prices !== 'object') return ['prices.json: no prices object'];
  for (const m of mapping.products) {
    const p = file.prices[m.site];
    if (!p) { errors.push(`prices.json: ${m.site} is missing`); continue; }
    if (!Number.isInteger(p.incl) || !Number.isInteger(p.excl) || p.incl < MIN_DKK || p.incl > MAX_DKK || Math.round(p.excl * VAT) !== p.incl)
      errors.push(`prices.json: ${m.site} is invalid (${JSON.stringify(p)})`);
  }
  for (const k of Object.keys(file.prices)) if (!mapping.products.some((m) => m.site === k)) errors.push(`prices.json: ${k} is not in the approved mapping`);
  return errors;
}

export function diff(oldPrices, newPrices, mapping) {
  return mapping.products.filter((m) => oldPrices[m.site]?.incl !== newPrices[m.site].incl || oldPrices[m.site]?.excl !== newPrices[m.site].excl)
    .map((m) => {
      const o = oldPrices[m.site]?.incl, n = newPrices[m.site].incl;
      return { site: m.site, service: m.service, name: m.easypractice, old: oldPrices[m.site] ?? null, new: newPrices[m.site], change: o ? (n - o) / o : null };
    });
}

// 3500 -> "3.500" (Danish) / "3,500" (English), the way the website writes prices
const group = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
export const fmt = { raw: (n) => String(n), da: (n) => group(n, '.'), en: (n) => group(n, ',') };

// Website source carries __PRICE_<site>_<raw|da|en>__ where a price is shown; this fills them in.
export const TOKEN = /__PRICE_([a-z]+)_(raw|da|en)__/g;
export function applyTokens(html, prices) {
  let n = 0;
  const out = html.replace(TOKEN, (_, site, f) => {
    if (!prices[site]) fail(`token for unknown product "${site}"`);
    n++;
    return fmt[f](prices[site].incl);
  });
  if (/__PRICE_/.test(out)) fail('a malformed __PRICE_ token is left in the page');
  return { out, n };
}
