import type { GetStaticPaths } from 'astro';
import { published, type PublishedPackage } from '../../../../lib/publish';

export const getStaticPaths = (() =>
  published.map((p) => ({ params: { name: p.name, version: p.data.version }, props: { p } }))) satisfies GetStaticPaths;

// In sha256sum format, so `sha256sum -c blueprint.json.sha256` checks a download.
export const GET = ({ props }: { props: { p: PublishedPackage } }) =>
  new Response(`${props.p.sha256}  blueprint.json\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
