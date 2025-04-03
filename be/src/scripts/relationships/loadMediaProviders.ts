import type { Prisma } from '@prisma/client';
import { keyBy } from 'lodash-es';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import type { MediaResponse } from '~/services/tmdb/types/responses.js';
import { processLines } from '../processLineByLine.js';
import { getPath } from '../utils.js';

const toId = (o: { id: number }) => o.id;

const toMediaKey = (media: MediaResponse) => {
	if ('title' in media) return { movieId: media.id };
	if ('name' in media) return { showId: media.id };
	throw new Error('unrecognized media object');
};

const getProvidersById = async () => {
	const providers = await prisma.provider.findMany({});
	return keyBy(providers, toId);
};

const toMediaProviderCreateInput = (
	media: MediaResponse,
): Prisma.MediaProviderUncheckedCreateInput[] => {
	const providers = media['watch/providers'].results.US?.flatrate || [];

	return providers.map((p) => ({
		...toMediaKey(media),
		providerId: p.provider_id,
	}));
};

export const loadMediaProviders = async (type: 'movie' | 'tv' | 'person') => {
	logger.info(`droploading ${type} mediaProviders`);
	const providersById = await getProvidersById();

	const where =
		type === 'movie' ? { movieId: { not: null } } : { showId: { not: null } };
	const deleteResult = await prisma.mediaProvider.deleteMany({ where: where });

	logger.info(`dropped ${deleteResult.count} rows`);

	await processLines(
		getPath(type),
		async (chunk) => {
			const data = chunk
				.map((line) => JSON.parse(line))
				.flatMap(toMediaProviderCreateInput)
				.filter((o) => o && providersById[o.providerId]);

			try {
				await prisma.mediaProvider.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		500,
	);

	logger.info(`finished loading ${type} mediaProviders`);
};
