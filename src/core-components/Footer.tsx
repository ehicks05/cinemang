import { HiOutlineHome } from 'react-icons/hi2';
import { SiThemoviedatabase } from 'react-icons/si';
import { VscGithub } from 'react-icons/vsc';
import { SystemInfo } from './SystemInfo';

const LINKS = [
	{
		icon: SiThemoviedatabase,
		url: 'https://www.themoviedb.org',
	},
	{
		icon: VscGithub,
		url: 'https://www.github.com/ehicks05/cinemang-frontend',
	},
	{
		icon: HiOutlineHome,
		url: 'https://ehicks.net',
	},
];

export const Footer = () => (
	<footer className="flex justify-end gap-4 p-4">
		<SystemInfo />
		{LINKS.map(({ url, icon: Icon }) => (
			<a key={url} href={url} rel="noreferrer" target="_blank">
				<Icon className="text-3xl text-emerald-500 hover:text-emerald-400" />
			</a>
		))}
	</footer>
);
