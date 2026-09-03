import './styles/footer.scss';
import { FooterConfig } from './types';

class Footer {
  private config: FooterConfig;
  private element: HTMLElement | null;

  constructor(selector: string, config?: FooterConfig) {
    this.element = document.querySelector(selector);
    this.config = config || {};
    if (this.element) {
      this.init();
    }
  }

  private init(): void {
    if (!this.element) return;
    this.setupEventListeners();
    this.setupAccessibility();
  }

  private setupEventListeners(): void {
    if (!this.element) return;

    const toggleButtons = this.element.querySelectorAll('[data-toggle="section"]');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleSection(button));
    });

    const links = this.element.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.currentTarget?.dispatchEvent(new MouseEvent('click'));
        }
      });
    });
  }

  private toggleSection(button: Element): void {
    const targetId = button.getAttribute('aria-controls');
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    target.setAttribute('aria-hidden', String(isExpanded));
    target.classList.toggle('collapsed');
  }

  private setupAccessibility(): void {
    if (!this.element) return;
    this.element.setAttribute('role', 'contentinfo');

    const nav = this.element.querySelector('[data-role="footer-navigation"]');
    if (nav) {
      nav.setAttribute('aria-label', 'Footer navigation');
    }
  }

  public destroy(): void {
    this.element = null;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Footer('[data-component="footer"]');
  });
} else {
  new Footer('[data-component="footer"]');
}

export default Footer;