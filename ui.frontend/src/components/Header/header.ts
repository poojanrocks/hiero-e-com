import { StateManager } from '../../services/state-manager';
import { CartService } from '../../services/cart';
import { SearchService } from '../../services/search';
import { WishlistService } from '../../services/wishlist';
import { KEYS, setAriaExpanded, announceToScreenReader } from '../../utils/accessibility';
import type { NavigationItem } from '../../types';

export class Header {
  private container: HTMLElement | null = null;
  private stateManager: StateManager;
  private cartService: CartService;
  private searchService: SearchService;
  private wishlistService: WishlistService;
  private mobileMenuElement: HTMLElement | null = null;
  private searchElement: HTMLElement | null = null;

  constructor(containerId: string) {
    this.stateManager = StateManager.getInstance();
    this.cartService = new CartService();
    this.searchService = new SearchService();
    this.wishlistService = new WishlistService();
    this.container = document.getElementById(containerId);
  }

  init(): void {
    if (!this.container) {
      console.error('Header container not found');
      return;
    }

    this.setupEventListeners();
    this.setupStateListeners();
    this.updateCartBadge();
    this.updateWishlistBadge();
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    // Mobile menu toggle
    const menuToggle = this.container.querySelector('[data-toggle="mobile-menu"]');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
      menuToggle.addEventListener('keydown', (e) => this.handleMenuToggleKeydown(e as KeyboardEvent));
    }

    // Search toggle
    const searchToggle = this.container.querySelector('[data-toggle="search"]');
    if (searchToggle) {
      searchToggle.addEventListener('click', () => this.toggleSearch());
      searchToggle.addEventListener('keydown', (e) => this.handleSearchToggleKeydown(e as KeyboardEvent));
    }

    // Search input
    const searchInput = this.container.querySelector('[data-search-input]') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = (e.target as HTMLInputElement).value;
        this.searchService.search(term);
      });
      searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e as KeyboardEvent));
    }

    // Cart button
    const cartButton = this.container.querySelector('[data-cart-button]');
    if (cartButton) {
      cartButton.addEventListener('click', () => this.navigateToCart());
    }

    // Wishlist button
    const wishlistButton = this.container.querySelector('[data-wishlist-button]');
    if (wishlistButton) {
      wishlistButton.addEventListener('click', () => this.navigateToWishlist());
    }

    // Navigation links
    const navLinks = this.container.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e as MouseEvent));
    });
  }

  private setupStateListeners(): void {
    this.stateManager.subscribe((state) => {
      if (state.mobileMenuOpen) {
        this.openMobileMenu();
      } else {
        this.closeMobileMenu();
      }
    });
  }

  private toggleMobileMenu(): void {
    const isOpen = this.stateManager.getState().mobileMenuOpen;
    this.stateManager.setMobileMenuOpen(!isOpen);
  }

  private openMobileMenu(): void {
    this.mobileMenuElement = this.container?.querySelector('[data-mobile-menu]') || null;
    if (this.mobileMenuElement) {
      this.mobileMenuElement.classList.add('open');
      this.mobileMenuElement.setAttribute('aria-hidden', 'false');
      const menuToggle = this.container?.querySelector('[data-toggle="mobile-menu"]');
      if (menuToggle) {
        setAriaExpanded(menuToggle as HTMLElement, true);
      }
      announceToScreenReader('Mobile menu opened');
      this.setupMenuKeyboardHandling();
    }
  }

  private closeMobileMenu(): void {
    if (this.mobileMenuElement) {
      this.mobileMenuElement.classList.remove('open');
      this.mobileMenuElement.setAttribute('aria-hidden', 'true');
      const menuToggle = this.container?.querySelector('[data-toggle="mobile-menu"]');
      if (menuToggle) {
        setAriaExpanded(menuToggle as HTMLElement, false);
      }
      announceToScreenReader('Mobile menu closed');
    }
  }

  private toggleSearch(): void {
    const isOpen = this.stateManager.getState().mobileSearchOpen;
    this.stateManager.setMobileSearchOpen(!isOpen);
    this.updateSearchVisibility();
  }

  private updateSearchVisibility(): void {
    this.searchElement = this.container?.querySelector('[data-search-container]') || null;
    if (this.searchElement) {
      const isOpen = this.stateManager.getState().mobileSearchOpen;
      if (isOpen) {
        this.searchElement.classList.add('open');
        const searchInput = this.searchElement.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      } else {
        this.searchElement.classList.remove('open');
      }
    }
  }

  private handleMenuToggleKeydown(event: KeyboardEvent): void {
    if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
      event.preventDefault();
      this.toggleMobileMenu();
    }
  }

  private handleSearchToggleKeydown(event: KeyboardEvent): void {
    if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
      event.preventDefault();
      this.toggleSearch();
    }
  }

  private handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === KEYS.ESCAPE) {
      this.stateManager.setMobileSearchOpen(false);
      this.updateSearchVisibility();
      const searchToggle = this.container?.querySelector('[data-toggle="search"]');
      if (searchToggle) {
        (searchToggle as HTMLElement).focus();
      }
    }
  }

  private setupMenuKeyboardHandling(): void {
    if (!this.mobileMenuElement) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        this.stateManager.setMobileMenuOpen(false);
      }
    };

    this.mobileMenuElement.addEventListener('keydown', handleEscape);
  }

  private handleNavClick(event: MouseEvent): void {
    const link = event.currentTarget as HTMLAnchorElement;
    const isActive = link.classList.contains('active');
    
    // Remove active class from all links
    this.container?.querySelectorAll('[data-nav-link]').forEach(el => {
      el.classList.remove('active');
    });
    
    // Add active class to current link
    link.classList.add('active');
  }

  private navigateToCart(): void {
    // Navigate to cart page - URL will be defined in component template
    const cartUrl = this.container?.querySelector('[data-cart-button]')?.getAttribute('data-cart-url') || '/cart';
    window.location.href = cartUrl;
  }

  private navigateToWishlist(): void {
    // Navigate to wishlist page
    const wishlistUrl = this.container?.querySelector('[data-wishlist-button]')?.getAttribute('data-wishlist-url') || '/wishlist';
    window.location.href = wishlistUrl;
  }

  private updateCartBadge(): void {
    const badge = this.container?.querySelector('[data-cart-badge]');
    if (badge) {
      const count = this.cartService.getItemCount();
      badge.textContent = count.toString();
      badge.setAttribute('aria-label', `${count} items in cart`);
    }
  }

  private updateWishlistBadge(): void {
    const badge = this.container?.querySelector('[data-wishlist-badge]');
    if (badge) {
      const count = this.wishlistService.getCount();
      badge.textContent = count.toString();
      badge.setAttribute('aria-label', `${count} items in wishlist`);
    }
  }
}
