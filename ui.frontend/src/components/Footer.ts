export interface FooterConfig {
  copyright?: string;
  year?: number;
  companyName?: string;
}

export class Footer {
  private container: HTMLElement;
  private config: FooterConfig;

  constructor(container: HTMLElement, config: FooterConfig = {}) {
    this.container = container;
    this.config = {
      year: new Date().getFullYear(),
      companyName: 'Hiero Store',
      ...config,
    };
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const html = `
      <footer class="hiero-footer" role="contentinfo">
        <div class="hiero-footer__container">
          <div class="hiero-footer__content">
            <div class="hiero-footer__section">
              <h3 class="hiero-footer__heading">Shop</h3>
              <ul class="hiero-footer__list">
                <li><a href="/products" class="hiero-footer__link">All Products</a></li>
                <li><a href="/sale" class="hiero-footer__link">Sale</a></li>
                <li><a href="/new" class="hiero-footer__link">New Arrivals</a></li>
              </ul>
            </div>

            <div class="hiero-footer__section">
              <h3 class="hiero-footer__heading">Support</h3>
              <ul class="hiero-footer__list">
                <li><a href="/help" class="hiero-footer__link">Help Center</a></li>
                <li><a href="/contact" class="hiero-footer__link">Contact Us</a></li>
                <li><a href="/faq" class="hiero-footer__link">FAQ</a></li>
              </ul>
            </div>

            <div class="hiero-footer__section">
              <h3 class="hiero-footer__heading">Company</h3>
              <ul class="hiero-footer__list">
                <li><a href="/about" class="hiero-footer__link">About Us</a></li>
                <li><a href="/careers" class="hiero-footer__link">Careers</a></li>
                <li><a href="/press" class="hiero-footer__link">Press</a></li>
              </ul>
            </div>

            <div class="hiero-footer__section">
              <h3 class="hiero-footer__heading">Legal</h3>
              <ul class="hiero-footer__list">
                <li><a href="/privacy" class="hiero-footer__link">Privacy Policy</a></li>
                <li><a href="/terms" class="hiero-footer__link">Terms of Service</a></li>
                <li><a href="/cookies" class="hiero-footer__link">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div class="hiero-footer__bottom">
            <div class="hiero-footer__social">
              <a href="#" class="hiero-footer__social-link" aria-label="Facebook">f</a>
              <a href="#" class="hiero-footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" class="hiero-footer__social-link" aria-label="Instagram">📷</a>
            </div>
            <p class="hiero-footer__copyright">
              ${this.config.copyright || `© ${this.config.year} ${this.config.companyName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </footer>
    `;
    this.container.innerHTML = html;
  }

  private attachEventListeners(): void {
    const links = this.container.querySelectorAll('.hiero-footer__link');
    links.forEach(link => {
      link.addEventListener('focus', (e) => {
        const section = (e.target as HTMLElement).closest('.hiero-footer__section');
        section?.classList.add('is-focused');
      });
      link.addEventListener('blur', (e) => {
        const section = (e.target as HTMLElement).closest('.hiero-footer__section');
        if (!section?.querySelector(':focus')) {
          section?.classList.remove('is-focused');
        }
      });
    });
  }
}
