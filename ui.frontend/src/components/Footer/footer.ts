import '../../../styles/components/footer.scss';

interface FooterConfig {
  selector?: string;
}

export class Footer {
  private element: HTMLElement | null;

  constructor(config: FooterConfig = {}) {
    this.element = document.querySelector(config.selector || '[data-component="footer"]');
    if (this.element) {
      this.init();
    }
  }

  private init(): void {
    this.setupAccordions();
    this.setupLinks();
    this.setupAccessibility();
  }

  private setupAccordions(): void {
    const headers = this.element?.querySelectorAll('[data-accordion-header]');
    headers?.forEach(header => {
      header.addEventListener('click', (e) => this.handleAccordionClick(e));
      header.addEventListener('keydown', (e) => this.handleAccordionKeydown(e));
    });
  }

  private handleAccordionClick(e: Event): void {
    const header = e.currentTarget as HTMLElement;
    const section = header.closest('[data-accordion-section]');
    const content = section?.querySelector('[data-accordion-content]');

    if (content) {
      const isOpen = section?.classList.contains('open');
      section?.classList.toggle('open');
      header.setAttribute('aria-expanded', String(!isOpen));
    }
  }

  private handleAccordionKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  }

  private setupLinks(): void {
    const links = this.element?.querySelectorAll('a');
    links?.forEach(link => {
      if (!link.href) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });
  }

  private setupAccessibility(): void {
    this.element?.setAttribute('role', 'contentinfo');
    const headers = this.element?.querySelectorAll('[data-accordion-header]');
    headers?.forEach(header => {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');
    });
  }

  public destroy(): void {
    if (this.element) {
      this.element = null;
    }
  }
}
