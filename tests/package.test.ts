import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validatePackage, type BlueprintPackage, type Resolve } from '../src/lib/package';

const read = (path: string): BlueprintPackage => JSON.parse(readFileSync(path, 'utf8'));
const original = read('content/federal-oig/0.2.0/blueprint.json');
const common = read('content/common/0.1.0/blueprint.json');
const resolve: Resolve = (id, version) => (id === common.packageId && version === common.version ? common : undefined);

/** A copy of the real package with one change applied. */
function broken(change: (pkg: BlueprintPackage) => void): BlueprintPackage {
  const pkg = structuredClone(original);
  change(pkg);
  return pkg;
}

const mission = 'eb:mission:independent-government-oversight';
const pattern = 'eb:implementationPattern:oversight-intake-case-tracking';

describe('validatePackage', () => {
  it('accepts the federal OIG package, which builds on the common one', () => {
    expect(validatePackage(original, resolve)).toEqual([]);
    expect(validatePackage(common)).toEqual([]);
  });

  it('accepts the published 0.1.0 package as it was', () => {
    expect(validatePackage(read('content/federal-oig/0.1.0/blueprint.json'))).toEqual([]);
  });

  it('has one mission, five capabilities, thirteen requirements, and one pattern', () => {
    const counts = Object.groupBy(original.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.capability).toHaveLength(5);
    expect(counts.implementationPattern).toHaveLength(1);
    expect(counts.requirement).toHaveLength(13);
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

  it('links every capability to the mission through an outcome it seeks', () => {
    const outcomes = original.relations.filter((r) => r.predicate === 'seeks' && r.from === mission).map((r) => r.to);
    expect(outcomes).toHaveLength(5);
    for (const c of original.elements.filter((e) => e.type === 'capability')) {
      expect(original.relations.some((r) => r.predicate === 'contributes_to' && r.from === c.id && outcomes.includes(r.to)), c.id).toBe(true);
    }
    expect(original.relations.some((r) => r.predicate === 'supports_mission')).toBe(false);
  });

  it('gives every outcome a measure, and every measure one outcome', () => {
    const measuredBy = original.relations.filter((r) => r.predicate === 'measured_by');
    for (const o of original.elements.filter((e) => e.type === 'outcome')) expect(measuredBy.some((r) => r.from === o.id), o.id).toBe(true);
    for (const m of original.elements.filter((e) => e.type === 'measure')) expect(measuredBy.filter((r) => r.to === m.id), m.id).toHaveLength(1);
  });
});

describe('dependencies', () => {
  const iam = 'eb:capability:identity-access-management';

  it('let relations and discovery answers point at the common package’s elements', () => {
    const shared = new Set(common.elements.map((e) => e.id));
    expect(original.relations.filter((r) => shared.has(r.from)).map((r) => r.to).sort()).toEqual([
      'eb:outcome:concerns-raised-safely',
      'eb:outcome:concerns-raised-safely',
      'eb:requirement:protect-reporter-identity',
      'eb:requirement:restrict-case-access',
    ]);
    const mapped = original.assessments!.flatMap((a) => a.questions.flatMap((q) => q.candidateMappings ?? []));
    expect(mapped.some((m) => m.elementId === iam)).toBe(true);
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
});

describe('discovery questions', () => {
  const intake = (pkg: BlueprintPackage) => pkg.assessments!.find((a) => a.id === 'assessment:intake-and-case-handling')!;
  const question = (pkg: BlueprintPackage, id: string) => intake(pkg).questions.find((q) => q.id === id)!;

  it('come with the 0.2.0 package and point only at its elements and the common package’s', () => {
    expect(intake(original).questions.length).toBeGreaterThanOrEqual(8);
    const ids = new Set([...original.elements, ...common.elements].map((e) => e.id));
    for (const a of original.assessments!) for (const q of a.questions) for (const m of q.candidateMappings ?? []) expect(ids.has(m.elementId)).toBe(true);
  });

  it('start with which outcomes matter and what the office measures', () => {
    const [first] = original.assessments!;
    expect(first.id).toBe('assessment:mission-results');
    const types = (q: string) => new Set(first.questions.find((x) => x.id === q)!.candidateMappings!.map((m) => m.elementId.split(':')[1]));
    expect(types('question:priority-results')).toEqual(new Set(['outcome']));
    expect(types('question:tracked-measures')).toEqual(new Set(['measure']));
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
  it('keep everything from 0.1.0 in 0.2.0, unchanged, with outcomes, requirements, and questions added', () => {
    const first: BlueprintPackage = JSON.parse(readFileSync('content/federal-oig/0.1.0/blueprint.json', 'utf8'));
    expect(first.assessments).toBeUndefined();
    for (const e of first.elements) expect(original.elements).toContainEqual(e);
    // Capabilities reach the mission through its outcomes instead.
    for (const r of first.relations.filter((r) => r.predicate !== 'supports_mission')) expect(original.relations).toContainEqual(r);
    expect(original.dependencies).toEqual([{ packageId: common.packageId, version: common.version }]);
    expect(original.sources!.slice(0, first.sources!.length)).toEqual(first.sources);
    const added = original.elements.filter((e) => !first.elements.some((f) => f.id === e.id));
    expect(new Set(added.map((e) => e.type))).toEqual(new Set(['outcome', 'measure', 'requirement']));
  });

  it('gives every capability its reference requirements, and every requirement one capability of its own package', () => {
    for (const pkg of [original, common]) {
      const own = new Set(pkg.elements.map((e) => e.id));
      const satisfies = pkg.relations.filter((r) => r.predicate === 'satisfies' && own.has(r.from));
      for (const c of pkg.elements.filter((e) => e.type === 'capability')) expect(satisfies.some((r) => r.from === c.id)).toBe(true);
      for (const q of pkg.elements.filter((e) => e.type === 'requirement')) expect(satisfies.filter((r) => r.to === q.id)).toHaveLength(1);
    }
  });
});
