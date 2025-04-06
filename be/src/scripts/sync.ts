import 'dotenv/config';
import { droploadSystemTables } from './droploadSystemTables.js';
import { dropLoadTable } from './droploadTables.js';
import { fetchAndSave } from './fetchAndSave/index.js';
import { loadCredits } from './relationships/loadCredits.js';
import { loadMediaProviders } from './relationships/loadMediaProviders.js';
import { loadSeasons } from './relationships/loadSeasons.js';
import { runLatencyReports } from './runLatencyReports.js';
import { updateCounts } from './updateCounts.js';
import { vacuumAnalyze } from './vacuumAnalyze.js';

export const runSync = async () => {
	await runLatencyReports();

	await fetchAndSave('movie');
	await fetchAndSave('tv');
	await fetchAndSave('season'); // depends on tv
	await fetchAndSave('person'); // depends on movie, tv, and season

	await droploadSystemTables();

	await dropLoadTable('movie');
	await dropLoadTable('tv');
	await dropLoadTable('person');

	await loadCredits('movie');
	await loadCredits('tv');

	await loadMediaProviders('movie');
	await loadMediaProviders('tv');

	await loadSeasons();

	await updateCounts();

	await vacuumAnalyze();
};
