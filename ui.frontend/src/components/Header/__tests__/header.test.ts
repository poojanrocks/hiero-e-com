import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Header } from '../header';

describe('Header Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-component', 'header');
    container.innerHTML = `
      <button data-mobile-menu-toggle aria-label="Toggle menu">Menu</button>
      <nav>
        <a href="/" data-nav-item>Home</a>
        <a href="/products" data-nav-item>Products</a>
      </nav>
      <button data-search-toggle aria-label="Search">Search</button>
      <button data-cart-toggle aria-label="Cart">Cart</button>
      <button data-wishlist-toggle aria-label="Wishlist">Wishlist</button>
      <div data-search-panel></div>
      <div data-cart-panel></div>
      <div data-wishlist-panel></div>
      <div data-mobile-menu>
        <button data-mobile-menu-close aria-label="Close menu">Close</button>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should initialize header component', () => {
    const header = new Header();
    expect(header).toBeDefined();
  });

  it('should set banner role on header element', () => {
    const header = new Header();
    expect(container.getAttribute('role')).toBe('banner');
  });

  it('should toggle mobile menu on button click', () => {
    const header = new Header();
    const menuBtn = container.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = container.querySelector('[data-mobile-menu]');

    menuBtn?.dispatchEvent(new MouseEvent('click'));
    expect(mobileMenu?.classList.contains('active')).toBe(true);

    menuBtn?.dispatchEvent(new MouseEvent('click'));
    expect(mobileMenu?.classList.contains('active')).toBe(false);
  });

  it('should close mobile menu on Escape key', () => {
    const header = new Header();
    const menuBtn = container.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = container.querySelector('[data-mobile-menu]');

    menuBtn?.dispatchEvent(new MouseEvent('click'));
    expect(mobileMenu?.classList.contains('active')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(mobileMenu?.classList.contains('active')).toBe(false);
  });

  it('should handle navigation item click', () => {
    const header = new Header();
    const navItems = container.querySelectorAll('[data-nav-item]');
    const firstItem = navItems[0];

    firstItem?.dispatchEvent(new MouseEvent('click'));
    expect(firstItem?.classList.contains('active')).toBe(true);

    const secondItem = navItems[1];
    secondItem?.dispatchEvent(new MouseEvent('click'));
    expect(firstItem?.classList.contains('active')).toBe(false);
    expect(secondItem?.classList.contains('active')).toBe(true);
  });

  it('should toggle search panel', () => {
    const header = new Header();
    const searchBtn = container.querySelector('[data-search-toggle]');
    const searchPanel = container.querySelector('[data-search-panel]');

    searchBtn?.dispatchEvent(new MouseEvent('click'));
    expect(searchPanel?.classList.contains('active')).toBe(true);
  });

  it('should toggle cart panel', () => {
    const header = new Header();
    const cartBtn = container.querySelector('[data-cart-toggle]');
    const cartPanel = container.querySelector('[data-cart-panel]');

    cartBtn?.dispatchEvent(new MouseEvent('click'));
    expect(cartPanel?.classList.contains('active')).toBe(true);
  });

  it('should toggle wishlist panel', () => {
    const header = new Header();
    const wishlistBtn = container.querySelector('[data-wishlist-toggle]');
    const wishlistPanel = container.querySelector('[data-wishlist-panel]');

    wishlistBtn?.dispatchEvent(new MouseEvent('click'));
    expect(wishlistPanel?.classList.contains('active')).toBe(true);
  });

  it('should destroy component', () => {
    const header = new Header();
    header.destroy();
    expect(header).toBeDefined();
  });
});
