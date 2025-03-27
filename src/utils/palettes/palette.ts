import type { CSSProperties } from 'react';
import { Vibrant } from './vibrant';

export const DEFAULT_PALETTE = {
	bgStyles: { background: '#282828', filter: 'saturate(0)' } as CSSProperties,
	darkMuted: '#333',
	darkVibrant: '#333',
};

export interface PaletteWithGradient {
	bgStyles: CSSProperties;
	darkMuted: string;
	darkVibrant: string;
}

export const toPalette = async (url: string) => {
	const img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = url;
	const p = await new Vibrant(img).getPalette();

	const base = {
		darkMuted: p.DarkMuted?.hex || DEFAULT_PALETTE.darkMuted,
		darkVibrant: p.DarkVibrant?.hex || DEFAULT_PALETTE.darkVibrant,
	};

	// blend `darkVibrant` with dark grays for use in background gradients
	const lessMuted = `color-mix(in oklch, ${base.darkVibrant}, #131313 50%)`;
	const moreMuted = `color-mix(in oklch, ${base.darkVibrant}, #262626 90%)`;
	const bgStyles = {
		background: `linear-gradient(45deg, ${moreMuted} 5%, ${moreMuted} 45%, ${lessMuted} 95%)`,
		filter: 'saturate(1)',
	} as CSSProperties;

	return {
		...base,
		bgStyles,
	} as PaletteWithGradient;
};

export const toPalettes = async (urls: string[]) => {
	return Promise.all(urls.map(toPalette));
};
