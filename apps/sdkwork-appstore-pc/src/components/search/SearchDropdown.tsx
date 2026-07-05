import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import {
  useTrendingSearchTerms,
  useSearchHistory,
  recordSearchHistory,
  clearSearchHistory,
} from '@/hooks/useApi';
import { getStoreClient } from '@/services/storeClient';
import { isAuthenticated } from '@/bootstrap/iamRuntime';

function readTerm(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const record = item as Record<string, unknown>;
  const value = record.term ?? record.queryText ?? record.query_text ?? record.suggestion;
  return typeof value === 'string' ? value.trim() : '';
}

interface SearchDropdownProps {
  query: string;
  open: boolean;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchDropdown({
  query,
  open,
  onClose,
  onQueryChange,
  inputRef,
}: SearchDropdownProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const { data: trendingData } = useTrendingSearchTerms(8);
  const { data: historyData, execute: refreshHistory } = useSearchHistory(8);
  const authed = isAuthenticated();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open || debouncedQuery.length < 1) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setSuggestionsLoading(true);
    void getStoreClient()
      .catalog.listSearchSuggestions({ q: debouncedQuery })
      .then((result) => {
        if (cancelled) return;
        const terms = (result.items ?? []).map(readTerm).filter((t) => t.length > 0);
        setSuggestions(terms);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, inputRef]);

  const submitSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      onQueryChange(trimmed);
      onClose();
      if (authed) {
        void recordSearchHistory(trimmed).then(() => refreshHistory());
      }
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [authed, navigate, onClose, onQueryChange, refreshHistory],
  );

  if (!open) return null;

  const trending = (trendingData?.items ?? []).map(readTerm).filter(Boolean);
  const recent = (historyData?.items ?? []).map(readTerm).filter(Boolean);
  const showSuggestions = query.trim().length > 0;

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full mt-2 w-[28rem] max-h-[28rem] overflow-y-auto rounded-2xl border shadow-lg z-[var(--z-dropdown)] animate-fade-in"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
      }}
      role="listbox"
      aria-label="搜索建议"
    >
      {showSuggestions ? (
        <section className="p-3">
          <p className="px-2 py-1 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            搜索建议
          </p>
          {suggestionsLoading ? (
            <div className="px-3 py-4 text-[var(--text-sm)] text-[var(--text-tertiary)]">加载中…</div>
          ) : suggestions.length === 0 ? (
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--bg-muted)]"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitSearch(query)}
            >
              <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
              <span className="text-[var(--text-sm)] text-[var(--text-primary)]">
                搜索「{query.trim()}」
              </span>
            </button>
          ) : (
            suggestions.map((term) => (
              <button
                key={term}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--bg-muted)]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => submitSearch(term)}
              >
                <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-sm)] text-[var(--text-primary)]">{term}</span>
              </button>
            ))
          )}
        </section>
      ) : (
        <>
          {trending.length > 0 ? (
            <section className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="mb-2 flex items-center gap-2 px-2">
                <TrendingUp className="h-4 w-4 text-[var(--warning)]" />
                <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                  热搜
                </p>
              </div>
              <div className="flex flex-wrap gap-2 px-1">
                {trending.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="rounded-full px-3 py-1.5 text-[var(--text-sm)] font-medium hover:bg-[var(--bg-muted)]"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => submitSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {authed && recent.length > 0 ? (
            <section className="p-3">
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--text-tertiary)]" />
                  <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                    最近搜索
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[var(--text-xs)] font-medium text-[var(--accent)]"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    void clearSearchHistory().then(() => refreshHistory());
                  }}
                >
                  清空
                </button>
              </div>
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--bg-muted)]"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submitSearch(term)}
                >
                  <Clock className="h-4 w-4 text-[var(--text-tertiary)]" />
                  <span className="text-[var(--text-sm)] text-[var(--text-primary)]">{term}</span>
                </button>
              ))}
            </section>
          ) : null}

          {trending.length === 0 && (!authed || recent.length === 0) ? (
            <div className="px-4 py-6 text-center text-[var(--text-sm)] text-[var(--text-tertiary)]">
              输入关键词开始搜索
            </div>
          ) : null}
        </>
      )}

      {query.trim() ? (
        <div className="border-t p-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[var(--text-sm)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onQueryChange('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
            清除
          </button>
        </div>
      ) : null}
    </div>
  );
}
