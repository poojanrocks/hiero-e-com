interface NavigationItem {
  label: string;
  url: string;
  children?: NavigationItem[];
}

type NavigationSubscriber = (items: NavigationItem[]) => void;

class NavigationServiceImpl {
  private items: NavigationItem[] = [];
  private subscribers: Set<NavigationSubscriber> = new Set();
  private activeUrl: string = '';

  subscribe(callback: NavigationSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.items);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.items));
  }

  setNavigationItems(items: NavigationItem[]): void {
    this.items = items;
    this.notify();
  }

  getNavigationItems(): NavigationItem[] {
    return this.items;
  }

  setActiveUrl(url: string): void {
    this.activeUrl = url;
    this.notify();
  }

  getActiveUrl(): string {
    return this.activeUrl;
  }

  isActive(url: string): boolean {
    return this.activeUrl === url;
  }
}

export const NavigationService = new NavigationServiceImpl();
