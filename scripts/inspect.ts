// Answers questions about the current release, for people and coding agents.
//
//   pnpm content:show <id or words>   an element, with every link to and from it across the release,
//                                     its resources, and the discovery answers that point at it
//   pnpm content:report               what each package holds, and gaps worth a look
//
// Both read content/ at its newest release, so run pnpm content:build first.
// Add --json for the same answer as data.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareVersions } from '../src/lib/format.ts';
import type { BlueprintPackage, Element, Relation } from '../src/lib/package.ts';
import { elementTypes, groupings } from '../src/lib/vocabulary.ts';

const [command, ...rest] = process.argv.slice(2);
const json = rest.includes('--json');
const query = rest.filter((a) => a !== '--json').join(' ').trim();

const versions = readdirSync('content').flatMap((name) => readdirSync(join('content', name)).map((version) => ({ name, version })));
const release = versions.map((v) => v.version).sort(compareVersions).at(-1)!;
const packages: BlueprintPackage[] = versions
  .filter((v) => v.version === release)
  .map((v) => JSON.parse(readFileSync(join('content', v.name, v.version, 'blueprint.json'), 'utf8')));
const short = (p: BlueprintPackage) => p.title.split(' — ')[0];
const elements = packages.flatMap((p) => p.elements.map((e) => ({ ...e, pkg: p })));
const relations = packages.flatMap((p) => p.relations.map((r) => ({ ...r, pkg: p })));
const byId = new Map(elements.map((e) => [e.id, e]));
const title = (id: string) => byId.get(id)?.title ?? '(not in this release)';
const groupOf = (e: Element) => {
  const g = groupings[e.type];
  return g && typeof e.attributes?.[g.field] === 'string' ? `${g.field}: ${e.attributes[g.field]}` : undefined;
};
const questions = packages.flatMap((p) =>
  (p.assessments ?? []).flatMap((a) => a.questions.map((q) => ({ pkg: p, assessment: a.id, id: q.id, prompt: q.prompt, targets: new Set((q.candidateMappings ?? []).map((m) => m.elementId)) }))),
);
const print = (data: unknown, text: () => void) => (json ? console.log(JSON.stringify(data, null, 2)) : text());

function show() {
  if (!query) {
    console.error('Usage: pnpm content:show <id or words>, such as eb:capability:records-management, records-management, or "records"');
    process.exit(2);
  }
  const q = query.toLowerCase();
  const exact = elements.filter((e) => e.id === query || e.id.endsWith(`:${query}`) || e.id.split(':').slice(1).join(':') === query);
  const found = exact.length ? exact : elements.filter((e) => e.title.toLowerCase().includes(q) || e.id.includes(q));
  if (found.length !== 1) {
    return print(
      found.map((e) => ({ id: e.id, title: e.title })),
      () => {
        if (!found.length) console.log(`Nothing in release ${release} matches "${query}".`);
        else for (const e of found) console.log(`${e.id.padEnd(60)} ${e.title}`);
      },
    );
  }
  const e = found[0];
  const link = (r: Relation & { pkg: BlueprintPackage }, other: string) => ({
    predicate: r.predicate,
    id: other,
    title: title(other),
    ...(r.way && { way: r.way }),
    ...(r.coverage === 'partial' && { partial: true }),
    ...(r.description && { note: r.description }),
    statedIn: short(r.pkg),
  });
  const out = relations.filter((r) => r.from === e.id).map((r) => link(r, r.to));
  const into = relations.filter((r) => r.to === e.id).map((r) => link(r, r.from));
  const asked = questions.filter((x) => x.targets.has(e.id)).map((x) => ({ id: x.id, assessment: x.assessment, prompt: x.prompt }));
  const { pkg, ...element } = e;
  print({ ...element, package: { packageId: pkg.packageId, version: pkg.version }, linksOut: out, linksIn: into, discovery: asked }, () => {
    console.log(`${e.id}  (${elementTypes[e.type]?.label ?? e.type}, ${short(pkg)} ${pkg.version})`);
    console.log(e.title);
    if (groupOf(e)) console.log(groupOf(e));
    console.log(`\n${e.description}`);
    const lines = (heading: string, list: ReturnType<typeof link>[], arrow: string) => {
      if (!list.length) return;
      console.log(`\n${heading}:`);
      for (const l of list) {
        const extra = [l.way && `way ${l.way}`, l.partial && 'partly', l.statedIn !== short(pkg) && `in ${l.statedIn}`].filter(Boolean).join(', ');
        console.log(`  ${l.predicate} ${arrow} ${l.id}  ${l.title}${extra ? `  [${extra}]` : ''}`);
      }
    };
    lines('Links out', out, '→');
    lines('Links in', into, '←');
    if (asked.length) {
      console.log('\nDiscovery questions whose answers point here:');
      for (const x of asked) console.log(`  ${x.id}  ${x.prompt}`);
    }
  });
}

