import { describe, expect, it } from 'vitest';
import { elements, missionBlueprint } from '../src/lib/library';

describe('missionBlueprint', () => {
  const mission = elements.find((e) => e.id === 'eb:mission:independent-government-oversight')!;
  const blueprint = missionBlueprint(mission);
  const ids = (list: { id: string }[]) => list.map((e) => e.id);

  it('gathers the outcomes the mission seeks, with their measures', () => {
    expect(blueprint.outcomes).toHaveLength(5);
    expect(blueprint.measures).toHaveLength(9);
    const safely = blueprint.outcomes.find((o) => o.outcome.id === 'eb:outcome:concerns-raised-safely')!;
    expect(ids(safely.measures)).toEqual(['eb:measure:time-to-route', 'eb:measure:retaliation-found']);
  });

  it('lists the mission’s own capabilities first, then the shared ones, with what each serves', () => {
    const order = blueprint.capabilities.map((c) => [c.capability.id.split(':')[2], c.sharedFrom?.packageId ?? null]);
    expect(order).toEqual([
      ['complaint-allegation-disclosure-intake', null],
      ['audit-inspection-evaluation', null],
      ['investigation-management', null],
      ['recommendations-corrective-action-monitoring', null],
      ['oversight-reporting-communication', null],
      ['identity-access-management', 'org.enterprise-blueprints.common'],
      ['data-protection-privacy', 'org.enterprise-blueprints.common'],
    ]);
    for (const c of blueprint.capabilities) expect(c.outcomes.length, c.capability.id).toBeGreaterThan(0);
  });

  it('counts each requirement and pattern once, however many capabilities share it', () => {
    const all = blueprint.capabilities.flatMap((c) => c.requirements);
    expect(blueprint.requirements.length).toBeLessThan(all.length);
    expect(new Set(ids(blueprint.requirements)).size).toBe(blueprint.requirements.length);
    expect(ids(blueprint.patterns)).toEqual(['eb:implementationPattern:oversight-intake-case-tracking']);
  });
});
