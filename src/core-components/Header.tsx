import { Link } from '@tanstack/react-router';
import { FaCat } from 'react-icons/fa';

export const Header = () => (
	<div className="mx-auto flex max-w-5xl items-center gap-4">
		<Link
			className="flex items-center gap-1 p-4 text-2xl"
			style={{ fontFamily: 'Urbanist' }}
			to="/"
		>
			Cine
			<FaCat className="inline text-emerald-500" />
			Mang
		</Link>

		<Link
			to="/films"
			activeProps={{ className: 'font-bold' }}
			activeOptions={{ includeSearch: false }}
		>
			Movies
		</Link>
		<Link
			to="/tv"
			activeProps={{ className: 'font-bold' }}
			activeOptions={{ includeSearch: false }}
		>
			TV
		</Link>
	</div>
);
