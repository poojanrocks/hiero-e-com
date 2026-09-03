import { StateManager } from '../../services/state-manager';
import { setAriaLabel } from '../../utils/accessibility';
import type { FooterColumn, SocialLink } from '../../types';

export class Footer {
  private container: HTMLElement | null = null;
  private stateManager: StateManager;

  constructor(containerId: string) {
    this.stateManager = StateManager.getInstance();
    this.container = document.getElementById(containerId);
  }

  init(): void {
    if (!this.container) {
      console.error('Footer container not found');
      return;
    }

    this.setupEventListeners();
    this.setupAccessibility();
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    // Newsletter subscription
    const newsletterForm = this.container.querySelector('[data-newsletter-form]') as HTMLFormElement;
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }

    // Expandable sections on mobile
    const expandableHeaders = this.container.querySelectorAll('[data-expandable-header]');
    expandableHeaders.forEach(header => {
      header.addEventListener('click', (e) => this.toggleExpandable(e));
      header.addEventListener('keydown', (e) => this.handleExpandableKeydown(e as KeyboardEvent));
    });

    // Social links tracking
    const socialLinks = this.container.querySelectorAll('[data-social-link]');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => this.trackSocialClick(e));
    });
  }

  private setupAccessibility(): void {
    if (!this.container) return;

    // Ensure footer has proper landmark role
    this.container.setAttribute('role', 'contentinfo');

    // Add proper labels to expandable sections
    const expandableSections = this.container.querySelectorAll('[data-expandable-section]');
    expandableSections.forEach((section, index) => {
      const header = section.querySelector('[data-expandable-header]');
      if (header) {
        const title = header.textContent || `Section ${index + 1}`;
        setAriaLabel(header as HTMLElement, `Expand ${title}`);
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
      }

      const content = section.querySelector('[data-expandable-content]');
      if (content) {
        content.setAttribute('aria-hidden', 'true');
      }
    });

    // Add proper labels to links
    const links = this.container.querySelectorAll('a');
    links.forEach(link => {
      if (!link.getAttribute('aria-label')) {
        setAriaLabel(link as HTMLElement, link.textContent || 'Link');
      }
    });
  }

  private toggleExpandable(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const section = header.closest('[data-expandable-section]');
    if (!section) return;

    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', (!isExpanded).toString());

    const content = section.querySelector('[data-expandable-content]');
    if (content) {
      content.setAttribute('aria-hidden', isExpanded.toString());
      content.classList.toggle('expanded');
    }
  }

  private handleExpandableKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleExpandable(event);
    }
  }

  private handleNewsletterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const emailInput = form.querySelector('[type="email"]') as HTMLInputElement;

    if (emailInput && this.isValidEmail(emailInput.value)) {
      // In production, send to backend
      console.log('Newsletter subscription:', emailInput.value);
      this.showNewsletterConfirmation();
      form.reset();
    } else {
      this.showNewsletterError();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showNewsletterConfirmation(): void {
    const message = document.createElement('div');
    message.className = 'notification notification--success';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'Thank you for subscribing!';

    if (this.container) {
      const form = this.container.querySelector('[data-newsletter-form]');
      if (form) {
        form.parentElement?.insertBefore(message, form);
        setTimeout(() => message.remove(), 5000);
      }
    }
  }

  private showNewsletterError(): void {
    const message = document.createElement('div');
    message.className = 'notification notification--error';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'Please enter a valid email address';

    if (this.container) {
      const form = this.container.querySelector('[data-newsletter-form]');
      if (form) {
        form.parentElement?.insertBefore(message, form);
        setTimeout(() => message.remove(), 5000);
      }
    }
  }

  private trackSocialClick(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    const platform = link.getAttribute('data-social-link');
    // Track social click - implement with analytics service
    console.log('Social click:', platform);
  }
}
