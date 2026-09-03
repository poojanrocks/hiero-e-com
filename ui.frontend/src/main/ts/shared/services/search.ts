/**
 * Search Service
 * Manages search functionality and state
 */

interface SearchState {
  query: string;
  isLoading: boolean;
  results: any[];
  error: string | null;
}

class SearchService {
  private state: SearchState = {
    query: '',
    isLoading: false,
    results: [],
    error: null
  };
  private listeners: Set<(state: SearchState) => void> = new Set();

  public initialize(container: HTMLElement): void {
    const searchInput = container.querySelector('[data-search-input]') as HTMLInputElement;
    const searchForm = container.querySelector('[data-search-form]') as HTMLFormElement;

    if (searchInput) {
      searchInput.addEventListener('focus', () => this.onSearchFocus(container));
      searchInput.addEventListener('input', (e) => this.onSearchInput(e as Event));
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.onSearchSubmit(e));
    }
  }

  private onSearchFocus(container: HTMLElement): void {
    const resultsContainer = container.querySelector('[data-search-results]');
    if (resultsContainer) {
      resultsContainer.classList.add('is-open');
    }
  }

  private onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.state.query = input.value;
    this.notifyListeners();
  }

  private onSearchSubmit(event: Event): void {
    event.preventDefault();
    if (this.state.query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(this.state.query)}`;
    }
  }

  public subscribe(listener: (state: SearchState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState(): SearchState {
    return { ...this.state };
  }
}

const searchService = new SearchService();

export function initializeSearch(container: HTMLElement): void {
  searchService.initialize(container);
}

export { SearchService, searchService };