import { placeholder, requiresReview, verified } from './types';

/**
 * OPERATIONAL, PRODUCT AND LEGAL CLAIMS.
 *
 * Verified entries are quoted from pandonia.com or the live booking system,
 * read 23 September 2026. Anything conflicting or unsourced is gated.
 */

// ---------------------------------------------------------------------------
// Operational — the mechanism behind the experience
// ---------------------------------------------------------------------------

export const ownLaboratory = verified({
  id: 'claim.ownLaboratory',
  value:
    'Vi har vores eget laboratorium på Langebrogade i København. Det er grunden til, at svaret kan nå frem samme dag.',
  source: 'pandonia.com FAQ — "Hvor lang tid tager det før jeg modtager resultaterne?"',
  appearsOn: ['/', '/saadan-fungerer-det#laboratoriet', '/om-pandonia'],
});

export const laboratoryAddress = verified({
  id: 'claim.laboratoryAddress',
  value: 'Langebrogade 3A, 2. sal, 1411 København K',
  source: 'pandonia.com + booking system footer',
  appearsOn: ['/saadan-fungerer-det#laboratoriet', '/om-pandonia'],
});

export const laboratoryAccreditation = placeholder({
  id: 'claim.laboratoryAccreditation',
  intent: 'Under what accreditation and authorisation the laboratory operates.',
  needs:
    'Pandonia must supply this. It is the most valuable claim on the site and therefore the most scrutinised — do not write "akkrediteret" or "certificeret" anywhere until it is confirmed.',
  appearsOn: ['/saadan-fungerer-det#laboratoriet'],
});

export const laboratoryScope = placeholder({
  id: 'claim.laboratoryScope',
  intent: 'Which analyses run in-house and which, if any, are sent on.',
  needs: 'Laboratory confirmation.',
  appearsOn: ['/saadan-fungerer-det#laboratoriet'],
});

export const laboratoryQuality = placeholder({
  id: 'claim.laboratoryQuality',
  intent: 'How results are quality-controlled before release.',
  needs: 'Laboratory confirmation.',
  appearsOn: ['/saadan-fungerer-det#laboratoriet', '/faq'],
});

export const coverageArea = verified({
  id: 'claim.coverageArea',
  value:
    'København K, N, NV, V, S, SV, Ø, Frederiksberg og Hellerup — eller på Langebrogade 3A, 2. sal.',
  source: 'pandonia.com process step 02 + location FAQ + booking footer',
  appearsOn: ['/saadan-fungerer-det', '/faq', '/book'],
});

export const preparation = verified({
  id: 'claim.preparation',
  value:
    'Fast i mindst 12 timer, og undgå både kaffe og kosttilskud før prøven. Hård fysisk aktivitet frarådes de sidste 48 timer.',
  source: 'pandonia.com FAQ — "Hvordan forbereder jeg mig til prøven?"',
  appearsOn: ['/saadan-fungerer-det', '/faq'],
});

export const morningRationale = verified({
  id: 'claim.morningRationale',
  value:
    'Vi anbefaler at prøven tages tidligt på dagen, da flere biomarkører naturligt topper om morgenen.',
  source: 'pandonia.com FAQ — preparation',
  appearsOn: ['/saadan-fungerer-det', '/faq'],
});

export const morningMarkers = placeholder({
  id: 'claim.morningMarkers',
  intent: 'Which markers peak in the morning. Naming two would make a good line credible.',
  needs: 'Clinical detail.',
  appearsOn: ['/saadan-fungerer-det'],
});

export const phlebotomist = verified({
  id: 'claim.phlebotomist',
  value:
    'Vores blodprøvetager har erfaring fra flere forskellige hospitaler og arbejder under tæt supervision af vores ansvarlige læge.',
  source: 'pandonia.com FAQ — "Hvem foretager blodprøven?"',
  appearsOn: ['/saadan-fungerer-det', '/faq'],
});

export const responsibleDoctor = placeholder({
  id: 'claim.responsibleDoctor',
  intent: 'Whether the responsible doctor is Benedikte Halle or a separate role.',
  needs: 'Pandonia confirmation. Affects how the supervision claim is worded.',
  appearsOn: ['/saadan-fungerer-det', '/om-pandonia'],
});

