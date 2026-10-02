# Pandonia website — domain setup

This note is for whoever manages Pandonia's domain and DNS. It can be
forwarded as it is. No GitHub knowledge is needed for the DNS part; the
GitHub steps are spelled out click by click.

**Nothing has been connected yet.** The site is live on a temporary public
address. DNS has not been changed.

---

## 1. Where the site is hosted

| | |
|---|---|
| Host | **GitHub Pages** (static hosting by GitHub, free, HTTPS included) |
| Repository | `Pandonia-ApS/pandoina-website-v2` on GitHub (the name contains a typo, `pandoina`; it is harmless) |
| Branch | `main` — every push deploys automatically (GitHub Actions, workflow "Deploy public site to GitHub Pages") |
| What is published | Only the public site in `site/` and the photographs it uses. Internal previews and the booking demo are never published. |

## 2. The public address today

**https://pandonia-aps.github.io/pandoina-website-v2/**

- Danish: https://pandonia-aps.github.io/pandoina-website-v2/
- English: https://pandonia-aps.github.io/pandoina-website-v2/en/

Anyone can open it; no login. Search engines are told not to index this
temporary address (that switches on by itself once the real domain is
connected — see section 9).

## 3. Is GitHub Pages used?

Yes. The custom domain is configured inside GitHub (section 6) and pointed to
GitHub with DNS records (section 5).

## 4. Which domain should be primary

**Recommendation: the `www` address is primary — e.g. `www.pandonia.dk` —
and the bare domain (`pandonia.dk`) redirects to it.**

Why `www`: it is a CNAME record, so GitHub can move its servers without
anyone touching DNS again, and it is GitHub's own recommendation. GitHub
redirects the bare domain to `www` automatically when both are set up as
below.

> **Decision needed from Pandonia: which domain?** The brief mentions
> `pandonia.dk`. Pandonia's *current* website runs on **www.pandonia.com**,
> and the new site's footer links to the privacy and cookie policies that
> live there (`www.pandonia.com/persondatapolitik`, `/cookiepolitik`).
> If `pandonia.com` is moved to the new site, those two pages must be moved
> or re-hosted first, or the links break. The steps below are identical for
> either domain — replace `pandonia.dk` with the domain chosen.

## 5. DNS records

Make these at the DNS provider for the domain. **Write down the current
records before changing anything** (needed for roll-back, section 11).

### 5a. Verify the domain for the GitHub organisation (do this first)

This stops anyone else from claiming the domain on GitHub.

1. In GitHub: **github.com/organizations/Pandonia-ApS/settings/pages** →
   *Add a domain* → enter `pandonia.dk`.
2. GitHub shows one **TXT** record. Create it exactly as shown — it looks like:

| Type | Name / host | Value |
|---|---|---|
| TXT | `_github-pages-challenge-pandonia-aps` (i.e. `_github-pages-challenge-pandonia-aps.pandonia.dk`) | *the code GitHub shows* |

3. Back in GitHub, press *Verify*. (Can take a few minutes to hours.)

### 5b. Point the domain to GitHub Pages

**`www` (primary):**

| Type | Name / host | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `pandonia-aps.github.io` | 3600 (or the provider's default) |

**Bare domain `pandonia.dk` (redirects to www):**

| Type | Name / host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

Notes:
- Remove any **other** A, AAAA or CNAME records for `@` and `www` (for example
  the ones pointing at the current website). Leave **MX** (e-mail) and other
  TXT records alone — e-mail is not affected.
- Do not use wildcard records (`*`).
- These are GitHub's published addresses:
  https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 6. GitHub Pages custom-domain setting

1. Open **github.com/Pandonia-ApS/pandoina-website-v2/settings/pages**.
2. *Build and deployment* → Source must stay **GitHub Actions** (do not change).
3. *Custom domain* → enter **`www.pandonia.dk`** → *Save*.
   GitHub runs a DNS check; it turns green when section 5b is in place.
   (No `CNAME` file is needed in the repository with this setup.)
4. Re-publish once so the site uses its new address: **Actions** tab →
   *Deploy public site to GitHub Pages* → *Run workflow* → `main` → *Run*.
   This updates canonical links, the sitemap and robots.txt to the new domain
   and switches search indexing on. No code change is needed.

The site's address is read automatically from GitHub. If it ever has to be
forced, it is set in one place: `site.config.json` → `"siteUrl"`.

## 7. HTTPS / SSL

GitHub issues and renews a free certificate (Let's Encrypt) automatically.

1. After the DNS check in section 6 is green, wait until the certificate is
   ready (usually minutes, can be up to 24 hours).
2. Tick **Enforce HTTPS** on the same settings page.
   If the box is greyed out, the certificate is not ready yet — wait and reload.

## 8. www and non-www

With the records in 5b and `www.pandonia.dk` as the custom domain, GitHub
redirects `https://pandonia.dk` → `https://www.pandonia.dk` by itself.
The old GitHub address (`pandonia-aps.github.io/pandoina-website-v2/`) also
redirects to the new domain.

## 9. How to check it works

Wait for DNS to propagate (minutes to a few hours; up to 48 h in rare cases).

1. `https://www.pandonia.dk/` opens the Danish site with a padlock.
2. `https://www.pandonia.dk/en/` opens the English site.
3. `http://pandonia.dk` and `https://pandonia.dk` end up on `https://www.pandonia.dk/`.
4. `https://www.pandonia.dk/sitemap.xml` lists `https://www.pandonia.dk/` and `https://www.pandonia.dk/en/`.
5. `https://www.pandonia.dk/robots.txt` says `Allow: /` (it said `Disallow` on the temporary address).
6. "Book din blodprøve" opens `https://system.easypractice.net/book/pandonia#choose-service`;
   "Log ind" opens `https://system.easypractice.net/book/pandonia/center`.
7. Optional DNS check from a terminal:
   `dig www.pandonia.dk +short` → `pandonia-aps.github.io.` and the 185.199.x.153 addresses;
   `dig pandonia.dk +short` → the four 185.199.x.153 addresses.

## 10. Afterwards (search engines)

- Add the domain in Google Search Console and submit `https://www.pandonia.dk/sitemap.xml`.
- If an old site is replaced on the same domain, keep or redirect its
  important old addresses (privacy policy, cookie policy) — see section 4.

## 11. Roll-back

The temporary address keeps working throughout, so roll-back is quick:

1. GitHub → Settings → Pages → *Custom domain* → **Remove**.
2. Restore the DNS records you wrote down before the change (section 5).
3. Leave the TXT verification record — it does no harm and protects the domain.

The site is then back on `https://pandonia-aps.github.io/pandoina-website-v2/`
only, and the previous website is reachable again once DNS has updated.

## 12. Contact for the site

Booking and client login are EasyPractice (not part of this hosting).
Website source: the GitHub repository above.
