export class Header {
  private element: HTMLElement;
  private mobileMenuToggle: HTMLButtonElement | null;
  private mobileMenu: HTMLElement | null;
  private searchToggle: HTMLButtonElement | null;
  private searchForm: HTMLElement | null;
  private navLinks: NodeListOf<HTMLAnchorElement>;
  private escapeKey = (e: KeyboardEvent) => this.handleEscapeKey(e);

  constructor(element: HTMLElement) {
    this.element = element;
    this.mobileMenuToggle = element.querySelector('[data-header-toggle]');
    this.mobileMenu = element.querySelector('[data-header-menu]');
    this.searchToggle = element.querySelector('[data-search-toggle]');
    this.searchForm = element.querySelector('[data-search-form]');
    this.navLinks = element.querySelectorAll('[data-nav-link]');
    this.init();
  }

  private init(): void {
    this.bindMobileMenuEvents();
    this.bindSearchEvents();
    this.bindNavigationEvents();
  }

  private bindMobileMenuEvents(): void {
    if (!this.mobileMenuToggle || !this.mobileMenu) return;

    this.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
  }

  private toggleMobileMenu(): void {
    if (!this.mobileMenu || !this.mobileMenuToggle) return;

    const isOpen = this.mobileMenu.getAttribute('data-open') === 'true';
    this.mobileMenu.setAttribute('data-open', String(!isOpen));
    this.mobileMenuToggle.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen) {
      document.addEventListener('keydown', this.escapeKey);
    } else {
      document.removeEventListener('keydown', this.escapeKey);
    }
  }

  private bindSearchEvents(): void {
    if (!this.searchToggle || !this.searchForm) return;

    this.searchToggle.addEventListener('click', () => {
      const isOpen = this.searchForm!.getAttribute('data-open') === 'true';
      this.searchForm!.setAttribute('data-open', String(!isOpen));
      this.searchToggle!.setAttribute('aria-expanded', String(!isOpen));

      if (!isOpen) {
        const searchInput = this.searchForm!.querySelector('input') as HTMLInputElement;
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    });
  }

  private bindNavigationEvents(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e: Event) => {
        this.setActiveLink(link);
      });
    });
  }

  private setActiveLink(link: HTMLAnchorElement): void {
    this.navLinks.forEach(l => l.setAttribute('aria-current', 'false'));
    link.setAttribute('aria-current', 'true');
  }

  private handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  private closeMobileMenu(): void {
    if (!this.mobileMenu || !this.mobileMenuToggle) return;

    this.mobileMenu.setAttribute('data-open', 'false');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', this.escapeKey);
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.escapeKey);
  }
}

declare global {
  interface Window {
    Header: typeof Header;
  }
}

window.Header = Header;
