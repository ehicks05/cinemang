import { createStorage } from 'unstorage';
import lruCacheDriver from 'unstorage/drivers/lru-cache';

const storage = createStorage({
	driver: lruCacheDriver({
		max: 100,
	}),
});

export { storage };
