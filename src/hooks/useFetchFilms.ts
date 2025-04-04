import { useQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '~/constants/constants';
import type { Film, FilmDetail } from '~/types/types';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { supabase } from '~/utils/supabase';
import { CREDIT_PERSON_JOIN, PROVIDER_JOIN } from './constants';

const queryPersonIdsByName = async (name: string) => {
	const query = supabase
		.from('person')
		.select('id')
		.ilike('name', `%${name}%`)
		.order('popularity', { ascending: false })
		.range(0, 100);
	const result = await query;
	if (result.error) return result.error;
	if (result.data.length === 0) return new Error('No credits found by that name');
	return result.data?.map((o) => o.id);
};

export const queryFilms = async (form: MovieSearchForm) => {
	const creditPersonIds =
		form.creditName.length > 2 ? await queryPersonIdsByName(form.creditName) : [];

	if ('message' in creditPersonIds) {
		throw creditPersonIds;
	}

	// creditSearch and providerSearch are for filtering
	// providers is for showing providers linked to the film
	const providerSearch =
		form.providers.length > 0
			? ['providerSearch: media_provider!inner(provider_id)']
			: [];

	const creditSearch =
		form.creditName.length > 0 ? ['creditSearch: credit!inner(person_id)'] : [];

	const select = ['*', PROVIDER_JOIN, ...providerSearch, ...creditSearch].join(', ');

	const query = supabase.from('movie').select(select, { count: 'exact' });

	if (form.title) {
		query.ilike('title', `%${form.title}%`);
	}

	if (form.minVotes !== 0) {
		query.gte('vote_count', form.minVotes);
	}
	if (form.maxVotes !== 100_000_0000) {
		query.lte('vote_count', form.maxVotes);
	}
	if (form.minRating !== 0) {
		query.gte('vote_average', form.minRating);
	}
	if (form.maxRating !== 10) {
		query.lte('vote_average', form.maxRating);
	}

	if (form.minReleasedAt) {
		query.gte('released_at', form.minReleasedAt);
	}
	if (form.maxReleasedAt) {
		query.lte('released_at', form.maxReleasedAt);
	}

	if (form.genre) {
		query.eq('genre_id', form.genre);
	}
	if (form.language) {
		query.like('language_id', form.language);
	}

	if (form.providers.length > 0) {
		query.in('providerSearch.provider_id', form.providers);
	}

	if (creditPersonIds.length > 0) {
		query.in('creditSearch.person_id', creditPersonIds || []);
	}

	const result = await query
		.order(form.sortColumn, { ascending: form.ascending })
		.order('id', { ascending: true })
		.range(form.page * PAGE_SIZE, (form.page + 1) * PAGE_SIZE - 1);

	return {
		films: result.data as unknown as Film[],
		count: result.count || 0,
	};
};

export const getFilmById = async (id: number) => {
	const select = ['*', PROVIDER_JOIN, CREDIT_PERSON_JOIN].join(',');

	const result = await supabase.from('movie').select(select).eq('id', id).single();
	return result.data as unknown as FilmDetail;
};

export const useFetchFilm = (id: number) =>
	useQuery({ queryKey: ['films', id], queryFn: async () => getFilmById(id) });
