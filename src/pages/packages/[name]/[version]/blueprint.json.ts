import type { GetStaticPaths } from 'astro';
import { json, published, type PublishedPackage } from '../../../../lib/publish';

export const getStaticPaths = (() =>
  published.map((p) => ({ params: { name: p.name, version: p.data.version }, props: { p } }))) satisfies GetStaticPaths;

// The package exactly as stored, so its digest matches the catalog.
export const GET = ({ props }: { props: { p: PublishedPackage } }) => json(props.p.text);
