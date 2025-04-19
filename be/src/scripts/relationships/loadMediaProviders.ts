import type { Prisma } from '@prisma/client';
import { keyBy } from 'lodash-es';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { processLines } from '../processLineByLine.js';
import type { MediaResponse } from '../types.js';
import { getPath } from '../utils.js';

const toMediaKey = (media: MediaResponse) => {
	if ('title' in media) return { movieId: media.id };
	if ('name' in media) return { showId: media.id };
	throw new Error('unrecognized media object');
};

const getProvidersById = async () => {
	const providers = await prisma.provider.findMany({ select: { id: true } });
	return keyBy(providers, (o) => o.id);
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

export const loadMediaProviders = async (type: 'movie' | 'tv') => {
	logger.info(`droploading ${type} mediaProviders`);
	const providersById = await getProvidersById();

	await processLines(
		getPath(type),
		async (chunk) => {
			const data = chunk
				.map((line) => JSON.parse(line))
				.flatMap(toMediaProviderCreateInput)
				.filter((o) => o && providersById[o.providerId]);

			try {
				const _ids =
					type === 'movie' ? data.map((o) => o.movieId) : data.map((o) => o.showId);
				const ids = _ids.filter((o): o is number => !!o);
				const where =
					type === 'movie' ? { movieId: { in: ids } } : { showId: { in: ids } };

				await prisma.mediaProvider.deleteMany({ where: where });
				await prisma.mediaProvider.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		500,
	);

	logger.info(`finished loading ${type} mediaProviders`);
};
