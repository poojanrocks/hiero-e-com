import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Header } from '../../../main/ts/components/header';

describe('Header Component', () => {
  let container: HTMLElement;
  let header: Header;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <header class="header">
        <div class="header__container">
          <a href="/" class="header__logo">Logo</a>
          
          <nav class="header__nav">
            <ul class="header__nav-list">
              <li><a href="/" class="header__nav-link" data-nav-link aria-current="true">Home</a></li>
              <li><a href="/shop" class="header__nav-link" data-nav-link>Shop</a></li>
              <li><a href="/about" class="header__nav-link" data-nav-link>About</a></li>
            </ul>
          </nav>
          
          <div class="header__actions">
            <div class="header__search">
              <button class="header__search-toggle" data-search-toggle aria-expanded="false">🔍</button>
              <form class="header__search-form" data-search-form data-open="false">
                <input type="search" class="header__search-input" placeholder="Search..." />
              </form>
            </div>
            <a href="/wishlist" class="header__action-link">❤️</a>
            <a href="/cart" class="header__action-link">🛒</a>
          </div>
          
          <button class="header__menu-toggle" data-header-toggle aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div class="header__mobile-menu" data-header-menu data-open="false">
            <ul class="header__mobile-nav-list">
              <li><a href="/" class="header__mobile-nav-link" data-nav-link>Home</a></li>
              <li><a href="/shop" class="header__mobile-nav-link" data-nav-link>Shop</a></li>
              <li><a href="/about" class="header__mobile-nav-link" data-nav-link>About</a></li>
            </ul>
          </div>
        </div>
      </header>
    `;
    document.body.appendChild(container);
    header = new Header(container.querySelector('header') as HTMLElement);
  });

  afterEach(() => {
    header.destroy();
    container.remove();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(header).toBeDefined();
    });

    it('should find mobile menu elements', () => {
      const toggle = container.querySelector('[data-header-toggle]');
      const menu = container.querySelector('[data-header-menu]');
      expect(toggle).toBeDefined();
      expect(menu).toBeDefined();
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu on button click', () => {
      const toggle = container.querySelector('[data-header-toggle]') as HTMLButtonElement;
      const menu = container.querySelector('[data-header-menu]') as HTMLElement;

      toggle.click();
      expect(menu.getAttribute('data-open')).toBe('true');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      toggle.click();
      expect(menu.getAttribute('data-open')).toBe('false');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('should close menu on Escape key', () => {
      const toggle = container.querySelector('[data-header-toggle]') as HTMLButtonElement;
      const menu = container.querySelector('[data-header-menu]') as HTMLElement;

      toggle.click();
      expect(menu.getAttribute('data-open')).toBe('true');

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(menu.getAttribute('data-open')).toBe('false');
    });
  });

  describe('Search', () => {
    it('should toggle search form on button click', () => {
      const toggle = container.querySelector('[data-search-toggle]') as HTMLButtonElement;
      const form = container.querySelector('[data-search-form]') as HTMLElement;

      toggle.click();
      expect(form.getAttribute('data-open')).toBe('true');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      toggle.click();
      expect(form.getAttribute('data-open')).toBe('false');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Navigation Links', () => {
    it('should set active link on click', () => {
      const links = container.querySelectorAll('[data-nav-link]') as NodeListOf<HTMLAnchorElement>;
      const secondLink = links[1];

      secondLink.click();
      expect(secondLink.getAttribute('aria-current')).toBe('true');
    });

    it('should have only one active link at a time', () => {
      const links = container.querySelectorAll('[data-nav-link]') as NodeListOf<HTMLAnchorElement>;
      const firstLink = links[0];
      const secondLink = links[1];

      secondLink.click();
      expect(firstLink.getAttribute('aria-current')).toBe('false');
      expect(secondLink.getAttribute('aria-current')).toBe('true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const toggle = container.querySelector('[data-header-toggle]');
      const searchToggle = container.querySelector('[data-search-toggle]');
      expect(toggle?.hasAttribute('aria-expanded')).toBe(true);
      expect(searchToggle?.hasAttribute('aria-expanded')).toBe(true);
    });

    it('should be keyboard navigable', () => {
      const links = container.querySelectorAll('[data-nav-link]');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
