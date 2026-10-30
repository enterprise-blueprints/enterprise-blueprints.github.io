import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compilePackage, parseSource, plan, readSources, sameContent, SourceError, type PackageSource } from '../src/lib/compile';
import { compareVersions } from '../src/lib/format';
import type { BlueprintPackage } from '../src/lib/package';

const content: Record<string, Record<string, BlueprintPackage>> = Object.fromEntries(
  readdirSync('content').map((name) => [
    name,
    Object.fromEntries(readdirSync(join('content', name)).map((v) => [v, JSON.parse(readFileSync(join('content', name, v, 'blueprint.json'), 'utf8'))])),
  ]),
);
const release = Object.values(content).flatMap((versions) => Object.keys(versions)).sort(compareVersions).at(-1);

describe('the source files', () => {
  it('compile to the current release, so content/ is up to date', () => {
    const steps = plan(readSources('source'), content, () => true, '2026-10-29');
    const live = steps.filter((s) => !s.retired);
    expect(live.map((s) => s.name)).toEqual(readdirSync('source'));
    for (const s of live) expect([s.name, s.version, s.reason]).toEqual([s.name, release, 'unchanged']);
  });

  it('leave packages without a source out of the release, as retired', () => {
    for (const name of readdirSync('content').filter((n) => !existsSync(join('source', n)))) {
      expect(Object.keys(content[name]), name).not.toContain(release);
    }
  });
});

// A small package: a mission package that builds on a shared one.
const shared = (extra: Record<string, string> = {}): PackageSource =>
  parseSource('shared', {
    'package.yaml': 'schemaVersion: 0.2.0\npackageId: eb.shared\ntitle: Shared\ndescription: Shared things.\npublisher: { name: Test }\nlicense: MIT\ndomain: public-sector\n',
    'capabilities.yaml': '- id: tracking\n  title: Tracking\n  description: Track work.\n',
    ...extra,
  });
const mission = (capabilities = ''): PackageSource =>
  parseSource('mission', {
    'package.yaml': 'schemaVersion: 0.2.0\npackageId: eb.mission\ntitle: Mission\ndescription: A mission.\npublisher: { name: Test }\nlicense: MIT\ndomain: public-sector\ndependencies: [shared]\n',
    'sources.yaml': '- id: law\n  title: The law\n  url: https://example.gov/law\n  kind: official-reference\n',
    'missions.yaml': '- id: m\n  title: M\n  description: The mission.\n  sources: [law]\n  seeks: [o1, o2]\n',
    'outcomes.yaml': '- id: o1\n  title: O1\n  description: First.\n- id: o2\n  title: O2\n  description: Second.\n',
    'capabilities.yaml':
      capabilities ||
      '- id: intake\n  title: Intake\n  description: Take things in.\n  contributes_to: [o1]\n  candidate_pattern:\n    - p\n    - to: shared-pattern\n      note: Here it needs care.\n      coverage: partial\n      id: legacy-id\n',
    'patterns.yaml': '- id: p\n  title: P\n  description: An example architecture.\n  attributes: { approach: product, role: business-applications }\n',
    'links.yaml': '- from: capability:tracking\n  contributes_to: [o2]\n',
    'discovery.yaml':
      '- id: start\n  title: Start\n  questions:\n    - id: channels\n      prompt: Which channels?\n      kind: multiple-choice\n      options:\n        - web: The web\n        - phone: Phone\n      points:\n        - when: [web, phone]\n          to: capability:intake\n          why: Intake matters.\n    - id: tracked\n      prompt: Tracked?\n      kind: boolean\n      points:\n        - when: false\n          to: [capability:tracking, implementationPattern:p]\n          why: Not yet.\n',
  });
const pins = { shared: { packageId: 'eb.shared', version: '0.1.0' } };

