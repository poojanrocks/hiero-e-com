import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { stateManager } from './services/StateManager';
import type { HeaderConfig, FooterConfig } from './types';

// Initialize header and footer on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize header
  const headerElement = document.querySelector('[data-component="header"]');
  if (headerElement) {
    const config = (headerElement.parentElement as any)?.dataset?.headerConfig;
    const headerConfig: HeaderConfig = config
      ? JSON.parse(config)
      : {
          navigation: [
            { label: 'Home', href: '/', active: true },
            { label: 'Shop', href: '/shop' },
            { label: 'About', href: '/about' },
          ],
        };
    new Header('app-header', headerConfig);
  }

  // Initialize footer
  const footerElement = document.querySelector('[data-component="footer"]');
  if (footerElement) {
    const config = (footerElement.parentElement as any)?.dataset?.footerConfig;
    const footerConfig: FooterConfig = config
      ? JSON.parse(config)
      : {
          companyName: 'Hiero eCommerce',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        };
    new Footer('app-footer', footerConfig);
  }
});

// Export for external use
export { Header, Footer, stateManager };
export type { HeaderConfig, FooterConfig };
