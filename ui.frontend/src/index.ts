import './styles/global.scss';
import './styles/header.scss';
import './styles/footer.scss';
import './styles/patterns.scss';
import './styles/responsive.scss';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { StateManager } from './services/state-manager';
import { CartService } from './services/cart';
import { SearchService } from './services/search';
import { WishlistService } from './services/wishlist';

// Initialize global state manager
const stateManager = StateManager.getInstance();

// Initialize services
const cartService = new CartService();
const searchService = new SearchService();
const wishlistService = new WishlistService();

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).HieroEcom = {
    Header,
    Footer,
    StateManager,
    CartService,
    SearchService,
    WishlistService,
    stateManager,
    cartService,
    searchService,
    wishlistService
  };
}

export {
  Header,
  Footer,
  StateManager,
  CartService,
  SearchService,
  WishlistService
};