function report() {
  const linked = (id: string) => relations.some((r) => r.from === id || r.to === id);
  const asked = new Set(questions.flatMap((q) => [...q.targets]));
  const year = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
  const counts = packages.map((p) => ({
    package: short(p),
    packageId: p.packageId,
    ...Object.fromEntries(Object.keys(elementTypes).flatMap((t) => {
      const n = p.elements.filter((e) => e.type === t).length;
      return n ? [[(n === 1 ? elementTypes[t].label : elementTypes[t].plural).toLowerCase(), n]] : [];
    })),
    questions: questions.filter((q) => q.pkg === p).length,
  }));
  const ids = (list: { id: string }[]) => list.map((e) => e.id);
  const gaps = {
    'requirements without sources': ids(elements.filter((e) => e.type === 'requirement' && !e.sourceIds?.length)),
    'capabilities no discovery answer points at': ids(elements.filter((e) => e.type === 'capability' && !asked.has(e.id))),
    'capabilities without candidate patterns': ids(elements.filter((e) => e.type === 'capability' && !relations.some((r) => r.from === e.id && r.predicate === 'candidate_pattern'))),
    'outcomes without measures': ids(elements.filter((e) => e.type === 'outcome' && !(e.attributes?.measures as unknown[] | undefined)?.length)),
    'items without a group': ids(elements.filter((e) => groupings[e.type] && !groupOf(e))),
    // Deprecated patterns, which became ways of others, are left alone.
    'elements nothing links to': ids(elements.filter((e) => e.type !== 'mission' && e.status !== 'deprecated' && !linked(e.id))),
    'resources not checked in a year': ids(elements.filter((e) => e.type === 'resource' && String(e.attributes?.lastReviewedAt ?? '') < year)),
    'sources not reviewed in a year': packages.flatMap((p) => (p.sources ?? []).filter((s) => (s.lastReviewedAt ?? '') < year).map((s) => `${short(p)}: ${s.id}`)),
  };
  print({ release, packages: counts, gaps }, () => {
    console.log(`Release ${release}\n`);
    for (const c of counts) {
      const { package: name, packageId: _, ...n } = c;
      console.log(`${name.padEnd(28)} ${Object.entries(n).map(([k, v]) => `${v} ${k}`).join(', ')}`);
    }
    console.log('\nWorth a look:');
    for (const [label, list] of Object.entries(gaps)) {
      console.log(`  ${label}: ${list.length || 'none'}`);
      for (const id of list.slice(0, 12)) console.log(`    ${id}  ${byId.get(id)?.title ?? ''}`);
      if (list.length > 12) console.log(`    and ${list.length - 12} more (--json lists them all)`);
    }
  });
}

if (command === 'show') show();
else if (command === 'report') report();
else {
  console.error('Usage: inspect.ts show <id or words> | report  [--json]');
  process.exit(2);
}
