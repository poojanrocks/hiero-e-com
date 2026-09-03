/**
 * Header Component
 * Manages header navigation, search, cart, and wishlist functionality
 */
import { initializeNavigation } from '@services/navigation';
import { initializeSearch } from '@services/search';
import { initializeCart } from '@services/cart';
import { initializeWishlist } from '@services/wishlist';

interface HeaderConfig {
  rootSelector: string;
  breakpoint?: number;
}

class Header {
  private root: HTMLElement | null;
  private config: HeaderConfig;
  private mobileMenuOpen = false;

  constructor(config: HeaderConfig) {
    this.config = { breakpoint: 768, ...config };
    this.root = document.querySelector(this.config.rootSelector);
    if (!this.root) {
      console.error(`Header: Element not found for selector ${config.rootSelector}`);
      return;
    }
    this.init();
  }

  private init(): void {
    if (!this.root) return;

    this.setupEventListeners();
    this.handleResponsive();
    window.addEventListener('resize', () => this.handleResponsive());

    initializeNavigation(this.root);
    initializeSearch(this.root);
    initializeCart(this.root);
    initializeWishlist(this.root);
  }

  private setupEventListeners(): void {
    if (!this.root) return;

    const menuToggle = this.root.querySelector('[data-header-menu-toggle]') as HTMLElement;
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    const closeButton = this.root.querySelector('[data-header-menu-close]') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', () => this.closeMobileMenu());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
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
    if (!this.root) return;
    this.mobileMenuOpen = true;
    this.root.setAttribute('data-mobile-menu-open', 'true');
    document.body.style.overflow = 'hidden';
  }

  private closeMobileMenu(): void {
    if (!this.root) return;
    this.mobileMenuOpen = false;
    this.root.setAttribute('data-mobile-menu-open', 'false');
    document.body.style.overflow = '';
  }

  private handleResponsive(): void {
    if (window.innerWidth >= this.config.breakpoint!) {
      this.closeMobileMenu();
    }
  }

  public destroy(): void {
    if (!this.root) return;
    this.closeMobileMenu();
  }
}

// Auto-initialize if data attribute is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('[data-header-component]');
    headers.forEach((el) => {
      new Header({ rootSelector: `[data-header-component="${(el as HTMLElement).getAttribute('data-header-component')}"]` });
    });
  });
} else {
  const headers = document.querySelectorAll('[data-header-component]');
  headers.forEach((el) => {
    new Header({ rootSelector: `[data-header-component="${(el as HTMLElement).getAttribute('data-header-component')}"]` });
  });
}

export { Header };