(function() {
  'use strict';

  class Header {
    constructor() {
      this.header = document.querySelector('[data-component="header"]');
      if (!this.header) return;

      this.menuToggle = this.header.querySelector('.header__menu-toggle');
      this.nav = this.header.querySelector('.header__nav');
      this.searchForm = this.header.querySelector('.header__search-form');
      this.wishlistLink = this.header.querySelector('.header__wishlist');
      this.cartLink = this.header.querySelector('.header__cart');
      this.navLinks = this.header.querySelectorAll('.header__nav-link');

      this.init();
    }

    init() {
      this.bindMenuToggle();
      this.bindNavigation();
      this.bindSearch();
      this.updateCartCount();
      this.updateWishlistCount();
    }

    bindMenuToggle() {
      if (!this.menuToggle) return;

      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      this.menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleMenu();
        }
      });
    }

    toggleMenu() {
      const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
      this.menuToggle.setAttribute('aria-expanded', !isExpanded);
    }

    bindNavigation() {
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });

        link.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeMenu();
            this.menuToggle.focus();
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.menuToggle.getAttribute('aria-expanded') === 'true') {
          this.closeMenu();
          this.menuToggle.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (!this.header.contains(e.target) && this.menuToggle.getAttribute('aria-expanded') === 'true') {
          this.closeMenu();
        }
      });
    }

    closeMenu() {
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    bindSearch() {
      if (!this.searchForm) return;

      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = this.searchForm.querySelector('.header__search-input');
        const query = searchInput.value.trim();

        if (query.length > 0) {
          this.performSearch(query);
        }
      });
    }

    performSearch(query) {
      // TODO: Implement search functionality
      console.log('Search query:', query);
      // This would typically redirect to search results page or trigger API call
    }

    updateCartCount() {
      // TODO: Fetch cart count from API or state management
      const cartCount = 0;
      if (this.cartLink) {
        this.cartLink.setAttribute('data-count', cartCount);
        this.cartLink.setAttribute('aria-label', `Shopping cart (${cartCount} items)`);
      }
    }

    updateWishlistCount() {
      // TODO: Fetch wishlist count from API or state management
      const wishlistCount = 0;
      if (this.wishlistLink) {
        this.wishlistLink.setAttribute('data-count', wishlistCount);
        this.wishlistLink.setAttribute('aria-label', `Wishlist (${wishlistCount} items)`);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Header());
  } else {
    new Header();
  }
})();
