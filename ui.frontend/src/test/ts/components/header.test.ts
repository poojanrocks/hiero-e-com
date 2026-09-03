import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HeaderComponent } from '@components/header';

describe('HeaderComponent', () => {
  let container: HTMLElement;
  let header: HeaderComponent;

  beforeEach(() => {
    document.body.innerHTML = `
      <header class="header" data-testid="header">
        <a href="/" class="header__logo">Logo</a>
        <nav class="header__nav" data-mobile-menu aria-hidden="true">
          <a href="/products" class="header__nav-item" data-nav-item>Products</a>
          <a href="/about" class="header__nav-item" data-nav-item>About</a>
        </nav>
        <div class="header__actions">
          <button class="header__action-btn" data-search-toggle>Search</button>
          <button class="header__action-btn" data-mobile-menu-toggle>Menu</button>
          <a href="/cart">
            Cart <span class="header__badge" data-cart-count></span>
          </a>
          <a href="/wishlist">
            Wishlist <span class="header__badge" data-wishlist-count></span>
          </a>
        </div>
        <div class="header__search-box" data-search-box aria-hidden="true">
          <input type="text" class="header__search-input" data-search-input placeholder="Search" />
          <div class="header__search-results" data-search-results></div>
        </div>
      </header>
    `;
    container = document.querySelector('[data-testid="header"]')!;
    header = new HeaderComponent('[data-testid="header"]');
  });

  afterEach(() => {
    header.destroy();
    document.body.innerHTML = '';
  });

  it('should initialize successfully', () => {
    expect(header).toBeDefined();
    expect(container).toBeDefined();
  });

  it('should toggle mobile menu on button click', () => {
    const toggle = container.querySelector('[data-mobile-menu-toggle]') as HTMLElement;
    const menu = container.querySelector('[data-mobile-menu]') as HTMLElement;

    expect(menu.classList.contains('visible')).toBe(false);

    toggle.click();
    expect(menu.classList.contains('visible')).toBe(true);

    toggle.click();
    expect(menu.classList.contains('visible')).toBe(false);
  });

  it('should toggle search box on button click', () => {
    const toggle = container.querySelector('[data-search-toggle]') as HTMLElement;
    const searchBox = container.querySelector('[data-search-box]') as HTMLElement;

    expect(searchBox.classList.contains('visible')).toBe(false);

    toggle.click();
    expect(searchBox.classList.contains('visible')).toBe(true);

    toggle.click();
    expect(searchBox.classList.contains('visible')).toBe(false);
  });

  it('should close menu when clicking outside', () => {
    const toggle = container.querySelector('[data-mobile-menu-toggle]') as HTMLElement;
    const menu = container.querySelector('[data-mobile-menu]') as HTMLElement;

    toggle.click();
    expect(menu.classList.contains('visible')).toBe(true);

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(menu.classList.contains('visible')).toBe(false);
  });

  it('should have keyboard accessible navigation items', () => {
    const navItems = container.querySelectorAll('[data-nav-item]');
    expect(navItems.length).toBeGreaterThan(0);

    navItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });
});
