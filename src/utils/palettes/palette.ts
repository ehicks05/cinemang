import type { CSSProperties } from 'react';
import { Vibrant } from './vibrant';

export const DEFAULT_PALETTE = {
	bgStyles: { background: '#282828' } as CSSProperties,
	darkMuted: '#333',
	darkVibrant: '#333',
};

export interface PaletteWithGradient {
	bgStyles: CSSProperties;
	darkMuted: string;
	darkVibrant: string;
}

export const toPalette = async (url: string) => {
	await fetch(url, { mode: 'cors', cache: 'no-cache' });
	const p = await new Vibrant(url).getPalette();

	const base = {
		darkMuted: p.DarkMuted?.hex || DEFAULT_PALETTE.darkMuted,
		darkVibrant: p.DarkVibrant?.hex || DEFAULT_PALETTE.darkVibrant,
	};

	// blend `darkVibrant` with dark grays for use in background gradients
	const lessMuted = `color-mix(in oklch, ${base.darkVibrant}, #131313 50%)`;
	const moreMuted = `color-mix(in oklch, ${base.darkVibrant}, #262626 90%)`;
	const bgStyles = {
		background: `linear-gradient(45deg, ${moreMuted} 5%, ${moreMuted} 45%, ${lessMuted} 95%)`,
	} as CSSProperties;

	return {
		...base,
		bgStyles,
	} as PaletteWithGradient;
};

export const toPalettes = async (urls: string[]) => {
	return Promise.all(urls.map(toPalette));
};
