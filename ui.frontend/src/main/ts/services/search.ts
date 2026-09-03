export interface SearchResult {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export class SearchService {
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly debounceDelay = 300;

  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        console.error('Search failed:', response.status);
        return [];
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search service error:', error);
      return [];
    }
  }

  debounceSearch(
    query: string,
    callback: (results: SearchResult[]) => void
  ): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.search(query).then(callback);
    }, this.debounceDelay);
  }

  cancelSearch(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
