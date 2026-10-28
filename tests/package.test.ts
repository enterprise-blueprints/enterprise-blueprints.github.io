import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validatePackage, type BlueprintPackage, type Resolve } from '../src/lib/package';

const read = (path: string): BlueprintPackage => JSON.parse(readFileSync(path, 'utf8'));
const original = read('content/federal-oig/0.4.0/blueprint.json');
const common = read('content/common/0.3.0/blueprint.json');
const foia = read('content/federal-foia/0.2.0/blueprint.json');
// Published versions, which never change.
const oig010 = read('content/federal-oig/0.1.0/blueprint.json');
const oig020 = read('content/federal-oig/0.2.0/blueprint.json');
const oig030 = read('content/federal-oig/0.3.0/blueprint.json');
const common010 = read('content/common/0.1.0/blueprint.json');
const common020 = read('content/common/0.2.0/blueprint.json');
const foia010 = read('content/federal-foia/0.1.0/blueprint.json');
const all = [original, common, foia, oig010, oig020, oig030, common010, common020, foia010];
const resolve: Resolve = (id, version) => all.find((p) => p.packageId === id && p.version === version);
const missions = [original, foia];

/** A copy of the real package with one change applied. */
function broken(change: (pkg: BlueprintPackage) => void): BlueprintPackage {
  const pkg = structuredClone(original);
  change(pkg);
  return pkg;
}

const mission = 'eb:mission:independent-government-oversight';
const pattern = 'eb:implementationPattern:oversight-intake-case-tracking';
const ofType = (pkg: BlueprintPackage, type: string) => pkg.elements.filter((e) => e.type === type);
const patternOf = (pkg: BlueprintPackage) => pkg.elements.find((e) => e.id === pattern)!;

describe('validatePackage', () => {
  it('accepts the mission packages, which build on the common one', () => {
    expect(validatePackage(original, resolve)).toEqual([]);
    expect(validatePackage(foia, resolve)).toEqual([]);
    expect(validatePackage(common)).toEqual([]);
  });

  it('accepts the published versions as they were', () => {
    expect(validatePackage(oig010)).toEqual([]);
    for (const pkg of [oig020, oig030, foia010]) expect(validatePackage(pkg, resolve), pkg.version).toEqual([]);
    expect(validatePackage(common010)).toEqual([]);
    expect(validatePackage(common020)).toEqual([]);
  });

  it('has one mission, five capabilities, ten requirements, and five patterns in the OIG package', () => {
    const counts = Object.groupBy(original.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.capability).toHaveLength(5);
    expect(counts.implementationPattern).toHaveLength(5);
    expect(counts.requirement).toHaveLength(10);
  });

  it('has one mission, six outcomes, seven capabilities, and five patterns in the FOIA package', () => {
    const counts = Object.groupBy(foia.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.outcome).toHaveLength(6);
    expect(counts.capability).toHaveLength(7);
    expect(counts.implementationPattern).toHaveLength(5);
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a malformed element ID', (p) => (p.elements[0].id = 'Mission One'), 'schema: /elements/0/id'],
    ['a missing required field', (p) => delete (p as Partial<BlueprintPackage>).title, 'schema:'],
    ['an unexpected field', (p) => ((p.elements[0] as unknown as Record<string, unknown>).extra = 1), 'schema:'],
    ['a duplicate element ID', (p) => p.elements.push(p.elements[1]), 'duplicate element ID'],
    ['a duplicate relation ID', (p) => p.relations.push({ ...p.relations[0], to: pattern, predicate: 'candidate_pattern' }), 'duplicate relation ID'],
    ['a duplicate source ID', (p) => p.sources!.push(p.sources![0]), 'duplicate source ID'],
    ['an unknown element type', (p) => (p.elements[0] = { ...p.elements[0], id: 'eb:widget:x', type: 'widget' }), 'unknown type "widget"'],
    ['an ID that names a different type', (p) => (p.elements[1].type = 'mission'), "doesn't match its type"],
    ['a citation of an unknown source', (p) => p.elements[0].sourceIds!.push('src:missing'), 'unknown source src:missing'],
    ['a replacement that doesn\'t exist', (p) => (p.elements[0].replacedBy = 'eb:mission:missing'), 'replaced by unknown element'],
    ['a dangling relation endpoint', (p) => (p.relations[0].to = 'eb:mission:missing'), 'ends at unknown element eb:mission:missing'],
    ['an unknown predicate', (p) => (p.relations[0].predicate = 'owns'), 'unknown predicate "owns"'],
    ['a predicate between the wrong types', (p) => (p.relations[0].to = pattern), '"seeks" can\'t link mission'],
    ['a repeated relationship', (p) => p.relations.push({ ...p.relations[0], id: 'rel:copy' }), 'repeats'],
    ['an unknown schema version', (p) => ((p as { schemaVersion: string }).schemaVersion = '9.0.0'), 'schemaVersion should be one of 0.1.0, 0.2.0'],
    ['dependencies under schema 0.1.0', (p) => (p.schemaVersion = '0.1.0'), 'must NOT have additional properties'],
    ['a pattern with an unknown approach', (p) => (patternOf(p).attributes!.approach = 'outsource'), 'unknown approach "outsource"'],
    ['a pattern with an empty list', (p) => (patternOf(p).attributes!.watchFor = []), 'needs watchFor to be a list of statements'],
    ['a pattern with a list that isn’t statements', (p) => (patternOf(p).attributes!.parts = 'a database'), 'needs parts to be a list of statements'],
  ])('rejects %s', (_, change, message) => {
    const errors = validatePackage(broken(change), resolve);
    expect(errors.join('\n')).toContain(message);
  });

  it('reports every problem, not just the first', () => {
    const errors = validatePackage(
      broken((p) => {
        p.relations[0].to = 'eb:mission:missing';
        p.relations[1].from = 'eb:capability:missing';
      }),
      resolve,
    );
    expect(errors).toHaveLength(2);
  });
});

