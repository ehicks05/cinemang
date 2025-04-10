import { format, formatDistance } from 'date-fns';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { useFetchSyncLog } from '~/hooks/useFetchSyncLog';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const SHORT = 'hh:mm:ss a';
const DEFAULT = `yyyy-MM-dd'T'${SHORT}`;

export const SystemInfo = () => {
	const { data: syncRunLog } = useFetchSyncLog();
	if (!syncRunLog) return null;

	const { createdAt, endedAt } = syncRunLog;
	const duration = endedAt ? formatDistance(endedAt, createdAt) : undefined;

	return (
		<Popover>
			<PopoverTrigger>
				<HiOutlineInformationCircle className="text-3xl cursor-pointer text-emerald-500 hover:text-emerald-400" />
			</PopoverTrigger>
			<PopoverContent className="w-48 p-2 rounded-sm bg-neutral-700 text-neutral-200 shadow-2xl border-none">
				<div className="flex flex-col gap-4 text-sm">
					<div className="font-bold">Sync Stats</div>
					<div className="flex flex-col">
						<div>Start</div>
						<div>{format(createdAt, DEFAULT)}</div>
					</div>
					<div className="flex flex-col">
						<div>End</div>
						<div>{endedAt ? format(endedAt, DEFAULT) : 'pending'}</div>
					</div>
					<div className="flex flex-col">
						<div>Duration</div>
						<div>{duration || 'pending'}</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
