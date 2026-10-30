import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validatePackage, type BlueprintPackage, type Resolve } from '../src/lib/package';

const read = (path: string): BlueprintPackage => JSON.parse(readFileSync(path, 'utf8'));
const byVersion = (a: string, b: string) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
/** The latest version of a package, as content:build last wrote it. */
const latest = (name: string) => read(`content/${name}/${readdirSync(`content/${name}`).sort(byVersion).at(-1)}/blueprint.json`);
const original = latest('federal-oig');
const common = latest('common');
const foia = latest('federal-foia');
const grants = latest('federal-grants');
const acquisition = latest('federal-acquisition');
// Published versions, which never change.
const oig050 = read('content/federal-oig/0.5.0/blueprint.json');
const common040 = read('content/common/0.4.0/blueprint.json');
const foia030 = read('content/federal-foia/0.3.0/blueprint.json');
const grants010 = read('content/federal-grants/0.1.0/blueprint.json');
const solutions020 = read('content/solutions/0.2.0/blueprint.json');
const oig040 = read('content/federal-oig/0.4.0/blueprint.json');
const common030 = read('content/common/0.3.0/blueprint.json');
const foia020 = read('content/federal-foia/0.2.0/blueprint.json');
const solutions010 = read('content/solutions/0.1.0/blueprint.json');
const oig010 = read('content/federal-oig/0.1.0/blueprint.json');
const oig020 = read('content/federal-oig/0.2.0/blueprint.json');
const oig030 = read('content/federal-oig/0.3.0/blueprint.json');
const common010 = read('content/common/0.1.0/blueprint.json');
const common020 = read('content/common/0.2.0/blueprint.json');
const foia010 = read('content/federal-foia/0.1.0/blueprint.json');
const published = [oig010, oig020, oig030, oig040, oig050, common010, common020, common030, common040, foia010, foia020, foia030, grants010, solutions010, solutions020];
const all = [original, common, foia, grants, acquisition, ...published];
const resolve: Resolve = (id, version) => all.find((p) => p.packageId === id && p.version === version);
const missions = [original, foia, grants, acquisition];

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
    expect(validatePackage(grants, resolve)).toEqual([]);
    expect(validatePackage(acquisition, resolve)).toEqual([]);
    expect(validatePackage(common)).toEqual([]);
  });

  it('accepts the published versions as they were', () => {
    expect(validatePackage(oig010)).toEqual([]);
    for (const pkg of [oig020, oig030, oig040, oig050, foia010, foia020, foia030, grants010, solutions010, solutions020]) expect(validatePackage(pkg, resolve), `${pkg.packageId} ${pkg.version}`).toEqual([]);
    for (const pkg of [common010, common020, common030, common040]) expect(validatePackage(pkg), pkg.version).toEqual([]);
  });

  it('has one mission, five capabilities, eleven requirements, and eight patterns (one replaced) in the OIG package', () => {
    const counts = Object.groupBy(original.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.capability).toHaveLength(5);
    expect(counts.implementationPattern).toHaveLength(8);
    expect(counts.implementationPattern!.filter((p) => p.status === 'deprecated').map((p) => p.replacedBy)).toEqual(['eb:implementationPattern:audit-management-system']);
    expect(counts.requirement).toHaveLength(11);
    expect(counts.solution).toBeUndefined();
  });

  it('has one mission, six outcomes, seven capabilities, and seven patterns in the FOIA package', () => {
    const counts = Object.groupBy(foia.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.outcome).toHaveLength(6);
    expect(counts.capability).toHaveLength(7);
    expect(counts.implementationPattern).toHaveLength(7);
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
    ['an unknown schema version', (p) => ((p as { schemaVersion: string }).schemaVersion = '9.0.0'), 'schemaVersion should be one of 0.1.0, 0.2.0, 0.3.0'],
    ['dependencies under schema 0.1.0', (p) => (p.schemaVersion = '0.1.0'), 'must NOT have additional properties'],
    ['a way with an unknown approach', (p) => ((patternOf(p).attributes!.ways as { approach: string }[])[0].approach = 'outsource'), '/ways/0/approach must be equal to one of the allowed values'],
    ['a pattern with an approach of its own, under schema 0.4.0', (p) => (patternOf(p).attributes!.approach = 'product'), 'must NOT have additional properties'],
    ['a pattern with an empty list', (p) => (patternOf(p).attributes!.watchFor = []), '/attributes/watchFor must NOT have fewer than 1 items'],
    ['a pattern with a list that isn’t statements', (p) => (patternOf(p).attributes!.parts = 'a database'), '/attributes/parts must be array'],
    ['a pattern with an unknown role', (p) => (patternOf(p).attributes!.role = 'middleware'), '/attributes/role must be equal to one of the allowed values'],
    ['a pattern without a role, under schema 0.3.0', (p) => delete patternOf(p).attributes!.role, "must have required property 'role'"],
    ['a pattern with a field of its own, under schema 0.3.0', (p) => (patternOf(p).attributes!.vendor = 'Acme'), 'must NOT have additional properties'],
    ['coverage on a link that isn’t a candidate pattern', (p) => (p.relations[0].coverage = 'partial'), 'only a candidate pattern has coverage'],
    ['coverage that isn’t full or partial', (p) => ((p.relations[0] as { coverage?: string }).coverage = 'most'), 'must be equal to one of the allowed values'],
    ['a pattern that works with itself', (p) => p.relations.push({ id: 'rel:self', from: pattern, predicate: 'works_with', to: pattern }), `links ${pattern} to itself`],
  ])('rejects %s', (_, change, message) => {
    const errors = validatePackage(broken(change), resolve);
    expect(errors.join('\n')).toContain(message);
  });

  it.each<[string, (a: Record<string, unknown>) => void, string]>([
    ['an unknown approach', (a) => (a.approach = 'outsource'), 'unknown approach "outsource"'],
    ['an unknown role', (a) => (a.role = 'middleware'), 'unknown role "middleware"'],
    ['a list that isn’t statements', (a) => (a.parts = 'a database'), 'needs parts to be a list of statements'],
  ])('checks a pattern’s fields in a 0.2.0 package too: %s', (_, change, message) => {
    const pkg = structuredClone(oig040);
    change(pkg.elements.find((e) => e.id === pattern)!.attributes!);
    expect(validatePackage(pkg, resolve).join('\n')).toContain(message);
  });

  it('has one mission, seven outcomes, eight capabilities, sixteen requirements, and eight patterns (three replaced) in the grants package', () => {
    const counts = Object.groupBy(grants.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.outcome).toHaveLength(7);
    expect(counts.capability).toHaveLength(8);
    expect(counts.requirement).toHaveLength(16);
    expect(counts.implementationPattern).toHaveLength(8);
    expect(new Set(counts.implementationPattern!.flatMap((p) => p.replacedBy ?? []))).toEqual(new Set(['eb:implementationPattern:grants-management']));
    expect(grants.dependencies).toEqual([{ packageId: common.packageId, version: common.version }]);
    // Every outcome has a measure, and every capability contributes to an outcome and has a candidate pattern.
    for (const o of ofType(grants, 'outcome')) expect((o.attributes?.measures as unknown[] | undefined)?.length, o.id).toBeGreaterThan(0);
    for (const c of ofType(grants, 'capability')) {
      expect(grants.relations.some((r) => r.from === c.id && r.predicate === 'contributes_to'), c.id).toBe(true);
      expect(grants.relations.some((r) => r.from === c.id && r.predicate === 'candidate_pattern'), c.id).toBe(true);
    }
  });

  it('has one mission, nine outcomes, ten capabilities, twenty-two requirements, and ten patterns (three replaced) in the acquisition package', () => {
    const counts = Object.groupBy(acquisition.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.outcome).toHaveLength(9);
    expect(counts.measure).toBeUndefined();
    expect(counts.outcome!.flatMap((o) => o.attributes!.measures as unknown[])).toHaveLength(11);
    expect(counts.capability).toHaveLength(10);
    expect(counts.requirement).toHaveLength(22);
    expect(counts.implementationPattern).toHaveLength(10);
    expect(new Set(counts.implementationPattern!.flatMap((p) => p.replacedBy ?? []))).toEqual(new Set(['eb:implementationPattern:acquisition-management']));
    expect(acquisition.dependencies).toEqual([{ packageId: common.packageId, version: common.version }]);
    // Every capability has a candidate pattern.
    for (const c of ofType(acquisition, 'capability')) expect(acquisition.relations.some((r) => r.from === c.id && r.predicate === 'candidate_pattern'), c.id).toBe(true);
  });

  it('shares SAM.gov checks between grants and acquisition through the common package', () => {
    const checks = 'eb:implementationPattern:sam-gov-entity-checks';
    expect(ofType(common, 'implementationPattern').map((p) => p.id)).toContain(checks);
    for (const [pkg, capability] of [[grants, 'eb:capability:risk-review-award'], [acquisition, 'eb:capability:responsibility-determination']] as const) {
      const link = pkg.relations.find((r) => r.from === capability && r.to === checks);
      expect(link, pkg.packageId).toMatchObject({ predicate: 'candidate_pattern', coverage: 'partial' });
    }
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

  it('gives every outcome its measures', () => {
    for (const o of ofType(pkg, 'outcome')) {
      expect((o.attributes!.measures as unknown[]).length, o.id).toBeGreaterThan(0);
    }
    expect(ofType(pkg, 'measure')).toEqual([]);
    expect(pkg.relations.filter((r) => r.predicate === 'measured_by')).toEqual([]);
  });

  it('points discovery answers only at its own elements and the common package’s', () => {
    const ids = new Set([...pkg.elements, ...common.elements].map((e) => e.id));
    for (const a of pkg.assessments!) for (const q of a.questions) for (const m of q.candidateMappings ?? []) expect(ids.has(m.elementId), m.elementId).toBe(true);
  });

  it('starts discovery with which outcomes matter and what the office measures, naming the measures', () => {
    const [first, second] = pkg.assessments![0].questions;
    const types = (q: typeof first) => new Set(q.candidateMappings!.map((m) => m.elementId.split(':')[1]));
    expect(types(first)).toEqual(new Set(['outcome']));
    expect(types(second)).toEqual(new Set(['outcome']));
    const titles = ofType(pkg, 'outcome').flatMap((o) => (o.attributes!.measures as { title: string }[]).map((m) => m.title));
    for (const m of second.candidateMappings!) expect(titles.some((t) => m.interpretation.includes(`“${t}”`)), m.answerValue).toBe(true);
  });

  it('describes each pattern as an example, with its ways to source it, layer, parts, strengths, fit, and what to watch for', () => {
    const patterns = ofType(pkg, 'implementationPattern');
    expect(patterns.length).toBeGreaterThanOrEqual(5);
    for (const p of patterns) {
      expect(p.description, p.id).toMatch(/^An example architecture/);
      expect(Object.keys(p.attributes!).sort(), p.id).toEqual(['fitsWhen', 'parts', 'role', 'strengths', 'watchFor', 'ways']);
      expect(p.sourceIds?.length, p.id).toBeGreaterThan(0);
    }
  });

  it('offers patterns for most of its capabilities', () => {
    const covered = new Set(pkg.relations.filter((r) => r.predicate === 'candidate_pattern').map((r) => r.from));
    const own = ofType(pkg, 'capability');
    expect(own.filter((c) => covered.has(c.id)).length / own.length).toBeGreaterThanOrEqual(0.8);
  });
});

