export class FooterComponent {
  private element: HTMLElement;

  constructor(selector: string) {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Footer element not found: ${selector}`);
    
    this.element = el as HTMLElement;
    this.initialize();
  }

  private initialize(): void {
    this.setupExpandableLinks();
    this.setupAccessibility();
  }

  private setupExpandableLinks(): void {
    const expandableButtons = this.element.querySelectorAll('[data-expandable]');
    expandableButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleExpandClick(e));
    });
  }

  private handleExpandClick(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const target = button.getAttribute('aria-controls');
    if (!target) return;

    const content = document.getElementById(target);
    if (!content) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    content.classList.toggle('expanded', !isExpanded);
  }

  private setupAccessibility(): void {
    const links = this.element.querySelectorAll('a');
    links.forEach((link, index) => {
      if (!link.textContent?.trim()) {
        link.setAttribute('aria-label', `Link ${index + 1}`);
      }
    });
  }

  public destroy(): void {
    const expandableButtons = this.element.querySelectorAll('[data-expandable]');
    expandableButtons.forEach(button => {
      button.removeEventListener('click', (e) => this.handleExpandClick(e));
    });
  }
}
