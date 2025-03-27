const toInitials = (name: string) => {
	const parts = name.split(' ');
	return [parts.at(0), parts.at(-1)]
		.map((part) => (part || '').slice(0, 1))
		.join('');
};
