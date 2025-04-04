import 'dotenv/config';
import { discoverMediaIds } from '~/app/tmdb_api.js';

const ids = await discoverMediaIds('tv', true);

console.log(ids.length);
