# Pandonia — booking with a 2-week calendar: implementation notes

Status: **demo preview, published as `booking.html`.** The live site's booking buttons still go straight to EasyPractice; the demo page is labelled DEMO / NOT LIVE throughout. The preview is
built from a separate working copy (`site-src-booking.html`), so ordinary
"commit and push" requests cannot carry it to GitHub by accident.

## 1 · What EasyPractice supports (checked 1 Oct 2026)

| Need | Supported? | Source |
|---|---|---|
| Embed the booking form on our own page | **Yes** — official iframe, pop-up script or link | easypractice.net/link-online-booking |
| iframe allowed by the booking page | **Yes** — no `X-Frame-Options` / `frame-ancestors` header on `system.easypractice.net/book/pandonia` | response headers |
| Read available dates / times | **No** — no public availability endpoint | system.easypractice.net/api |
| Admin API | Exists: bookings, calendars, opening times, pauses, clients, invoices. Needs a **personal access token or OAuth for the practice account**, 60 req/min. No "free slots" endpoint. | system.easypractice.net/api |
| Link straight to a service or a date/time step | **No documented way** — choosing a service changes the URL to `#choose-time` with no service id | the booking page itself |
| Pass a chosen service + time into EasyPractice | **No documented way** | — |

Why the admin API is not the answer: computing availability from opening
times minus existing bookings would be a parallel availability engine (the
thing the brief rules out), it would need a server holding a token that can
read every client record, and the site is a static page on GitHub Pages.

## 2 · What the preview shows

- **Ønsket flow (demotider)** — service → 14-day date row → times → "Fortsæt
  med 10:00" → hand-off. Every time slot is generated in the browser and
  labelled **DEMOTIDER — IKKE LIVE / DEMO AVAILABILITY — NOT LIVE**.
- **Ingen ledige tider** — the empty state: "Ingen ledige tider de næste 14
  dage." + "Se senere tider →" (opens EasyPractice).
- **Muligt i dag (EasyPractice)** — Pandonia's page around EasyPractice's
  official embed, with real availability. This is what can go live now.
- Integration point: at step 03 the real EasyPractice form loads inside the
  Pandonia page. The customer must choose test and time again there, because
  EasyPractice cannot receive the choice — the preview says so on screen.

Services, prices and durations are the booking system's (9 tests). Nothing
the customer selects is stored or sent anywhere by the Pandonia page.

## 3 · Recommendation

Go live with **Option A**: the Pandonia-designed booking page with the official
EasyPractice embed (mode 3). It is supported, uses real availability, and keeps
EasyPractice responsible for appointments, personal data, consent,
confirmations and cancellations.

To get the custom 14-day calendar (mode 1) for real, ask EasyPractice for one of:

1. a public read-only availability endpoint (services, dates, times, duration), or
2. a supported deep link that opens the booking form on a given service, date
   and time (so the customer only enters details and confirms), or
3. embed parameters that preselect a service.

With (1) **and** (2) the demo calendar can be wired to live data with no
change to its design. With only (2) or (3), steps 01–02 can stay on the
Pandonia page and the hand-off becomes seamless.

## 4 · Open points

- The artifact host may block third-party iframes; the embed is verified in
  the local preview (http://localhost:4173/booking.html), where it loads.
- Inside the embed, styling is EasyPractice's own and cannot be changed by us.
- Danish/English: EasyPractice's own fields are not translated by Pandonia.
