(function() {
  'use strict';

  class Footer {
    constructor() {
      this.footer = document.querySelector('[data-component="footer"]');
      if (!this.footer) return;

      this.socialLinks = this.footer.querySelectorAll('.footer__social-link');
      this.footerLinks = this.footer.querySelectorAll('.footer__link');

      this.init();
    }

    init() {
      this.bindSocialLinks();
      this.bindFooterLinks();
      this.observeScrollPosition();
    }

    bindSocialLinks() {
      this.socialLinks.forEach((link) => {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      });
    }

    bindFooterLinks() {
      this.footerLinks.forEach((link) => {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            // Link will navigate normally on Enter
          }
        });
      });
    }

    observeScrollPosition() {
      // Optional: Add scroll-to-top functionality or other scroll-based behaviors
      // This is a placeholder for future enhancement
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Footer());
  } else {
    new Footer();
  }
})();
