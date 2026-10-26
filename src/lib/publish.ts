// The machine-readable files the site publishes: each package exactly as
// stored, its SHA-256 digest, the package schema, and a catalog of packages.
// Paths are relative to the site root, and the catalog's hrefs are relative
// to the catalog, so they work under any base path.

import { createHash } from 'node:crypto';
import schemaText from '../../schemas/blueprint-package.schema.json?raw';
import { packageFiles, type PackageFile } from './library';
import type { BlueprintPackage } from './package';
import { href } from './paths';

export { schemaText };

const schemaVersion: string = JSON.parse(schemaText).properties.schemaVersion.const;
export const schemaPath = `schemas/blueprint-package-${schemaVersion}.schema.json`;

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
    schema: schemaPath,
    packages: published.map((p) => ({
      packageId: p.data.packageId,
      version: p.data.version,
      title: p.data.title,
      license: p.data.license,
      publishedAt: p.data.publishedAt,
      href: p.path,
      sha256: p.sha256,
    })),
  };
}

export function json(text: string): Response {
  return new Response(text, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
