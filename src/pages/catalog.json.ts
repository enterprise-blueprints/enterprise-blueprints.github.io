import { catalog, json } from '../lib/publish';

export const GET = () => json(`${JSON.stringify(catalog(), null, 2)}\n`);
