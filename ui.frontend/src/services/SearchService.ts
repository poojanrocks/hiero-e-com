interface SearchResult {
  id: string;
  name: string;
  url: string;
  price?: number;
  image?: string;
}

class SearchService {
  private static readonly API_ENDPOINT = '/api/search';
  private static debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly DEBOUNCE_DELAY = 300;

  static async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.API_ENDPOINT}?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  static debounced(query: string, limit?: number): Promise<SearchResult[]> {
    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.search(query, limit).then(resolve).catch(() => resolve([]));
      }, this.DEBOUNCE_DELAY);
    });
  }
}

export default SearchService;