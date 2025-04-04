import 'dotenv/config';
import { tmdb } from '~/services/tmdb/index.js';

const ids = await tmdb.discoverMediaIds('tv', true);

console.log(ids.length);
