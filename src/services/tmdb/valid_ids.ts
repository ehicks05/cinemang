import axios from 'axios';
import { format, isBefore, subDays } from 'date-fns';
import { TextDecoder } from 'util';
import logger from '../logger';
import zlib from 'zlib';
import { DailyFileRow, ResourceKey } from './types';
import { DAILY_FILE, RESOURCES } from './constants';
import fileCache from '../file_cache';

/*
 * The daily ID files contain a list of the valid IDs you can find on TMDB
 * and some higher level attributes that are helpful for filtering items
 * like the adult, video and popularity values.
 *
 * The export job runs every day and all files are available by 8:00 AM UTC.
 */

const { CONFIG, HOST, PATH, EXT } = DAILY_FILE;

const getFormattedDate = () => {
  const now = new Date();
  const compareTo = new Date().setUTCHours(8, 0, 0, 0);
  const daysToSub = isBefore(now, compareTo) ? 1 : 0;
  return format(subDays(new Date(), daysToSub), 'MM_dd_yyyy');
};

export const getFilename = (resource: ResourceKey) => {
  const filename = RESOURCES[resource].DAILY_FILE_NAME;
  const date = getFormattedDate();
  return `${filename}_${date}${EXT}`;
};

const getUrl = (resource: ResourceKey) => {
  const filename = getFilename(resource);
  return `${HOST}${PATH}${filename}`;
};

export const fetchDailyFile = async (resource: ResourceKey) => {
  const result = await axios.get(getUrl(resource), CONFIG);
  const unzipped = zlib.gunzipSync(result.data);
  const decoded = new TextDecoder().decode(unzipped);
  return decoded;
};

export const getDailyFile = async (resource: ResourceKey) => {
  const filename = getFilename(resource);

  logger.info('checking file cache');
  const fromCache = await fileCache.get(filename);
  if (fromCache) {
    logger.info('retrieving from file cache');
    return fromCache;
  }
  logger.info('retrieving from tmdb');

  const fromTmdb = await fetchDailyFile(resource);

  await fileCache.set(filename, fromTmdb);

  logger.info('done');
  return fromTmdb;
};

export const getValidIdRows = async (resource: ResourceKey) => {
  const dailyFile = await getDailyFile(resource);

  const rows: DailyFileRow[] = dailyFile
    .split('\n')
    .filter((l) => l)
    .map((line) => JSON.parse(line));
  return rows;
};

export const getPopularValidIds = async (resource: ResourceKey) => {
  try {
    const rows = await getValidIdRows(resource);
    return rows
      .filter((row) => row.popularity >= RESOURCES[resource].MIN_POPULARITY)
      .map((row) => row.id);
  } catch (e) {
    logger.error(e);
  }
};
