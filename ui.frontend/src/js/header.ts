import './styles/header.scss';
import { HeaderConfig } from './types';
import cartService from './services/cartService';
import wishlistService from './services/wishlistService';

class Header {
  private config: HeaderConfig;
  private element: HTMLElement | null;
  private mobileMenuOpen = false;

  constructor(selector: string, config?: HeaderConfig) {
    this.element = document.querySelector(selector);
    this.config = config || {};
    if (this.element) {
      this.init();
    }
  }

  private init(): void {
    if (!this.element) return;
    this.setupEventListeners();
    this.updateCartCount();
    this.updateWishlistCount();
    this.subscribeToUpdates();
  }

  private setupEventListeners(): void {
    if (!this.element) return;

    const mobileMenuToggle = this.element.querySelector('[data-toggle="mobile-menu"]');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    const navigationLinks = this.element.querySelectorAll('[data-role="navigation"] a');
    navigationLinks.forEach(link => {
      link.addEventListener('click', () => this.onNavigationClick());
    });

    const searchForm = this.element.querySelector('[data-role="search-form"]');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.onSearch(e));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
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
    if (!this.element) return;
    this.mobileMenuOpen = true;
    this.element.classList.add('mobile-menu-open');
    this.element.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  private closeMobileMenu(): void {
    if (!this.element) return;
    this.mobileMenuOpen = false;
    this.element.classList.remove('mobile-menu-open');
    this.element.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  private onNavigationClick(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private onSearch(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('[name="search"]') as HTMLInputElement;
    if (input && input.value.trim()) {
      const searchEvent = new CustomEvent('hiero:search', {
        detail: { term: input.value }
      });
      document.dispatchEvent(searchEvent);
    }
  }

  private updateCartCount(): void {
    const cartBadge = this.element?.querySelector('[data-role="cart-count"]');
    if (cartBadge) {
      const count = cartService.getItemCount();
      cartBadge.textContent = String(count);
      cartBadge.setAttribute('aria-label', `${count} items in cart`);
    }
  }

  private updateWishlistCount(): void {
    const wishlistBadge = this.element?.querySelector('[data-role="wishlist-count"]');
    if (wishlistBadge) {
      const count = wishlistService.getCount();
      wishlistBadge.textContent = String(count);
      wishlistBadge.setAttribute('aria-label', `${count} items in wishlist`);
    }
  }

  private subscribeToUpdates(): void {
    cartService.subscribe(() => this.updateCartCount());
    wishlistService.subscribe(() => this.updateWishlistCount());
  }

  public destroy(): void {
    if (!this.element) return;
    this.closeMobileMenu();
    this.element = null;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Header('[data-component="header"]');
  });
} else {
  new Header('[data-component="header"]');
}

export default Header;