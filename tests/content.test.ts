import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compilePackage, parseSource, plan, readSources, sameContent, SourceError, type PackageSource } from '../src/lib/compile';
import type { BlueprintPackage } from '../src/lib/package';

const versionsOf = (name: string): Record<string, BlueprintPackage> => {
  const dir = join('content', name);
  if (!existsSync(dir)) return {};
  return Object.fromEntries(readdirSync(dir).map((v) => [v, JSON.parse(readFileSync(join(dir, v, 'blueprint.json'), 'utf8'))]));
};

describe('the source files', () => {
  it('compile to the latest version of every package, so content/ is up to date', () => {
    const steps = plan(readSources('source'), versionsOf, () => true, '2026-10-29');
    expect(steps.map((s) => [s.name, s.version, s.reason])).toEqual([
      ['common', '0.4.0', 'unchanged'],
      ['federal-foia', '0.3.0', 'unchanged'],
      ['federal-oig', '0.5.0', 'unchanged'],
      ['solutions', '0.2.0', 'unchanged'],
    ]);
  });

  it('cover every package in content/', () => {
    expect(readdirSync('source').sort()).toEqual(readdirSync('content').sort());
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

  it('gives a changed package its next version, and bumps the packages that build on it', () => {
    const files: Record<string, Record<string, BlueprintPackage>> = {
      shared: { '0.1.0': at(shared(), '0.1.0') },
      mission: { '0.1.0': at(mission(), '0.1.0') },
    };
    const changed = shared({ 'capabilities.yaml': '- id: tracking\n  title: Tracking\n  description: Track work, now with deadlines.\n' });
    const steps = plan([mission(), changed], (n) => files[n], published(['shared@0.1.0', 'mission@0.1.0']), '2026-10-29');
    expect(steps.map((s) => [s.name, s.version, Boolean(s.write), s.reason])).toEqual([
      ['shared', '0.2.0', true, '1 element edited'],
      ['mission', '0.2.0', true, 'builds on shared 0.2.0'],
    ]);
    expect(steps[1].write!.dependencies).toEqual([{ packageId: 'eb.shared', version: '0.2.0' }]);
    expect(steps[0].write!.publishedAt).toBe('2026-10-29');
  });

  it('rebuilds an unpublished version in place, and drops one that is no longer needed', () => {
    const files = { shared: { '0.1.0': at(shared(), '0.1.0'), '0.2.0': at(shared(), '0.2.0') } };
    const edited = shared({ 'capabilities.yaml': '- id: tracking\n  title: Tracking\n  description: Edited again.\n' });
    const rebuilt = plan([edited], (n) => files[n as 'shared'], published(['shared@0.1.0']), '2026-10-29');
    expect(rebuilt.map((s) => [s.version, Boolean(s.write), s.remove])).toEqual([['0.2.0', true, []]]);
    // Back as published: the unpublished 0.2.0 goes.
    const back = plan([shared()], (n) => files[n as 'shared'], published(['shared@0.1.0']), '2026-10-29');
    expect(back.map((s) => [s.version, Boolean(s.write), s.remove, s.reason])).toEqual([['0.1.0', false, ['0.2.0'], 'back to 0.1.0, as published']]);
  });

  it('starts a new package at 0.1.0', () => {
    expect(plan([shared()], () => ({}), () => false, '2026-10-29').map((s) => [s.version, s.reason])).toEqual([['0.1.0', 'new package']]);
  });
});
