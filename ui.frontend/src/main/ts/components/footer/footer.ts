/**
 * Footer Component
 * Manages footer navigation, links, and layout
 */

interface FooterConfig {
  rootSelector: string;
}

class Footer {
  private root: HTMLElement | null;
  private config: FooterConfig;

  constructor(config: FooterConfig) {
    this.config = config;
    this.root = document.querySelector(this.config.rootSelector);
    if (!this.root) {
      console.error(`Footer: Element not found for selector ${config.rootSelector}`);
      return;
    }
    this.init();
  }

  private init(): void {
    if (!this.root) return;

    this.setupEventListeners();
    this.setupAccessibility();
  }

  private setupEventListeners(): void {
    if (!this.root) return;

    const expandableGroups = this.root.querySelectorAll('[data-footer-group]');
    expandableGroups.forEach((group) => {
      const toggle = group.querySelector('[data-footer-group-toggle]');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggleGroup(group as HTMLElement));
      }
    });
  }

  private toggleGroup(group: HTMLElement): void {
    const isOpen = group.getAttribute('data-footer-group-open') === 'true';
    group.setAttribute('data-footer-group-open', (!isOpen).toString());
  }

  private setupAccessibility(): void {
    if (!this.root) return;

    const links = this.root.querySelectorAll('a');
    links.forEach((link) => {
      if (!link.getAttribute('aria-label')) {
        const text = link.textContent?.trim();
        if (text) {
          link.setAttribute('aria-label', text);
        }
      }
    });
  }

  public destroy(): void {
    // Cleanup if needed
  }
}

// Auto-initialize if data attribute is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const footers = document.querySelectorAll('[data-footer-component]');
    footers.forEach((el) => {
      new Footer({ rootSelector: `[data-footer-component="${(el as HTMLElement).getAttribute('data-footer-component')}"]` });
    });
  });
} else {
  const footers = document.querySelectorAll('[data-footer-component]');
  footers.forEach((el) => {
    new Footer({ rootSelector: `[data-footer-component="${(el as HTMLElement).getAttribute('data-footer-component')}"]` });
  });
}

export { Footer };