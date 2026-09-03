import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

jest.mock('../../services/NavigationService');
jest.mock('../../services/SearchService');
jest.mock('../../services/CartService');
jest.mock('../../services/WishlistService');

describe('Header Component', () => {
  const mockNavigationItems = [
    { url: '/', label: 'Home' },
    { url: '/products', label: 'Products' },
    { url: '/about', label: 'About' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with logo', () => {
    render(<Header logoUrl="/logo.svg" logoAlt="Test Logo" />);
    const logo = screen.getByAltText('Test Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  test('renders navigation items', () => {
    render(<Header navigationItems={mockNavigationItems} />);
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('renders search button with correct aria attributes', () => {
    render(<Header />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens search panel when search button is clicked', () => {
    render(<Header />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(searchButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  test('renders menu button on mobile', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens mobile menu when menu button is clicked', () => {
    render(<Header navigationItems={mockNavigationItems} />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
  });

  test('closes menu when Escape key is pressed', () => {
    render(<Header navigationItems={mockNavigationItems} />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('renders header as banner landmark', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders cart button with correct aria label', () => {
    render(<Header />);
    const cartButton = screen.getByLabelText(/cart/i);
    expect(cartButton).toBeInTheDocument();
  });

  test('renders wishlist button with correct aria label', () => {
    render(<Header />);
    const wishlistButton = screen.getByLabelText(/wishlist/i);
    expect(wishlistButton).toBeInTheDocument();
  });

  test('renders navigation with correct role', () => {
    render(<Header navigationItems={mockNavigationItems} />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });
});
