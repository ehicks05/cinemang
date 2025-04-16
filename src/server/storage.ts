import { createStorage } from 'unstorage';
import lruCacheDriver from 'unstorage/drivers/lru-cache';

const storage = createStorage({
	driver: lruCacheDriver({
		max: 100,
		ttl: 1000 * 60 * 60,
	}),
});

export { storage };