describe('compilePackage', () => {
  const pkg = compilePackage(mission(), pins, '0.1.0', '2026-10-29');

  it('names elements by type and key, and pins what it builds on', () => {
    expect(pkg.elements.map((e) => e.id)).toEqual(['eb:mission:m', 'eb:outcome:o1', 'eb:outcome:o2', 'eb:capability:intake', 'eb:implementationPattern:p']);
    expect(pkg.elements[0]).toEqual({ id: 'eb:mission:m', type: 'mission', title: 'M', description: 'The mission.', status: 'reference', sourceIds: ['src:law'] });
    expect(pkg.dependencies).toEqual([{ packageId: 'eb.shared', version: '0.1.0' }]);
    expect(pkg.sources![0].id).toBe('src:law');
  });

  it('turns links into relations, with generated IDs unless one is given', () => {
    expect(pkg.relations).toEqual([
      { id: 'rel:m-seeks-o1', from: 'eb:mission:m', predicate: 'seeks', to: 'eb:outcome:o1' },
      { id: 'rel:m-seeks-o2', from: 'eb:mission:m', predicate: 'seeks', to: 'eb:outcome:o2' },
      { id: 'rel:intake-contributes-to-o1', from: 'eb:capability:intake', predicate: 'contributes_to', to: 'eb:outcome:o1' },
      { id: 'rel:intake-candidate-pattern-p', from: 'eb:capability:intake', predicate: 'candidate_pattern', to: 'eb:implementationPattern:p' },
      { id: 'rel:legacy-id', from: 'eb:capability:intake', predicate: 'candidate_pattern', to: 'eb:implementationPattern:shared-pattern', coverage: 'partial', description: 'Here it needs care.' },
      // From links.yaml: a shared element's link into this package.
      { id: 'rel:tracking-contributes-to-o2', from: 'eb:capability:tracking', predicate: 'contributes_to', to: 'eb:outcome:o2' },
    ]);
  });

  it('puts a capability’s stage in its attributes, beside the ones written there', () => {
    const c = compilePackage(mission('- id: c\n  title: C\n  description: D.\n  stage: assess-decide\n  attributes: { scope: here }\n'), pins, '0.1.0', 'd').elements.find((e) => e.type === 'capability');
    expect(c!.attributes).toEqual({ scope: 'here', stage: 'assess-decide' });
  });

  it('expands each group of discovery answers into one mapping per answer and element', () => {
    const [channels, tracked] = pkg.assessments![0].questions;
    expect(channels.options).toEqual([{ value: 'web', label: 'The web' }, { value: 'phone', label: 'Phone' }]);
    expect(channels.candidateMappings!.map((m) => m.answerValue)).toEqual(['web', 'phone']);
    expect(tracked.candidateMappings).toEqual([
      { answerValue: 'false', elementId: 'eb:capability:tracking', interpretation: 'Not yet.' },
      { answerValue: 'false', elementId: 'eb:implementationPattern:p', interpretation: 'Not yet.' },
    ]);
  });

  it.each<[string, () => unknown, string]>([
    ['an unknown file', () => shared({ 'widgets.yaml': '[]' }), 'widgets.yaml: unknown file'],
    ['a version written by hand', () => parseSource('x', { 'package.yaml': 'version: 1.0.0\n' }), '"version" is set when the package is built'],
    ['a misspelled link', () => compilePackage(mission('- id: c\n  title: C\n  description: D.\n  satisfy: [r]\n'), pins, '0.1.0', 'd'), 'unknown field "satisfy"'],
    [
      'a reference without its type',
      () => compilePackage(mission('- id: c\n  title: C\n  description: D.\n  satisfies: [{ to: "eb:requirement:r" }]\n'), pins, '0.1.0', 'd') && compilePackage(parseSource('y', { 'package.yaml': 'packageId: y\n', 'links.yaml': '- from: tracking\n  satisfies: [r]\n' }), {}, '0.1.0', 'd'),
      'should name a type and a key',
    ],
    ['a package it builds on that has no source', () => compilePackage(mission(), {}, '0.1.0', 'd'), 'builds on "shared", which isn\'t a package'],
    ['a stage that isn’t in the vocabulary', () => compilePackage(mission('- id: c\n  title: C\n  description: D.\n  stage: someday\n'), pins, '0.1.0', 'd'), 'unknown stage "someday", which should be one of plan-prepare'],
    ['a group on the wrong type', () => compilePackage(mission('- id: c\n  title: C\n  description: D.\n  kind: timeliness\n'), pins, '0.1.0', 'd'), 'only a requirement has a kind'],
  ])('reports %s', (_, run, message) => {
    expect(run).toThrow(SourceError);
    expect(run).toThrow(message);
  });
});

