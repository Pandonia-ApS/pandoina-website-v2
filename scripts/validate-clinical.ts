/**
 * CLINICAL CONTENT GATE
 *
 * Runs as `prebuild`, so `npm run build` cannot complete while any clinical
 * field is still `placeholder` or `requires_review`.
 *
 *   npm run validate:clinical            fail on any unresolved field
 *   npm run validate:clinical:report     print the full register, never fail
 *
 * Set PANDONIA_ALLOW_PLACEHOLDERS=true to permit an internal preview deploy.
 * The script then warns loudly and exits 0. Never set this in production.
 */

import { collectClinicalFields, groupByStatus, type CollectedField } from '../src/lib/clinical';
import * as areas from '../src/data/clinical/health-areas';
import * as systems from '../src/data/clinical/biological-systems';
import * as markers from '../src/data/clinical/biomarkers';
import * as claims from '../src/data/clinical/claims';

const REPORT_ONLY = process.argv.includes('--report');
const ALLOWED = process.env.PANDONIA_ALLOW_PLACEHOLDERS === 'true';

const sources: Array<[string, unknown]> = [
  ['health-areas', areas],
  ['biological-systems', systems],
  ['biomarkers', markers],
  ['claims', claims],
];

const all: CollectedField[] = sources.flatMap(([name, mod]) =>
  collectClinicalFields(mod, name),
);

const byStatus = groupByStatus(all);
const unresolved = [...byStatus.placeholder, ...byStatus.requires_review];

const bold = (s: string) => `[1m${s}[0m`;
const red = (s: string) => `[31m${s}[0m`;
const green = (s: string) => `[32m${s}[0m`;
const yellow = (s: string) => `[33m${s}[0m`;
const dim = (s: string) => `[2m${s}[0m`;

console.log('');
console.log(bold('Pandonia — clinical content gate'));
console.log(dim('─'.repeat(72)));
console.log(
  `  ${green(String(byStatus.verified.length))} verified   ` +
    `${yellow(String(byStatus.placeholder.length))} placeholder   ` +
    `${red(String(byStatus.requires_review.length))} requires_review`,
);
console.log(dim('─'.repeat(72)));

if (REPORT_ONLY || unresolved.length > 0) {
  const groups = new Map<string, CollectedField[]>();
  for (const f of unresolved) {
    const group = f.path.split('.')[0] ?? 'unknown';
    const list = groups.get(group) ?? [];
    list.push(f);
    groups.set(group, list);
  }

  for (const [group, fields] of groups) {
    console.log('');
    console.log(bold(`  ${group}`));
    for (const f of fields) {
      const badge = f.status === 'requires_review' ? red('REVIEW ') : yellow('PENDING');
      console.log(`    ${badge}  ${f.id}`);
      if (f.needs) console.log(dim(`             needs: ${f.needs}`));
      if (f.appearsOn?.length) {
        console.log(dim(`             appears on: ${f.appearsOn.join(', ')}`));
      }
    }
  }
  console.log('');
}

if (REPORT_ONLY) {
  console.log(dim('  Report only — exiting 0.\n'));
  process.exit(0);
}

if (unresolved.length === 0) {
  console.log(green('  All clinical content is verified. Safe to build.\n'));
  process.exit(0);
}

if (ALLOWED) {
  console.log(
    yellow(
      `  PANDONIA_ALLOW_PLACEHOLDERS=true — building WITH ${unresolved.length} unresolved field(s).`,
    ),
  );
  console.log(yellow('  This build must not be promoted to production.\n'));
  process.exit(0);
}

console.log(red(bold(`  BUILD BLOCKED — ${unresolved.length} unresolved clinical field(s).`)));
console.log('');
console.log('  Pandonia must verify these before this site can be published.');
console.log('  See docs/clinical-content.md.');
console.log('');
console.log(dim('  For an internal preview only:'));
console.log(dim('    PANDONIA_ALLOW_PLACEHOLDERS=true npm run build'));
console.log('');
process.exit(1);
