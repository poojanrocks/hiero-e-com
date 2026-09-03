import type { SearchQuery, SearchResult } from '../types';
import { StateManager } from './state-manager';

export class SearchService {
  private stateManager: StateManager;
  private readonly API_ENDPOINT = '/api/search';
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_DELAY = 300;

  constructor() {
    this.stateManager = StateManager.getInstance();
  }

  getSearchQuery(): SearchQuery {
    return this.stateManager.getState().search;
  }

  search(term: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (!term.trim()) {
      this.stateManager.updateSearch({
        term: '',
        results: [],
        loading: false
      });
      return;
    }

    this.stateManager.updateSearch({
      term,
      loading: true
    });

    this.debounceTimer = setTimeout(() => {
      this.executeSearch(term);
    }, this.DEBOUNCE_DELAY);
  }

  private async executeSearch(term: string): Promise<void> {
    try {
      const results = await this.fetchResults(term);
      this.stateManager.updateSearch({
        results,
        loading: false,
        error: undefined
      });
      this.dispatchEvent('search:results', { results, term });
    } catch (error) {
      this.stateManager.updateSearch({
        loading: false,
        error: 'Failed to fetch search results'
      });
      this.dispatchEvent('search:error', { error, term });
    }
  }

  private async fetchResults(term: string): Promise<SearchResult[]> {
    // This will be replaced with actual API call
    // For now, return mock data
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: `Result for "${term}"`,
            url: '#'
          }
        ]);
      }, 100);
    });
  }

  clear(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.stateManager.updateSearch({
      term: '',
      results: [],
      loading: false
    });
  }

  private dispatchEvent(eventName: string, detail: any): void {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}
