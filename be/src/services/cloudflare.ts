import Cloudflare from 'cloudflare';

const apiEmail = process.env.CLOUDFLARE_EMAIL;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zone_id = process.env.CLOUDFLARE_ZONE_ID;
const host = process.env.CLOUDFLARE_HOST;

if (!apiEmail || !apiToken || !zone_id || !host) {
	throw new Error('missing cloudflare env vars');
}

const cloudflare = new Cloudflare({ apiEmail, apiToken });

// should purge everything in the zone/host,
// which should be the domain for cinemang
export const purgeCloudflareCache = async () =>
	await cloudflare.cache.purge({
		hosts: [host], // don't purge unrelated subdomains
		zone_id,
	});
