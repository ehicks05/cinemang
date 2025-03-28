import { TmdbImage } from '~/core-components';
import { useSystemData } from '~/hooks/useSystemData';
import type { Provider } from '~/types/types';

interface Props {
	selectedIds: { id: number }[];
}

export const MediaProviders = ({ selectedIds }: Props) => {
	const { providers } = useSystemData();

	const filteredProviders = selectedIds
		.map((id) => providers.find((p) => p.id === id.id))
		.filter((p): p is Provider => p !== null && p !== undefined)
		.filter((p) => p.display_priority <= 22)
		.sort((p1, p2) => p1.display_priority - p2.display_priority)
		.slice(0, 3);

	if (filteredProviders.length === 0) return null;
	return (
		<div className="flex flex-wrap justify-end gap-1">
			{filteredProviders.map((provider) => (
				<TmdbImage
					key={provider.id}
					className="h-10 w-10 rounded-full"
					path={provider.logo_path}
					width={'original'}
					title={provider.name}
					alt={provider.name}
				/>
			))}
		</div>
	);
};
