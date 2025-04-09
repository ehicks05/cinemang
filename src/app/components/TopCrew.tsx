import { Clapperboard, Lightbulb } from 'lucide-react';
import type { Film, Show } from '~/types/types';

interface Props {
	media: Film | Show;
	showAllCreators?: boolean;
}

const getFontSize = (input: string) => (input.length > 24 ? 'text-sm' : '');

export const TopCrew = ({ media, showAllCreators = false }: Props) => {
	if ('director' in media) {
		return (
			<div className="flex items-center gap-1" title="Director">
				<Clapperboard size={16} className="text-neutral-400" />
				<span className={getFontSize(media.director)}>{media.director}</span>
			</div>
		);
	}
	if (media.createdBy) {
		const creator = showAllCreators
			? media.createdBy
			: media.createdBy.split(',')[0];
		return (
			<div className="flex items-center gap-1" title="Created by">
				<Lightbulb size={16} className="text-neutral-400 shrink-0" />{' '}
				<span className={getFontSize(creator)}>{creator}</span>
			</div>
		);
	}
};
