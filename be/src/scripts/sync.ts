import 'dotenv/config';
import { droploadSystemTables } from './droploadSystemTables.js';
import { dropLoadTable } from './droploadTables.js';
import { fetchAndSave } from './fetchAndSave/index.js';
import { loadCredits } from './relationships/loadCredits.js';
import { loadMediaProviders } from './relationships/loadMediaProviders.js';
import { loadSeasons } from './relationships/loadSeasons.js';
import { runLatencyReports } from './runLatencyReports.js';
import { updateCounts } from './updateCounts.js';

const REUSE_FILE = true;

export const runSync = async () => {
	await runLatencyReports();
	// await fetchAndSave(REUSE_FILE); // save movies, shows, and persons to disk

	await droploadSystemTables();

	// await dropLoadTable('movie');
	// await dropLoadTable('tv');
	// await dropLoadTable('person');

	// await loadCredits('movie');
	// await loadCredits('tv');

	// await loadMediaProviders('movie');
	// await loadMediaProviders('tv');

	// await loadSeasons();

	// await updateCounts();
};
