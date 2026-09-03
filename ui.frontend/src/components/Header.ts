import { stateManager } from '../services/state-manager';

export interface HeaderConfig {
  logoUrl?: string;
  logoAlt?: string;
  searchPlaceholder?: string;
  mobileMenuBreakpoint?: number;
}

export class Header {
  private container: HTMLElement;
  private config: HeaderConfig;
  private mobileMenuOpen = false;
  private searchOpen = false;
  private unsubscribe: (() => void) | null = null;

  constructor(container: HTMLElement, config: HeaderConfig = {}) {
    this.container = container;
    this.config = {
      searchPlaceholder: 'Search products...',
      mobileMenuBreakpoint: 768,
      ...config,
    };
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const html = `
      <header class="hiero-header" role="banner">
        <div class="hiero-header__top">
          <div class="hiero-header__container">
            <button class="hiero-header__menu-toggle" aria-label="Toggle menu" aria-expanded="false">
              <span class="hiero-header__menu-icon"></span>
            </button>
            
            <div class="hiero-header__logo">
              ${this.config.logoUrl ? `<img src="${this.config.logoUrl}" alt="${this.config.logoAlt || 'Logo'}" />` : '<span>Store</span>'}
            </div>

            <nav class="hiero-header__nav" role="navigation" aria-label="Main navigation">
              <ul class="hiero-header__nav-list">
                <li><a href="/" class="hiero-header__nav-link">Home</a></li>
                <li><a href="/products" class="hiero-header__nav-link">Products</a></li>
                <li><a href="/about" class="hiero-header__nav-link">About</a></li>
              </ul>
            </nav>

            <div class="hiero-header__actions">
              <button class="hiero-header__search-toggle" aria-label="Open search" aria-expanded="false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <a href="/wishlist" class="hiero-header__wishlist" aria-label="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="hiero-header__wishlist-count">0</span>
              </a>
              <a href="/cart" class="hiero-header__cart" aria-label="Shopping cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="hiero-header__cart-count">0</span>
              </a>
            </div>
          </div>
        </div>

        <div class="hiero-header__search" role="search" aria-expanded="false">
          <div class="hiero-header__search-container">
            <input 
              type="text" 
              class="hiero-header__search-input" 
              placeholder="${this.config.searchPlaceholder}"
              aria-label="Search products"
            />
            <button class="hiero-header__search-submit" aria-label="Submit search">Search</button>
          </div>
        </div>
      </header>
    `;
    this.container.innerHTML = html;
  }

  private attachEventListeners(): void {
    const menuToggle = this.container.querySelector('.hiero-header__menu-toggle') as HTMLButtonElement;
    const searchToggle = this.container.querySelector('.hiero-header__search-toggle') as HTMLButtonElement;
    const searchClose = this.container.querySelector('.hiero-header__search') as HTMLElement;
    const searchInput = this.container.querySelector('.hiero-header__search-input') as HTMLInputElement;

    menuToggle?.addEventListener('click', () => this.toggleMobileMenu());
    searchToggle?.addEventListener('click', () => this.toggleSearch());
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeSearch();
      }
    });

    searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch(searchInput.value);
      }
    });

    this.unsubscribe = stateManager.subscribe((state) => {
      this.updateCartCount(state.cartCount);
      this.updateWishlistCount(state.wishlistCount);
    });
  }

  private toggleMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  private openMobileMenu(): void {
    this.mobileMenuOpen = true;
    const nav = this.container.querySelector('.hiero-header__nav') as HTMLElement;
    const toggle = this.container.querySelector('.hiero-header__menu-toggle') as HTMLButtonElement;
    if (nav) nav.classList.add('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  private closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    const nav = this.container.querySelector('.hiero-header__nav') as HTMLElement;
    const toggle = this.container.querySelector('.hiero-header__menu-toggle') as HTMLButtonElement;
    if (nav) nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  private toggleSearch(): void {
    if (this.searchOpen) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }

  private openSearch(): void {
    this.searchOpen = true;
    const search = this.container.querySelector('.hiero-header__search') as HTMLElement;
    const toggle = this.container.querySelector('.hiero-header__search-toggle') as HTMLButtonElement;
    if (search) search.setAttribute('aria-expanded', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    const input = this.container.querySelector('.hiero-header__search-input') as HTMLInputElement;
    input?.focus();
  }

  private closeSearch(): void {
    this.searchOpen = false;
    const search = this.container.querySelector('.hiero-header__search') as HTMLElement;
    const toggle = this.container.querySelector('.hiero-header__search-toggle') as HTMLButtonElement;
    if (search) search.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  private handleSearch(query: string): void {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  }

  private updateCartCount(count: number): void {
    const badge = this.container.querySelector('.hiero-header__cart-count') as HTMLElement;
    if (badge) {
      badge.textContent = count.toString();
      badge.classList.toggle('is-empty', count === 0);
    }
  }

  private updateWishlistCount(count: number): void {
    const badge = this.container.querySelector('.hiero-header__wishlist-count') as HTMLElement;
    if (badge) {
      badge.textContent = count.toString();
      badge.classList.toggle('is-empty', count === 0);
    }
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
