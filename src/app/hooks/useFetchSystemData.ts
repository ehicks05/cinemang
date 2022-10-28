import { useQuery } from 'react-query';
import { supabase } from '../../supabase';
import { Genre, Language, WatchProvider } from '../../types';

const fetchGenres = async () => {
  const result = await supabase.from('genre').select('*');
  const genres: Genre[] = result.data || [];
  return genres;
};

const fetchLanguages = async () => {
  const result = await supabase
    .from('language')
    .select('*')
    .order('count', { ascending: false });
  const languages: Language[] = result.data || [];
  return languages;
};

const fetchWatchProviders = async () => {
  const result = await supabase
    .from('watch_provider')
    .select('*')
    .order('display_priority');
  const watchProviders: WatchProvider[] = result.data || [];
  return watchProviders;
};

const fetchData = async () => {
  const [genres, languages, watchProviders] = await Promise.all([
    fetchGenres(),
    fetchLanguages(),
    fetchWatchProviders(),
  ]);

  return { genres, languages, watchProviders };
};

export interface SystemData {
  genres: Genre[];
  languages: Language[];
  watchProviders: WatchProvider[];
}

export const useFetchSystemData = () => {
  return useQuery<SystemData, Error>(['systemData'], fetchData, {
    keepPreviousData: true,
  });
};