describe.each(missions.map((pkg) => [pkg.title, pkg] as const))('%s', (_, pkg) => {
  const [own] = ofType(pkg, 'mission');
  const outcomes = pkg.relations.filter((r) => r.predicate === 'seeks' && r.from === own.id).map((r) => r.to);

  it('links every capability to the mission through an outcome it seeks', () => {
    expect(outcomes).toEqual(ofType(pkg, 'outcome').map((o) => o.id));
    for (const c of ofType(pkg, 'capability')) {
      expect(pkg.relations.some((r) => r.predicate === 'contributes_to' && r.from === c.id && outcomes.includes(r.to)), c.id).toBe(true);
    }
    expect(pkg.relations.some((r) => r.predicate === 'supports_mission')).toBe(false);
  });

  it('gives every outcome a measure, and every measure one outcome', () => {
    const measuredBy = pkg.relations.filter((r) => r.predicate === 'measured_by');
    for (const o of ofType(pkg, 'outcome')) expect(measuredBy.some((r) => r.from === o.id), o.id).toBe(true);
    for (const m of ofType(pkg, 'measure')) expect(measuredBy.filter((r) => r.to === m.id), m.id).toHaveLength(1);
  });

  it('points discovery answers only at its own elements and the common package’s', () => {
    const ids = new Set([...pkg.elements, ...common.elements].map((e) => e.id));
    for (const a of pkg.assessments!) for (const q of a.questions) for (const m of q.candidateMappings ?? []) expect(ids.has(m.elementId), m.elementId).toBe(true);
  });

  it('starts discovery with which outcomes matter and what the office measures', () => {
    const [first, second] = pkg.assessments![0].questions;
    const types = (q: typeof first) => new Set(q.candidateMappings!.map((m) => m.elementId.split(':')[1]));
    expect(types(first)).toEqual(new Set(['outcome']));
    expect(types(second)).toEqual(new Set(['measure']));
  });

  it('describes each pattern as an example, with its approach, parts, strengths, fit, and what to watch for', () => {
    const patterns = ofType(pkg, 'implementationPattern');
    expect(patterns.length).toBeGreaterThanOrEqual(5);
    for (const p of patterns) {
      expect(p.description, p.id).toMatch(/^An example architecture/);
      expect(Object.keys(p.attributes!).sort(), p.id).toEqual(['approach', 'fitsWhen', 'parts', 'strengths', 'watchFor']);
      expect(p.sourceIds?.length, p.id).toBeGreaterThan(0);
    }
  });

  it('offers patterns for most of its capabilities', () => {
    const covered = new Set(pkg.relations.filter((r) => r.predicate === 'candidate_pattern').map((r) => r.from));
    const own = ofType(pkg, 'capability');
    expect(own.filter((c) => covered.has(c.id)).length / own.length).toBeGreaterThanOrEqual(0.8);
  });
});

