import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppStoreService } from '../services/api';
import { AppItem } from '../types';
import {
  SearchHeader,
  SearchInput,
  SearchFilters,
  TrendingSearches,
  SearchResults,
} from '../components/search';

export default function Search() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || 'All';

  const filterCategories = [
    'All',
    t('search.filters.apps'),
    t('search.filters.games'),
    t('search.filters.productivity'),
    t('search.filters.miniGames'),
    t('search.filters.utilities'),
    t('search.filters.ai')
  ];

  const [query, setQuery] = useState(urlQuery);
  const [activeFilter, setActiveFilter] = useState(urlCategory);
  const [results, setResults] = useState<AppItem[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlQuery) setQuery(urlQuery);
    if (urlCategory) setActiveFilter(urlCategory);
  }, [urlQuery, urlCategory]);

  useEffect(() => {
    async function loadTrending() {
      try {
        const list = await AppStoreService.getTrendingSearches();
        setTrending(list.length > 0 ? list : ['千问 AI', 'WPS Office', '微信 PC', '腾讯AI工作台', '无尽冬日', 'OBS Studio']);
      } catch (err) {
        console.error("Failed to load trending searches", err);
      }
    }
    loadTrending();
  }, []);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const searchResults = await AppStoreService.searchApps(query, activeFilter);
        setResults(searchResults);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() || activeFilter !== 'All') {
      const timer = setTimeout(doSearch, 200);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, activeFilter]);

  const handleClear = () => {
    setQuery('');
    setActiveFilter('All');
    setResults([]);
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-full transition-colors duration-200 select-none">
      <SearchHeader />

      <SearchInput
        value={query}
        onChange={setQuery}
        onClear={handleClear}
        loading={loading}
      />

      <SearchFilters
        filters={filterCategories}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {query.trim() || activeFilter !== 'All' ? (
        <SearchResults query={query || activeFilter} results={results} loading={loading} />
      ) : (
        <TrendingSearches trending={trending} onSelect={setQuery} />
      )}
    </div>
  );
}
