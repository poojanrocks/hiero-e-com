import { initializeKeyboardNavigation } from '@utils/keyboard';
import { SearchService } from '@services/search';
import { CartService } from '@services/cart';
import { WishlistService } from '@services/wishlist';

export class HeaderComponent {
  private element: HTMLElement;
  private searchService: SearchService;
  private cartService: CartService;
  private wishlistService: WishlistService;
  private mobileMenuOpen = false;
  private searchOpen = false;

  constructor(selector: string) {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Header element not found: ${selector}`);
    
    this.element = el as HTMLElement;
    this.searchService = new SearchService();
    this.cartService = new CartService();
    this.wishlistService = new WishlistService();
    
    this.initialize();
  }

  private initialize(): void {
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.updateCartCount();
    this.updateWishlistCount();
  }

  private setupEventListeners(): void {
    const mobileToggle = this.element.querySelector('[data-mobile-menu-toggle]');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    const searchToggle = this.element.querySelector('[data-search-toggle]');
    if (searchToggle) {
      searchToggle.addEventListener('click', () => this.toggleSearch());
    }

    const searchInput = this.element.querySelector('[data-search-input]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }

    document.addEventListener('click', (e) => this.handleDocumentClick(e));
  }

  private setupKeyboardNavigation(): void {
    const navItems = this.element.querySelectorAll('[data-nav-item]');
    initializeKeyboardNavigation(Array.from(navItems), {
      onEscape: () => this.closeMobileMenu(),
    });
  }

  private toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const menu = this.element.querySelector('[data-mobile-menu]');
    if (menu) {
      menu.classList.toggle('visible', this.mobileMenuOpen);
      menu.setAttribute('aria-hidden', String(!this.mobileMenuOpen));
    }
  }

  private closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      const menu = this.element.querySelector('[data-mobile-menu]');
      if (menu) {
        menu.classList.remove('visible');
        menu.setAttribute('aria-hidden', 'true');
      }
    }
  }

  private toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    const searchBox = this.element.querySelector('[data-search-box]');
    if (searchBox) {
      searchBox.classList.toggle('visible', this.searchOpen);
      searchBox.setAttribute('aria-hidden', String(!this.searchOpen));
      if (this.searchOpen) {
        const input = searchBox.querySelector('input');
        input?.focus();
      }
    }
  }

  private handleSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 0) {
      this.searchService.search(input.value).then(results => {
        this.displaySearchResults(results);
      });
    }
  }

  private displaySearchResults(results: any[]): void {
    const resultsContainer = this.element.querySelector('[data-search-results]');
    if (resultsContainer) {
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="search-empty">No results found</p>';
      } else {
        resultsContainer.innerHTML = results.map(r => 
          `<a href="${r.url}" class="search-result">${r.title}</a>`
        ).join('');
      }
    }
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.element.contains(target)) {
      this.closeMobileMenu();
      this.searchOpen = false;
    }
  }

  private updateCartCount(): void {
    this.cartService.getCount().then(count => {
      const badge = this.element.querySelector('[data-cart-count]');
      if (badge && count > 0) {
        badge.textContent = String(count);
        badge.classList.add('visible');
      }
    });
  }

  private updateWishlistCount(): void {
    this.wishlistService.getCount().then(count => {
      const badge = this.element.querySelector('[data-wishlist-count]');
      if (badge && count > 0) {
        badge.textContent = String(count);
        badge.classList.add('visible');
      }
    });
  }

  public destroy(): void {
    const mobileToggle = this.element.querySelector('[data-mobile-menu-toggle]');
    if (mobileToggle) {
      mobileToggle.removeEventListener('click', () => this.toggleMobileMenu());
    }
  }
}
