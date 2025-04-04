import { omit } from 'lodash-es';
import pMap from 'p-map';
import logger from '~/services/logger.js';
import prisma, { PRISMA_CONCURRENCY } from '~/services/prisma.js';

// count shows as well?
const updateLanguageCounts = async () => {
	const [languages, languageCounts] = await Promise.all([
		prisma.language.findMany(),
		prisma.movie.groupBy({
			by: ['languageId'],
			_count: true,
		}),
	]);

	const languagesWithCounts = languages.map((l) => {
		const lc = languageCounts.find((lc) => lc.languageId === l.id);
		const count = lc ? lc._count : l.count;
		return { ...l, count };
	});

	await pMap(
		languagesWithCounts,
		(o) => prisma.language.update({ data: o, where: { id: o.id } }),
		PRISMA_CONCURRENCY,
	);

	logger.info('updated language counts');
};

const updateProviderCounts = async () => {
	const providersWithCounts = await prisma.provider.findMany({
		include: {
			_count: {
				select: {
					medias: true,
				},
			},
		},
	});

	const providers = providersWithCounts.map((wp) => ({
		...omit(wp, ['_count']),
		count: wp._count.medias,
	}));

	await pMap(
		providers,
		async (p) => prisma.provider.update({ data: p, where: { id: p.id } }),
		PRISMA_CONCURRENCY,
	);

	logger.info('updated watch provider counts');
};

export const updateCounts = async () => {
	await updateLanguageCounts();
	await updateProviderCounts();
};