describe('plan', () => {
  const at = (src: PackageSource, version: string, deps = pins) => compilePackage(src, deps, version, '2026-10-01');
  const published = (list: string[]) => (name: string, v: string) => list.includes(`${name}@${v}`);

  it('keeps a package on its published version when its source matches, whatever the order of unrelated links', () => {
    const pkg = at(mission(), '0.1.0');
    // The shared element's link first, and the types in another order, each one's own order kept.
    const relations = [pkg.relations.at(-1)!, ...pkg.relations.slice(0, -1)];
    const elements = [...pkg.elements.filter((e) => e.type !== 'mission'), pkg.elements[0]];
    const reordered = { ...pkg, relations, elements };
    expect(sameContent(pkg, reordered)).toBe(true);
    // The order of one element's links of one kind is shown, so it counts.
    const swapped = { ...pkg, relations: [pkg.relations[1], pkg.relations[0], ...pkg.relations.slice(2)] };
    expect(sameContent(pkg, swapped)).toBe(false);
  });

  it('releases every package at the next version when any one changes, each building on the others at it', () => {
    const files = { shared: { '0.1.0': at(shared(), '0.1.0') }, mission: { '0.1.0': at(mission(), '0.1.0') } };
    const changed = shared({ 'capabilities.yaml': '- id: tracking\n  title: Tracking\n  description: Track work, now with deadlines.\n' });
    const steps = plan([changed, mission()], files, published(['shared@0.1.0', 'mission@0.1.0']), '2026-10-29');
    expect(steps.map((s) => [s.name, s.version, Boolean(s.write), s.reason])).toEqual([
      ['shared', '0.2.0', true, '1 element edited'],
      ['mission', '0.2.0', true, 'no changes of its own'],
    ]);
    expect(steps[1].write!.dependencies).toEqual([{ packageId: 'eb.shared', version: '0.2.0' }]);
    expect(steps[0].write!.publishedAt).toBe('2026-10-29');
    // When the mission changes instead, the package it builds on, which builds on nothing, has none of its own.
    const missionChanged = mission('- id: intake\n  title: Intake\n  description: Take things in, from anywhere.\n');
    expect(plan([shared(), missionChanged], files, published(['shared@0.1.0', 'mission@0.1.0']), '2026-10-29')[0].reason).toBe('no changes of its own');
  });

  it('stays on the published release when nothing changed', () => {
    const v2 = { shared: { packageId: 'eb.shared', version: '0.2.0' } };
    const files = { shared: { '0.2.0': at(shared(), '0.2.0') }, mission: { '0.2.0': at(mission(), '0.2.0', v2) } };
    const steps = plan([shared(), mission()], files, () => true, '2026-10-29');
    expect(steps.map((s) => [s.name, s.version, Boolean(s.write), s.reason])).toEqual([
      ['shared', '0.2.0', false, 'unchanged'],
      ['mission', '0.2.0', false, 'unchanged'],
    ]);
  });

  it('rebuilds an unpublished release in place, and drops one that is no longer needed', () => {
    const files = { shared: { '0.1.0': at(shared(), '0.1.0'), '0.2.0': at(shared(), '0.2.0') } };
    const edited = shared({ 'capabilities.yaml': '- id: tracking\n  title: Tracking\n  description: Edited again.\n' });
    const rebuilt = plan([edited], files, published(['shared@0.1.0']), '2026-10-29');
    expect(rebuilt.map((s) => [s.version, Boolean(s.write), s.remove])).toEqual([['0.2.0', true, []]]);
    // Back as published: the unpublished 0.2.0 goes.
    const back = plan([shared()], files, published(['shared@0.1.0']), '2026-10-29');
    expect(back.map((s) => [s.version, Boolean(s.write), s.remove, s.reason])).toEqual([['0.1.0', false, ['0.2.0'], 'back to 0.1.0, as published']]);
  });

  it('retires a package whose source is gone, keeping its published versions, in a new release', () => {
    const files = { shared: { '0.1.0': at(shared(), '0.1.0') }, mission: { '0.1.0': at(mission(), '0.1.0'), '0.2.0': at(mission(), '0.2.0') } };
    const steps = plan([shared()], files, published(['shared@0.1.0', 'mission@0.1.0']), '2026-10-29');
    expect(steps.map((s) => [s.name, s.version, Boolean(s.write), s.remove, Boolean(s.retired)])).toEqual([
      ['shared', '0.2.0', true, [], false],
      ['mission', '0.1.0', false, ['0.2.0'], true],
    ]);
  });

  it('starts a new library at 0.1.0', () => {
    expect(plan([shared()], {}, () => false, '2026-10-29').map((s) => [s.version, s.reason])).toEqual([['0.1.0', 'new package']]);
  });
});
