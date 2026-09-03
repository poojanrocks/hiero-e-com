import { stateManager } from '../../services/StateManager';
import type { FooterConfig } from '../../types';
import '../styles/footer.scss';

class Footer {
  private container: HTMLElement | null;
  private config: FooterConfig;

  constructor(containerId: string, config: FooterConfig) {
    this.container = document.getElementById(containerId);
    this.config = config;
    if (this.container) {
      this.init();
    }
  }

  private init(): void {
    if (!this.container) return;
    
    this.render();
    this.attachEventListeners();
    this.initializeAccessibility();
  }

  private render(): void {
    if (!this.container) return;

    const mainContent = this.renderMainContent();
    const bottomBar = this.renderBottomBar();

    this.container.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="footer__main">
          ${mainContent}
        </div>
        ${bottomBar}
      </footer>
    `;
  }

  private renderMainContent(): string {
    let sections = '';

    if (this.config.links) {
      sections += `
        <section class="footer__section" aria-labelledby="footer-links-title">
          <h3 id="footer-links-title" class="footer__section-title">Quick Links</h3>
          <ul class="footer__link-list">
            ${this.config.links.map((link) => `<li><a href="${link.href}" class="footer__link">${link.label}</a></li>`).join('')}
          </ul>
        </section>
      `;
    }

    if (this.config.socialLinks && this.config.socialLinks.length > 0) {
      sections += `
        <section class="footer__section" aria-labelledby="footer-social-title">
          <h3 id="footer-social-title" class="footer__section-title">Follow Us</h3>
          <ul class="footer__social-list">
            ${this.config.socialLinks.map((social) => `
              <li>
                <a href="${social.href}" class="footer__social-link" aria-label="${social.label}">
                  ${social.icon}
                </a>
              </li>
            `).join('')}
          </ul>
        </section>
      `;
    }

    return `
      <div class="footer__container">
        <div class="footer__branding">
          <h2 class="footer__company-name">${this.config.companyName || 'Hiero eCommerce'}</h2>
        </div>
        <div class="footer__sections">
          ${sections}
        </div>
      </div>
    `;
  }

  private renderBottomBar(): string {
    return `
      <div class="footer__bottom">
        <p class="footer__copyright">${this.config.copyright || `© ${new Date().getFullYear()} Hiero eCommerce. All rights reserved.`}</p>
        <ul class="footer__legal">
          <li><a href="/privacy" class="footer__legal-link">Privacy Policy</a></li>
          <li><a href="/terms" class="footer__legal-link">Terms of Service</a></li>
          <li><a href="/cookies" class="footer__legal-link">Cookie Settings</a></li>
        </ul>
      </div>
    `;
  }

  private attachEventListeners(): void {
    if (!this.container) return;

    const socialLinks = this.container.querySelectorAll('.footer__social-link');
    socialLinks.forEach((link) => {
      link.addEventListener('click', (e) => this.handleSocialLink(e));
    });

    const footerLinks = this.container.querySelectorAll('.footer__link');
    footerLinks.forEach((link) => {
      link.addEventListener('keydown', (e) => this.handleFooterLinkKeyboard(e));
    });
  }

  private handleSocialLink(e: Event): void {
    const link = e.target as HTMLAnchorElement;
    const ariaLabel = link.getAttribute('aria-label');
    console.log('Social link clicked:', ariaLabel);
    this.container?.dispatchEvent(
      new CustomEvent('footer:social-click', { detail: { label: ariaLabel } })
    );
  }

  private handleFooterLinkKeyboard(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      (e.target as HTMLAnchorElement).click();
    }
  }

  private initializeAccessibility(): void {
    if (!this.container) return;
    
    const footer = this.container.querySelector('footer');
    if (footer) {
      footer.setAttribute('aria-label', 'Site footer');
    }

    const sections = this.container.querySelectorAll('.footer__section');
    sections.forEach((section, index) => {
      if (!section.id) {
        section.id = `footer-section-${index}`;
      }
    });
  }

  public destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export default Footer;
