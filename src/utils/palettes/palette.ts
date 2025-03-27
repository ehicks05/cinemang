import { Vibrant } from './vibrant';

export const DEFAULT_PALETTE = {
	bgStyles: { background: '#333' },
	darkMuted: '#333',
	darkVibrant: '#333',
};

export interface PaletteWithGradient {
	bgStyles: { background: string };
	darkMuted: string;
	darkVibrant: string;
}

export const toPalette = async (url: string) => {
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
	};

	return {
		...base,
		bgStyles,
	} as PaletteWithGradient;
};

export const toPalettes = async (urls: string[]) => {
	return Promise.all(urls.map(toPalette));
};
