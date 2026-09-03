interface SearchQuery {
  query: string;
  timestamp: number;
}

type SearchSubscriber = (query: SearchQuery) => void;

class SearchServiceImpl {
  private subscribers: Set<SearchSubscriber> = new Set();
  private lastQuery: SearchQuery | null = null;

  subscribe(callback: SearchSubscriber): () => void {
    this.subscribers.add(callback);
    if (this.lastQuery) {
      callback(this.lastQuery);
    }
    return () => this.subscribers.delete(callback);
  }

  private notify(query: SearchQuery): void {
    this.subscribers.forEach(callback => callback(query));
  }

  search(query: string): void {
    const searchQuery: SearchQuery = {
      query: query.trim(),
      timestamp: Date.now()
    };
    this.lastQuery = searchQuery;
    this.notify(searchQuery);
  }

  getLastQuery(): SearchQuery | null {
    return this.lastQuery;
  }
}

export const SearchService = new SearchServiceImpl();
