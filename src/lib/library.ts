// Loads every package under content/, validates it, and indexes it for the
// pages. Any validation problem stops the build.

import { validatePackage, type BlueprintPackage, type Element, type Relation, type Source } from './package';
import { elementTypes, predicates, type ElementTypeInfo } from './vocabulary';
import { href } from './paths';

export interface LibraryElement extends Element {
  package: BlueprintPackage;
  typeInfo: ElementTypeInfo;
  slug: string;
  url: string;
}

export interface RelationGroup {
  heading: string;
  /** Distinct notes on the relations in this group. */
  notes: string[];
  elements: LibraryElement[];
}

/** A package as stored: its folder under content/, its exact text, and its data. */
export interface PackageFile {
  name: string;
  text: string;
  data: BlueprintPackage;
}

const files = import.meta.glob<string>('/content/*/blueprint.json', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function load(): PackageFile[] {
  const errors: string[] = [];
  const loaded: PackageFile[] = [];
  for (const [path, text] of Object.entries(files)) {
    const data: unknown = JSON.parse(text);
    const problems = validatePackage(data);
    errors.push(...problems.map((p) => `${path}: ${p}`));
    if (!problems.length) loaded.push({ name: path.split('/')[2], text, data: data as BlueprintPackage });
  }
  const packageIds = new Set<string>();
  const seen = new Map<string, string>();
  for (const { data: pkg } of loaded) {
    if (packageIds.has(pkg.packageId)) errors.push(`package ${pkg.packageId} is defined twice`);
    packageIds.add(pkg.packageId);
    for (const e of pkg.elements) {
      const other = seen.get(e.id);
      if (other) errors.push(`element ${e.id} is defined in both ${other} and ${pkg.packageId}`);
      seen.set(e.id, pkg.packageId);
    }
  }
  if (!Object.keys(files).length) errors.push('no packages found under content/');
  if (errors.length) {
    throw new Error(`Blueprint package validation failed:\n  ${errors.join('\n  ')}`);
  }
  return loaded;
}

export const packageFiles = load();
export const packages = packageFiles.map((f) => f.data);

export const elements: LibraryElement[] = packages.flatMap((pkg) =>
  pkg.elements.map((e) => {
    const typeInfo = elementTypes[e.type];
    const slug = e.id.split(':')[2];
    return { ...e, package: pkg, typeInfo, slug, url: href(`${typeInfo.section}/${slug}/`) };
  }),
);

const byId = new Map(elements.map((e) => [e.id, e]));
const relations: Relation[] = packages.flatMap((p) => p.relations);

export function elementsOfType(type: string): LibraryElement[] {
  return elements.filter((e) => e.type === type);
}

/** Types that have at least one element, in vocabulary order. */
export function typesInUse(): [string, ElementTypeInfo][] {
  return Object.entries(elementTypes).filter(([type]) => elements.some((e) => e.type === type));
}

/** Elements linked to this one by a predicate, in either direction. */
export function related(element: LibraryElement, predicate: string, direction: 'outgoing' | 'incoming'): LibraryElement[] {
  return relationsOf(element, predicate, direction).map((r) => byId.get(direction === 'outgoing' ? r.to : r.from)!);
}

function relationsOf(element: LibraryElement, predicate: string, direction: 'outgoing' | 'incoming'): Relation[] {
  return relations.filter(
    (r) => r.predicate === predicate && (direction === 'outgoing' ? r.from : r.to) === element.id,
  );
}

/** An element's relationships, grouped by predicate and direction. */
export function relationGroups(element: LibraryElement): RelationGroup[] {
  const groups: RelationGroup[] = [];
  for (const [name, info] of Object.entries(predicates)) {
    for (const direction of ['outgoing', 'incoming'] as const) {
      const rels = relationsOf(element, name, direction);
      if (!rels.length) continue;
      groups.push({
        heading: info[direction],
        notes: [...new Set(rels.flatMap((r) => (r.description ? [r.description] : [])))],
        elements: related(element, name, direction),
      });
    }
  }
  return groups;
}

export function sourcesOf(element: LibraryElement): Source[] {
  const sources = element.package.sources ?? [];
  return (element.sourceIds ?? []).map((id) => sources.find((s) => s.id === id)!);
}

export interface LibrarySource extends Source {
  package: BlueprintPackage;
  citedBy: LibraryElement[];
}

export const sources: LibrarySource[] = packages.flatMap((pkg) =>
  (pkg.sources ?? []).map((s) => ({
    ...s,
    package: pkg,
    citedBy: elements.filter((e) => e.package === pkg && e.sourceIds?.includes(s.id)),
  })),
);

/** The most recent review date among the given sources. */
export function lastReviewed(list: Source[]): string | undefined {
  return list.map((s) => s.lastReviewedAt).filter(Boolean).sort().at(-1);
}
