export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
}

class SearchService {
  private debounceTimer: NodeJS.Timeout | null = null;
  private debounceDelay = 300;

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }
    
    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      this.debounceTimer = setTimeout(async () => {
        const results = await this.performSearch(query);
        resolve(results);
      }, this.debounceDelay);
    });
  }

  private async performSearch(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}

export const searchService = new SearchService();
