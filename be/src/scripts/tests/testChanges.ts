import { subDays } from 'date-fns';
import 'dotenv/config';
import { tmdb } from '~/services/tmdb/index.js';

const ids = await tmdb.getRecentlyChangedIds('person', {
	start: subDays(new Date(), 7),
	end: new Date(),
});

console.log(ids.length);
console.log([...new Set(ids)].length);