describe('dependencies', () => {
  const iam = 'eb:capability:identity-access-management';

  it('let relations and discovery answers point at the common package’s elements', () => {
    const shared = new Set(common.elements.map((e) => e.id));
    expect(original.relations.filter((r) => shared.has(r.from)).map((r) => r.to).sort()).toEqual([
      'eb:implementationPattern:oversight-intake-case-tracking',
      'eb:outcome:concerns-raised-safely',
      'eb:outcome:concerns-raised-safely',
      'eb:outcome:concerns-raised-safely',
      'eb:outcome:fraud-waste-abuse-prevented',
      'eb:requirement:protect-reporter-identity',
      'eb:requirement:restrict-case-access',
    ]);
    const mapped = original.assessments!.flatMap((a) => a.questions.flatMap((q) => q.candidateMappings ?? []));
    expect(mapped.some((m) => m.elementId === iam)).toBe(true);
  });

  it('let both missions share case management', () => {
    const cm = 'eb:capability:case-management';
    for (const pkg of missions) {
      expect(pkg.dependencies).toEqual([{ packageId: common.packageId, version: common.version }]);
      expect(pkg.relations.some((r) => r.from === cm && r.predicate === 'contributes_to'), pkg.packageId).toBe(true);
      expect(pkg.relations.some((r) => r.predicate === 'satisfies' && r.to === 'eb:requirement:multi-channel-intake'), pkg.packageId).toBe(true);
    }
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a dependency the library doesn’t have', (p) => (p.dependencies![0].version = '9.9.9'), "depends on org.enterprise-blueprints.common 9.9.9, which isn't in the library"],
    ['the same dependency twice', (p) => p.dependencies!.push({ ...p.dependencies![0] }), 'depends on org.enterprise-blueprints.common more than once'],
    ['depending on itself', (p) => p.dependencies!.push({ packageId: p.packageId, version: p.version }), 'depends on itself'],
    ['defining an element a dependency already defines', (p) => p.elements.push({ ...common.elements[0] }), `element ${iam} is already defined`],
    [
      'a relation between two elements from other packages',
      (p) => p.relations.push({ id: 'rel:borrowed', from: iam, predicate: 'satisfies', to: 'eb:requirement:review-access' }),
      'only links elements from other packages',
    ],
    [
      'a relation to a dependency’s element of the wrong type',
      (p) => p.relations.push({ id: 'rel:wrong', from: iam, predicate: 'supports_mission', to: 'eb:requirement:link-evidence' }),
      `"supports_mission" can't link capability`,
    ],
  ])('reject %s', (_, change, message) => {
    expect(validatePackage(broken(change), resolve).join('\n')).toContain(message);
  });

  it('don’t resolve without the dependency', () => {
    const errors = validatePackage(original);
    expect(errors[0]).toContain("which isn't in the library");
    expect(errors.join('\n')).toContain(`starts at unknown element ${iam}`);
  });

  it('can’t move back to the older common package, which lacks case management', () => {
    const errors = validatePackage(broken((p) => (p.dependencies![0].version = '0.1.0')), resolve);
    expect(errors.join('\n')).toContain('starts at unknown element eb:capability:case-management');
  });
});

describe('discovery questions', () => {
  const intake = (pkg: BlueprintPackage) => pkg.assessments!.find((a) => a.id === 'assessment:intake-and-case-handling')!;
  const question = (pkg: BlueprintPackage, id: string) => intake(pkg).questions.find((q) => q.id === id)!;

  it('come with the OIG package', () => {
    expect(intake(original).questions.length).toBeGreaterThanOrEqual(8);
    expect(original.assessments![0].id).toBe('assessment:mission-results');
  });

  it('have IDs no other package uses, so answers can’t be confused', () => {
    const latest = [original, common, foia];
    const assessments = latest.flatMap((p) => p.assessments ?? []);
    expect(new Set(assessments.map((a) => a.id)).size).toBe(assessments.length);
    const questions = assessments.flatMap((a) => a.questions.map((q) => q.id));
    expect(new Set(questions).size).toBe(questions.length);
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a badly named assessment', (p) => (p.assessments![0].id = 'intake'), 'should look like assessment:'],
    ['a badly named question', (p) => (question(p, 'question:intake-triage').id = 'triage'), 'should look like question:'],
    ['a repeated question ID', (p) => intake(p).questions.push(question(p, 'question:intake-triage')), 'duplicate question ID'],
    ['a choice with one option', (p) => (question(p, 'question:intake-triage').options = [{ value: 'a', label: 'A' }]), 'needs at least two options'],
    ['options on a text question', (p) => (question(p, 'question:hardest-part').options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]), "can't have options"],
    ['a repeated option', (p) => question(p, 'question:intake-triage').options!.push({ value: 'informal', label: 'Again' }), 'repeats option informal'],
    ['a mapping from an answer that isn’t offered', (p) => (question(p, 'question:intake-triage').candidateMappings![0].answerValue = 'maybe'), 'isn\'t one of its answers'],
    ['a boolean mapped from something other than true or false', (p) => (question(p, 'question:audit-work').candidateMappings![0].answerValue = 'yes'), 'isn\'t one of its answers'],
    ['a mapping on a text question', (p) => (question(p, 'question:hardest-part').candidateMappings = [{ answerValue: 'x', elementId: mission, interpretation: 'x' }]), "can't map to elements"],
    ['a mapping to an unknown element', (p) => (question(p, 'question:audit-work').candidateMappings![0].elementId = 'eb:capability:missing'), 'maps to unknown element'],
    ['a repeated mapping', (p) => question(p, 'question:audit-work').candidateMappings!.push({ ...question(p, 'question:audit-work').candidateMappings![0] }), 'repeats mapping'],
  ])('rejects %s', (_, change, message) => {
    expect(validatePackage(broken(change), resolve).join('\n')).toContain(message);
  });
});

