import type { GetStaticPaths } from 'astro';
import { json, schemaPath, schemaText } from '../../lib/publish';

export const getStaticPaths = (() => [{ params: { file: schemaPath.split('/')[1] } }]) satisfies GetStaticPaths;

export const GET = () => json(schemaText);
