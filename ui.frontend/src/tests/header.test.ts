import { describe, it, expect, beforeEach } from 'vitest';
import Header from '../js/header';

describe('Header', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header data-component="header" role="banner">
        <div class="header__top">
          <div class="header__logo"><img src="logo.png" alt="Logo"></div>
          <div class="header__middle">
            <form class="header__search" data-role="search-form">
              <input type="search" name="search" placeholder="Search products...">
              <button type="submit">Search</button>
            </form>
          </div>
          <div class="header__actions">
            <button data-role="cart-link" class="header__action-button">
              Cart <span data-role="cart-count">0</span>
            </button>
            <button data-role="wishlist-link" class="header__action-button">
              Wishlist <span data-role="wishlist-count">0</span>
            </button>
          </div>
          <button data-toggle="mobile-menu" class="header__action-button">Menu</button>
        </div>
        <nav class="header__nav" data-role="navigation" aria-label="Main navigation">
          <div class="header__nav-item"><a href="/">Home</a></div>
          <div class="header__nav-item"><a href="/products">Products</a></div>
          <div class="header__nav-item"><a href="/about">About</a></div>
        </nav>
      </header>
    `;
  });

  it('should initialize header component', () => {
    const header = new Header('[data-component="header"]');
    expect(header).toBeDefined();
  });

  it('should display cart count', () => {
    new Header('[data-component="header"]');
    const badge = document.querySelector('[data-role="cart-count"]');
    expect(badge?.textContent).toBe('0');
  });

  it('should display wishlist count', () => {
    new Header('[data-component="header"]');
    const badge = document.querySelector('[data-role="wishlist-count"]');
    expect(badge?.textContent).toBe('0');
  });

  it('should toggle mobile menu on button click', () => {
    new Header('[data-component="header"]');
    const button = document.querySelector('[data-toggle="mobile-menu"]');
    const headerEl = document.querySelector('[data-component="header"]');
    
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(headerEl?.classList.contains('mobile-menu-open')).toBe(true);
    
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(headerEl?.classList.contains('mobile-menu-open')).toBe(false);
  });

  it('should close mobile menu on Escape key', () => {
    new Header('[data-component="header"]');
    const button = document.querySelector('[data-toggle="mobile-menu"]');
    const headerEl = document.querySelector('[data-component="header"]');
    
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(headerEl?.classList.contains('mobile-menu-open')).toBe(true);
    
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(headerEl?.classList.contains('mobile-menu-open')).toBe(false);
  });
});