import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useSearch } from '../../hooks/useSearch';
import { useWishlist } from '../../hooks/useWishlist';
import Navigation from '../Navigation/Navigation';
import Search from '../Search/Search';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import '../Header/Header.scss';

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  navigationItems?: Array<{ label: string; url: string; active?: boolean }>;
  homeUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = '/images/logo.png',
  logoAlt = 'Store Logo',
  navigationItems = [],
  homeUrl = '/'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();
  const { onSearch } = useSearch();
  const { wishlistCount } = useWishlist();

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  }, []);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <div className="header__logo">
          <a href={homeUrl} className="header__logo-link" aria-label="Home">
            <img src={logoSrc} alt={logoAlt} className="header__logo-image" />
          </a>
        </div>

        <button
          className="header__menu-toggle"
          onClick={handleMenuToggle}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="header__menu-icon"></span>
          <span className="header__menu-icon"></span>
          <span className="header__menu-icon"></span>
        </button>

        <nav
          className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}
          ref={menuRef}
          id="mobile-menu"
          role="navigation"
          aria-label="Main navigation"
        >
          <Navigation items={navigationItems} onItemClick={handleMenuClose} />
        </nav>

        <div className="header__actions">
          <button
            className="header__search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-expanded={searchOpen}
            aria-label="Toggle search"
          >
            <svg className="icon icon--search" aria-hidden="true">
              <use href="#icon-search"></use>
            </svg>
          </button>

          <Wishlist count={wishlistCount} />
          <Cart count={cartCount} />
        </div>
      </div>

      {searchOpen && (
        <div className="header__search-panel" role="search">
          <Search onClose={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;