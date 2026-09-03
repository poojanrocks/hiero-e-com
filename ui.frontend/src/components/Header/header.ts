import { stateManager } from '../../services/StateManager';
import type { HeaderConfig } from '../../types';
import '../styles/header.scss';

class Header {
  private container: HTMLElement | null;
  private config: HeaderConfig;
  private mobileMenuOpen: boolean = false;

  constructor(containerId: string, config: HeaderConfig) {
    this.container = document.getElementById(containerId);
    this.config = config;
    if (this.container) {
      this.init();
    }
  }

  private init(): void {
    if (!this.container) return;
    
    this.render();
    this.attachEventListeners();
    this.subscribeToState();
    this.initializeAccessibility();
  }

  private render(): void {
    if (!this.container) return;

    const nav = this.renderNavigation();
    const search = this.renderSearch();
    const utilities = this.renderUtilities();
    const mobileToggle = this.renderMobileToggle();

    this.container.innerHTML = `
      <header class="header" role="banner">
        <div class="header__top">
          <div class="header__logo">
            ${this.config.logo ? `<img src="${this.config.logo}" alt="${this.config.logoAlt || 'Logo'}" class="header__logo-img">` : '<span class="header__logo-text">Hiero</span>'}
          </div>
          ${search}
          ${utilities}
          ${mobileToggle}
        </div>
        ${nav}
      </header>
    `;
  }

  private renderNavigation(): string {
    const items = this.config.navigation
      .map(
        (item) =>
          `<li class="nav-item">
            <a href="${item.href}" class="nav-link ${item.active ? 'nav-link--active' : ''}" aria-current="${item.active ? 'page' : 'false'}">
              ${item.label}
            </a>
            ${item.children ? `<ul class="nav-submenu">${this.renderSubmenu(item.children)}</ul>` : ''}
          </li>`
      )
      .join('');

    return `
      <nav class="header__nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-list">${items}</ul>
      </nav>
    `;
  }

  private renderSubmenu(items: typeof this.config.navigation): string {
    return items
      .map(
        (item) =>
          `<li class="nav-item nav-item--sub">
            <a href="${item.href}" class="nav-link">${item.label}</a>
          </li>`
      )
      .join('');
  }

  private renderSearch(): string {
    return `
      <div class="header__search">
        <form class="search-form" role="search">
          <input
            type="search"
            class="search-form__input"
            placeholder="Search products..."
            aria-label="Search products"
            autocomplete="off"
          />
          <button type="submit" class="search-form__button" aria-label="Submit search">
            <span aria-hidden="true">🔍</span>
          </button>
        </form>
      </div>
    `;
  }

  private renderUtilities(): string {
    return `
      <div class="header__utilities">
        <a href="/wishlist" class="utility-link" aria-label="Wishlist">
          ♡ <span class="utility-badge" data-count="wishlist">0</span>
        </a>
        <a href="/cart" class="utility-link" aria-label="Shopping cart">
          🛒 <span class="utility-badge" data-count="cart">0</span>
        </a>
      </div>
    `;
  }

  private renderMobileToggle(): string {
    return `
      <button class="header__mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="header-nav">
        <span class="hamburger">
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
        </span>
      </button>
    `;
  }

  private attachEventListeners(): void {
    if (!this.container) return;

    const searchForm = this.container.querySelector('.search-form');
    searchForm?.addEventListener('submit', (e) => this.handleSearch(e));

    const mobileToggle = this.container.querySelector('.header__mobile-toggle');
    mobileToggle?.addEventListener('click', () => this.toggleMobileMenu());

    const navLinks = this.container.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => this.handleNavigation(link as HTMLAnchorElement));
    });

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  private handleSearch(e: Event): void {
    e.preventDefault();
    const input = this.container?.querySelector('.search-form__input') as HTMLInputElement;
    if (input?.value) {
      stateManager.setSearchQuery(input.value);
      console.log('Search triggered:', input.value);
      // Dispatch custom event for search
      this.container?.dispatchEvent(
        new CustomEvent('header:search', { detail: { query: input.value } })
      );
    }
  }

  private toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const nav = this.container?.querySelector('.header__nav');
    const toggle = this.container?.querySelector('.header__mobile-toggle') as HTMLButtonElement;
    if (nav && toggle) {
      nav.setAttribute('aria-hidden', String(!this.mobileMenuOpen));
      toggle.setAttribute('aria-expanded', String(this.mobileMenuOpen));
      nav.classList.toggle('header__nav--open');
    }
  }

  private handleNavigation(link: HTMLAnchorElement): void {
    const allLinks = this.container?.querySelectorAll('.nav-link');
    allLinks?.forEach((l) => l.classList.remove('nav-link--active'));
    link.classList.add('nav-link--active');
  }

  private handleKeyboard(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  private subscribeToState(): void {
    stateManager.subscribe((state) => {
      if (this.container) {
        const cartBadge = this.container.querySelector('[data-count="cart"]');
        const wishlistBadge = this.container.querySelector('[data-count="wishlist"]');
        if (cartBadge) cartBadge.textContent = String(state.cartCount);
        if (wishlistBadge) wishlistBadge.textContent = String(state.wishlistCount);
      }
    });
  }

  private initializeAccessibility(): void {
    if (!this.container) return;
    const header = this.container.querySelector('header');
    if (header) {
      header.setAttribute('aria-label', 'Site header');
    }
  }

  public updateCart(count: number): void {
    stateManager.updateCartCount(count);
  }

  public updateWishlist(count: number): void {
    stateManager.updateWishlistCount(count);
  }

  public destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export default Header;
