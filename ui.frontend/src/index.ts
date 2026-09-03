import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { stateManager } from './services/state-manager';
import { cartService } from './services/cart-service';
import { wishlistService } from './services/wishlist-service';
import { searchService } from './services/search-service';

// Export all services and components for external use
export {
  Header,
  Footer,
  stateManager,
  cartService,
  wishlistService,
  searchService,
};

// Auto-initialize header and footer components if DOM elements exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
  initializeComponents();
}

function initializeComponents(): void {
  const headerElement = document.querySelector('.hiero-header-wrapper') as HTMLElement;
  if (headerElement) {
    new Header(headerElement);
  }

  const footerElement = document.querySelector('.hiero-footer-wrapper') as HTMLElement;
  if (footerElement) {
    new Footer(footerElement);
  }
}
