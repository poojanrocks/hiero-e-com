import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import type { HeaderConfig } from '../../../types';

describe('Header Component', () => {
  let container: HTMLDivElement;
  let header: Header;
  const mockConfig: HeaderConfig = {
    logo: '/logo.png',
    logoAlt: 'Test Logo',
    navigation: [
      { label: 'Home', href: '/', active: true },
      { label: 'Shop', href: '/shop', children: [{ label: 'Electronics', href: '/shop/electronics' }] },
      { label: 'About', href: '/about' },
    ],
  };

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-header';
    document.body.appendChild(container);
    header = new Header('test-header', mockConfig);
  });

  afterEach(() => {
    header.destroy();
    document.body.removeChild(container);
  });

  it('should render header with logo', () => {
    const logo = screen.getByAltText('Test Logo');
    expect(logo).toBeTruthy();
    expect((logo as HTMLImageElement).src).toContain('/logo.png');
  });

  it('should render navigation items', () => {
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Shop')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
  });

  it('should have correct active link', () => {
    const homeLink = screen.getByText('Home') as HTMLAnchorElement;
    expect(homeLink.getAttribute('aria-current')).toBe('page');
  });

  it('should render search form', () => {
    const searchInput = screen.getByPlaceholderText('Search products..') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.type).toBe('search');
  });

  it('should render cart and wishlist utilities', () => {
    const cartLink = screen.getByLabelText('Shopping cart');
    const wishlistLink = screen.getByLabelText('Wishlist');
    expect(cartLink).toBeTruthy();
    expect(wishlistLink).toBeTruthy();
  });

  it('should render mobile menu toggle', () => {
    const toggle = screen.getByLabelText('Toggle mobile menu') as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle mobile menu on button click', () => {
    const toggle = screen.getByLabelText('Toggle mobile menu') as HTMLButtonElement;
    const nav = document.querySelector('.header__nav') as HTMLElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('header__nav--open')).toBe(true);
  });

  it('should close mobile menu on Escape key', () => {
    const toggle = screen.getByLabelText('Toggle mobile menu') as HTMLButtonElement;
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should handle search submission', async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText('Search products..');
    const searchForm = screen.getByRole('search') as HTMLFormElement;

    await user.type(searchInput, 'laptop');
    await user.click(screen.getByLabelText('Submit search'));

    expect((searchInput as HTMLInputElement).value).toBe('laptop');
  });

  it('should update cart count', () => {
    header.updateCart(5);
    const cartBadge = screen.getByText('5');
    expect(cartBadge).toBeTruthy();
  });

  it('should update wishlist count', () => {
    header.updateWishlist(3);
    const badges = screen.getAllByText('3');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should have proper ARIA labels', () => {
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeTruthy();
    expect(screen.getByRole('search')).toBeTruthy();
  });

  it('should highlight active navigation link on click', async () => {
    const shopLink = screen.getByText('Shop') as HTMLAnchorElement;
    fireEvent.click(shopLink);
    expect(shopLink.classList.contains('nav-link--active')).toBe(true);
  });
});