describe('missions', () => {
  const missions = [original, foia, grants, acquisition];
  const patterns = [original, common, foia, grants, acquisition].flatMap((p) => ofType(p, 'implementationPattern'));
  const roleOf = (id: string) => patterns.find((p) => p.id === id)!.attributes!.role;

  it('list the principles their architecture follows', () => {
    for (const pkg of missions) for (const m of ofType(pkg, 'mission')) expect((m.attributes!.principles as string[]).length, m.id).toBeGreaterThanOrEqual(5);
  });

  it('give every pattern in the library a layer', () => {
    for (const p of patterns) expect(roleOf(p.id), p.id).toBeTruthy();
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
      'eb:outcome:concerns-raised-safely',
      'eb:outcome:fraud-waste-abuse-prevented',
      'eb:outcome:fraud-waste-abuse-prevented',
      'eb:outcome:leaders-congress-informed',
      'eb:requirement:protect-reporter-identity',
      'eb:requirement:restrict-case-access',
    ]);
    const mapped = original.assessments!.flatMap((a) => a.questions.flatMap((q) => q.candidateMappings ?? []));
    expect(mapped.some((m) => m.elementId === iam)).toBe(true);
  });

  it('let the missions share case management', () => {
    const cm = 'eb:capability:case-management';
    for (const pkg of [original, foia]) {
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
    for (const [before, after] of [[oig030, oig040], [foia010, foia020], [common020, common030]] as const) {
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

  it('mark partial coverage, connect patterns, and add patterns in schema 0.3.0, and keep everything else', () => {
    for (const [before, after] of [[oig040, oig050], [foia020, foia030], [common030, common040]] as const) {
      expect(after.schemaVersion).toBe('0.3.0');
      for (const e of before.elements) expect(after.elements, after.packageId).toContainEqual(e);
      for (const r of before.relations) {
        const now = after.relations.find((x) => x.id === r.id);
        // A candidate pattern can say it covers only part of a capability, and why.
        if (r.predicate === 'candidate_pattern') expect({ ...now, coverage: undefined, description: r.description }, r.id).toEqual({ ...r, coverage: undefined });
        else expect(now, r.id).toEqual(r);
      }
      const added = after.relations.filter((r) => !before.relations.some((b) => b.id === r.id));
      expect(new Set(added.map((r) => r.predicate)), after.packageId).toEqual(new Set(['candidate_pattern', 'depends_on', 'works_with']));
      // Everything new is a pattern.
      const newElements = after.elements.filter((e) => !before.elements.some((b) => b.id === e.id));
      expect(newElements.every((e) => e.type === 'implementationPattern'), after.packageId).toBe(true);
    }
  });

  it('gives every capability its reference requirements, and every requirement one capability of its own package', () => {
    for (const pkg of [original, common, foia, grants, acquisition]) {
      const own = new Set(pkg.elements.map((e) => e.id));
      const satisfies = pkg.relations.filter((r) => r.predicate === 'satisfies' && own.has(r.from));
      for (const c of ofType(pkg, 'capability')) expect(satisfies.some((r) => r.from === c.id), c.id).toBe(true);
      for (const q of ofType(pkg, 'requirement')) expect(satisfies.filter((r) => r.to === q.id), q.id).toHaveLength(1);
    }
  });
});

describe('missions, measures, and ways to source a pattern (schema 0.4.0)', () => {
  const caseSystem = 'eb:implementationPattern:oversight-intake-case-tracking';
  const hotline = 'eb:implementationPattern:confidential-hotline-intake';
  const check = (change: (pkg: BlueprintPackage) => void) => {
    const pkg = structuredClone(original);
    change(pkg);
    return validatePackage(pkg, resolve).join('\n');
  };

  it('accept the OIG package, with a need of one way only', () => {
    expect(validatePackage(original, resolve)).toEqual([]);
    expect(original.relations.find((r) => r.from === caseSystem && r.predicate === 'depends_on')).toMatchObject({ way: 'agency-platform' });
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a solution', (p) => p.elements.push({ id: 'eb:solution:x', type: 'solution', title: 'X', description: 'X.' }), 'there are no solutions'],
    [
      'a need none of the mission’s capabilities points to',
      (p) => p.relations.push({ id: 'rel:x', from: hotline, predicate: 'depends_on', to: 'eb:implementationPattern:audit-workpapers-collaboration' }),
      `${hotline} needs eb:implementationPattern:audit-workpapers-collaboration, but none of the mission's capabilities points to it`,
    ],
    ['a need of a way the pattern doesn’t have', (p) => (p.relations.find((r) => r.from === caseSystem && r.predicate === 'depends_on')!.way = 'spreadsheets'), `${caseSystem} has no way "spreadsheets"`],
    ['a way on something else', (p) => (p.relations.find((r) => r.predicate === 'satisfies')!.way = 'product'), 'only depends_on names a way'],
    ['principles that aren’t statements', (p) => (p.elements.find((e) => e.type === 'mission')!.attributes!.principles = 'Be independent'), '/attributes/principles must be array'],
    ['a measure as an element of its own', (p) => p.elements.push({ id: 'eb:measure:x', type: 'measure', title: 'X', description: 'X.' }), 'a measure is part of its outcome'],
    ['a measure that cites an unknown source', (p) => ((p.elements.find((e) => e.type === 'outcome')!.attributes!.measures as { sourceIds: string[] }[])[0].sourceIds = ['src:missing']), 'cites unknown source src:missing'],
    ['a measure without a title', (p) => delete (p.elements.find((e) => e.type === 'outcome')!.attributes!.measures as { title?: string }[])[0].title, "must have required property 'title'"],
  ])('reject %s', (_, change, message) => {
    expect(check(change)).toContain(message);
  });

  it('need every pattern to have at least one way', () => {
    expect(check((p) => delete (p.elements.find((e) => e.id === hotline)!.attributes as Record<string, unknown>).ways)).toContain("must have required property 'ways'");
    expect(check((p) => (p.elements.find((e) => e.id === hotline)!.attributes!.ways = []))).toContain('/ways must NOT have fewer than 1 items');
  });
});
