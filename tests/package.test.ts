import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validatePackage, type BlueprintPackage } from '../src/lib/package';

const original: BlueprintPackage = JSON.parse(readFileSync('content/federal-oig/blueprint.json', 'utf8'));

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
