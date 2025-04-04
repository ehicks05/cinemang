import { z } from 'zod';

export const MovieStatusEnum = z.enum([
	'Rumored',
	'Planned',
	'In Production',
	'Post Production',
	'Released',
	'Canceled',
]);
export type MovieStatusEnum = z.infer<typeof MovieStatusEnum>;

export const ShowStatusEnum = z.enum([
	'Returning Series',
	'Planned',
	'In Production',
	'Ended',
	'Canceled',
	'Pilot',
]);
export type ShowStatusEnum = z.infer<typeof ShowStatusEnum>;

export const MediaStatusEnum = z.union([MovieStatusEnum, ShowStatusEnum]);
export type MediaStatusEnum = z.infer<typeof MediaStatusEnum>;

export const GenderEnum = z.nativeEnum({
	UNSPECIFIED: 0,
	FEMAIL: 1,
	MALE: 2,
	NON_BINARY: 3,
} as const);
export type GenderEnum = z.infer<typeof GenderEnum>;

export const ShowTypeEnum = z.nativeEnum({
	Documentary: 0,
	News: 1,
	Miniseries: 2,
	Reality: 3,
	Scripted: 4,
	TalkShow: 5,
	Video: 6,
} as const);
export type ShowTypeEnum = z.infer<typeof ShowTypeEnum>;
