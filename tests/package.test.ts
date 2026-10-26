import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validatePackage, type BlueprintPackage } from '../src/lib/package';

const original: BlueprintPackage = JSON.parse(readFileSync('content/federal-oig/0.2.0/blueprint.json', 'utf8'));

/** A copy of the real package with one change applied. */
function broken(change: (pkg: BlueprintPackage) => void): BlueprintPackage {
  const pkg = structuredClone(original);
  change(pkg);
  return pkg;
}

const mission = 'eb:mission:independent-government-oversight';
const pattern = 'eb:implementationPattern:oversight-intake-case-tracking';

describe('validatePackage', () => {
  it('accepts the federal OIG package', () => {
    expect(validatePackage(original)).toEqual([]);
  });

  it('has one mission, five capabilities, and one pattern', () => {
    const counts = Object.groupBy(original.elements, (e) => e.type);
    expect(counts.mission).toHaveLength(1);
    expect(counts.capability).toHaveLength(5);
    expect(counts.implementationPattern).toHaveLength(1);
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a malformed element ID', (p) => (p.elements[0].id = 'Mission One'), 'schema: /elements/0/id'],
    ['a missing required field', (p) => delete (p as Partial<BlueprintPackage>).title, 'schema:'],
    ['an unexpected field', (p) => ((p.elements[0] as unknown as Record<string, unknown>).extra = 1), 'schema:'],
    ['a duplicate element ID', (p) => p.elements.push(p.elements[1]), 'duplicate element ID'],
    ['a duplicate relation ID', (p) => p.relations.push({ ...p.relations[0], to: pattern, predicate: 'candidate_pattern' }), 'duplicate relation ID'],
    ['a duplicate source ID', (p) => p.sources!.push(p.sources![0]), 'duplicate source ID'],
    ['an unknown element type', (p) => (p.elements[0] = { ...p.elements[0], id: 'eb:outcome:x', type: 'outcome' }), 'unknown type "outcome"'],
    ['an ID that names a different type', (p) => (p.elements[1].type = 'mission'), "doesn't match its type"],
    ['a citation of an unknown source', (p) => p.elements[0].sourceIds!.push('src:missing'), 'unknown source src:missing'],
    ['a replacement that doesn\'t exist', (p) => (p.elements[0].replacedBy = 'eb:mission:missing'), 'replaced by unknown element'],
    ['a dangling relation endpoint', (p) => (p.relations[0].to = 'eb:mission:missing'), 'ends at unknown element eb:mission:missing'],
    ['an unknown predicate', (p) => (p.relations[0].predicate = 'owns'), 'unknown predicate "owns"'],
    ['a predicate between the wrong types', (p) => (p.relations[0].to = pattern), '"supports_mission" can\'t link capability'],
    ['a repeated relationship', (p) => p.relations.push({ ...p.relations[0], id: 'rel:copy' }), 'repeats'],
  ])('rejects %s', (_, change, message) => {
    const errors = validatePackage(broken(change));
    expect(errors.join('\n')).toContain(message);
  });

  it('reports every problem, not just the first', () => {
    const errors = validatePackage(
      broken((p) => {
        p.relations[0].to = 'eb:mission:missing';
        p.relations[1].from = 'eb:capability:missing';
      }),
    );
    expect(errors).toHaveLength(2);
  });

  it('leaves the mission linked to all five capabilities', () => {
    const supporting = original.relations.filter((r) => r.predicate === 'supports_mission' && r.to === mission);
    expect(supporting).toHaveLength(5);
  });
});

describe('discovery questions', () => {
  const question = (pkg: BlueprintPackage, id: string) => pkg.assessments![0].questions.find((q) => q.id === id)!;

  it('come with the 0.2.0 package and point only at its elements', () => {
    const [assessment] = original.assessments!;
    expect(assessment.questions.length).toBeGreaterThanOrEqual(8);
    const ids = new Set(original.elements.map((e) => e.id));
    for (const q of assessment.questions) for (const m of q.candidateMappings ?? []) expect(ids.has(m.elementId)).toBe(true);
  });

  it.each<[string, (pkg: BlueprintPackage) => void, string]>([
    ['a badly named assessment', (p) => (p.assessments![0].id = 'intake'), 'should look like assessment:'],
    ['a badly named question', (p) => (question(p, 'question:intake-triage').id = 'triage'), 'should look like question:'],
    ['a repeated question ID', (p) => p.assessments![0].questions.push(question(p, 'question:intake-triage')), 'duplicate question ID'],
    ['a choice with one option', (p) => (question(p, 'question:intake-triage').options = [{ value: 'a', label: 'A' }]), 'needs at least two options'],
    ['options on a text question', (p) => (question(p, 'question:hardest-part').options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]), "can't have options"],
    ['a repeated option', (p) => question(p, 'question:intake-triage').options!.push({ value: 'informal', label: 'Again' }), 'repeats option informal'],
    ['a mapping from an answer that isn’t offered', (p) => (question(p, 'question:intake-triage').candidateMappings![0].answerValue = 'maybe'), 'isn\'t one of its answers'],
    ['a boolean mapped from something other than true or false', (p) => (question(p, 'question:audit-work').candidateMappings![0].answerValue = 'yes'), 'isn\'t one of its answers'],
    ['a mapping on a text question', (p) => (question(p, 'question:hardest-part').candidateMappings = [{ answerValue: 'x', elementId: mission, interpretation: 'x' }]), "can't map to elements"],
    ['a mapping to an unknown element', (p) => (question(p, 'question:audit-work').candidateMappings![0].elementId = 'eb:capability:missing'), 'maps to unknown element'],
    ['a repeated mapping', (p) => question(p, 'question:audit-work').candidateMappings!.push({ ...question(p, 'question:audit-work').candidateMappings![0] }), 'repeats mapping'],
  ])('rejects %s', (_, change, message) => {
    expect(validatePackage(broken(change)).join('\n')).toContain(message);
  });
});

describe('versions', () => {
  it('keep 0.1.0 as it was, with 0.2.0 adding only the questions and its own details', () => {
    const first: BlueprintPackage = JSON.parse(readFileSync('content/federal-oig/0.1.0/blueprint.json', 'utf8'));
    expect(first.assessments).toBeUndefined();
    const { version, publishedAt, description, assessments, ...rest } = original;
    const { version: v1, publishedAt: p1, description: d1, ...restFirst } = first;
    expect([version, v1]).toEqual(['0.2.0', '0.1.0']);
    expect(assessments).toHaveLength(1);
    expect(rest).toEqual(restFirst);
  });
});
