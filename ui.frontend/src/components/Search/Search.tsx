import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import '../Search/Search.scss';

interface SearchProps {
  onClose?: () => void;
}

const Search: React.FC<SearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { onSearch } = useSearch();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setError(null);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await onSearch(value);
      setResults(searchResults);
    } catch (err) {
      setError('Failed to load search results');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="search" role="search">
      <form className="search__form" onSubmit={handleSubmit}>
        <label htmlFor="search-input" className="sr-only">Search products</label>
        <input
          ref={searchInputRef}
          id="search-input"
          type="text"
          className="search__input"
          placeholder="Search products..."
          value={query}
          onChange={handleSearchChange}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-label="Search products"
        />
        <button type="submit" className="search__button" aria-label="Search">
          <svg className="icon icon--search" aria-hidden="true">
            <use href="#icon-search"></use>
          </svg>
        </button>
      </form>

      {isLoading && <div className="search__loading" role="status" aria-live="polite">Loading...</div>}
      {error && <div className="search__error" role="alert">{error}</div>}

      {results.length > 0 && (
        <ul id="search-results" className="search__results" role="listbox">
          {results.map((result, index) => (
            <li key={index} className="search__result" role="option">
              <a href={result.url} className="search__result-link" onClick={onClose}>
                <span className="search__result-name">{result.name}</span>
                {result.price && <span className="search__result-price">${result.price}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && query.trim().length >= 2 && results.length === 0 && !error && (
        <div className="search__empty" role="status">No products found</div>
      )}
    </div>
  );
};

export default Search;