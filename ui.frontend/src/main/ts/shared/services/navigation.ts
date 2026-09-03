/**
 * Navigation Service
 * Manages navigation state and active link tracking
 */

interface NavigationItem {
  href: string;
  label: string;
  ariaLabel?: string;
}

class NavigationService {
  private currentPath: string = window.location.pathname;

  public initialize(container: HTMLElement): void {
    this.updateActiveLinks(container);
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this.updateActiveLinks(container);
    });
  }

  private updateActiveLinks(container: HTMLElement): void {
    const links = container.querySelectorAll('a[data-nav-link]');
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (this.isActiveLink(href)) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('is-active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('is-active');
      }
    });
  }

  private isActiveLink(href: string): boolean {
    if (!href) return false;
    return this.currentPath === href || this.currentPath.startsWith(href + '/');
  }

  public getActiveNavItem(container: HTMLElement): NavigationItem | null {
    const activeLink = container.querySelector('a[aria-current="page"]');
    if (!activeLink) return null;

    return {
      href: activeLink.getAttribute('href') || '',
      label: activeLink.textContent || '',
      ariaLabel: activeLink.getAttribute('aria-label') || undefined
    };
  }
}

const navigationService = new NavigationService();

export function initializeNavigation(container: HTMLElement): void {
  navigationService.initialize(container);
}

export { NavigationService, navigationService };