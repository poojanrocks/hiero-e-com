import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import * as cartHook from '../../hooks/useCart';
import * as searchHook from '../../hooks/useSearch';
import * as wishlistHook from '../../hooks/useWishlist';

jest.mock('../../hooks/useCart');
jest.mock('../../hooks/useSearch');
jest.mock('../../hooks/useWishlist');

const mockUseCart = cartHook.useCart as jest.MockedFunction<typeof cartHook.useCart>;
const mockUseSearch = searchHook.useSearch as jest.MockedFunction<typeof searchHook.useSearch>;
const mockUseWishlist = wishlistHook.useWishlist as jest.MockedFunction<typeof wishlistHook.useWishlist>;

describe('Header Component', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      cartCount: 0,
      isLoading: false,
      error: null,
      addToCart: jest.fn(),
      removeFromCart: jest.fn()
    });

    mockUseSearch.mockReturnValue({
      onSearch: jest.fn()
    });

    mockUseWishlist.mockReturnValue({
      wishlistCount: 0,
      isLoading: false,
      error: null,
      addToWishlist: jest.fn(),
      removeFromWishlist: jest.fn()
    });
  });

  it('renders header with logo', () => {
    render(
      <Header
        logoSrc="/logo.png"
        logoAlt="Store Logo"
        homeUrl="/"
      />
    );

    const logo = screen.getByAltText('Store Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('renders navigation items', () => {
    const items = [
      { label: 'Home', url: '/', active: true },
      { label: 'Products', url: '/products' },
      { label: 'About', url: '/about' }
    ];

    render(<Header navigationItems={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('displays cart count badge', () => {
    mockUseCart.mockReturnValue({
      cartCount: 5,
      isLoading: false,
      error: null,
      addToCart: jest.fn(),
      removeFromCart: jest.fn()
    });

    render(<Header />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', async () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('closes mobile menu on Escape key', async () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('toggles search panel', async () => {
    render(<Header />);

    const searchButton = screen.getByLabelText('Toggle search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(searchButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
  });
});
