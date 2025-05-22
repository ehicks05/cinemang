import logger from '~/services/logger.js';
import { checkFullMode } from './checkFullMode.js';
import { droploadSystemTables } from './droploadSystemTables.js';
import { dropLoadTable } from './droploadTables.js';
import { fetchAndSave } from './fetchAndSave/index.js';
import { purgeCache } from './purgeCache.js';
import { loadCredits } from './relationships/loadCredits.js';
import { loadMediaProviders } from './relationships/loadMediaProviders.js';
import { loadSeasons } from './relationships/loadSeasons.js';
import { runLatencyReports } from './runLatencyReports.js';
import { updateCounts } from './updateCounts.js';
import { vacuumAnalyze } from './vacuumAnalyze.js';

export const runSync = async () => {
	await runLatencyReports();

	const isFullMode = checkFullMode();
	logger.info(`running ${isFullMode ? 'full' : 'partial'} load`);

	await fetchAndSave(isFullMode, 'movie');
	await fetchAndSave(isFullMode, 'tv');
	await fetchAndSave(isFullMode, 'season'); // depends on tv
	await fetchAndSave(isFullMode, 'person'); // depends on movie, tv, and season

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

	await purgeCache();
};
