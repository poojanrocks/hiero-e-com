import { SearchQuery, UIState } from '../types';

class SearchService {
  private static instance: SearchService;
  private listeners: Set<(state: UIState) => void> = new Set();
  private searchState: UIState = { status: 'idle' };

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async search(query: SearchQuery): Promise<UIState> {
    this.setSearchState({ status: 'loading' });
    try {
      const params = new URLSearchParams();
      params.append('q', query.term);
      if (query.filters) {
        Object.entries(query.filters).forEach(([key, values]) => {
          values.forEach(value => params.append(`filter[${key}]`, value));
        });
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      const results = data.results || [];
      const state: UIState = results.length > 0
        ? { status: 'idle', data: results }
        : { status: 'empty' };
      this.setSearchState(state);
      return state;
    } catch (error) {
      const state: UIState = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.setSearchState(state);
      return state;
    }
  }

  getSearchState(): UIState {
    return this.searchState;
  }

  subscribe(listener: (state: UIState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setSearchState(state: UIState): void {
    this.searchState = state;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.searchState));
  }
}

export default SearchService.getInstance();