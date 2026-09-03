import '../../../styles/components/header.scss';

interface HeaderConfig {
  selector?: string;
}

export class Header {
  private element: HTMLElement | null;

  constructor(config: HeaderConfig = {}) {
    this.element = document.querySelector(config.selector || '[data-component="header"]');
    if (this.element) {
      this.init();
    }
  }

  private init(): void {
    this.setupNavigation();
    this.setupSearch();
    this.setupCart();
    this.setupWishlist();
    this.setupMobileMenu();
    this.setupAccessibility();
  }

  private setupNavigation(): void {
    const navItems = this.element?.querySelectorAll('[data-nav-item]');
    navItems?.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavClick(e));
      item.addEventListener('keydown', (e) => this.handleNavKeydown(e));
    });
  }

  private setupSearch(): void {
    const searchBtn = this.element?.querySelector('[data-search-toggle]');
    searchBtn?.addEventListener('click', () => this.toggleSearch());
    searchBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleSearch();
      }
    });
  }

  private setupCart(): void {
    const cartBtn = this.element?.querySelector('[data-cart-toggle]');
    cartBtn?.addEventListener('click', () => this.toggleCart());
    cartBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCart();
      }
    });
  }

  private setupWishlist(): void {
    const wishlistBtn = this.element?.querySelector('[data-wishlist-toggle]');
    wishlistBtn?.addEventListener('click', () => this.toggleWishlist());
    wishlistBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleWishlist();
      }
    });
  }

  private setupMobileMenu(): void {
    const menuBtn = this.element?.querySelector('[data-mobile-menu-toggle]');
    menuBtn?.addEventListener('click', () => this.toggleMobileMenu());
    menuBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMobileMenu();
      }
    });

    const closeBtn = this.element?.querySelector('[data-mobile-menu-close]');
    closeBtn?.addEventListener('click', () => this.closeMobileMenu());
  }

  private setupAccessibility(): void {
    this.element?.setAttribute('role', 'banner');
    const closeButton = this.element?.querySelector('button');
    if (closeButton) {
      closeButton.setAttribute('aria-label', 'Close menu');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscape();
      }
    });
  }

  private handleNavClick(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    this.element?.querySelectorAll('[data-nav-item]').forEach(item => {
      item.classList.remove('active');
    });
    target.classList.add('active');
  }

  private handleNavKeydown(e: KeyboardEvent): void {
    const target = e.currentTarget as HTMLElement;
    let nextItem: Element | null = null;

    if (e.key === 'ArrowRight') {
      nextItem = target.nextElementSibling;
    } else if (e.key === 'ArrowLeft') {
      nextItem = target.previousElementSibling;
    }

    if (nextItem instanceof HTMLElement) {
      nextItem.focus();
    }
  }

  private toggleSearch(): void {
    const searchPanel = this.element?.querySelector('[data-search-panel]');
    searchPanel?.classList.toggle('active');
  }

  private toggleCart(): void {
    const cartPanel = this.element?.querySelector('[data-cart-panel]');
    cartPanel?.classList.toggle('active');
  }

  private toggleWishlist(): void {
    const wishlistPanel = this.element?.querySelector('[data-wishlist-panel]');
    wishlistPanel?.classList.toggle('active');
  }

  private toggleMobileMenu(): void {
    const mobileMenu = this.element?.querySelector('[data-mobile-menu]');
    mobileMenu?.classList.toggle('active');
    this.element?.setAttribute('aria-expanded', 'true');
  }

  private closeMobileMenu(): void {
    const mobileMenu = this.element?.querySelector('[data-mobile-menu]');
    mobileMenu?.classList.remove('active');
    this.element?.setAttribute('aria-expanded', 'false');
  }

  private handleEscape(): void {
    this.closeMobileMenu();
  }

  public destroy(): void {
    if (this.element) {
      this.element = null;
    }
  }
}
