/**
 * IMAGE MANIFEST
 *
 * Every image on the site is declared here before it exists. The PhotoBlock
 * component renders a neutral art-direction plate from this data, so the
 * layout is final and a real file drops in without touching a component.
 *
 * `src` stays null until the shoot. When a file lands in /public/images,
 * set `src` and the plate is replaced by a real <Image> automatically.
 *
 * Full briefs: Phase 3 Revision B §07 (eleven-shot photography brief).
 */

export type ShotId =
  | 'ARM-01'
  | 'HAND-01'
  | 'HAND-02'
  | 'HALS-01'
  | 'RUM-01'
  | 'RUM-02'
  | 'LYS-01'
  | 'LYS-02'
  | 'LYS-03'
  | 'OBJ-01'
  | 'OBJ-02'
  | 'LAB-01'
  | 'LAB-02'
  | 'LAB-03'
  | 'SKAERM-01'
  | 'PORTRAET-01'
  | 'HOLD-01'
  | 'HOLD-02'
  | 'HOLD-03'
  | 'HOLD-04';

export interface ImageEntry {
  id: ShotId;
  /** Route where it appears. */
  route: string;
  /** Section within the route. */
  section: string;
  /** Desktop aspect ratio, CSS value. */
  aspect: string;
  /** Mobile recrop — never a rescale of the desktop frame. */
  mobileAspect: string;
  /** object-position for the focal point, both viewports. */
  focal: string;
  mobileFocal?: string;
  /** One line for the photographer. Full brief in Phase 3 Rev B §07. */
  brief: string;
  /** Alt text strategy: decorative frames are empty, informative ones describe. */
  alt: string;
  /** Set once a real file exists in /public/images. */
  src: string | null;
  /** Only the hero is eager. Everything else lazy-loads. */
  priority?: boolean;
}

