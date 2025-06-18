'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '~/core-components/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '~/core-components/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/core-components/popover';
import { cn } from '~/utils/cn';
import { TmdbImage } from './TmdbImage';

interface Option {
	id: number;
	label: string;
	imagePath: string;
}

interface Props {
	options: Option[];
	selectedOptions: number[];
	handleChange: (selected: number[]) => void;
}

export function ComboBox({ options, selectedOptions, handleChange }: Props) {
	const [open, setOpen] = React.useState(false);

	const triggerIcons = selectedOptions
		.slice(0, 6)
		.map((selected) => options.find((option) => selected === option.id)?.imagePath)
		.map((imagePath) => (
			<TmdbImage
				key={imagePath}
				alt="provider"
				path={imagePath || ''}
				width="original"
				className="h-8 w-8 rounded-sm"
			/>
		));

	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					aria-expanded={open}
					className="w-full justify-between h-10 pl-1 bg-neutral-700 rounded-none border border-neutral-500"
				>
					<div className="flex gap-2">{triggerIcons}</div>
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 bg-neutral-800 text-neutral-200">
				<Command>
					<CommandInput placeholder="Search providers..." className="h-9" />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.id}
									value={option.label}
									onSelect={() => {
										if (selectedOptions.includes(option.id)) {
											handleChange(selectedOptions.filter((o) => o !== option.id));
										} else {
											handleChange([...selectedOptions, option.id]);
										}
										setOpen(false);
									}}
								>
									<TmdbImage
										className="h-8 w-8"
										key={option.id}
										alt="provider"
										path={option.imagePath}
										width="original"
									/>
									{option.label}
									<Check
										className={cn(
											'ml-auto',
											selectedOptions.includes(option.id)
												? 'opacity-100'
												: 'opacity-0',
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
