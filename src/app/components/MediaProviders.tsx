import { TmdbImage } from '~/core-components';
import { useSystemData } from '~/hooks/useSystemData';
import type { Provider } from '~/types/types';

interface Props {
	ids: { providerId: number }[];
}

export const MediaProviders = ({ ids }: Props) => {
	const { providers } = useSystemData();

	const filteredProviders = ids
		.map((id) => providers.find((p) => p.id === id.providerId))
		.filter((p): p is Provider => p !== null && p !== undefined)
		.filter((p) => p.displayPriority <= 22)
		.sort((p1, p2) => p1.displayPriority - p2.displayPriority)
		.slice(0, 2);

	if (filteredProviders.length === 0) return null;
	return (
		<div className="flex justify-end gap-0.5 shrink-0">
			{filteredProviders.map((provider) => (
				<TmdbImage
					key={provider.id}
					className="h-8 w-8 rounded-full"
					path={provider.logoPath}
					width={'original'}
					title={provider.name}
					alt={provider.name}
				/>
			))}
		</div>
	);
};