export const imageManifest: readonly ImageEntry[] = [
  {
    id: 'ARM-01',
    route: '/',
    section: 'hero',
    aspect: '3 / 4',
    mobileAspect: '16 / 10',
    focal: '50% 40%',
    mobileFocal: '50% 45%',
    brief:
      'Forearm and inner elbow, palm up on a table. Hard raking sidelight so skin reads as topography. Directly above. Frame cuts at wrist and mid-upper-arm. f/1.8. No face, no needle, no blood.',
    alt: '',
    src: null,
    priority: true,
  },
  {
    id: 'HALS-01',
    route: '/',
    section: 'beat-04-marker',
    aspect: '4 / 5',
    mobileAspect: '3 / 2',
    focal: '60% 50%',
    brief:
      'Neck, jaw underside, collarbone. Cold low winter daylight from the side — the season should be legible. Slightly below, looking up. Collarbone sharp. Jumper collar entering the bottom of frame.',
    alt: '',
    src: null,
  },
  {
    id: 'RUM-01',
    route: '/',
    section: 'beat-05-breath',
    aspect: '3 / 2',
    mobileAspect: '4 / 5',
    focal: '30% 50%',
    mobileFocal: '25% 50%',
    brief:
      'The whole kitchen, person small and off-centre at the far left, not looking at camera. Window filling the right third, blown out. Standing height from a doorway, with a dark out-of-focus door frame entering the left of frame.',
    alt: 'Et køkken i København om morgenen.',
    src: null,
  },
  {
    id: 'HAND-02',
    route: '/',
    section: 'beat-06-day',
    aspect: '3 / 4',
    mobileAspect: '3 / 4',
    focal: '50% 50%',
    brief:
      'Two pairs of hands at the kitchen table — the tourniquet being fastened, or the plaster smoothed afterwards. Slight motion blur preferred over a frozen pose. No faces. Never the needle.',
    alt: '',
    src: null,
  },
  {
    id: 'OBJ-02',
    route: '/',
    section: 'beat-06-day',
    aspect: '3 / 4',
    mobileAspect: '3 / 4',
    focal: '50% 50%',
    brief:
      'The tube in a transport bag, on a seat or in a hand. Copenhagen streets visible but unreadable through glass. The one frame where background motion blur is required. No branded vehicle, no landmark.',
    alt: '',
    src: null,
  },
  {
    id: 'LAB-01',
    route: '/',
    section: 'beat-06-day',
    aspect: '3 / 4',
    mobileAspect: '3 / 4',
    focal: '50% 50%',
    brief:
      'A rack of tubes on a working bench, a hand entering frame to label one. A window must be in frame or clearly the light source. f/2 — the room must not be readable as a room. Workshop, not cleanroom.',
    alt: '',
    src: null,
  },
  {
    id: 'SKAERM-01',
    route: '/',
    section: 'beat-06-day',
    aspect: '3 / 4',
    mobileAspect: '3 / 4',
    focal: '50% 50%',
    brief:
      'A phone face-up on a desk, report visible but not legible. Flat overhead midday light — cooler than the morning frames. Steep angle. Screen content deliberately soft. No face reacting.',
    alt: '',
    src: null,
  },
  {
    id: 'PORTRAET-01',
    route: '/',
    section: 'beat-09-doctor',
    aspect: '4 / 5',
    mobileAspect: '4 / 5',
    focal: '50% 35%',
    brief:
      'Pandonia’s doctor, three-quarter, cropped at the shoulder. Soft window light from the left, shadow side intact. No coat, no stethoscope, no desk. The only frame on the site where eyes meet the lens. Requires consent.',
    alt: 'Benedikte Halle, læge hos Pandonia.',
    src: null,
  },
  {
    id: 'HAND-01',
    route: '/saadan-fungerer-det',
    section: 'opening',
    aspect: '16 / 7',
    mobileAspect: '4 / 5',
    focal: '50% 55%',
    brief:
      'A hand at rest on worn oak beside a ceramic cup, tourniquet coiled soft at the far edge. Window light raking from upper left with visible falloff to shadow at right. Table height. f/2.',
    alt: '',
    src: null,
    priority: true,
  },
  {
    id: 'OBJ-01',
    route: '/saadan-fungerer-det',
    section: 'transit',
    aspect: '16 / 7',
    mobileAspect: '4 / 5',
    focal: '50% 50%',
    brief:
      'The filled sample tube upright on the kitchen table, label facing slightly away. Backlit from the window so the edge catches; room falls to warm dark. No hands, no white surface, no product lighting.',
    alt: '',
    src: null,
  },
  {
    id: 'LAB-02',
    route: '/saadan-fungerer-det',
    section: 'laboratoriet',
    aspect: '4 / 3',
    mobileAspect: '4 / 3',
    focal: '50% 50%',
    brief: 'Second laboratory frame — bench detail, shallow, daylight. See LAB-01 for treatment.',
    alt: '',
    src: null,
  },
  {
    id: 'LAB-03',
    route: '/saadan-fungerer-det',
    section: 'laboratoriet',
    aspect: '4 / 3',
    mobileAspect: '4 / 3',
    focal: '50% 50%',
    brief: 'Third laboratory frame — a hand labelling, mid-task. See LAB-01 for treatment.',
    alt: '',
    src: null,
  },
  {
    id: 'RUM-02',
    route: '/om-pandonia',
    section: 'opening',
    aspect: '16 / 7',
    mobileAspect: '4 / 5',
    focal: '40% 50%',
    brief:
      'A second wide room frame, different apartment or different hour from RUM-01. Same rules: person small, window blown, foreground obstruction.',
    alt: '',
    src: null,
  },
  {
    id: 'LYS-01',
    route: '/om-pandonia',
    section: 'between-why-sections',
    aspect: '16 / 9',
    mobileAspect: '3 / 2',
    focal: '50% 50%',
    brief:
      'No person. Window light crossing a wooden table, or steam off a cup. Shoot several across the morning for a graded set. Exists to break a run of text — see Phase 5 design review.',
    alt: '',
    src: null,
  },
  {
    id: 'LYS-02',
    route: '/hvad-vi-maaler',
    section: 'area-5',
    aspect: '16 / 9',
    mobileAspect: '3 / 2',
    focal: '50% 50%',
    brief: 'Connective light frame. See LYS-01.',
    alt: '',
    src: null,
  },
  {
    id: 'LYS-03',
    route: '/hvad-vi-maaler',
    section: 'area-6',
    aspect: '16 / 9',
    mobileAspect: '3 / 2',
    focal: '50% 50%',
    brief: 'Connective light frame. See LYS-01.',
    alt: '',
    src: null,
  },
  {
    id: 'HOLD-01',
    route: '/om-pandonia',
    section: 'team',
    aspect: '4 / 5',
    mobileAspect: '4 / 5',
    focal: '50% 35%',
    brief: 'Team frame — same treatment as PORTRAET-01 but eyes away from the lens. Consent required.',
    alt: 'Benedikte Halle',
    src: null,
  },
  {
    id: 'HOLD-02',
    route: '/om-pandonia',
    section: 'team',
    aspect: '4 / 5',
    mobileAspect: '4 / 5',
    focal: '50% 35%',
    brief: 'Team frame. Consent required.',
    alt: 'Deborah Saren',
    src: null,
  },
  {
    id: 'HOLD-03',
    route: '/om-pandonia',
    section: 'team',
    aspect: '4 / 5',
    mobileAspect: '4 / 5',
    focal: '50% 35%',
    brief: 'Team frame. Consent required.',
    alt: 'Carol Melo',
    src: null,
  },
  {
    id: 'HOLD-04',
    route: '/om-pandonia',
    section: 'team',
    aspect: '4 / 5',
    mobileAspect: '4 / 5',
    focal: '50% 35%',
    brief: 'Team frame. Consent required.',
    alt: 'Laura D. Ellis-Aguilar',
    src: null,
  },
];

const byId = new Map(imageManifest.map((e) => [e.id, e]));

export function getImage(id: ShotId): ImageEntry {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Unknown shot id: ${id}`);
  return entry;
}

export const shootStatus = {
  total: imageManifest.length,
  delivered: imageManifest.filter((e) => e.src !== null).length,
};
