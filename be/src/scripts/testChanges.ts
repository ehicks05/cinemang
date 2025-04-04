import { subDays } from 'date-fns';
import 'dotenv/config';
import { getRecentlyChangedIds } from '~/app/tmdb_api.js';

const ids = await getRecentlyChangedIds('person', {
	start: subDays(new Date(), 7),
	end: new Date(),
});

console.log(ids.length);
console.log([...new Set(ids)].length);