describe('versions', () => {
  it('kept everything from OIG 0.1.0 in 0.2.0, unchanged, with outcomes, requirements, and questions added', () => {
    expect(oig010.assessments).toBeUndefined();
    for (const e of oig010.elements) expect(oig020.elements).toContainEqual(e);
    // Capabilities reach the mission through its outcomes instead.
    for (const r of oig010.relations.filter((r) => r.predicate !== 'supports_mission')) expect(oig020.relations).toContainEqual(r);
    expect(oig020.dependencies).toEqual([{ packageId: common010.packageId, version: common010.version }]);
    expect(oig020.sources!.slice(0, oig010.sources!.length)).toEqual(oig010.sources);
    const added = oig020.elements.filter((e) => !oig010.elements.some((f) => f.id === e.id));
    expect(new Set(added.map((e) => e.type))).toEqual(new Set(['outcome', 'measure', 'requirement']));
  });

  it('moved OIG’s case tracking requirements into common 0.2.0 under the same IDs', () => {
    const gone = oig020.elements.filter((e) => !oig030.elements.some((f) => f.id === e.id)).map((e) => e.id);
    expect(gone).toEqual(['eb:requirement:multi-channel-intake', 'eb:requirement:acknowledge-receipt', 'eb:requirement:track-case-status']);
    for (const id of gone) expect(common020.elements.map((e) => e.id)).toContain(id);
    // OIG's capabilities still satisfy them, and its relations and questions are otherwise kept.
    for (const r of oig020.relations) expect(oig030.relations).toContainEqual(r);
    expect(oig030.sources).toEqual(oig020.sources);
    // Common keeps everything it had.
    for (const e of common010.elements) expect(common020.elements).toContainEqual(e);
    for (const r of common010.relations) expect(common020.relations).toContainEqual(r);
  });

  it('add patterns in OIG 0.4.0, FOIA 0.2.0, and common 0.3.0, and keep everything else', () => {
    for (const [before, after] of [[oig030, original], [foia010, foia], [common020, common]] as const) {
      const isPattern = (e: { type: string }) => e.type === 'implementationPattern';
      for (const e of before.elements.filter((e) => !isPattern(e))) expect(after.elements, after.packageId).toContainEqual(e);
      const added = after.elements.filter((e) => !before.elements.some((b) => b.id === e.id));
      expect(added.every(isPattern), after.packageId).toBe(true);
      for (const r of before.relations) expect(after.relations, after.packageId).toContainEqual(r);
      const newRelations = after.relations.filter((r) => !before.relations.some((b) => b.id === r.id));
      expect(new Set(newRelations.map((r) => r.predicate)), after.packageId).toEqual(new Set(['candidate_pattern']));
      expect(after.sources!.slice(0, before.sources!.length)).toEqual(before.sources);
    }
  });

  it('gives every capability its reference requirements, and every requirement one capability of its own package', () => {
    for (const pkg of [original, common, foia]) {
      const own = new Set(pkg.elements.map((e) => e.id));
      const satisfies = pkg.relations.filter((r) => r.predicate === 'satisfies' && own.has(r.from));
      for (const c of ofType(pkg, 'capability')) expect(satisfies.some((r) => r.from === c.id), c.id).toBe(true);
      for (const q of ofType(pkg, 'requirement')) expect(satisfies.filter((r) => r.to === q.id), q.id).toHaveLength(1);
    }
  });
});
