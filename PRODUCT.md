# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: adult private customers in Greater Copenhagen who want an overview of their own health and book a blood test themselves, often from a phone. They arrive curious or mildly concerned, compare tests and prices, and want to know what happens to their sample and what they get back.

Secondary (confirmed as secondary, not primary): workplaces that want several employees tested, and clinics/partners. Business enquiries go to labs@pandonia.com.

## Product Purpose

Pandonia takes blood samples at the customer's home, workplace or laboratory, analyses them in its own laboratory in Copenhagen, and returns a report the customer can read — with a doctor to go through it if they want. The website explains the tests, shows what the report looks like, gives prices, and sends the customer into booking. Success: a visitor understands what they get, trusts it, and books.

## Positioning

- **Own laboratory in Copenhagen** (Langebrogade 3A). Samples are analysed in-house, not sent on to an external lab.
- **The sample is taken where the customer is** — at home, at work, or at the laboratory.
- **Report plus doctor** — the Pandonia Score and six system scores, each measurement beside its optimal and reference range, and a doctor consultation available.
- **Follow it over time** — repeat measurements and a membership, so the customer sees what moves.

## Operating Context

- Booking, appointment creation, personal data, consent, confirmations, rescheduling and cancellation all live in **EasyPractice** (`system.easypractice.net/book/pandonia`). The website links or embeds it; it never stores sensitive booking information. EasyPractice exposes no supported way to read free appointment times.
- Login for existing customers is EasyPractice's client centre (`/book/pandonia/center`).
- The report the customer receives is Pandonia's own health report (six systems: Signaling, Highway, Digestion, Energy, Defense, Waste; zoned biomarker bars; score over time).

## Capabilities and Constraints

- Static site with client-side (#) routes, published on GitHub Pages from `site/` (Danish `/`, English `/en/`) by `scripts/assemble-site.mjs`; domain setup in `DOMAIN_SETUP.md`. `preview/` holds the internal review build and the booking demo, never published. A Next.js codebase in `src/` exists but has never been built.
- Danish and English versions of every page, switchable in place.
- Tests offered (EasyPractice booking page, read 2 Oct 2026): Health Tests — Health Test 3.500 kr., Health Test + Consultation 4.750 kr.; Essentielle tests — Blodsukker- og Kolesteroltest 1.300, D-vitamin Test 1.000, Glukose Monitorering 2.000, Metabolisk Sundheds Test 1.250, Mænds Sundhedstest 1.600, Skjoldbruskkirtel Test 1.200 kr.; Pandonia test — Female hormones 2.200, Health check + Female hormones 5.200, Health check + Female hormones + Thyroid panel 6.300 kr.; Membership 2.000 kr./md. The site keeps one catalogue (`SVC` in the preview script) for the Prices page and the booking demo.
- Collection areas: København K, N, NV, V, S, SV, Ø, Frederiksberg and Hellerup — or at the laboratory.
- A clinical content gate: unverified clinical copy is held back in the customer view and shown only in a review layer.
- Open: turnaround promise (the homepage four steps say 48 hours; other copy says same day / 2–4 hours), and B2B wording ("partnerportal", "din klient") on the consumer homepage.

## Brand Commitments

- Name and wordmark: PANDONIA (uppercase wordmark).
- Lines Pandonia uses in English on both language versions: "Happier Healthier Longer.", "You can't optimise what you haven't measured.", "Test. It's the cheapest way to a better decision.", "Mål. Forstå. Handl."
- The existing identity is the foundation and must not be replaced: it follows Pandonia's brand documents (feed, landing page, health report) — off-white and warm sand paper, black ink, restrained taupe, acid yellow only as a small accent, the report's own green/yellow/red range colours, Arimo and Tinos. Detailed tokens live in the code.
- Voice: short, direct, calm and factual. Diagnostic, not promotional.

## Evidence on Hand

- Real Pandonia photography in `public/images/` (team portraits, premises, product); stock images are marked as such in the review layer.
- Report UI mockup values (six-system radar) and the report guide's own GLU example. Other marker cards are illustrative and labelled so.
- No customer testimonials, reviews, case studies, press or benchmarks exist on the site. Do not fabricate any.

## Product Principles

1. **Nothing invented.** Clinical copy, numbers, ranges, prices and claims are used only when verified or approved by Pandonia; illustrative data is labelled.
2. **Booking belongs to EasyPractice.** The site explains and hands over; it never stores sensitive data or simulates availability as if it were real.
3. **Mobile first.** Many customers book from a phone; the mobile experience must be as good as desktop.
4. **Show the real thing.** Prefer Pandonia's own lab, people and report over generic health imagery.
5. **Calm credibility.** Medical trust comes from clarity and restraint, not from urgency or hype.

## Accessibility & Inclusion

No formal standard has been set. Existing practice to keep: WCAG AA text contrast on paper grounds, keyboard-operable controls, reduced-motion respected, no colour-only status.
