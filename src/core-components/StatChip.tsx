import type { IconType } from 'react-icons';

interface Props {
	bgColor: string;
	color: string;
	icon: IconType;
	label: string | number;
	title: string;
}

const StatChip = ({ bgColor, color, icon: Icon, label, title }: Props) => (
	<div
		className={
			'flex w-full items-center justify-center gap-1 px-3 py-1 sm:px-3 rounded text-sm'
		}
		style={{ background: bgColor }}
		title={title}
	>
		{Icon && <Icon className={color} />}
		{label && <div className="text-xs sm:text-sm">{label}</div>}
	</div>
);

export { StatChip };
