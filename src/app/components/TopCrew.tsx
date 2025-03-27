import { Clapperboard, Lightbulb } from 'lucide-react';
import type { Film, Show } from '~/types/types';

interface Props {
	media: Film | Show;
	showAllCreators?: boolean;
}

export const TopCrew = ({ media, showAllCreators = false }: Props) => {
	if ('director' in media) {
		return (
			<div className="flex items-center gap-1" title="Director">
				<Clapperboard size={16} className="text-neutral-400" /> {media.director}
			</div>
		);
	}
	if (media.created_by) {
		return (
			<div className="flex items-center gap-1" title="Created by">
				<Lightbulb size={16} className="text-neutral-400 shrink-0" />{' '}
				{showAllCreators ? media.created_by : media.created_by.split(',')[0]}
			</div>
		);
	}
};
