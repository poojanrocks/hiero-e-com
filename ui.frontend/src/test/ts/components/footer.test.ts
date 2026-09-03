import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FooterComponent } from '@components/footer';

describe('FooterComponent', () => {
  let container: HTMLElement;
  let footer: FooterComponent;

  beforeEach(() => {
    document.body.innerHTML = `
      <footer class="footer" data-testid="footer">
        <section class="footer__section">
          <button class="footer__section-title" data-expandable aria-controls="company-links" aria-expanded="false">
            Company
          </button>
          <div id="company-links" class="footer__section-content">
            <a href="/about" class="footer__link">About Us</a>
            <a href="/careers" class="footer__link">Careers</a>
          </div>
        </section>
        <section class="footer__section">
          <button class="footer__section-title" data-expandable aria-controls="help-links" aria-expanded="false">
            Help
          </button>
          <div id="help-links" class="footer__section-content">
            <a href="/faq" class="footer__link">FAQ</a>
            <a href="/contact" class="footer__link">Contact</a>
          </div>
        </section>
      </footer>
    `;
    container = document.querySelector('[data-testid="footer"]')!;
    footer = new FooterComponent('[data-testid="footer"]');
  });

  afterEach(() => {
    footer.destroy();
    document.body.innerHTML = '';
  });

  it('should initialize successfully', () => {
    expect(footer).toBeDefined();
    expect(container).toBeDefined();
  });

  it('should expand section on button click', () => {
    const button = container.querySelector('[data-expandable]') as HTMLElement;
    const target = button.getAttribute('aria-controls');
    const content = document.getElementById(target!);

    expect(content!.classList.contains('expanded')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();

    expect(content!.classList.contains('expanded')).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should toggle expansion on multiple clicks', () => {
    const button = container.querySelector('[data-expandable]') as HTMLElement;
    const target = button.getAttribute('aria-controls');
    const content = document.getElementById(target!);

    button.click();
    expect(content!.classList.contains('expanded')).toBe(true);

    button.click();
    expect(content!.classList.contains('expanded')).toBe(false);
  });

  it('should have all links accessible', () => {
    const links = container.querySelectorAll('.footer__link');
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      expect(link).toBeInTheDocument();
      expect((link as HTMLElement).textContent).toBeTruthy();
    });
  });
});