export const consultation = verified({
  id: 'claim.consultation',
  value:
    'Du booker konsultationen, når det passer dig — vi skal blot have mindst tre timer fra du modtager svaret. Tyve minutter online.',
  source: 'pandonia.com FAQ — "Hvordan foregår konsultationen med lægen?"',
  appearsOn: ['/saadan-fungerer-det', '/din-rapport', '/faq'],
});

export const corporateProgramme = verified({
  id: 'claim.corporateProgramme',
  value:
    'Vi kommer ud til arbejdspladsen og tager prøver på mange medarbejdere i ét samlet besøg, så tidsforbruget for den enkelte bliver minimalt.',
  source: 'pandonia.com FAQ — corporate',
  appearsOn: ['/faq'],
});

// ---------------------------------------------------------------------------
// Conflicting product facts — deliberately not resolved here
// ---------------------------------------------------------------------------

export const turnaround = requiresReview({
  id: 'claim.turnaround',
  value: 'Inden for to til fire timer efter prøven.',
  source: 'pandonia.com FAQ + process step 03 + stats band',
  needs:
    'Is 2–4 hours typical or best case? A range presented as a promise needs a stated basis.',
  appearsOn: ['/saadan-fungerer-det', '/din-rapport', '/faq'],
});

export const drawDuration = requiresReview({
  id: 'claim.drawDuration',
  value: 'Selve prøven tager omkring fem minutter.',
  source: 'pandonia.com stats band + EN FAQ',
  needs:
    'The booking system allocates 10 minutes for the Health Test and 15 for test + consultation. Which figure is customer-facing?',
  appearsOn: ['/', '/saadan-fungerer-det', '/faq'],
});

export const consultationIncluded = placeholder({
  id: 'claim.consultationIncluded',
  intent: 'Whether the 20-minute consultation is included in the 3.500 kr. Health Test.',
  needs:
    'Both pricing cards on the current site list it under both products, which makes the 1.250 kr. difference impossible to explain.',
  appearsOn: ['/book', '/', '/faq'],
});

export const cancellation = placeholder({
  id: 'claim.cancellation',
  intent: 'Cancellation terms and deadline.',
  needs: 'Commercial and legal confirmation.',
  appearsOn: ['/book', '/faq'],
});

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

export const scoreBasis = placeholder({
  id: 'claim.scoreBasis',
  intent: 'What the six category scores are scored on, and how the Pandonia Score is calculated.',
  needs:
    'Clinical and product confirmation. This single answer decides whether the two taxonomy layers are independent — see docs/content-architecture.md.',
  appearsOn: ['/', '/din-rapport'],
});

export const scoreComparability = placeholder({
  id: 'claim.scoreComparability',
  intent: 'Whether a score of 78 means the same thing at 32 as at 58.',
  needs: 'Clinical confirmation. Affects whether a single score can honestly be shown at all.',
  appearsOn: ['/din-rapport'],
});

// ---------------------------------------------------------------------------
// Legal and compliance
// ---------------------------------------------------------------------------

export const healthDisclaimer = requiresReview({
  id: 'legal.healthDisclaimer',
  value:
    'Pandonias tests erstatter ikke lægelig undersøgelse, diagnose eller behandling. Har du symptomer eller er du i tvivl, så kontakt din egen læge eller lægevagten.',
  needs: 'Legal approval, and confirmation that it meets Danish rules for marketing health services.',
  appearsOn: ['site-wide footer'],
});

export const dataHandling = placeholder({
  id: 'legal.dataHandling',
  intent: 'How results are stored, whether they enter a journal, and who else can see them.',
  needs: 'Legal and DPO approval.',
  appearsOn: ['/faq', '/book', '/persondatapolitik'],
});

export const companyDetails = placeholder({
  id: 'legal.companyDetails',
  intent: 'CVR, registered address, data controller.',
  needs: 'Legal.',
  appearsOn: ['site-wide footer'],
});
