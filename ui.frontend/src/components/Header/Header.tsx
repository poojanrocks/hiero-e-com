import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';
import { NavigationService } from '../../services/NavigationService';
import { SearchService } from '../../services/SearchService';
import { CartService } from '../../services/CartService';
import { WishlistService } from '../../services/WishlistService';

interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  navigationItems?: any[];
  searchPlaceholder?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl = '/logo.svg',
  logoAlt = 'Logo',
  navigationItems = [],
  searchPlaceholder = 'Search products...'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const unsubscribeCart = CartService.subscribe((items) => {
      setCartCount(items.length);
    });
    const unsubscribeWishlist = WishlistService.subscribe((items) => {
      setWishlistCount(items.length);
    });
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    SearchService.search(searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      e.preventDefault();
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <div className="header__logo">
          <a href="/" aria-label="Home">
            <img src={logoUrl} alt={logoAlt} />
          </a>
        </div>

        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navigationItems.map((item, index) => (
              <li key={index} className="header__nav-item">
                <a href={item.url} className="header__nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            className="header__action-btn header__search-btn"
            onClick={handleSearchToggle}
            aria-label="Search"
            aria-expanded={isSearchOpen}
            aria-controls="search-form"
          >
            <span className="header__icon">🔍</span>
          </button>

          <a
            href="/wishlist"
            className="header__action-btn header__wishlist-btn"
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <span className="header__icon">♡</span>
            {wishlistCount > 0 && (
              <span className="header__badge">{wishlistCount}</span>
            )}
          </a>

          <a
            href="/cart"
            className="header__action-btn header__cart-btn"
            aria-label={`Cart (${cartCount} items)`}
          >
            <span className="header__icon">🛒</span>
            {cartCount > 0 && (
              <span className="header__badge">{cartCount}</span>
            )}
          </a>

          <button
            className="header__menu-toggle"
            onClick={handleMenuToggle}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="header__hamburger"></span>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="header__search" ref={searchRef}>
          <form id="search-form" onSubmit={handleSearch} className="header__search-form">
            <input
              type="text"
              className="header__search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              aria-label="Search query"
            />
            <button type="submit" className="header__search-submit" aria-label="Submit search">
              Search
            </button>
          </form>
        </div>
      )}

      {isMenuOpen && (
        <nav id="mobile-menu" className="header__mobile-menu" ref={menuRef} role="navigation" aria-label="Mobile navigation">
          <ul className="header__mobile-menu-list">
            {navigationItems.map((item, index) => (
              <li key={index} className="header__mobile-menu-item">
                <a href={item.url} className="header__mobile-menu-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
