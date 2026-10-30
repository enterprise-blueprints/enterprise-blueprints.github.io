// The machine-readable files the site publishes: each package exactly as
// stored, its SHA-256 digest, every version of the package schema, the
// vocabulary, and a catalog of packages.
// Paths are relative to the site root, and the catalog's hrefs are relative
// to the catalog, so they work under any base path.

import { createHash } from 'node:crypto';
import schema010 from '../../schemas/blueprint-package-0.1.0.schema.json?raw';
import schema020 from '../../schemas/blueprint-package-0.2.0.schema.json?raw';
import schema030 from '../../schemas/blueprint-package-0.3.0.schema.json?raw';
import schema040 from '../../schemas/blueprint-package-0.4.0.schema.json?raw';
import schema050 from '../../schemas/blueprint-package-0.5.0.schema.json?raw';
import { packageFiles, release, type PackageFile } from './library';
import type { BlueprintPackage } from './package';
import { href } from './paths';
import { capabilityStages, earlierLayers, elementTypes, outcomeThemes, patternApproaches, patternFields, patternLayers, predicates, requirementKinds, sourceKinds, statuses } from './vocabulary';

/** Every schema version stays published, so packages that use an older one still validate. Newest last. */
export const schemas = [schema010, schema020, schema030, schema040, schema050].map((text) => {
  const version: string = JSON.parse(text).properties.schemaVersion.const;
  return { version, text, path: `schemas/blueprint-package-${version}.schema.json` };
});
const current = schemas.at(-1)!;
const schemaVersion = current.version;
export const schemaPath = current.path;

export interface PublishedPackage extends PackageFile {
  path: string;
  sha256: string;
}

export const published: PublishedPackage[] = packageFiles.map((f) => ({
  ...f,
  path: `packages/${f.name}/${f.data.version}/blueprint.json`,
  sha256: createHash('sha256').update(f.text, 'utf8').digest('hex'),
}));

export function downloadUrl(pkg: BlueprintPackage): string {
  return href(published.find((p) => p.data === pkg)!.path);
}

export function catalog() {
  return {
    schemaVersion,
    // The newest package date, not the build time, so the same content
    // always produces the same catalog.
    generatedAt: published.map((p) => p.data.publishedAt).sort().at(-1),
    // The library's current release: every package marked latest has this version.
    release,
    schema: schemaPath,
    schemas: schemas.map((s) => s.path),
    vocabulary: 'vocabulary.json',
    packages: published.map((p) => ({
      packageId: p.data.packageId,
      version: p.data.version,
      title: p.data.title,
      license: p.data.license,
      publishedAt: p.data.publishedAt,
      latest: p.latest,
      href: p.path,
      sha256: p.sha256,
    })),
  };
}

/**
 * The types and relationships packages use, with their labels, so tools can
 * show library content in the library's own words. Each type's `page` is the
 * address of an element's page relative to this file, where {key} is the last
 * part of the element ID.
 */
export function vocabulary() {
  return {
    schemaVersion,
    types: Object.fromEntries(
      Object.entries(elementTypes).map(([id, t]) => [id, { label: t.label, plural: t.plural, definition: t.definition, page: `${t.section}/{key}/` }]),
    ),
    predicates,
    // What an implementation pattern's attributes hold.
    // Its layers, in order, and the ones packages before schema 0.4.0 also use.
    pattern: { layers: patternLayers, earlierLayers, approaches: patternApproaches, fields: patternFields },
    // The groups that outcomes, capabilities, and requirements name in their attributes, since schema 0.5.0, in order.
    outcome: { themes: outcomeThemes.groups },
    capability: { stages: capabilityStages.groups },
    requirement: { kinds: requirementKinds.groups },
    sourceKinds,
    statuses,
  };
}

export function json(text: string): Response {
  return new Response(text, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
