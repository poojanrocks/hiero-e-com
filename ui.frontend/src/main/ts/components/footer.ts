export class Footer {
  private element: HTMLElement;
  private accordions: NodeListOf<HTMLElement>;
  private newsletterForm: HTMLFormElement | null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.accordions = element.querySelectorAll('[data-footer-accordion]');
    this.newsletterForm = element.querySelector('[data-newsletter-form]');
    this.init();
  }

  private init(): void {
    this.bindAccordionEvents();
    this.bindNewsletterEvents();
  }

  private bindAccordionEvents(): void {
    this.accordions.forEach(accordion => {
      const trigger = accordion.querySelector('[data-accordion-trigger]') as HTMLButtonElement;
      if (trigger) {
        trigger.addEventListener('click', () => {
          this.toggleAccordion(accordion, trigger);
        });
      }
    });
  }

  private toggleAccordion(accordion: HTMLElement, trigger: HTMLButtonElement): void {
    const isOpen = accordion.getAttribute('data-open') === 'true';
    accordion.setAttribute('data-open', String(!isOpen));
    trigger.setAttribute('aria-expanded', String(!isOpen));
  }

  private bindNewsletterEvents(): void {
    if (!this.newsletterForm) return;

    this.newsletterForm.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.handleNewsletterSubmit();
    });
  }

  private handleNewsletterSubmit(): void {
    if (!this.newsletterForm) return;

    const formData = new FormData(this.newsletterForm);
    const email = formData.get('email');

    if (email && this.validateEmail(email as string)) {
      this.showNewsletterMessage('Success', 'Thank you for subscribing!');
      this.newsletterForm.reset();
    } else {
      this.showNewsletterMessage('Error', 'Please enter a valid email address.');
    }
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private showNewsletterMessage(type: string, message: string): void {
    const messageElement = document.createElement('div');
    messageElement.setAttribute('data-message-type', type.toLowerCase());
    messageElement.textContent = message;
    messageElement.setAttribute('role', 'alert');
    this.newsletterForm?.insertAdjacentElement('afterend', messageElement);

    setTimeout(() => messageElement.remove(), 5000);
  }

  public destroy(): void {
    // Cleanup if needed
  }
}

declare global {
  interface Window {
    Footer: typeof Footer;
  }
}

window.Footer = Footer;
