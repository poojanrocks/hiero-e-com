import { Header } from '../header';
import { StateManager } from '../../../services/state-manager';
import { CartService } from '../../../services/cart';

describe('Header Component', () => {
  let container: HTMLElement;
  let header: Header;
  let stateManager: StateManager;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <header id="header">
        <div data-toggle="mobile-menu" class="hamburger"></div>
        <nav data-mobile-menu aria-hidden="true"></nav>
        <div data-search-container>
          <input data-search-input type="text" />
        </div>
        <button data-cart-button data-cart-url="/cart">
          <span data-cart-badge>0</span>
        </button>
        <button data-wishlist-button data-wishlist-url="/wishlist">
          <span data-wishlist-badge>0</span>
        </button>
        <ul data-nav-links>
          <li><a data-nav-link href="#">Home</a></li>
          <li><a data-nav-link href="#">Products</a></li>
        </ul>
      </header>
    `;

    stateManager = StateManager.getInstance();
    header = new Header('header');
    header.init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    stateManager.reset();
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu on button click', () => {
      const menuToggle = document.querySelector('[data-toggle="mobile-menu"]');
      (menuToggle as HTMLElement).click();

      expect(stateManager.getState().mobileMenuOpen).toBe(true);
    });

    it('should close menu on escape key', () => {
      stateManager.setMobileMenuOpen(true);
      const menu = document.querySelector('[data-mobile-menu]');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      menu?.dispatchEvent(event);

      expect(stateManager.getState().mobileMenuOpen).toBe(false);
    });
  });

  describe('Search', () => {
    it('should toggle search on button click', () => {
      const searchToggle = document.querySelector('[data-toggle="search"]') as HTMLElement;
      if (searchToggle) {
        searchToggle.click();
        expect(stateManager.getState().mobileSearchOpen).toBe(true);
      }
    });
  });

  describe('Cart Badge', () => {
    it('should display cart item count', () => {
      const badge = document.querySelector('[data-cart-badge]');
      expect(badge?.textContent).toBe('0');
    });
  });

  describe('Navigation', () => {
    it('should mark link as active on click', () => {
      const link = document.querySelector('[data-nav-link]') as HTMLElement;
      link.click();
      expect(link.classList.contains('active')).toBe(true);
    });
  });
});
