import { json, vocabulary } from '../lib/publish';

export const GET = () => json(`${JSON.stringify(vocabulary(), null, 2)}
`);
