import 'dotenv/config';
import { droploadSystemTables } from './droploadSystemTables.js';
import { dropLoadTable } from './droploadTables.js';
import { fetchAndSave } from './fetchAndSave/index.js';
import { loadCredits } from './relationships/loadCredits.js';
import { loadMediaProviders } from './relationships/loadMediaProviders.js';
import { loadSeasons } from './relationships/loadSeasons.js';

const REUSE_FILE = true;

const run = async () => {
	await fetchAndSave(REUSE_FILE);

	// by now all movies, shows, and persons should be stored on disk

	// dropload 'system' tables
	await droploadSystemTables();

	// dropload core tables
	await dropLoadTable('movie');
	await dropLoadTable('tv');
	await dropLoadTable('person');

	// create relations for credits
	await loadCredits('movie');
	await loadCredits('tv');

	// create relations for mediaProviders
	await loadMediaProviders('movie');
	await loadMediaProviders('tv');

	// dropload seasons
	await loadSeasons();
};

run();
